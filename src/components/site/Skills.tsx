import { useSupabaseData } from "@/hooks/useSupabaseData";
import { skills } from "@/data/siteData";

const Skills = () => {
  const { data: skillsData, loading } = useSupabaseData<any>("skills");
  const displaySkills = skillsData.length > 0 ? skillsData : skills.map(s => ({ skill_name: s, proficiency: 75 }));

  return (
    <section id="skills" className="container py-16 md:py-24" data-animate="fade-up">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 title-gradient">Skills</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displaySkills.map((skill: any, idx: number) => {
          const skillName = skill.skill_name || skill;
          const proficiency = skill.proficiency || 75;
          return (
            <div key={idx} className="group rounded-xl border border-border bg-card/60 p-4 backdrop-blur hover:shadow-[var(--shadow-elevate)] transition-all animate-fade-in" data-animate="fade-up">
              <div className="flex items-center justify-between">
                <p className="font-medium">{skillName}</p>
                <span className="h-2 w-2 rounded-full bg-primary/70 group-hover:bg-primary transition-colors" />
              </div>
              <div className="mt-3 h-2 w-full rounded bg-secondary/60 overflow-hidden">
                <div 
                  className="h-full bg-primary/80 rounded transition-all duration-700 ease-out"
                  style={{ width: `${proficiency}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
