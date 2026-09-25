import { useSupabaseData } from "@/hooks/useSupabaseData";
import LazyImage from "@/components/ui/LazyImage";
import { Award } from "lucide-react";

const Certifications = () => {
  const { data } = useSupabaseData<any>("certifications");
  if (!data.length) return null;
  const items = [...data].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));

  return (
    <section id="certifications" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="text-center mb-12">
        <div className="heading-backdrop inline-block mb-6" data-animate="heading-reveal">
          <h2 className="section-heading">Certifications & Awards</h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((c) => (
          <article key={c.id} className="group overflow-hidden rounded-2xl border border-border/50 bg-gradient-card card-hover" data-animate="zoom-in">
            <div className="bg-muted/20 flex items-center justify-center min-h-48">
              {c.image_url ? (
                <LazyImage src={c.image_url} alt={c.title} className="w-full h-auto max-h-80 object-contain transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <Award className="h-16 w-16 text-primary/50" />
              )}
            </div>
            <div className="p-5 flex items-center gap-3">
              <Award className="h-5 w-5 text-primary shrink-0" />
              <h3 className="font-display font-semibold text-lg">{c.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
