import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { Briefcase, Calendar, Building } from "lucide-react";

const Experience = () => {
  const { data: experience, loading } = useSupabaseData<any>("experience");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <section id="experience" className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold title-gradient">Experience</h2>
          <p className="text-muted-foreground mt-4">Professional work history</p>
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
    <section id="experience" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="text-center mb-16">
        <div className="heading-backdrop inline-block mb-8" data-animate="heading-reveal">
          <h2 className="section-heading">
            Professional Experience
          </h2>
        </div>
        <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg" data-animate="fade-up">
          Building innovative AI solutions and driving technological advancement
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {experience.map((exp: any, index: number) => (
          <Card 
            key={exp.id} 
            className="glass-panel card-hover group relative overflow-hidden" 
            data-animate="fade-left"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                      {exp.role}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="font-medium">{exp.company}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-secondary/20 border-primary/30">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            
            {exp.description && (
              <CardContent className="relative pt-0">
                <p className="text-muted-foreground/90 leading-relaxed">
                  {exp.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Experience;