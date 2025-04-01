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
  const prompt = `Analyze: ${transcript}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  return JSON.parse(completion.choices[0].message.content || "{}");
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
        prev.map((i) =>
          i.id === item.id ? { ...i, ai_analysis: aiResponse } : i
        )
      );
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
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-sm relative min-h-[400px] border border-white/20"
                >
                  <div className="h-[160px] mb-8">
                    <h2 className="text-xl font-semibold mb-3">
                      {item.title || "-"}
                    </h2>
                    <div>
                      <p className="text-gray-600 mb-2">
                        {item.overview || "-"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="pb-16">
                    <Accordion type="multiple" className="space-y-4">
                      <AccordionItem value="transcript">
                        <AccordionTrigger className="flex justify-between w-full">
                          Transcript
                        </AccordionTrigger>
                        <AccordionContent className="mt-4">
                          {formatTranscript(item.transcript)}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="analysis">
                        <AccordionTrigger className="flex justify-between w-full">
                          AI Analysis
                        </AccordionTrigger>
                        <AccordionContent className="mt-4">
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

                  <div className="absolute bottom-6 right-6">
                    {!item.ai_analysis || item.ai_analysis === "{}" ? (
                      <button
                        onClick={() => handleAnalyze(item)}
                        className="px-6 py-2.5 bg-black text-white border-1 border-black rounded-md transition-all duration-200 ease-in-out hover:bg-white hover:text-black"
                      >
                        Call MCP
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
