import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import GlowingCard from "@/components/ui/GlowingCard";

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

  const educationContent = (
    <div className="space-y-6 p-4 overflow-y-auto max-h-full">
      {education.map((edu: any, index: number) => (
        <GlowingCard key={edu.id}>
          <Card 
            className="glass-panel group relative overflow-hidden border-0 bg-card/50" 
            data-animate="fade-right"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative py-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg md:text-xl font-display font-bold mb-1 group-hover:text-primary transition-colors">
                      {edu.degree}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span className="font-medium">{edu.institution}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 bg-secondary/20 border-primary/30 text-xs">
                  <Calendar className="h-2 w-2" />
                  <span className="font-medium">
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            
            {edu.description && (
              <CardContent className="relative pt-0 pb-4">
                <p className="text-muted-foreground/90 leading-relaxed text-sm">
                  {edu.description}
                </p>
              </CardContent>
            )}
          </Card>
        </GlowingCard>
      ))}
    </div>
  );

  return (
    <section id="education" className="relative overflow-hidden" data-animate="fade-up">
      <ContainerScroll
        titleComponent={
          <div className="text-center mb-8">
            <div className="heading-backdrop inline-block mb-4" data-animate="heading-reveal">
              <h2 className="section-heading text-3xl md:text-5xl font-bold">
                Education Journey
              </h2>
            </div>
            <p className="text-muted-foreground/80 max-w-2xl mx-auto text-base md:text-lg" data-animate="fade-up">
              Academic foundation and continuous learning in AI and technology
            </p>
          </div>
        }
      >
        {educationContent}
      </ContainerScroll>
    </section>
  );
};

export default Education;
