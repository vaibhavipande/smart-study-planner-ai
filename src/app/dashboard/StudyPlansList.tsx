"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StudyPlan {
  id: string;
  topic: string;
  title: string;
  duration: string;
  description?: string;
  estimatedHours?: number;
  progressPercentage: number;
  completedSteps: number;
  totalSteps: number;
  isCompleted: boolean;
  difficulty?: string;
  source: string;
  createdAt: string;
}

export default function StudyPlansList() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/study-plans");
      const data = await res.json();

      if (data.success) {
        setPlans(data.data);
      } else {
        setError("Failed to load study plans");
      }
    } catch (err) {
      setError("Failed to load study plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this study plan?")) {
      return;
    }

    try {
      const res = await fetch(`/api/study-plans/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setPlans(plans.filter((plan) => plan.id !== id));
      } else {
        alert("Failed to delete study plan");
      }
    } catch (err) {
      alert("Failed to delete study plan");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          No study plans yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first study plan to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Study Plans ({plans.length})
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  {plan.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plan.topic}
                </p>
              </div>
              {plan.isCompleted && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded">
                  ✓ Completed
                </span>
              )}
            </div>

            {plan.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {plan.description}
              </p>
            )}

            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>
                  {plan.completedSteps}/{plan.totalSteps} steps
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${plan.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded">
                {plan.duration}
              </span>
              {plan.difficulty && (
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-2 py-1 rounded capitalize">
                  {plan.difficulty}
                </span>
              )}
              {plan.estimatedHours && (
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 px-2 py-1 rounded">
                  ~{plan.estimatedHours}h
                </span>
              )}
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">
                {plan.source === "openai" ? "🤖 AI" : "📝 Smart"}
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/dashboard/plans/${plan.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-medium py-2 px-4 rounded transition-colors"
              >
                View Details
              </Link>
              <button
                onClick={() => handleDelete(plan.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                title="Delete plan"
              >
                🗑️
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Created: {new Date(plan.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

