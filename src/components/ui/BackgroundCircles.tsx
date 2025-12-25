import { cn } from "@/lib/utils";

interface BackgroundCirclesProps {
  variant?: "hero" | "section" | "subtle";
  className?: string;
}

const BackgroundCircles = ({
  variant = "hero",
  className,
}: BackgroundCirclesProps) => {
  const variants = {
    hero: [
      { size: "h-96 w-96", blur: "blur-3xl", opacity: "opacity-30", color: "bg-primary", position: "top-[-10%] left-[-5%]", delay: "0s" },
      { size: "h-72 w-72", blur: "blur-3xl", opacity: "opacity-20", color: "bg-accent", position: "top-[20%] right-[-10%]", delay: "2s" },
      { size: "h-64 w-64", blur: "blur-2xl", opacity: "opacity-25", color: "bg-primary", position: "bottom-[10%] left-[30%]", delay: "4s" },
    ],
    section: [
      { size: "h-48 w-48", blur: "blur-3xl", opacity: "opacity-15", color: "bg-primary", position: "top-[10%] right-[10%]", delay: "0s" },
      { size: "h-32 w-32", blur: "blur-2xl", opacity: "opacity-20", color: "bg-accent", position: "bottom-[20%] left-[5%]", delay: "1s" },
    ],
    subtle: [
      { size: "h-24 w-24", blur: "blur-2xl", opacity: "opacity-10", color: "bg-primary", position: "top-[50%] left-[50%]", delay: "0s" },
    ],
  };

  const circles = variants[variant];

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10", className)}>
      {circles.map((circle, i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full animate-pulse",
            circle.size,
            circle.blur,
            circle.opacity,
            circle.color,
            circle.position
          )}
          style={{
            animationDelay: circle.delay,
            animationDuration: "4s",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundCircles;
