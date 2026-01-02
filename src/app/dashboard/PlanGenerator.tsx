"use client";

import { useState } from "react";

interface StudyPlan {
  title: string;
  duration: string;
  steps: string[];
  source: string;
  id?: string;
  createdAt?: string;
  description?: string;
  estimatedHours?: number;
  difficulty?: string;
  progressPercentage?: number;
}

interface PlanGeneratorProps {
  onPlanCreated?: () => void;
}

export default function PlanGenerator({ onPlanCreated }: PlanGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [duration, setDuration] = useState(8);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePlan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan(null);

    if (!topic.trim()) {
      setError("Please enter a topic");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          dailyHours,
          difficulty,
          duration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      if (data.success && data.data) {
        setPlan(data.data);
        if (onPlanCreated) {
          onPlanCreated();
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate study plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Generate Study Plan
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter any topic and get a personalized study plan powered by AI
      </p>

      <form onSubmit={generatePlan} className="space-y-4">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Topic *
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., React, Machine Learning, Big Data, Java, JavaScript..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="dailyHours"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Daily Hours
            </label>
            <input
              id="dailyHours"
              type="number"
              min="1"
              max="12"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as "beginner" | "intermediate" | "advanced"
                )
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Duration (Weeks)
            </label>
            <input
              id="duration"
              type="number"
              min="1"
              max="52"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Plan with AI...</span>
            </>
          ) : (
            <>
              <span>🤖</span>
              <span>Generate Study Plan</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {plan && (
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-blue-200 dark:border-gray-600 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {plan.title}
                </h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded">
                  ✓ Created
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span>
                  Duration: <span className="font-semibold">{plan.duration}</span>
                </span>
                {plan.estimatedHours && (
                  <span>
                    Est. Hours: <span className="font-semibold">~{plan.estimatedHours}h</span>
                  </span>
                )}
                {plan.difficulty && (
                  <span className="capitalize">
                    Level: <span className="font-semibold">{plan.difficulty}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {plan.description && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-gray-700 dark:text-gray-300">{plan.description}</p>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
              Study Schedule:
            </h4>
            <ol className="space-y-2">
              {plan.steps.map((step: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Source: {plan.source === "openai" ? "🤖 OpenAI GPT-4" : "📝 Smart Generator"}
            </p>
            {plan.id && (
              <a
                href={`/dashboard/plans/${plan.id}`}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
              >
                View Full Plan →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
