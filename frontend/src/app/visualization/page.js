"use client";

import React, { useState } from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import Link from "next/link";

const people = [
  {
    id: 1,
    name: "aly baba",
    designation: "Yellow",
    image:
      "https://pbs.twimg.com/profile_images/1894709078330322944/Dc1WAF-s_400x400.jpg",
  },
  {
    id: 2,
    name: "tomster",
    designation: "Green",
    image:
      "https://pbs.twimg.com/profile_images/1879245793313673216/H20toOUD_400x400.png",
  },
  {
    id: 3,
    name: "kevin",
    designation: "Red",
    image:
      "https://pbs.twimg.com/profile_images/1409195680229429254/4XOS0l45_400x400.jpg",
  },
  {
    id: 4,
    name: "trevor",
    designation: "blue",
    image:
      "https://pbs.twimg.com/profile_images/1645585472457158656/Uc-J3XQT_400x400.jpg",
  },
];

export default function AnimatedTooltipPreview() {
  const [question, setQuestion] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href="/"
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            ← Back to Homepage
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Visualization Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Question Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700"
              >
                Ask a Question
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="question"
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your question here..."
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Question
              </button>
              <button
                type="button"
                onClick={() => setQuestion("")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Existing AnimatedTooltip */}
        <div className="flex flex-row items-center justify-center mb-10 w-full">
          <AnimatedTooltip items={people} />
        </div>
      </main>
    </div>
  );
}
