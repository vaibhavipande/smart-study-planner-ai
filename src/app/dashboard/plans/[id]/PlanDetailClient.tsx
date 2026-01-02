"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FeedbackForm from "@/components/FeedbackForm";

interface StepProgress {
  stepIndex: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

interface StudyPlan {
  id: string;
  topic: string;
  title: string;
  duration: string;
  description?: string;
  estimatedHours?: number;
  steps: string[];
  stepProgress: StepProgress[];
  progressPercentage: number;
  completedSteps: number;
  totalSteps: number;
  isCompleted: boolean;
  difficulty?: string;
  dailyHours?: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

interface PlanDetailClientProps {
  planId: string;
}

export default function PlanDetailClient({ planId }: PlanDetailClientProps) {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/study-plans/${planId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setPlan(data.data);
      } else {
        setError("Failed to load study plan");
      }
    } catch (err) {
      setError("Failed to load study plan");
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompletion = async (stepIndex: number) => {
    if (!plan) return;

    setUpdating(stepIndex);
    const currentStep = plan.stepProgress.find(
      (sp) => sp.stepIndex === stepIndex
    );
    const newCompleted = !currentStep?.completed;

    try {
      const res = await fetch(`/api/study-plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepIndex,
          completed: newCompleted,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        // Update local state
        const updatedPlan = { ...plan };
        const step = updatedPlan.stepProgress.find(
          (sp) => sp.stepIndex === stepIndex
        );
        if (step) {
          step.completed = newCompleted;
          step.completedAt = newCompleted ? new Date().toISOString() : undefined;
        } else {
          updatedPlan.stepProgress.push({
            stepIndex,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : undefined,
          });
        }
        updatedPlan.progressPercentage = data.data.progressPercentage;
        updatedPlan.completedSteps = data.data.completedSteps;
        updatedPlan.totalSteps = data.data.totalSteps;
        updatedPlan.isCompleted = data.data.isCompleted;
        setPlan(updatedPlan);
      }
    } catch (err) {
      alert("Failed to update step");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this study plan?")) {
      return;
    }

    try {
      const res = await fetch(`/api/study-plans/${planId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        alert("Failed to delete study plan");
      }
    } catch (err) {
      alert("Failed to delete study plan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading study plan...
          </p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {error || "Study plan not found"}
          </h2>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {plan.title}
                </h1>
                {plan.isCompleted && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded">
                    ✓ Completed
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {plan.topic}
              </p>
              {plan.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {plan.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded">
                  {plan.duration}
                </span>
                {plan.estimatedHours && (
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 px-3 py-1 rounded">
                    ~{plan.estimatedHours} hours
                  </span>
                )}
                {plan.difficulty && (
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-3 py-1 rounded capitalize">
                    {plan.difficulty}
                  </span>
                )}
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded">
                  {plan.source === "openai" ? "🤖 AI Generated" : "📝 Smart Plan"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>
                {plan.completedSteps}/{plan.totalSteps} steps completed (
                {plan.progressPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${plan.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Study Steps */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Study Steps
          </h2>
          <div className="space-y-4">
            {plan.steps.map((step, index) => {
              const stepProgress = plan.stepProgress.find(
                (sp) => sp.stepIndex === index
              );
              const isCompleted = stepProgress?.completed || false;

              return (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 transition-all duration-300 transform hover:scale-[1.02] animate-slide-in ${
                    isCompleted
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                      : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleStepCompletion(index)}
                      disabled={updating === index}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800"
                      }`}
                    >
                      {isCompleted && "✓"}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800 dark:text-white">
                          Step {index + 1}
                        </span>
                        {isCompleted && stepProgress?.completedAt && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Completed on{" "}
                            {new Date(stepProgress.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p
                        className={`${
                          isCompleted
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-6 animate-fade-in">
          <FeedbackForm studyPlanId={planId} />
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

