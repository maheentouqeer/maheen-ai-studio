import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { projects as allProjects } from "@/data/siteData";
import LazyImage from "@/components/ui/LazyImage";
import { Skeleton } from "@/components/ui/skeleton";

const Projects = () => {
  const [filter, setFilter] = useState<string>('All');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => ['All', ...Array.from(new Set(allProjects.map(p => p.category)))], []);
  const items = useMemo(() => filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter), [filter]);

  // Simulate initial load for skeletons
  useState(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  });

  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6; // tilt up/down
    const ry = ((x / rect.width) - 0.5) * 6;   // tilt left/right
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };
  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <section id="projects" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold title-gradient">Projects</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <Button key={c} variant={filter === c ? 'premium' : 'secondary'} onClick={() => setFilter(c)} size="sm">
              {c}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card/60 p-5">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(p => {
            const img = (p as any).image || (p as any).media_url;
            const title = (p as any).name || (p as any).title;
            return (
              <article
                key={p.id}
                className="group rounded-xl border border-border bg-card/60 p-5 hover:shadow-[var(--shadow-elevate)] transition-transform duration-200 will-change-transform"
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                onClick={() => { setActive(p); setOpen(true); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { setActive(p); setOpen(true); } }}
                aria-label={`Open ${title} preview`}
              >
                {img ? (
                  <LazyImage src={img} alt={`${title} preview`} className="h-40 mb-4" />
                ) : (
                  <div className="h-40 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-border mb-4" aria-label={`${title} preview`} />
                )}
                <h3 className="font-semibold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                <span className="story-link text-sm">View details</span>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{(active as any)?.name || (active as any)?.title}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="grid gap-3">
              {((active as any).image || (active as any).media_url) ? (
                <LazyImage src={(active as any).image || (active as any).media_url} alt={`Preview`} className="h-72" />
              ) : null}
              <p className="text-sm text-muted-foreground">{(active as any).description}</p>
              {((active as any).link || (active as any).link_url) && (
                <a
                  href={(active as any).link || (active as any).link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="story-link"
                >
                  Open project
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;

