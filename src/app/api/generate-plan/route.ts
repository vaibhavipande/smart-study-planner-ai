import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StudyPlan from "@/models/StudyPlan";
import { generateStudyPlan } from "@/lib/ai/studyPlanGenerator";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { subjects, dailyHours } = body;

  const aiPlan = await generateStudyPlan({
    subjects,
    dailyHours,
  });

  const savedPlan = await StudyPlan.create({
    subjects,
    dailyHours,
    aiPlan,
  });

  return NextResponse.json({
    success: true,
    data: savedPlan,
  });
}
