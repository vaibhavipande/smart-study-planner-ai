import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import StudyPlan from "@/models/StudyPlan";
import { applyAPISecurity } from "@/lib/api-security";

// POST - Create feedback
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { studyPlanId, rating, feedback, helpful, suggestions } = body;

    // Validation
    if (!studyPlanId) {
      return NextResponse.json(
        { error: "Study plan ID is required" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify study plan exists and belongs to user
    const plan = await StudyPlan.findOne({
      _id: studyPlanId,
      userId: session.user.id,
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Study plan not found" },
        { status: 404 }
      );
    }

    // Create or update feedback
    const existingFeedback = await Feedback.findOne({
      userId: session.user.id,
      studyPlanId,
    });

    let feedbackDoc;
    if (existingFeedback) {
      existingFeedback.rating = rating;
      existingFeedback.feedback = feedback.trim();
      existingFeedback.helpful = helpful !== undefined ? helpful : true;
      existingFeedback.suggestions = suggestions?.trim();
      feedbackDoc = await existingFeedback.save();
    } else {
      feedbackDoc = await Feedback.create({
        userId: session.user.id,
        studyPlanId,
        rating,
        feedback: feedback.trim(),
        helpful: helpful !== undefined ? helpful : true,
        suggestions: suggestions?.trim(),
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        id: feedbackDoc._id.toString(),
        rating: feedbackDoc.rating,
        feedback: feedbackDoc.feedback,
        helpful: feedbackDoc.helpful,
        suggestions: feedbackDoc.suggestions,
        createdAt: feedbackDoc.createdAt,
      },
    });

    // Add security headers
    Object.entries(security.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error("Feedback error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Feedback already exists for this plan" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    );
  }
}

// GET - Get feedback for a study plan
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

    const { searchParams } = new URL(req.url);
    const studyPlanId = searchParams.get("studyPlanId");

    if (!studyPlanId) {
      return NextResponse.json(
        { error: "Study plan ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const feedback = await Feedback.findOne({
      userId: session.user.id,
      studyPlanId,
    }).lean();

    if (!feedback) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: feedback._id.toString(),
        rating: feedback.rating,
        feedback: feedback.feedback,
        helpful: feedback.helpful,
        suggestions: feedback.suggestions,
        createdAt: feedback.createdAt,
      },
    });

    // Add security headers
    Object.entries(security.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error("Get feedback error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback. Please try again." },
      { status: 500 }
    );
  }
}

