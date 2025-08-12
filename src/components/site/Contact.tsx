import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    setLoading(true);
    try {
      // Placeholder until Supabase is connected
      console.log('Contact submission (connect Supabase to persist):', payload);
      toast({ title: 'Message received!', description: 'Connect Supabase to enable storage and email notifications.' });
      e.currentTarget.reset();
    } catch (err) {
      toast({ title: 'Something went wrong', description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative">
      <div className="absolute inset-0 -z-10 opacity-80" aria-hidden style={{ background: 'var(--gradient-hero)' }} />
      <div className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Me</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">Have a project, want to hire me, or book a consultation? Send a message and I’ll get back to you soon.</p>
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <Input name="name" placeholder="Your name" required aria-label="Your name" />
          <Input type="email" name="email" placeholder="Your email" required aria-label="Your email" />
          <Textarea name="message" placeholder="Your message" required className="md:col-span-2" aria-label="Your message" />
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
