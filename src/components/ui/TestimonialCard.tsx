import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

const TestimonialCard = ({ name, role, company, content, rating, avatar }: TestimonialCardProps) => {
  return (
    <Card className="glass-panel card-hover">
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-400 fill-current" : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        
        <blockquote className="text-muted-foreground italic mb-6 leading-relaxed">
          "{content}"
        </blockquote>
        
        <div className="flex items-center gap-3">
          {avatar && (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold text-foreground">{name}</div>
            <div className="text-sm text-muted-foreground">
              {role} at {company}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;