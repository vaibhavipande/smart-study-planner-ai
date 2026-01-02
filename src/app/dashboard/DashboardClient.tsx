"use client";

import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import PlanGenerator from "./PlanGenerator";
import StudyPlansList from "./StudyPlansList";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { CurrentUser } from "@/lib/auth";
import Link from "next/link";

interface DashboardClientProps {
  user: CurrentUser;
}

interface Statistics {
  totalPlans: number;
  completedPlans: number;
  inProgressPlans: number;
  totalSteps: number;
  completedSteps: number;
  averageProgress: number;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"plans" | "generate" | "analytics">("plans");
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const res = await fetch("/api/study-plans");
      const data = await res.json();

      if (data.success && data.data) {
        const plans = data.data;
        const totalPlans = plans.length;
        const completedPlans = plans.filter((p: any) => p.isCompleted).length;
        const inProgressPlans = totalPlans - completedPlans;
        const totalSteps = plans.reduce((sum: number, p: any) => sum + (p.totalSteps || 0), 0);
        const completedSteps = plans.reduce((sum: number, p: any) => sum + (p.completedSteps || 0), 0);
        const averageProgress =
          totalPlans > 0
            ? Math.round(
                plans.reduce((sum: number, p: any) => sum + (p.progressPercentage || 0), 0) /
                  totalPlans
              )
            : 0;

        setStats({
          totalPlans,
          completedPlans,
          inProgressPlans,
          totalSteps,
          completedSteps,
          averageProgress,
        });
      }
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Welcome back, <span className="font-semibold">{user.name}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Statistics */}
        {!loadingStats && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.totalPlans}</div>
                  <div className="text-sm text-blue-100 mt-1">Total Plans</div>
                </div>
                <div className="text-4xl opacity-80">📚</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.completedPlans}</div>
                  <div className="text-sm text-green-100 mt-1">Completed</div>
                </div>
                <div className="text-4xl opacity-80">✅</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.inProgressPlans}</div>
                  <div className="text-sm text-orange-100 mt-1">In Progress</div>
                </div>
                <div className="text-4xl opacity-80">🚀</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.averageProgress}%</div>
                  <div className="text-sm text-purple-100 mt-1">Avg Progress</div>
                </div>
                <div className="text-4xl opacity-80">📊</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("plans")}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-all duration-200 relative ${
                  activeTab === "plans"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  📚 My Study Plans
                </span>
              </button>
              <button
                onClick={() => setActiveTab("generate")}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-all duration-200 ${
                  activeTab === "generate"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  🤖 Generate New Plan
                </span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-all duration-200 ${
                  activeTab === "analytics"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  📊 Analytics & Insights
                </span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "plans" && (
              <div className="animate-fade-in">
                <StudyPlansList />
              </div>
            )}
            {activeTab === "generate" && (
              <div className="animate-fade-in">
                <PlanGenerator onPlanCreated={fetchStatistics} />
              </div>
            )}
            {activeTab === "analytics" && (
              <div className="animate-fade-in">
                <AnalyticsDashboard />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
