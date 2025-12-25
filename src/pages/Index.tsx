import LimelightNav from "@/components/ui/LimelightNav";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Skills from "@/components/site/Skills";
import Education from "@/components/site/Education";
import Experience from "@/components/site/Experience";
import Projects from "@/components/site/Projects";
import HireLinks from "@/components/site/HireLinks";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import VoiceAssistant from "@/components/site/VoiceAssistant";
import BackgroundCircles from "@/components/ui/BackgroundCircles";
import useScrollReveal from "@/hooks/useScrollReveal";

const navItems = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "education", label: "Education", href: "#education" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "contact", label: "Contact", href: "#contact" },
];

const Index = () => {
  useScrollReveal();

  return (
    <div className="relative">
      <BackgroundCircles variant="hero" />
      <LimelightNav items={navItems} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Education />
        <Experience />
        <Projects />
        <HireLinks />
        <Contact />
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
};

export default Index;
