import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { projects as allProjects } from "@/data/siteData";

const Projects = () => {
  const [filter, setFilter] = useState<string>('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(allProjects.map(p => p.category)))], []);
  const items = useMemo(() => filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter), [filter]);

  return (
    <section id="projects" className="container py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <Button key={c} variant={filter === c ? 'default' : 'secondary'} onClick={() => setFilter(c)} size="sm">
              {c}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <article key={p.id} className="group rounded-xl border border-border bg-card/60 p-5 hover-scale hover:shadow-[var(--shadow-elevate)] animate-fade-in">
            <div className="h-40 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-border mb-4" aria-label={`${p.name} preview`} />
            <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
            {p.link && (
              <a href={p.link} className="story-link text-sm" aria-label={`Open ${p.name}`}>
                View details
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
