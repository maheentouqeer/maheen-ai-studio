"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  className?: string;
}

export default function TiltedCard({
  imageSrc,
  altText = "Profile image",
  captionText = "",
  containerHeight = "400px",
  containerWidth = "350px",
  imageHeight = "400px",
  imageWidth = "350px",
  scaleOnHover = 1.05,
  rotateAmplitude = 15,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent,
  displayOverlayContent = false,
  className = "",
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]), springConfig);
  const scale = useSpring(isHovered ? scaleOnHover : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className={`relative ${className}`}>
      {showMobileWarning && (
        <p className="md:hidden text-xs text-muted-foreground text-center mb-2">
          Best viewed on desktop for 3D effect
        </p>
      )}
      
      <motion.div
        ref={ref}
        className="relative cursor-pointer"
        style={{
          width: containerWidth,
          height: containerHeight,
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-deep"
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Glowing border effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--accent) / 0.2))",
              opacity: isHovered ? 1 : 0,
              filter: "blur(20px)",
              transform: "translateZ(-10px)",
            }}
          />

          {/* Main image */}
          <motion.img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover rounded-2xl"
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          />

          {/* Overlay content */}
          {displayOverlayContent && overlayContent && (
            <motion.div
              className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-background/90 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {overlayContent}
            </motion.div>
          )}

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, transparent 50%)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </motion.div>

        {/* Tooltip caption */}
        {showTooltip && captionText && (
          <motion.div
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/90 backdrop-blur-md rounded-lg border border-border/50 text-sm text-foreground whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            {captionText}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
