"use client";

import React from "react";
import { Vortex } from "../components/ui/vortex";

export default function VortexDemo() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-4 md:px-10 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          The Color Theory
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Who are you talking to, how can you improve, what should you say?
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Sync Omi
          </button>
          <button className="px-4 py-2 text-white">Visualize</button>
        </div>
      </Vortex>
    </div>
  );
}
