import { NextRequest, NextResponse } from "next/server";

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // max requests per window
};

export function rateLimit(req: NextRequest): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const key = `rate_limit_${ip}`;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Create new record
    const resetTime = now + RATE_LIMIT.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    
    // Cleanup old records periodically
    if (rateLimitStore.size > 1000) {
      for (const [k, v] of rateLimitStore.entries()) {
        if (now > v.resetTime) {
          rateLimitStore.delete(k);
        }
      }
    }

    return {
      allowed: true,
      remaining: RATE_LIMIT.maxRequests - 1,
      resetTime,
    };
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (password.length > 100) {
    errors.push("Password must be less than 100 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password should contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password should contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password should contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// CORS headers
export function getCORSHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

// Security headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  };
}

