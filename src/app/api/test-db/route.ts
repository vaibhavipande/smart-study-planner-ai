import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import StudyPlan from "@/models/StudyPlan";

export async function GET() {
  try {
    await connectDB();

    // Test User model
    const userCount = await User.countDocuments();
    
    // Test StudyPlan model
    const planCount = await StudyPlan.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        users: userCount,
        studyPlans: planCount,
        connection: "active",
      },
    });
  } catch (error: any) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
