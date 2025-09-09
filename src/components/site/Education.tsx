import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

const Education = () => {
  const { data: education, loading } = useSupabaseData<any>("education");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <section id="education" className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold title-gradient">Education</h2>
          <p className="text-muted-foreground mt-4">Academic background and certifications</p>
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-black mb-4 title-gradient">
          Education Journey
        </h2>
        <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">
          Academic foundation and continuous learning in AI and technology
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {education.map((edu: any, index: number) => (
          <Card 
            key={edu.id} 
            className="glass-panel card-hover group relative overflow-hidden" 
            data-animate="fade-in-left"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                      {edu.degree}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{edu.institution}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-secondary/20 border-primary/30">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            
            {edu.description && (
              <CardContent className="relative pt-0">
                <p className="text-muted-foreground/90 leading-relaxed">
                  {edu.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Education;