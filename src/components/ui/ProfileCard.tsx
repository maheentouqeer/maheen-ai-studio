import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mail, MapPin, ExternalLink } from "lucide-react";

interface ProfileCardProps {
  name: string;
  title: string;
  location?: string;
  email?: string;
  imageUrl?: string;
  status?: "available" | "busy" | "away";
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const ProfileCard = ({
  name,
  title,
  location,
  email,
  imageUrl,
  status = "available",
  ctaLabel = "Contact Me",
  ctaHref = "#contact",
  className,
}: ProfileCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -10;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  const statusColors = {
    available: "bg-green-500",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative p-6 rounded-2xl",
        "bg-gradient-to-br from-card/90 to-card/60",
        "backdrop-blur-xl border border-border/50",
        "shadow-xl",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-20" />

      <div className="relative z-10">
        {/* Avatar Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {/* Status indicator */}
            <div
              className={cn(
                "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background",
                statusColors[status]
              )}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-2 mb-4">
          {location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{location}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span>{email}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.a
          href={ctaHref}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-3 px-4",
            "bg-primary text-primary-foreground rounded-xl font-medium",
            "hover:bg-primary/90 transition-colors"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {ctaLabel}
          <ExternalLink className="h-4 w-4" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
