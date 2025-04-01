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
  onItemClick,
  children
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
    <div className="flex gap-2 items-center justify-center flex-wrap">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="group relative"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onClick={() => onItemClick(item)}
        >
          {children(item)}
        </motion.div>
      ))}
    </div>
  );
}; 