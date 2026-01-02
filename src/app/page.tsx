"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            Smart Study Planner 📚
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered study planning to help you achieve your learning goals
            efficiently and effectively
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Personalized Plans
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get customized study plans tailored to your topics and learning
              pace
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              AI-Powered
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Leverage AI to create intelligent study schedules and track your
              progress
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Track Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your study plans and achievements all in one place
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          {session ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Welcome back, {session.user?.name}! Ready to continue your
                learning journey?
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg"
              >
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Get started with your personalized study plan today
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/signup"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg"
                >
                  Sign Up Free
                </Link>
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
