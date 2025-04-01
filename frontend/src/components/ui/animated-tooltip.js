"use client";
import React, { useState } from "react";
import { Inter } from 'next/font/google';
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const AnimatedTooltip = ({
  items,
  onItemClick
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const getColorStyle = (suggestedColor) => {
    const colors = {
      Yellow: 'rgba(255, 206, 86, 0.5)',
      Blue: 'rgba(54, 162, 235, 0.5)',
      Red: 'rgba(255, 99, 132, 0.5)',
      Green: 'rgba(75, 192, 192, 0.5)'
    };
    return colors[suggestedColor] || 'rgba(200, 200, 200, 0.5)';
  };

  // FF = 100% opacity
  // CC = 80% opacity
  // 80 = 50% opacity
  // 40 = 25% opacity


  return (
    <div className="flex flex-row gap-4">
      {items.map((item) => (
        <div
          className="group relative cursor-pointer"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onItemClick && onItemClick(item)}>
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl">
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-white">{item.suggested_color}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className="relative flex items-center justify-center h-20 w-20 rounded-full transition duration-500 group-hover:scale-105"
            style={{
              backgroundColor: getColorStyle(item.suggested_color),
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
            }}
          >
            <span
              className={`${inter.className} text-xs font-medium text-black`}
            >
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}; 