import { Button } from "@/components/ui/button";
import { about } from "@/data/siteData";
import Hero3D from "./Hero3D";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden style={{ background: 'var(--gradient-hero)' }} />
      <Hero3D />
      <div className="container py-24 md:py-32" data-animate="fade-up">
        <p className="mb-3 text-sm text-muted-foreground animate-fade-in">{about.location}</p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-enter">
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
