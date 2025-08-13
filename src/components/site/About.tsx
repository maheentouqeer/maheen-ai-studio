import { useSupabaseData } from "@/hooks/useSupabaseData";
import { topSkills } from "@/data/siteData";
import LazyImage from "@/components/ui/LazyImage";

const About = () => {
  const { data: aboutData, loading } = useSupabaseData<any>("about");
  const aboutInfo = aboutData[0];

  return (
    <section id="about" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 title-gradient">
            {aboutInfo?.heading || "About Me"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {aboutInfo?.content || "Passionate AI engineer building the future with cutting-edge technology and innovative solutions."}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {topSkills.map(s => (
              <span key={s} className="rounded-full bg-secondary/60 text-secondary-foreground px-3 py-1 text-xs border border-border hover-scale">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          {aboutInfo?.image_url ? (
            <LazyImage 
              src={aboutInfo.image_url} 
              alt="Profile" 
              className="h-40 w-40 md:h-56 md:w-56 rounded-xl shadow-[var(--shadow-glow)] hover-scale"
            />
          ) : (
            <div className="h-40 w-40 md:h-56 md:w-56 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-border shadow-[var(--shadow-glow)] transition-transform hover:scale-105" aria-label="Profile image decorative" />
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
