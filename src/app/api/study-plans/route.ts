import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import StudyPlan from "@/models/StudyPlan";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all study plans for the current user
    const plans = await StudyPlan.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json({
      success: true,
      data: plans.map((plan) => ({
        id: plan._id.toString(),
        topic: plan.topic,
        title: plan.title,
        duration: plan.duration,
        steps: plan.steps,
        source: plan.source,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error("Get study plans error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study plans. Please try again." },
      { status: 500 }
    );
  }
}

