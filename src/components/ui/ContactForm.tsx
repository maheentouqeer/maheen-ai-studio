import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!hcaptchaToken) {
      toast({
        title: "Verification Required",
        description: "Please complete the captcha verification",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contact-submit', {
        body: {
          ...formData,
          hcaptchaToken
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Message Sent! 🚀",
          description: "Thank you for reaching out. I'll get back to you soon!",
        });
        
        // Reset form
        setFormData({ name: "", email: "", message: "" });
        setHcaptchaToken(null);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: "Message Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-panel card-hover max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Let's Connect</CardTitle>
        <CardDescription>
          Ready to bring your AI ideas to life? Let's discuss your project!
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="glass-input"
                disabled={loading}
                required
              />
            </div>
            <div>
              <Input
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <div>
            <Textarea
              name="message"
              placeholder="Tell me about your AI project, goals, and how I can help..."
              value={formData.message}
              onChange={handleChange}
              className="glass-input min-h-[120px] resize-none"
              disabled={loading}
              required
            />
          </div>

          <div className="flex justify-center">
            <HCaptcha
              sitekey="10000000-ffff-ffff-ffff-000000000001" // Test key - replace with real key
              onVerify={(token) => setHcaptchaToken(token)}
              onExpire={() => setHcaptchaToken(null)}
              onError={() => setHcaptchaToken(null)}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full btn-premium hover-scale text-base py-3"
            disabled={loading || !hcaptchaToken}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            Protected by hCaptcha • Your data is secure
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;