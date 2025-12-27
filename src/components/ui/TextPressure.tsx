"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TextPressureProps {
  text: string;
  className?: string;
  fontFamily?: string;
  minFontWeight?: number;
  maxFontWeight?: number;
  cursorProximity?: number;
}

export default function TextPressure({
  text,
  className = "",
  fontFamily = "'Playfair Display', Georgia, serif",
  minFontWeight = 400,
  maxFontWeight = 900,
  cursorProximity = 150,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [charWeights, setCharWeights] = useState<number[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    setCharWeights(new Array(text.length).fill(minFontWeight));
  }, [text, minFontWeight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (mousePos.x === -1000) return;

    const newWeights = charRefs.current.map((ref) => {
      if (!ref) return minFontWeight;

      const rect = ref.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(mousePos.x - charCenterX, 2) + Math.pow(mousePos.y - charCenterY, 2)
      );

      if (distance > cursorProximity) return minFontWeight;

      const normalizedDistance = 1 - distance / cursorProximity;
      const weight = minFontWeight + (maxFontWeight - minFontWeight) * normalizedDistance;
      return Math.round(weight);
    });

    setCharWeights(newWeights);
  }, [mousePos, cursorProximity, minFontWeight, maxFontWeight]);

  return (
    <motion.div
      ref={containerRef}
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          ref={(el) => (charRefs.current[index] = el)}
          className="inline-block hero-name transition-all duration-100"
          style={{
            fontFamily,
            fontWeight: charWeights[index] || minFontWeight,
            fontVariationSettings: `'wght' ${charWeights[index] || minFontWeight}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.03,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}
