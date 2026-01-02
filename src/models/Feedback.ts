import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFeedback extends Document {
  userId: Types.ObjectId;
  studyPlanId: Types.ObjectId;
  rating: number; // 1-5 stars
  feedback: string;
  helpful: boolean;
  suggestions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    studyPlanId: {
      type: Schema.Types.ObjectId,
      ref: "StudyPlan",
      required: [true, "Study Plan ID is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      required: [true, "Feedback is required"],
      trim: true,
      maxlength: [1000, "Feedback must be less than 1000 characters"],
    },
    helpful: {
      type: Boolean,
      default: true,
    },
    suggestions: {
      type: String,
      trim: true,
      maxlength: [500, "Suggestions must be less than 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate feedback
FeedbackSchema.index({ userId: 1, studyPlanId: 1 }, { unique: true });

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;

