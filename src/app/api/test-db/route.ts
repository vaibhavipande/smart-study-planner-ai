import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StudyPlan from "@/models/StudyPlan";

export async function GET() {
  await connectDB();

  const plan = await StudyPlan.create({
    subjects: ["DL", "Big Data"],
    dailyHours: 4,
  });

  return NextResponse.json({
    success: true,
    data: plan,
  });
}
