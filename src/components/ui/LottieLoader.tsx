import Lottie from "lottie-react";

interface LottieLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Simple animated loader using CSS animation as fallback
const LottieLoader = ({ size = "md", className = "" }: LottieLoaderProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  // Simple CSS-based loader with gradient animation
  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 animate-spin" 
           style={{ 
             background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent)',
             animation: 'spin 1.5s linear infinite'
           }} 
      />
      <div className="absolute inset-1 rounded-full bg-background" />
      <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse" />
    </div>
  );
};

export default LottieLoader;