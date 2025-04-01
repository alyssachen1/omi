"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";
import FloatingBubbles from "@/components/ui/floating-bubbles";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function processWithChatGPT(transcript) {
  const prompt = `
Given this transcript, can you extrapolate the speakers and then put them into this array of objects with the following format:
[...trimmed for brevity]
Transcript:
${transcript}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that analyzes conversation transcripts and provides structured insights. Always respond in JSON format.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}

const formatTranscript = (text) => {
  if (!text) return "-";
  
  if (text.includes('\\n')) {
    return text.split('\\n').map((line, i) => (
      <div key={i} className="py-1">
        {line}
      </div>
    ));
  }
  
  // If no \n, split at "SPEAKER" but keep "SPEAKER" at the start of each line
  return text.split('SPEAKER').map((line, i) => {
    if (i === 0 && !line.trim()) return null; // Skip first empty split
    return (
      <div key={i} className="py-1">
        {i === 0 ? line : `SPEAKER${line}`}
      </div>
    );
  }).filter(Boolean); 
};

const Bubbles = () => {
  const bubbles = [
    { size: "w-32 h-32", color: "bg-blue-100", duration: 20, delay: 0 },
    { size: "w-24 h-24", color: "bg-red-100", duration: 15, delay: 2 },
    { size: "w-16 h-16", color: "bg-yellow-100", duration: 18, delay: 1 },
    { size: "w-20 h-20", color: "bg-green-100", duration: 22, delay: 3 },
    // Add more bubbles with different sizes and colors
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${bubble.size} ${bubble.color} opacity-50`}
          initial={{ 
            x: "-10%",
            y: Math.random() * 100 + "%"
          }}
          animate={{
            x: "110%",
            y: Math.random() * 100 + "%"
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const TableWithButton = () => {
  const [items, setItems] = useState([]);
  const [expandedAI, setExpandedAI] = useState({});
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
    const aiResponse = await processWithChatGPT(item.transcript);
    const { error } = await supabase
      .from("transcripts")
      .update({ ai_analysis: aiResponse })
      .eq("id", item.id);

    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ai_analysis: aiResponse } : i))
      );
    }
  };

  const handleVisualize = (item) => {
    localStorage.setItem("memoryData", JSON.stringify(item));
    router.push("/visualization");
  };

  const toggleAI = (id) => {
    setExpandedAI((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTranscript = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, showFullTranscript: !item.showFullTranscript } : item
      )
    );
  };

  const toggleAnalysis = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, showAnalysis: !item.showAnalysis }
          : item
      )
    );
  };

  const toggleFullAnalysis = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, showFullAnalysis: !item.showFullAnalysis }
          : item
      )
    );
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.transcript?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <FloatingBubbles 
          scale={0.4}
          opacity={0.15}
        />
      </div>
      
      <div className="relative z-10">
        <div className="p-4 max-w-screen-xl mx-auto">
          <input
            type="text"
            placeholder="Search memories by title or transcript..."
            className="w-full p-3 rounded-full border-2 border-black bg-white text-black 
            placeholder-black/70 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <main className="p-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id || index} 
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-sm relative min-h-[400px] border border-white/20"
                >
                  {/* Fixed height container for title, overview, and date */}
                  <div className="h-[160px] mb-8">
                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-3">{item.title || "-"}</h2>
                    
                    {/* Overview and Date */}
                    <div>
                      <p className="text-gray-600 mb-2">{item.overview || "-"}</p>
                      <p className="text-gray-500 text-sm">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Content wrapper - adds padding at bottom for button */}
                  <div className="pb-16">
                    {/* Transcript Section - now starts at same height across cards */}
                    <div className="border-t pt-5">
                      <button 
                        onClick={() => toggleTranscript(item.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="font-medium">Transcript</span>
                        <svg className={`w-5 h-5 transform ${item.showFullTranscript ? 'rotate-180' : ''}`} 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {item.showFullTranscript && (
                        <div className="mt-4">
                          {formatTranscript(item.transcript)}
                        </div>
                      )}
                    </div>

                    {/* AI Analysis Section */}
                    <div className="border-t pt-4 mt-4">
                      <button 
                        onClick={() => toggleAnalysis(item.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="font-medium">AI Analysis</span>
                        <svg className={`w-5 h-5 transform ${item.showAnalysis ? 'rotate-180' : ''}`} 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {item.showAnalysis && (
                        <div className="mt-4">
                          {item.ai_analysis != "{}" && item.ai_analysis ? (
                            <>
                              <div className={`text-gray-600 ${!item.showFullAnalysis ? 'line-clamp-3' : ''}`}>
                                {typeof item.ai_analysis === 'string' 
                                  ? item.ai_analysis 
                                  : JSON.stringify(item.ai_analysis, null, 2)}
                              </div>
                              <button
                                onClick={() => toggleFullAnalysis(item.id)}
                                className="text-blue-500 hover:text-blue-600 mt-2 text-sm"
                              >
                                {item.showFullAnalysis ? 'Show less' : 'Show more'}
                              </button>
                            </>
                          ) : (
                            <div className="text-gray-500">No data available</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button - with hover inversion effect */}
                  <div className="absolute bottom-6 right-6">
                    {(!item.ai_analysis || item.ai_analysis === "{}") ? (
                      <button
                        onClick={() => handleAnalyze(item)}
                        className="px-6 py-2.5 bg-black text-white border-2 border-black rounded-full
                        transition-all duration-200 ease-in-out
                        hover:bg-white hover:text-black"
                      >
                        Call MCP
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVisualize(item)}
                        className="px-6 py-2.5 bg-black text-white border-2 border-black rounded-full
                        transition-all duration-200 ease-in-out
                        hover:bg-white hover:text-black"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TableWithButton;
