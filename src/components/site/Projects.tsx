import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import LazyImage from "@/components/ui/LazyImage";
import LottieLoader from "@/components/ui/LottieLoader";

const Projects = () => {
  const [filter, setFilter] = useState<string>('All');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any | null>(null);

  const { data: projectsData, loading } = useSupabaseData<any>("projects", "*, categories(name)");
  const { data: categoriesData } = useSupabaseData<any>("categories");

  const categories = useMemo(() => {
    const cats = categoriesData.map(c => c.name);
    return ['All', ...cats];
  }, [categoriesData]);

  const items = useMemo(() => {
    const projects = projectsData.filter(p => p.published !== false);
    if (filter === 'All') return projects;
    return projects.filter(p => p.categories?.name === filter);
  }, [projectsData, filter]);

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
        <div className="flex justify-center py-12">
          <LottieLoader size="lg" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(p => {
            const img = p.media_url;
            const title = p.title;
            const category = p.categories?.name || 'Uncategorized';
            return (
              <article
                key={p.id}
                className="group rounded-xl border border-border bg-card/60 p-5 hover:shadow-[var(--shadow-elevate)] transition-transform duration-200 will-change-transform cursor-pointer"
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
                  <div className="h-40 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-border mb-4 flex items-center justify-center" aria-label={`${title} preview`}>
                    <span className="text-4xl text-primary/40">🚀</span>
                  </div>
                )}
                <div className="mb-2">
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">{category}</span>
                </div>
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
            <DialogTitle>{active?.title}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="grid gap-4">
              {active.media_url && (
                <LazyImage src={active.media_url} alt={`${active.title} preview`} className="h-72" />
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                  {active.categories?.name || 'Project'}
                </span>
              </div>
              <p className="text-muted-foreground">{active.description}</p>
              {active.link_url && (
                <a
                  href={active.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="story-link inline-flex items-center gap-2"
                >
                  Open project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
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

