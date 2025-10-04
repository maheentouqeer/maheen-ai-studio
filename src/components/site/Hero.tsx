import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { about } from "@/data/siteData";
import Hero3D from "./Hero3D";
import { gsap } from "gsap";
const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // GSAP Hero Animations
    const tl = gsap.timeline();

    // Animate hero content
    tl.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out"
    }).from(".hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5").from(".hero-description", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4").from(".hero-buttons", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3").from("[data-depth]", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.6");

    // Parallax effect with GSAP
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.querySelectorAll<HTMLElement>('[data-depth]').forEach(layer => {
        const depth = Number(layer.dataset.depth || 0);
        const tx = -dx * depth * 20;
        const ty = -dy * depth * 20;
        gsap.to(layer, {
          x: tx,
          y: ty,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);
  return <section id="home" ref={sectionRef as any} className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden style={{
      background: 'var(--gradient-hero)'
    }} />
      {/* Parallax accent layers */}
      <div className="absolute -z-10 parallax-layer" data-depth="0.2" style={{
      top: '10%',
      left: '5%'
    }}>
        <span className="block h-24 w-24 md:h-36 md:w-36 rounded-full bg-primary/20 blur-2xl" />
      </div>
      <div className="absolute -z-10 parallax-layer" data-depth="0.4" style={{
      bottom: '15%',
      right: '8%'
    }}>
        <span className="block h-28 w-28 md:h-44 md:w-44 rounded-full bg-primary/30 blur-3xl" />
      </div>
      <div className="absolute -z-10 parallax-layer" data-depth="0.1" style={{
      top: '35%',
      right: '35%'
    }}>
        <span className="block h-14 w-14 md:h-20 md:w-20 rounded-full bg-primary/25 blur-xl" />
      </div>
      <Hero3D />
      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-5xl mx-auto text-center space-y-8" data-animate="fade-up">
          <div className="space-y-6">
            <div className="inline-block animate-fade-in">
              <Badge variant="outline" className="px-6 py-3 text-sm font-medium bg-gradient-primary/10 border-primary/40 backdrop-blur-xl shadow-glow">
                <span className="bg-gradient-primary bg-clip-text text-transparent font-semibold">
                  ✨ AI Engineer & Creative Developer
                </span>
              </Badge>
            </div>
            
            <h1 className="hero-title hero-name text-6xl md:text-8xl lg:text-9xl" data-text="Maheen Touqeer" data-animate="zoom-in">
              Maheen Touqeer
            </h1>
            
            <p className="hero-description text-xl md:text-2xl lg:text-3xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed font-light" data-animate="fade-up">
              Building intelligent systems that transform ideas into reality through 
              <span className="bg-gradient-accent bg-clip-text text-transparent font-semibold"> cutting-edge AI</span> and 
              <span className="bg-gradient-accent bg-clip-text text-transparent font-semibold"> innovative technology</span>
            </p>
          </div>
          
          <div className="hero-buttons mt-12 flex flex-col sm:flex-row gap-4 justify-center" data-animate="fade-up">
            <a href="#projects">
              <Button size="lg" className="btn-premium hover-scale text-lg px-10 py-7 rounded-2xl font-bold shadow-intense">
                View My Work
              </Button>
            </a>
            <a href="#contact">
              <Button variant="outline" size="lg" className="glass-panel hover-scale text-lg px-10 py-7 rounded-2xl font-bold border-2 border-primary/40 hover:border-primary/70 hover:bg-primary/5">
                Let's Connect
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;