import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getCORSHeaders } from "./security";

/**
 * Apply security middleware to API routes
 * This should be called at the beginning of each API route handler
 */
export function applyAPISecurity(req: NextRequest): {
  response: NextResponse | null;
  headers: Record<string, string>;
} {
  const corsHeaders = getCORSHeaders();
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return {
      response: new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
      }),
      headers: corsHeaders,
    };
  }

  // Apply rate limiting
  const rateLimitResult = rateLimit(req);
  
  if (!rateLimitResult.allowed) {
    return {
      response: NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
            ...corsHeaders,
          },
        }
      ),
      headers: corsHeaders,
    };
  }

  // Return headers to add to response
  return {
    response: null,
    headers: {
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
      "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
      ...corsHeaders,
    },
  };
}

