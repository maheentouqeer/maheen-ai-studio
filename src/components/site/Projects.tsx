import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import LazyImage from "@/components/ui/LazyImage";
import LottieLoader from "@/components/ui/LottieLoader";
import { ExternalLink } from "lucide-react";

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
      <div className="text-center mb-16">
        <div className="heading-backdrop inline-block mb-8" data-animate="heading-reveal">
          <h2 className="section-heading">
            Featured Projects
          </h2>
        </div>
        <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg mb-8" data-animate="fade-up">
          Innovative AI solutions and creative applications showcasing cutting-edge technology
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(c => (
            <Button 
              key={c} 
              variant={filter === c ? 'default' : 'outline'} 
              onClick={() => setFilter(c)} 
              size="sm"
              className={`rounded-full transition-all duration-300 ${
                filter === c 
                  ? 'btn-premium shadow-glow' 
                  : 'glass-panel hover:border-primary/50'
              }`}
            >
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((p, idx) => {
            const img = p.media_url;
            const title = p.title;
            const category = p.categories?.name || 'Uncategorized';
            return (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-card backdrop-blur-sm card-hover will-change-transform cursor-pointer"
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                onClick={() => { setActive(p); setOpen(true); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { setActive(p); setOpen(true); } }}
                aria-label={`Open ${title} preview`}
                data-animate="zoom-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {img ? (
                    <LazyImage 
                      src={img} 
                      alt={`${title} preview`} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-6xl opacity-40">🚀</span>
                    </div>
                  )}
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-background/90 backdrop-blur text-foreground border-border/50 font-medium">
                      {category}
                    </Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 relative z-20">
                  <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-muted-foreground/90 mb-4 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="story-link text-sm font-medium">View details →</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Enhanced Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-gradient-card border-border/50 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold title-gradient">
              {active?.title}
            </DialogTitle>
          </DialogHeader>
          {active && (
            <div className="grid gap-6">
              {active.media_url && (
                <div className="relative overflow-hidden rounded-xl">
                  <LazyImage 
                    src={active.media_url} 
                    alt={`${active.title} preview`} 
                    className="h-80 w-full object-cover" 
                  />
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  {active.categories?.name || 'Project'}
                </Badge>
              </div>
              
              <p className="text-muted-foreground/90 leading-relaxed text-lg">
                {active.description}
              </p>
              
              {active.link_url && (
                <Button asChild className="btn-premium w-fit">
                  <a
                    href={active.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2"
                  >
                    Open project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;

