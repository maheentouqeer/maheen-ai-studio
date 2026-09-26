import { useSupabaseData } from "@/hooks/useSupabaseData";

const Skills = () => {
  const { data: skillsData } = useSupabaseData<{ id: string; skill_name: string }>("skills");

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
        {skillsData.map((skill, idx) => (
            <div 
              key={skill.id}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-card p-6 backdrop-blur-sm card-hover" 
              data-animate="zoom-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {skill.skill_name}
                </h3>
                <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
