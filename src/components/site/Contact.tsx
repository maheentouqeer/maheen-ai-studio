import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCAPTCHA_SITEKEY = "REPLACE_WITH_YOUR_HCAPTCHA_SITE_KEY"; // Public site key

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
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Me</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">Have a project, want to hire me, or book a consultation? Send a message and I’ll get back to you soon.</p>
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <Input name="name" placeholder="Your name" required aria-label="Your name" />
          <Input type="email" name="email" placeholder="Your email" required aria-label="Your email" />
          <Textarea name="message" placeholder="Your message" required className="md:col-span-2" aria-label="Your message" />
          <div className="md:col-span-2">
            <HCaptcha
              ref={captchaRef as any}
              sitekey={HCAPTCHA_SITEKEY}
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading || !captchaToken}>{loading ? 'Sending...' : 'Send Message'}</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
