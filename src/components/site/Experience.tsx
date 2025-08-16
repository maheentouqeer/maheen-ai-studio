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
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold title-gradient animate-fade-in">
          Experience
        </h2>
        <p className="text-muted-foreground mt-4 animate-fade-in">
          Professional work history
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {experience.map((exp: any, index: number) => (
          <Card key={exp.id} className="glass-panel hover-scale transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{exp.role}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">{exp.company}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                </Badge>
              </div>
            </CardHeader>
            {exp.description && (
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
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