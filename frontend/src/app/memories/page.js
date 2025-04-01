"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@supabase/supabase-js";

import { OpenAI } from "openai";

// Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Make sure to load environment vars
  dangerouslyAllowBrowser: true,
});

async function processWithChatGPT(transcript) {
  try {
    const prompt = `
Given this transcript, can you extrapolate the speakers and then put them into this array of objects with the following format. Please only respond with the json file.

Format: {
  "id": 1,
  "name": "aly",
  "suggested_color": "Yellow",
  "color_matches": {
    "Yellow": 60,
    "Blue": 20,
    "Red": 10,
    "Green": 10
  },
  "pos_traits": ["Happiness", "Optimism", "Creativity"],
  "neg_traits": ["Impulsive", "Scattered"],
  "keywords": ["energy", "communication", "happiness"],
  "interactions": [
    {
      "date": "2025-04-01",
      "dominantColor": "Yellow",
      "wordCount": 100,
      "color_matches": {
        "Yellow": 60,
        "Blue": 20,
        "Red": 10,
        "Green": 10
      }
    }
  ],
  "stats": {
    "totalInteractions": 1,
    "lastMessage": "2025-04-01",
    "avgWordsPerSession": 100,
    "colorShifts": 0,
    "colorTimeline": "Yellow"
  }
}

Transcript:
${transcript}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that analyzes conversation transcripts and provides structured insights. Always respond in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiAnalysis = JSON.parse(completion.choices[0].message.content);
    console.log("✨ AI Analysis completed successfully");
    return aiAnalysis;
  } catch (error) {
    console.error("❌ Error in AI processing:", error);
    return { test: "bad" };
  }
}

const TableWithButton = () => {
  const [items, setItems] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("transcripts").select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        // Add a `showFullTranscript` field to each item
        const itemsWithState = data.map((item) => ({
          ...item,
          showFullTranscript: false,
        }));
        setItems(itemsWithState);
      }
    };

    fetchItems();
  }, []);

  const toggleTranscript = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, showFullTranscript: !item.showFullTranscript }
          : item
      )
    );
  };

  const handleVisualize = (item) => {
    localStorage.setItem("memoryData", JSON.stringify(item));
    router.push("/visualization");
  };

  const handleAnalyze = async (item) => {
    const title = item.title;
    const transcript = item.transcript;
    const aiResponse = await processWithChatGPT(transcript);
    console.log(aiResponse);

    // 2. Update local state
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.title === title ? { ...item, ai_analysis: aiResponse } : item
      )
    );

    // 3. Update Supabase
    const { data, error } = await supabase
      .from("transcripts")
      .update({ ai_analysis: aiResponse })
      .eq("title", title);

    if (error) {
      console.error("❌ Supabase update failed:", error);
    } else {
      console.log("✅ Supabase updated:", data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href="/"
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            ← Back to Homepage
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-inter">
            Visualization Dashboard
          </h1>
        </div>
      </header>

      <main className="p-4">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 border">Title</th>
              <th className="px-2 py-2 border">Overview</th>
              <th className="px-2 py-2 border">Transcript</th>
              <th className="px-2 py-2 border">Created At</th>
              <th className="px-2 py-2 border">AI Analysis</th>
              <th className="px-2 py-2 border">Visualize</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 align-top">
                <td className="px-2 py-2 border">{item.title || "-"}</td>
                <td className="px-2 py-2 border">{item.overview || "-"}</td>
                <td className="px-2 py-2 border max-w-xs whitespace-pre-wrap">
                  {item.showFullTranscript ||
                  (item.transcript?.length || 0) <= 100 ? (
                    item.transcript || "-"
                  ) : (
                    <>
                      {item.transcript.slice(0, 100)}...
                      <button
                        className="text-blue-500 ml-1 underline"
                        onClick={() => toggleTranscript(item.id)}
                      >
                        Show more
                      </button>
                    </>
                  )}
                  {item.showFullTranscript && item.transcript?.length > 100 && (
                    <button
                      className="text-blue-500 ml-1 underline"
                      onClick={() => toggleTranscript(item.id)}
                    >
                      Show less
                    </button>
                  )}
                </td>
                <td className="px-2 py-2 border">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-2 py-2 border">
                  {item.ai_analysis ? (
                    item.ai_analysis
                  ) : (
                    <button
                      onClick={() => handleAnalyze(item)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Call MCP
                    </button>
                  )}
                </td>

                <td className="px-2 py-2 border">
                  <button
                    onClick={() => handleVisualize(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default TableWithButton;
