"use client";

import { useState, useEffect } from "react";

interface AnalyticsData {
  overview: {
    totalPlans: number;
    completedPlans: number;
    inProgressPlans: number;
    totalSteps: number;
    completedSteps: number;
    averageProgress: number;
    totalEstimatedHours: number;
    averageHoursPerPlan: number;
  };
  difficulty: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  source: {
    openai: number;
    "smart-mock": number;
  };
  feedback: {
    totalFeedbacks: number;
    averageRating: number;
    helpfulCount: number;
    helpfulPercentage: number;
  };
  activity: {
    recentPlans: number;
    recentCompletions: number;
    weeklyProgress: Array<{
      week: string;
      plansCreated: number;
      plansCompleted: number;
    }>;
  };
  topTopics: Array<{
    topic: string;
    count: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError("Failed to load analytics");
      }
    } catch (err) {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
        {error || "No analytics data available"}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Plans</p>
              <p className="text-3xl font-bold mt-2">{data.overview.totalPlans}</p>
            </div>
            <div className="text-4xl opacity-80">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2">{data.overview.completedPlans}</p>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Progress</p>
              <p className="text-3xl font-bold mt-2">{data.overview.averageProgress}%</p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Hours</p>
              <p className="text-3xl font-bold mt-2">{data.overview.totalEstimatedHours}</p>
            </div>
            <div className="text-4xl opacity-80">⏰</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-scale-in">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Difficulty Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(data.difficulty).map(([level, count]) => (
              <div key={level} className="animate-slide-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {level}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">{count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      level === "beginner"
                        ? "bg-green-500"
                        : level === "intermediate"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    }`}
                    style={{
                      width: `${
                        data.overview.totalPlans > 0
                          ? (count / data.overview.totalPlans) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-scale-in">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Weekly Activity
          </h3>
          <div className="space-y-4">
            {data.activity.weeklyProgress.map((week, index) => (
              <div key={week.week} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {week.week}
                  </span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-blue-600 dark:text-blue-400">
                      +{week.plansCreated} created
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      ✓ {week.plansCompleted} completed
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(week.plansCreated / Math.max(...data.activity.weeklyProgress.map(w => w.plansCreated), 1)) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(week.plansCompleted / Math.max(...data.activity.weeklyProgress.map(w => w.plansCompleted), 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Topics & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-scale-in">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Top Topics
          </h3>
          <div className="space-y-3">
            {data.topTopics.length > 0 ? (
              data.topTopics.map((topic, index) => (
                <div
                  key={topic.topic}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {topic.topic}
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {topic.count} {topic.count === 1 ? "plan" : "plans"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No topics yet
              </p>
            )}
          </div>
        </div>

        {/* Feedback Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-scale-in">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Feedback Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {data.feedback.averageRating > 0 ? (
                    <>
                      {data.feedback.averageRating.toFixed(1)}{" "}
                      <span className="text-yellow-500">⭐</span>
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Feedback</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {data.feedback.totalFeedbacks}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Helpful</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {data.feedback.helpfulPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-scale-in">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Overall Progress
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Steps Completed</span>
              <span>
                {data.overview.completedSteps} / {data.overview.totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                style={{
                  width: `${
                    data.overview.totalSteps > 0
                      ? (data.overview.completedSteps / data.overview.totalSteps) * 100
                      : 0
                  }%`,
                }}
              >
                <span className="text-xs font-semibold text-white">
                  {data.overview.totalSteps > 0
                    ? Math.round(
                        (data.overview.completedSteps / data.overview.totalSteps) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

