import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  Icon: LucideIcon;
  size?: number;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export const AnimatedIcon = ({ 
  Icon, 
  size = 24, 
  className = "", 
  delay = 0,
  hover = true 
}: AnimatedIconProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={hover ? { 
        scale: 1.2, 
        rotate: 5,
        transition: { duration: 0.2 }
      } : {}}
      className={`inline-block ${className}`}
    >
      <Icon size={size} className="drop-shadow-lg" />
    </motion.div>
  );
};

export const FloatingIcon = ({ 
  Icon, 
  size = 32, 
  className = "",
  duration = 3
}: AnimatedIconProps & { duration?: number }) => {
  return (
    <motion.div
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`inline-block ${className}`}
    >
      <Icon size={size} className="drop-shadow-xl" />
    </motion.div>
  );
};

export const PulsingIcon = ({ 
  Icon, 
  size = 24, 
  className = "",
  color = "text-primary"
}: AnimatedIconProps & { color?: string }) => {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`inline-block ${color} ${className}`}
    >
      <Icon size={size} className="drop-shadow-lg filter drop-shadow-glow" />
    </motion.div>
  );
};