import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { HCAPTCHA_SITEKEY } from "@/config";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const message = String(data.get('message') || '');

    if (!captchaToken) {
      toast({ title: 'Please complete CAPTCHA', description: 'Confirm you are human to submit.' });
      return;
    }

    setLoading(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke('contact-submit', {
        body: { name, email, message, captchaToken }
      });
      if (error) throw error;
      if (!resp?.ok) throw new Error(resp?.error || 'Submission failed');

      toast({ title: 'Message received!', description: 'Thanks for reaching out — I will respond shortly.' });
      e.currentTarget.reset();
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (err: any) {
      toast({ title: 'Something went wrong', description: String(err?.message || err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative" data-animate="fade-up">
      <div className="absolute inset-0 -z-10 opacity-80" aria-hidden style={{ background: 'var(--gradient-hero)' }} />
      <div className="container py-16 md:py-24">
        <div className="heading-backdrop mb-8 max-w-3xl mx-auto" data-animate="heading-reveal">
          <h2 className="section-heading text-center">
            Contact Me
          </h2>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-center" data-animate="fade-up">
          Have a project, want to hire me, or book a consultation? Send a message and I'll get back to you soon.
        </p>
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto" data-animate="fade-up">
          <Input name="name" placeholder="Your name" required aria-label="Your name" className="glass-input" />
          <Input type="email" name="email" placeholder="Your email" required aria-label="Your email" className="glass-input" />
          <Textarea name="message" placeholder="Your message" required className="md:col-span-2 glass-input" aria-label="Your message" />
          <div className="md:col-span-2">
            <HCaptcha
              ref={captchaRef as any}
              sitekey={HCAPTCHA_SITEKEY}
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading || !captchaToken} className="btn-premium hover-scale w-full">
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;