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
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold title-gradient animate-fade-in">
          Education
        </h2>
        <p className="text-muted-foreground mt-4 animate-fade-in">
          Academic background and certifications
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {education.map((edu: any, index: number) => (
          <Card key={edu.id} className="glass-panel hover-scale transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{edu.degree}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{edu.institution}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </Badge>
              </div>
            </CardHeader>
            {edu.description && (
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
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