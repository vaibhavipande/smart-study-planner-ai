"use client";

import { useState, useEffect } from "react";

interface FeedbackFormProps {
  studyPlanId: string;
  onFeedbackSubmitted?: () => void;
}

export default function FeedbackForm({
  studyPlanId,
  onFeedbackSubmitted,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [helpful, setHelpful] = useState(true);
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<any>(null);

  useEffect(() => {
    fetchExistingFeedback();
  }, [studyPlanId]);

  const fetchExistingFeedback = async () => {
    try {
      const res = await fetch(`/api/feedback?studyPlanId=${studyPlanId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setExistingFeedback(data.data);
        setRating(data.data.rating);
        setFeedback(data.data.feedback);
        setHelpful(data.data.helpful);
        setSuggestions(data.data.suggestions || "");
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }

    if (!feedback.trim()) {
      alert("Please provide feedback");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studyPlanId,
          rating,
          feedback: feedback.trim(),
          helpful,
          suggestions: suggestions.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
      } else {
        alert(data.error || "Failed to submit feedback");
      }
    } catch (err) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {submitted ? "Your Feedback" : "Rate This Study Plan"}
      </h3>

      {submitted && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-400 text-sm">
            ✓ Thank you for your feedback! Your input helps us improve.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className={`text-3xl transition-transform transform hover:scale-110 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                disabled={submitted}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Your Feedback *
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think about this study plan..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            rows={4}
            required
            disabled={submitted}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {feedback.length}/1000 characters
          </p>
        </div>

        {/* Helpful Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={helpful}
              onChange={(e) => setHelpful(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={submitted}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              This plan was helpful
            </span>
          </label>
        </div>

        {/* Suggestions */}
        <div>
          <label
            htmlFor="suggestions"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Suggestions (Optional)
          </label>
          <textarea
            id="suggestions"
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="Any suggestions for improvement?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            rows={3}
            disabled={submitted}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {suggestions.length}/500 characters
          </p>
        </div>

        {!submitted && (
          <button
            type="submit"
            disabled={loading || rating === 0 || !feedback.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>💬</span>
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
}

