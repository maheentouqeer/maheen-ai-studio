import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Clock, MapPin } from "lucide-react";

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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold title-gradient">Hire Me</h2>
          <p className="text-muted-foreground mt-4">Available for AI development projects</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="glass-panel animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="hire" className="container py-16 md:py-24" data-animate="fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold title-gradient animate-fade-in">
          Hire Me
        </h2>
        <p className="text-muted-foreground mt-4 animate-fade-in">
          Available for AI development projects and freelance work
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {displayLinks.map((link: any, index: number) => (
          <Card key={link.platform || index} className="glass-panel hover-scale transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {link.platform}
                    {link.available && (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {link.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{link.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{link.projects} projects</span>
                </div>
              </div>
              
              <div className="text-lg font-semibold text-primary">
                {link.rate}
              </div>
              
              <Button 
                asChild 
                className="w-full btn-gradient group-hover:shadow-[var(--shadow-elevate)] transition-all"
              >
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Profile
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-card/60 backdrop-blur border border-border rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-2">Custom AI Solutions</h3>
          <p className="text-muted-foreground mb-4">
            Need a custom AI application or consultation? I specialize in building end-to-end AI solutions 
            using the latest technologies including LangChain, Streamlit, Hugging Face, and more.
          </p>
          <Button asChild variant="outline" className="glass-panel">
            <a href="#contact">Get Custom Quote</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HireLinks;