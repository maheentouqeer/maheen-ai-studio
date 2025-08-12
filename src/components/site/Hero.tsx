import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { about } from "@/data/siteData";
import Hero3D from "./Hero3D";

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.querySelectorAll<HTMLElement>('[data-depth]').forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0);
        const tx = -dx * depth * 20;
        const ty = -dy * depth * 20;
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="home" ref={sectionRef as any} className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden style={{ background: 'var(--gradient-hero)' }} />
      {/* Parallax accent layers */}
      <div className="absolute -z-10 parallax-layer" data-depth="0.2" style={{ top: '10%', left: '5%' }}>
        <span className="block h-24 w-24 md:h-36 md:w-36 rounded-full bg-primary/20 blur-2xl" />
      </div>
      <div className="absolute -z-10 parallax-layer" data-depth="0.4" style={{ bottom: '15%', right: '8%' }}>
        <span className="block h-28 w-28 md:h-44 md:w-44 rounded-full bg-primary/30 blur-3xl" />
      </div>
      <div className="absolute -z-10 parallax-layer" data-depth="0.1" style={{ top: '35%', right: '35%' }}>
        <span className="block h-14 w-14 md:h-20 md:w-20 rounded-full bg-primary/25 blur-xl" />
      </div>
      <Hero3D />
      <div className="container py-24 md:py-32" data-animate="fade-up">
        <p className="mb-3 text-sm text-muted-foreground animate-fade-in">{about.location}</p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-enter title-gradient">
          {about.name} <span className="text-primary">—</span> AI Engineer
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground animate-fade-in">
          {about.summary}
        </p>
        <div className="mt-8 flex gap-3 animate-fade-in">
          <a href="#projects"><Button size="lg" variant="premium">View Projects</Button></a>
          <a href="#contact"><Button variant="secondary" size="lg">Contact Me</Button></a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

