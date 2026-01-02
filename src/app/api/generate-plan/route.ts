import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import StudyPlan from "@/models/StudyPlan";
import { generateStudyPlanWithAI } from "@/lib/ai/studyPlanGenerator";
import { applyAPISecurity } from "@/lib/api-security";

export async function POST(req: NextRequest) {
  try {
    // Apply API security (rate limiting, CORS)
    const security = applyAPISecurity(req);
    if (security.response) {
      return security.response;
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topic, dailyHours, difficulty, duration } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const trimmedTopic = topic.trim();
    const studyHours = dailyHours ? Number(dailyHours) : 2;
    const studyDifficulty =
      difficulty && ["beginner", "intermediate", "advanced"].includes(difficulty)
        ? difficulty
        : "intermediate";
    const studyDuration = duration ? Number(duration) : 8;

    // Generate study plan using AI (with fallback)
    const aiPlan = await generateStudyPlanWithAI({
      topic: trimmedTopic,
      dailyHours: studyHours,
      difficulty: studyDifficulty as "beginner" | "intermediate" | "advanced",
      duration: studyDuration,
    });

    // Save to database
    await connectDB();
    const savedPlan = await StudyPlan.create({
      userId: session.user.id,
      topic: trimmedTopic,
      title: aiPlan.title,
      duration: aiPlan.duration,
      description: aiPlan.description,
      estimatedHours: aiPlan.estimatedHours,
      steps: aiPlan.steps,
      difficulty: studyDifficulty,
      dailyHours: studyHours,
      source: process.env.OPENAI_API_KEY ? "openai" : "smart-mock",
      stepProgress: aiPlan.steps.map((_, index) => ({
        stepIndex: index,
        completed: false,
      })),
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: savedPlan._id.toString(),
        topic: savedPlan.topic,
        title: savedPlan.title,
        duration: savedPlan.duration,
        description: savedPlan.description,
        estimatedHours: savedPlan.estimatedHours,
        steps: savedPlan.steps,
        difficulty: savedPlan.difficulty,
        dailyHours: savedPlan.dailyHours,
        source: savedPlan.source,
        progressPercentage: savedPlan.progressPercentage,
        completedSteps: savedPlan.completedSteps,
        totalSteps: savedPlan.totalSteps,
        isCompleted: savedPlan.isCompleted,
        createdAt: savedPlan.createdAt,
      },
    });

    // Add security headers
    Object.entries(security.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error("Generate plan error:", error);
    return NextResponse.json(
      { error: "Failed to generate study plan. Please try again." },
      { status: 500 }
    );
  }
}
