"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";
import FloatingBubbles from "@/components/ui/floating-bubbles";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function processWithChatGPT(transcript) {
  try {
    const prompt = `
Given this transcript, can you extrapolate the speakers and then put them into this array of objects with the following format.

Format: [{
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
  }]

Transcript:
${transcript}
    `;

    console.log(prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that analyzes conversation transcripts and provides structured insights. Only respond with the array and don't add ```json",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log(completion);

    const aiAnalysis = JSON.parse(completion.choices[0].message.content);
    console.log("✨ AI Analysis completed successfully");
    return aiAnalysis;
  } catch (error) {
    console.error("❌ Error in AI processing:", error);
    return {};
  }
}

const formatTranscript = (text) => {
  if (!text) return "-";
  return text
    .split("SPEAKER")
    .map((line, i) => {
      if (i === 0 && !line.trim()) return null;
      return (
        <div key={i} className="py-1">
          {i === 0 ? line : `SPEAKER${line}`}
        </div>
      );
    })
    .filter(Boolean);
};

const TableWithButton = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [errorItemId, setErrorItemId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("transcripts").select("*");
      if (data) setItems(data);
      if (error) console.error(error);
    };
    fetchItems();
  }, []);

  const handleAnalyze = async (item) => {
    try {
      setLoadingItemId(item.id);
      setErrorItemId(null);

      const aiResponse = await processWithChatGPT(item.transcript);
      console.log(aiResponse);
      const aiThing = aiResponse.speakers || aiResponse;

      const { error } = await supabase
        .from("transcripts")
        .update({ ai_analysis: JSON.stringify(aiThing, null, 2) })
        .eq("title", item.title);

      if (!error) {
        setItems((prev) =>
          prev.map((i) =>
            i.title === item.title
              ? { ...i, ai_analysis: JSON.stringify(aiThing, null, 2) }
              : i
          )
        );
      } else {
        throw error;
      }
    } catch (error) {
      console.error("Error analyzing transcript:", error);
      setErrorItemId(item.id);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleVisualize = (item) => {
    localStorage.setItem("memoryData", JSON.stringify(item));
    router.push("/visualization");
  };

  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transcript?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <FloatingBubbles scale={0.4} opacity={0.15} />
      </div>

      <div className="relative z-10">
        <div className="p-4 max-w-screen-xl mx-auto">
          <input
            type="text"
            placeholder="Search memories..."
            className="w-full p-3 rounded-md border-1 border-black bg-white text-black placeholder-black/70 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <main className="p-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-sm relative min-h-[400px] border border-white/20 flex flex-col"
                >
                  <div className="h-[160px] mb-4 flex-1">
                    <h2 className="text-xl font-semibold mb-3">
                      {item.title || "-"}
                    </h2>
                    <div>
                      <p className="text-gray-600 mb-3 text-sm md:text-base">
                        {item.overview || "-"}
                      </p>
                      <p className="text-gray-500 text-sm md:text-sm mb-6">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="pb-2 flex-0">
                    <Accordion type="multiple" className="space-y-4">
                      <AccordionItem value="transcript">
                        <AccordionTrigger className="flex justify-between w-full mb-4">
                          Transcript
                        </AccordionTrigger>
                        <AccordionContent className="mt-2">
                          {formatTranscript(item.transcript)}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="analysis">
                        <AccordionTrigger className="flex justify-between w-full mb-18">
                          AI Analysis
                        </AccordionTrigger>
                        <AccordionContent className="mt-2">
                          {item.ai_analysis != "{}" && item.ai_analysis ? (
                            <div className="text-gray-600">
                              {typeof item.ai_analysis === "string"
                                ? item.ai_analysis
                                : JSON.stringify(item.ai_analysis, null, 2)}
                            </div>
                          ) : (
                            <div className="text-gray-500">
                              No data available
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="absolute bottom-10 right-6 flex-shrink-0">
                    {!item.ai_analysis || item.ai_analysis === "{}" ? (
                      <button
                        onClick={() => handleAnalyze(item)}
                        className="px-6 py-2.5 bg-black text-white border-1 border-black rounded-md transition-all duration-200 ease-in-out hover:bg-white hover:text-black flex items-center gap-2 min-w-[120px] justify-center"
                        disabled={loadingItemId === item.id}
                      >
                        {loadingItemId === item.id ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : errorItemId === item.id ? (
                          "Error - Try Again"
                        ) : (
                          "Call MCP"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVisualize(item)}
                        className="px-6 py-2.5 bg-black text-white border-1 border-black rounded-md transition-all duration-200 ease-in-out hover:bg-white hover:text-black"
                      >
                        View
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TableWithButton;
