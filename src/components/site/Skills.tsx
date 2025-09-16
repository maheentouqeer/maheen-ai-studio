import { useSupabaseData } from "@/hooks/useSupabaseData";
import { skills } from "@/data/siteData";

const Skills = () => {
  const { data: skillsData, loading } = useSupabaseData<any>("skills");
  const displaySkills = skillsData.length > 0 ? skillsData : skills.map(s => ({ skill_name: s, proficiency: 75 }));

  return (
    <section id="skills" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="text-center mb-16">
        <div className="heading-backdrop inline-block mb-8" data-animate="heading-reveal">
          <h2 className="section-heading">
            Technical Skills
          </h2>
        </div>
        <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg" data-animate="fade-up">
          Expertise in AI technologies and programming languages
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displaySkills.map((skill: any, idx: number) => {
          const skillName = skill.skill_name || skill;
          const proficiency = skill.proficiency || 75;
          return (
            <div 
              key={idx} 
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-card p-6 backdrop-blur-sm card-hover" 
              data-animate="zoom-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {skillName}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{proficiency}%</span>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
              
              <div className="relative h-2 w-full rounded-full bg-secondary/40 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-primary transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${proficiency}%`,
                    animationDelay: `${idx * 0.2}s`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
