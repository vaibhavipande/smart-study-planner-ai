import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import StudyPlan from "@/models/StudyPlan";
import Feedback from "@/models/Feedback";
import { applyAPISecurity } from "@/lib/api-security";

export async function GET(req: NextRequest) {
  try {
    // Apply API security
    const security = applyAPISecurity(req);
    if (security.response) {
      return security.response;
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all study plans for the user
    const plans = await StudyPlan.find({ userId: session.user.id }).lean();
    const feedbacks = await Feedback.find({ userId: session.user.id }).lean();

    // Calculate statistics
    const totalPlans = plans.length;
    const completedPlans = plans.filter((p) => p.isCompleted).length;
    const inProgressPlans = totalPlans - completedPlans;

    // Progress statistics
    const totalSteps = plans.reduce((sum, p) => sum + (p.totalSteps || 0), 0);
    const completedSteps = plans.reduce(
      (sum, p) => sum + (p.completedSteps || 0),
      0
    );
    const averageProgress =
      totalPlans > 0
        ? Math.round(
            plans.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) /
              totalPlans
          )
        : 0;

    // Time statistics
    const totalEstimatedHours = plans.reduce(
      (sum, p) => sum + (p.estimatedHours || 0),
      0
    );
    const averageHoursPerPlan =
      totalPlans > 0 ? Math.round(totalEstimatedHours / totalPlans) : 0;

    // Difficulty distribution
    const difficultyStats = {
      beginner: plans.filter((p) => p.difficulty === "beginner").length,
      intermediate: plans.filter((p) => p.difficulty === "intermediate").length,
      advanced: plans.filter((p) => p.difficulty === "advanced").length,
    };

    // Source distribution
    const sourceStats = {
      openai: plans.filter((p) => p.source === "openai").length,
      "smart-mock": plans.filter((p) => p.source === "smart-mock").length,
    };

    // Feedback statistics
    const averageRating =
      feedbacks.length > 0
        ? Math.round(
            (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) *
              10
          ) / 10
        : 0;
    const helpfulCount = feedbacks.filter((f) => f.helpful).length;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPlans = plans.filter(
      (p) => new Date(p.createdAt) >= thirtyDaysAgo
    ).length;
    const recentCompletions = plans.filter(
      (p) => p.completedAt && new Date(p.completedAt) >= thirtyDaysAgo
    ).length;

    // Weekly progress (last 4 weeks)
    const weeklyProgress = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const weekPlans = plans.filter(
        (p) =>
          new Date(p.createdAt) >= weekStart &&
          new Date(p.createdAt) < weekEnd
      );
      const weekCompletions = plans.filter(
        (p) =>
          p.completedAt &&
          new Date(p.completedAt) >= weekStart &&
          new Date(p.completedAt) < weekEnd
      );

      weeklyProgress.push({
        week: `Week ${4 - i}`,
        plansCreated: weekPlans.length,
        plansCompleted: weekCompletions.length,
      });
    }

    // Top topics
    const topicCounts: Record<string, number> = {};
    plans.forEach((p) => {
      topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
    });
    const topTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalPlans,
          completedPlans,
          inProgressPlans,
          totalSteps,
          completedSteps,
          averageProgress,
          totalEstimatedHours,
          averageHoursPerPlan,
        },
        difficulty: difficultyStats,
        source: sourceStats,
        feedback: {
          totalFeedbacks: feedbacks.length,
          averageRating,
          helpfulCount,
          helpfulPercentage:
            feedbacks.length > 0
              ? Math.round((helpfulCount / feedbacks.length) * 100)
              : 0,
        },
        activity: {
          recentPlans,
          recentCompletions,
          weeklyProgress,
        },
        topTopics,
      },
    });

    // Add security headers
    Object.entries(security.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics. Please try again." },
      { status: 500 }
    );
  }
}

