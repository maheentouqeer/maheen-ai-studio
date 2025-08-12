import NavBar from "@/components/site/NavBar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Skills from "@/components/site/Skills";
import Timeline from "@/components/site/Timeline";
import Projects from "@/components/site/Projects";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import VoiceAssistant from "@/components/site/VoiceAssistant";
import { education } from "@/data/siteData";
import useScrollReveal from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();
  return (
    <div>
      <NavBar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Timeline id="education" title="Education" items={education} />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
};

export default Index;
