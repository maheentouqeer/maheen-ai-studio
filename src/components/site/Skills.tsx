import { skills } from "@/data/siteData";

const Skills = () => {
  return (
    <section id="skills" className="container py-16 md:py-24" data-animate="fade-up">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">Skills</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div key={s} className="group rounded-xl border border-border bg-card/60 p-4 backdrop-blur hover:shadow-[var(--shadow-elevate)] transition-all animate-fade-in" data-animate="fade-up">
            <div className="flex items-center justify-between">
              <p className="font-medium">{s}</p>
              <span className="h-2 w-2 rounded-full bg-primary/70 group-hover:bg-primary transition-colors" />
            </div>
            <div className="mt-3 h-2 w-full rounded bg-secondary/60 overflow-hidden">
              <div className="h-full w-3/4 bg-primary/80 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
