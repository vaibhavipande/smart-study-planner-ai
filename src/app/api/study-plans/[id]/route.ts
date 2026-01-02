import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import StudyPlan from "@/models/StudyPlan";

// GET single study plan
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectDB();

    const plan = await StudyPlan.findOne({
      _id: params.id,
      userId: session.user.id,
    }).lean();

    if (!plan) {
      return NextResponse.json(
        { error: "Study plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: plan._id.toString(),
        topic: plan.topic,
        title: plan.title,
        duration: plan.duration,
        description: plan.description,
        estimatedHours: plan.estimatedHours,
        steps: plan.steps,
        stepProgress: plan.stepProgress,
        progressPercentage: plan.progressPercentage,
        completedSteps: plan.completedSteps,
        totalSteps: plan.totalSteps,
        isCompleted: plan.isCompleted,
        difficulty: plan.difficulty,
        dailyHours: plan.dailyHours,
        source: plan.source,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Get study plan error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study plan. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE study plan
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectDB();

    const plan = await StudyPlan.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Study plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Study plan deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete study plan error:", error);
    return NextResponse.json(
      { error: "Failed to delete study plan. Please try again." },
      { status: 500 }
    );
  }
}

// PATCH - Update study plan progress
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { stepIndex, completed, notes } = body;

    if (typeof stepIndex !== "number" || stepIndex < 0) {
      return NextResponse.json(
        { error: "Valid stepIndex is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const plan = await StudyPlan.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Study plan not found" },
        { status: 404 }
      );
    }

    // Initialize stepProgress if needed
    if (!plan.stepProgress || plan.stepProgress.length === 0) {
      plan.stepProgress = plan.steps.map((_, index) => ({
        stepIndex: index,
        completed: false,
      }));
    }

    // Update or add step progress
    const existingStep = plan.stepProgress.find(
      (sp) => sp.stepIndex === stepIndex
    );

    if (existingStep) {
      existingStep.completed = completed !== undefined ? completed : existingStep.completed;
      if (completed) {
        existingStep.completedAt = new Date();
      } else {
        existingStep.completedAt = undefined;
      }
      if (notes !== undefined) {
        existingStep.notes = notes;
      }
    } else {
      plan.stepProgress.push({
        stepIndex,
        completed: completed !== undefined ? completed : false,
        completedAt: completed ? new Date() : undefined,
        notes: notes || "",
      });
    }

    // Save to trigger pre-save hook for progress calculation
    await plan.save();

    return NextResponse.json({
      success: true,
      data: {
        id: plan._id.toString(),
        progressPercentage: plan.progressPercentage,
        completedSteps: plan.completedSteps,
        totalSteps: plan.totalSteps,
        isCompleted: plan.isCompleted,
        stepProgress: plan.stepProgress,
      },
    });
  } catch (error: any) {
    console.error("Update study plan error:", error);
    return NextResponse.json(
      { error: "Failed to update study plan. Please try again." },
      { status: 500 }
    );
  }
}

