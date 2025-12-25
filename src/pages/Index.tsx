import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
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
      
      {/* Admin Link - Fixed position */}
      <Link
        to="/admin"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 text-primary hover:bg-primary/20 hover:scale-110 transition-all duration-300 shadow-lg group"
        title="Admin Panel"
      >
        <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
      </Link>
      
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
    </div>
  );
};

export default Index;