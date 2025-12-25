import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

const GradientText = ({
  children,
  className,
  animate = true,
  as: Component = "span",
}: GradientTextProps) => {
  return (
    <Component
      className={cn(
        "bg-clip-text text-transparent",
        "bg-gradient-to-r from-[hsl(210,100%,90%)] via-[hsl(214,92%,55%)] to-[hsl(180,100%,80%)]",
        animate && "animate-gradient bg-[length:200%_200%]",
        className
      )}
    >
      {children}
    </Component>
  );
};

export default GradientText;
