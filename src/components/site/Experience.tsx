import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { Briefcase, Calendar, Code, FileText, User, Clock, Sparkles } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import GlowingCard from "@/components/ui/GlowingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const Experience = () => {
  const { data: experience, loading } = useSupabaseData<any>("experience");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Convert experience data to timeline format with enhanced styling
  const timelineData = experience.map((exp: any, index: number) => ({
    id: index + 1,
    title: exp.role || "Role",
    date: formatDate(exp.start_date),
    content: exp.description || "",
    category: exp.company || "Company",
    icon: index === 0 ? Briefcase : index === 1 ? Code : index === 2 ? FileText : index === 3 ? User : Clock,
    relatedIds: index < experience.length - 1 ? [index + 2] : [],
    status: exp.end_date ? "completed" as const : "in-progress" as const,
    energy: 100,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
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
    <section id="experience" className="container py-16 md:py-24 relative" data-animate="fade-up">
      {/* Background glow effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="heading-backdrop inline-block mb-8 relative" data-animate="heading-reveal">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-xl blur-lg opacity-60" />
          <h2 className="section-heading relative flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            Professional Experience
            <Sparkles className="w-8 h-8 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </h2>
        </div>
        <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg" data-animate="fade-up">
          Building innovative AI solutions and driving technological advancement
        </p>
      </motion.div>

      {/* Radial Orbital Timeline for larger screens - Enhanced */}
      {experience.length > 0 && (
        <motion.div 
          className="hidden lg:block"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <RadialOrbitalTimeline timelineData={timelineData} />
        </motion.div>
      )}

      {/* Card layout for mobile with enhanced animations */}
      <motion.div 
        className="lg:hidden space-y-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {experience.map((exp: any, index: number) => (
          <motion.div
            key={exp.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <GlowingCard>
              <Card 
                className="glass-panel group relative overflow-hidden border-0 bg-transparent backdrop-blur-xl" 
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-[1px] rounded-lg bg-card" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-shine translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-20" />
                
                <CardHeader className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-glow"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Briefcase className="h-6 w-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors bg-gradient-to-r from-foreground to-primary bg-clip-text group-hover:text-transparent">
                          {exp.role}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="font-medium">{exp.company}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-primary/10 border-primary/40 shadow-sm">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span className="font-medium text-primary-foreground">
                        {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                
                {exp.description && (
                  <CardContent className="relative z-10 pt-0">
                    <p className="text-muted-foreground/90 leading-relaxed">
                      {exp.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </GlowingCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Experience;
