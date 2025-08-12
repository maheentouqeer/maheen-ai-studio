import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { projects as allProjects } from "@/data/siteData";
import LazyImage from "@/components/ui/LazyImage";

const Projects = () => {
  const [filter, setFilter] = useState<string>('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(allProjects.map(p => p.category)))], []);
  const items = useMemo(() => filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter), [filter]);

  return (
    <section id="projects" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <Button key={c} variant={filter === c ? 'premium' : 'secondary'} onClick={() => setFilter(c)} size="sm">
              {c}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => {
          const img = (p as any).image || (p as any).media_url;
          return (
            <article key={p.id} className="group rounded-xl border border-border bg-card/60 p-5 hover-scale hover:shadow-[var(--shadow-elevate)] animate-fade-in">
              {img ? (
                <LazyImage src={img} alt={`${p.name || p.title} preview`} className="h-40 mb-4" />
              ) : (
                <div className="h-40 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-border mb-4" aria-label={`${p.name || p.title} preview`} />
              )}
              <h3 className="font-semibold text-lg mb-1">{(p as any).name || (p as any).title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
              {(p as any).link || (p as any).link_url ? (
                <a href={(p as any).link || (p as any).link_url} className="story-link text-sm" aria-label={`Open ${(p as any).name || (p as any).title}`} target="_blank" rel="noreferrer">
                  View details
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
