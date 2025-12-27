import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Trophy, Clock, CheckCircle } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import TestimonialCard from "@/components/ui/TestimonialCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const HireLinks = () => {
  const { data: hireLinks, loading } = useSupabaseData<any>("hire_links");

  // Default hire links if none in database
  const defaultLinks = [
    {
      platform: "Upwork",
      url: "https://www.upwork.com/freelancers/maheen-touqeer",
      description: "AI Development & App Creation",
      rate: "$25/hour",
      rating: "5.0",
      projects: "15+",
      available: true
    },
    {
      platform: "Fiverr", 
      url: "https://www.fiverr.com/maheen_ai",
      description: "Custom AI Solutions & Chatbots",
      rate: "Starting at $50",
      rating: "4.9",
      projects: "25+",
      available: true
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/maheen-touqeer-3b5b03289",
      description: "Professional AI Engineering Services",
      rate: "Contact for Quote",
      rating: "Recommended",
      projects: "30+",
      available: true
    }
  ];

  const displayLinks = hireLinks.length > 0 ? hireLinks : defaultLinks;

  if (loading) {
    return (
      <section id="hire" className="container py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 bg-muted/50 rounded-xl animate-pulse mb-6 max-w-md mx-auto" />
          <div className="h-6 bg-muted/50 rounded-lg animate-pulse mb-4 max-w-lg mx-auto" />
          <div className="h-4 bg-muted/50 rounded animate-pulse mb-12 max-w-2xl mx-auto" />
          <div className="flex flex-wrap justify-center gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-40 bg-muted/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hire" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="text-center max-w-4xl mx-auto">
        {/* Stats Section - Trusted by Clients Worldwide */}
        <div className="mb-16">
          <div className="heading-backdrop inline-block mb-8" data-animate="heading-reveal">
            <h2 className="section-heading">
              Trusted by Clients Worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
            <div 
              className="p-6 rounded-2xl bg-gradient-card border border-primary/20 backdrop-blur-sm group hover:border-primary/40 transition-all duration-300"
              data-animate="bounce-in"
              style={{ animationDelay: '0s' }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={5} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Projects Completed</p>
            </div>
            
            <div 
              className="p-6 rounded-2xl bg-gradient-card border border-primary/20 backdrop-blur-sm group hover:border-primary/40 transition-all duration-300"
              data-animate="bounce-in"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Client Satisfaction</p>
            </div>
            
            <div 
              className="p-6 rounded-2xl bg-gradient-card border border-primary/20 backdrop-blur-sm group hover:border-primary/40 transition-all duration-300"
              data-animate="bounce-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={20} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">AI Applications Built</p>
            </div>
            
            <div 
              className="p-6 rounded-2xl bg-gradient-card border border-primary/20 backdrop-blur-sm group hover:border-primary/40 transition-all duration-300"
              data-animate="bounce-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={2} suffix="h" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Avg Response Time</p>
            </div>
          </div>
        </div>
        
        {/* Let's Build Section */}
        <p className="text-xl text-muted-foreground/90 mb-4 font-medium" data-animate="fade-up">
          Ready to bring your AI vision to life?
        </p>
        <p className="text-muted-foreground/80 mb-12 max-w-2xl mx-auto" data-animate="fade-up"
           style={{ animationDelay: '0.2s' }}>
          From AI apps and chatbots to automation workflows and creative solutions — let's collaborate on your next breakthrough project.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {displayLinks.map((link: any, idx: number) => (
            <a 
              key={link.platform || idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              data-animate="bounce-in"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <Button 
                size="lg" 
                className="btn-premium text-lg px-8 py-6 rounded-2xl font-semibold hover-scale shadow-glow group-hover:shadow-deep transition-all duration-300"
              >
                {link.platform}
                <ExternalLink className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          ))}
        </div>
        
        {/* Enhanced CTA */}
        <div className="p-6 rounded-2xl bg-gradient-card border border-primary/20 max-w-2xl mx-auto backdrop-blur-sm">
          <h3 className="text-xl font-display font-semibold mb-3 text-foreground">Custom AI Solutions</h3>
          <p className="text-muted-foreground/90 mb-6 leading-relaxed">
            Need a custom AI application or consultation? I specialize in building end-to-end AI solutions 
            using the latest technologies including LangChain, Streamlit, Hugging Face, and more.
          </p>
          <Button asChild variant="outline" className="glass-panel hover-scale font-semibold">
            <a href="#contact">Get Custom Quote →</a>
          </Button>
        </div>
        
        {/* Status indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground/60 flex flex-wrap justify-center items-center gap-4">
            <span className="flex items-center gap-1">
              💼 <span>Available for freelance</span>
            </span>
            <span className="flex items-center gap-1">
              🚀 <span>Open to full-time opportunities</span>
            </span>
            <span className="flex items-center gap-1">
              🤝 <span>Partnership ready</span>
            </span>
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="mt-16" data-animate="fade-up">
          <TestimonialCard
            name="Sarah Johnson"
            role="CTO"
            company="TechStart Inc"
            content="Maheen delivered an exceptional AI chatbot solution that transformed our customer support. Her expertise in generative AI and attention to detail made the entire process seamless."
            rating={5}
          />
        </div>
      </div>
    </section>
  );
};

export default HireLinks;