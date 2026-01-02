import mongoose, { Schema } from "mongoose";

const StudyPlanSchema = new Schema({
  subjects: [String],
  dailyHours: Number,
  aiPlan: Object,
});

export default mongoose.models.StudyPlan ||
  mongoose.model("StudyPlan", StudyPlanSchema);
