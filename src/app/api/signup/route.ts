import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { applyAPISecurity } from "@/lib/api-security";

function validateEmail(email: string): boolean {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }
  if (password.length > 100) {
    return { valid: false, error: "Password must be less than 100 characters" };
  }
  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    // Apply API security (rate limiting, CORS)
    const security = applyAPISecurity(req);
    if (security.response) {
      return security.response;
    }

    const body = await req.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        userId: user._id.toString(),
      },
      { status: 201 }
    );

    // Add security headers
    Object.entries(security.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Signup failed. Please try again." },
      { status: 500 }
    );
  }
}
