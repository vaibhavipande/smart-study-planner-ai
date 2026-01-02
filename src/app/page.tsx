"use client";

import { useState } from "react";

export default function Home() {
  const [subjects, setSubjects] = useState("");
  const [dailyHours, setDailyHours] = useState(4);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);

    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjects: subjects.split(","),
        dailyHours,
      }),
    });

    const data = await res.json();
    setPlan(data.data.aiPlan);
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">
        Smart Study Planner 📚
      </h1>

      {/* Input Form */}
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Subjects (comma separated)"
          className="border p-2 w-full"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 w-full"
          value={dailyHours}
          onChange={(e) => setDailyHours(Number(e.target.value))}
        />

        <button
          onClick={generatePlan}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
      </div>

      {/* Study Plan Output */}
      {plan && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Your Study Plan
          </h2>

          <ul className="list-disc ml-6">
            {Object.entries(plan).map(([day, task]) => (
              <li key={day}>
                <strong>{day}:</strong> {task as string}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
