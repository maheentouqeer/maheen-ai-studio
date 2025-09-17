import { useSupabaseData } from "@/hooks/useSupabaseData";
import { topSkills } from "@/data/siteData";
import LazyImage from "@/components/ui/LazyImage";
import maheen3DAvatar from "@/assets/maheen-3d-avatar.jpg";
import maheenTouqeer from "@/assets/maheen-touqeer.jpg";

const About = () => {
  const { data: aboutData, loading } = useSupabaseData<any>("about");
  const aboutInfo = aboutData.length > 0 ? aboutData[0] : null;

  return (
    <section id="about" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div className="order-2 lg:order-1" data-animate="fade-right">
        <div className="heading-backdrop mb-8" data-animate="heading-reveal">
          <h2 className="section-heading text-center lg:text-left">
            {aboutInfo?.heading || "About Me"}
          </h2>
        </div>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground/90">
            <p className="font-medium">
              {aboutInfo?.content || "Passionate AI engineer building the future with cutting-edge technology and innovative solutions."}
            </p>
            <p className="text-base">
              Currently pursuing BS in Artificial Intelligence at DUET, focusing on ethical AI development and real-world applications.
            </p>
          </div>
          
          {/* Credentials highlight */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-card border border-primary/20">
            <h3 className="font-display font-semibold text-primary mb-3">Featured Work</h3>
            <p className="text-sm text-muted-foreground/80">
              🚀 30 AI Apps in 30 Days Challenge • 🎯 RAG & Agentic AI Specialist • 🎨 Creative AI Solutions
            </p>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3">
            {topSkills.map(skill => (
              <span 
                key={skill} 
                className="px-4 py-2 rounded-xl bg-secondary/40 text-secondary-foreground text-sm font-medium border border-border/50 hover-scale transition-all hover:bg-secondary/60 hover:border-primary/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="order-1 lg:order-2 flex justify-center" data-animate="fade-left">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20 blur-xl animate-pulse" />
            <LazyImage 
              src={maheenTouqeer} 
              alt="Maheen Touqeer - AI Engineer and Developer working with cutting-edge technology" 
              className="relative h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 rounded-2xl shadow-deep hover-scale ring-2 ring-primary/30 transition-all duration-500 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
