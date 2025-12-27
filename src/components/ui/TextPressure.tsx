"use client";

import { useEffect, useRef, useState } from "react";

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
  const [charWeights, setCharWeights] = useState<number[]>(() => 
    new Array(text.length).fill(minFontWeight)
  );
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newWeights = charRefs.current.map((ref) => {
        if (!ref) return minFontWeight;

        const rect = ref.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(e.clientX - charCenterX, 2) + Math.pow(e.clientY - charCenterY, 2)
        );

        if (distance > cursorProximity) return minFontWeight;

        const normalizedDistance = 1 - distance / cursorProximity;
        const weight = minFontWeight + (maxFontWeight - minFontWeight) * normalizedDistance;
        return Math.round(weight);
      });

      setCharWeights(newWeights);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorProximity, minFontWeight, maxFontWeight]);

  return (
    <div
      ref={containerRef}
      className={`inline-block ${className}`}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          ref={(el) => (charRefs.current[index] = el)}
          className="inline-block hero-name"
          style={{
            fontFamily,
            fontWeight: charWeights[index] || minFontWeight,
            fontVariationSettings: `'wght' ${charWeights[index] || minFontWeight}`,
            transition: 'font-weight 0.1s ease-out, font-variation-settings 0.1s ease-out',
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
