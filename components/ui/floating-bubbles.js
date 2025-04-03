"use client";
import { motion } from "framer-motion";

export const FloatingBubbles = ({ scale = 0.5, opacity = 0.2 }) => {
  const bubbles = [
    // Reduced number of bubbles and simplified animations
    { size: "w-16 h-16", color: "bg-blue-200", duration: 20, delay: 0, startY: "20%" },
    { size: "w-12 h-12", color: "bg-red-200", duration: 18, delay: 2, startY: "40%" },
    { size: "w-20 h-20", color: "bg-yellow-200", duration: 22, delay: 1, startY: "60%" },
    { size: "w-14 h-14", color: "bg-green-200", duration: 19, delay: 3, startY: "80%" },
    // Right side bubbles
    { size: "w-16 h-16", color: "bg-purple-200", duration: 21, delay: 2, startY: "30%", fromRight: true },
    { size: "w-12 h-12", color: "bg-pink-200", duration: 17, delay: 4, startY: "50%", fromRight: true },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${bubble.size} ${bubble.color}`}
          style={{ 
            opacity: opacity,
            scale: scale,
            willChange: "transform" // Optimization for animations
          }}
          initial={{ 
            x: bubble.fromRight ? "110%" : "-10%",
            y: bubble.startY
          }}
          animate={{
            x: bubble.fromRight ? "-10%" : "110%",
            y: bubble.startY
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        />
      ))}
    </div>
  );
}; 