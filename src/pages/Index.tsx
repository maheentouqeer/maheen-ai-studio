import NavBar from "@/components/site/NavBar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Skills from "@/components/site/Skills";
import Timeline from "@/components/site/Timeline";
import Education from "@/components/site/Education";
import Experience from "@/components/site/Experience";
import Projects from "@/components/site/Projects";
import HireLinks from "@/components/site/HireLinks";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import VoiceAssistant from "@/components/site/VoiceAssistant";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { education } from "@/data/siteData";
import useScrollReveal from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();
  const { data: educationData } = useSupabaseData<any>("education");
  const displayEducation = educationData.length > 0 
    ? educationData.map((e: any) => ({
        school: e.institution,
        detail: e.degree || "Studies",
        period: `${e.start_date || ''} - ${e.end_date || 'Present'}`
      }))
    : education;

  return (
    <div>
      <NavBar />
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
