import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { about } from "@/data/siteData";
import Hero3D from "./Hero3D";
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect";
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

  return (
    <section id="home" ref={sectionRef as any} className="relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 -z-10" aria-hidden style={{
        background: 'var(--gradient-hero)'
      }} />
      
      {/* Animated shine effect */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-shine" />
        </div>
      </div>
      
      {/* Parallax accent layers */}
      <div className="absolute -z-10 parallax-layer" data-depth="0.2" style={{
        top: '10%',
        left: '5%'
      }}>
        <span className="block h-28 w-28 md:h-40 md:w-40 rounded-full bg-primary/30 blur-3xl animate-pulse" />
      </div>
      <div className="absolute -z-10 parallax-layer" data-depth="0.4" style={{
        bottom: '15%',
        right: '8%'
      }}>
        <span className="block h-32 w-32 md:h-48 md:w-48 rounded-full bg-accent/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute -z-10 parallax-layer" data-depth="0.1" style={{
        top: '35%',
        right: '35%'
      }}>
        <span className="block h-16 w-16 md:h-24 md:w-24 rounded-full bg-primary/25 blur-2xl" />
      </div>
      <div className="absolute -z-10 parallax-layer" data-depth="0.3" style={{
        top: '60%',
        left: '20%'
      }}>
        <span className="block h-20 w-20 md:h-32 md:w-32 rounded-full bg-[hsl(195_100%_50%/0.2)] blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <Hero3D />
      <div className="container py-24 md:py-32">
        {/* Vapour Text Effect for Name */}
        <div className="hero-title h-24 md:h-32 lg:h-40 xl:h-48 mb-6 relative">
          <VaporizeTextCycle
            texts={[about.name]}
            font={{
              fontFamily: "'Playfair Display', Georgia, Times, serif",
              fontSize: "clamp(48px, 10vw, 120px)",
              fontWeight: 700,
            }}
            color="rgb(96, 165, 250)"
            spread={8}
            density={7}
            animation={{
              vaporizeDuration: 3,
              fadeInDuration: 1.5,
              waitDuration: 2,
            }}
            direction="left-to-right"
            alignment="left"
            tag={Tag.H1}
          />
        </div>
        
        <h2 className="hero-subtitle text-xl md:text-2xl lg:text-3xl font-display font-semibold text-foreground/90 mb-6 leading-relaxed">
          AI Engineer & Generative AI Developer
        </h2>
        <p className="hero-description max-w-xl text-base md:text-lg text-muted-foreground/90 leading-relaxed font-medium">
          Building the future with AI & Automation • Passionate about AI Agents & Ethical Innovation
        </p>
        
        <div className="hero-buttons mt-10 flex flex-col sm:flex-row gap-4">
          <a href="#projects">
            <Button size="lg" className="btn-premium hover-scale text-lg px-8 py-6 rounded-xl font-semibold relative overflow-hidden group">
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-shine translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Button>
          </a>
          <a href="#contact">
            <Button variant="outline" size="lg" className="glass-panel hover-scale text-lg px-8 py-6 rounded-xl font-semibold border-primary/30 hover:border-primary/60 hover:shadow-glow transition-all duration-300">
              Let's Connect
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;