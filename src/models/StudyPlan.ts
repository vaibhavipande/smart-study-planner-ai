import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface StepProgress {
  stepIndex: number;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface IStudyPlan extends Document {
  userId: Types.ObjectId;
  topic: string;
  title: string;
  duration: string;
  description?: string;
  estimatedHours?: number;
  steps: string[];
  stepProgress: StepProgress[];
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  difficulty?: "beginner" | "intermediate" | "advanced";
  dailyHours?: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const StepProgressSchema = new Schema(
  {
    stepIndex: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const StudyPlanSchema = new Schema<IStudyPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      default: "8 Weeks",
    },
    estimatedHours: {
      type: Number,
    },
    steps: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Steps array cannot be empty",
      },
    },
    stepProgress: {
      type: [StepProgressSchema],
      default: [],
    },
    completedSteps: {
      type: Number,
      default: 0,
    },
    totalSteps: {
      type: Number,
      default: function (this: IStudyPlan) {
        return this.steps?.length || 0;
      },
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    dailyHours: {
      type: Number,
      default: 2,
      min: 1,
      max: 12,
    },
    source: {
      type: String,
      default: "ai",
    },
  },
  {
    timestamps: true,
  }
);

// Calculate progress before saving
StudyPlanSchema.pre("save", function (next) {
  if (this.steps && this.steps.length > 0) {
    this.totalSteps = this.steps.length;
    
    // Initialize stepProgress if not exists
    if (!this.stepProgress || this.stepProgress.length === 0) {
      this.stepProgress = this.steps.map((_, index) => ({
        stepIndex: index,
        completed: false,
      }));
    }
    
    // Calculate completed steps
    this.completedSteps = this.stepProgress.filter((sp) => sp.completed).length;
    this.progressPercentage = Math.round(
      (this.completedSteps / this.totalSteps) * 100
    );
    
    // Check if completed
    if (this.completedSteps === this.totalSteps && this.totalSteps > 0) {
      this.isCompleted = true;
      if (!this.completedAt) {
        this.completedAt = new Date();
      }
    } else {
      this.isCompleted = false;
    }
  }
  next();
});

// Index for efficient queries
StudyPlanSchema.index({ userId: 1, createdAt: -1 });
StudyPlanSchema.index({ userId: 1, isCompleted: 1 });

const StudyPlan: Model<IStudyPlan> =
  mongoose.models.StudyPlan ||
  mongoose.model<IStudyPlan>("StudyPlan", StudyPlanSchema);

export default StudyPlan;
