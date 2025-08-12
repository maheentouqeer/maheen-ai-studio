import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { about, education, projects, skills, certifications } from "@/data/siteData";
import { Mic, X, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
// import { supabase } from "@/integrations/supabase/client"; // Will be used in Phase 2

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;

type Status = 'idle'|'listening'|'thinking'|'speaking';

type Intent = 'hire'|'project'|'consult'|'promote'|'general'|'profile';

const knowledgeBase = () => {
  const basics = `I am ${about.name}, ${about.title}. Based in ${about.location}. Contact: ${about.email}.`;
  const tech = `Core stack: ${skills.join(', ')}.`;
  const edu = `Education includes ${education.map(e => `${e.detail} at ${e.school} (${e.period})`).join('; ')}.`;
  const certs = `Certifications: ${certifications.join(', ')}.`;
  const projs = `Projects include ${projects.map(p => `${(p as any).name || (p as any).title} (${p.category})`).join('; ')}.`;
  return [basics, tech, edu, certs, projs].join(' ');
};

const classifyIntent = (q: string): Intent => {
  const s = q.toLowerCase();
  if (/(hire|job|work with|engage)/.test(s)) return 'hire';
  if (/(project|build|develop|app|website)/.test(s)) return 'project';
  if (/(consult|advice|session)/.test(s)) return 'consult';
  if (/(promot|market|advertis|social)/.test(s)) return 'promote';
  if (/(who are you|about|profile|email|linkedin|skills|education)/.test(s)) return 'profile';
  return 'general';
};

const answer = (q: string): string => {
  const lower = q.toLowerCase();
  if (lower.includes('name')) return `I am ${about.name}.`;
  if (lower.includes('email')) return `You can email me at ${about.email}.`;
  if (lower.includes('linkedin')) return `Find me on LinkedIn at ${about.linkedin}.`;
  if (lower.includes('skills') || lower.includes('stack')) return `My core skills include ${skills.join(', ')}.`;
  if (lower.includes('project')) return `Some highlights are ${projects.slice(0,3).map(p=> (p as any).name || (p as any).title).join(', ')}.`;
  if (lower.includes('education')) return `I studied ${education[0].detail} at ${education[0].school}.`;
  return `About me: ${knowledgeBase()}`;
};

const groqStub = async (q: string) => {
  // Phase 1 stub. Phase 2 will call Supabase Edge Function that proxies to Groq using secret Grok-api-key
  return `That's a great question. I'll be connected to Groq in the next step for deep AI/tech/design answers. Meanwhile: ${q.slice(0,100)}...`;
};

const VoiceAssistant = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [intent, setIntent] = useState<Intent | null>(null);

  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setStatus('listening');
    rec.onend = () => setStatus('idle');
    rec.onresult = async (e: any) => {
      const text = e.results[0][0].transcript as string;
      setTranscript(text);
      const detected = classifyIntent(text);
      setIntent(detected);
      setStatus('thinking');
      let reply = '';
      if (detected === 'general') {
        reply = await groqStub(text);
      } else if (detected === 'profile') {
        reply = answer(text);
      } else {
        reply = `Got it — you want to ${detected}. I can help! Please fill the short form so I can respond quickly.`;
      }
      setResponse(reply);
      if (synth) {
        const utter = new SpeechSynthesisUtterance(reply);
        utter.onstart = () => setStatus('speaking');
        utter.onend = () => setStatus('idle');
        synth.speak(utter);
      } else {
        setStatus('idle');
      }
    };
    recognitionRef.current = rec;
  }, []);

  const canUse = useMemo(() => !!SpeechRecognition && !!synth, []);

  const handleMic = async () => {
    if (!recognitionRef.current) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitService = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      message: String(form.get('message') || ''),
      intent: intent || 'project',
    };

    try {
      // Phase 2: send to Supabase contacts table
      // const { error } = await supabase.from('contacts').insert({
      //   name: payload.name,
      //   email: payload.email,
      //   message: `[${payload.intent}] ${payload.message}`,
      // });
      // if (error) throw error;
      toast({ title: 'Request captured', description: 'We will follow up shortly. (Supabase wiring in Phase 2)' });
      (ev.currentTarget as HTMLFormElement).reset();
      setIntent(null);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Saved locally', description: 'Will sync to Supabase in Phase 2.' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-[22rem] rounded-2xl glass-panel p-4 shadow-[var(--shadow-elevate)] animate-enter">
          <p className="text-sm text-muted-foreground">Talk to Maheen's Assistant about services, projects, or general AI questions.</p>

          {/* Transcript */}
          {transcript && (
            <div className="mt-3 text-xs bg-secondary/60 rounded-lg p-3 border border-border" aria-live="polite">
              <span className="text-muted-foreground">You:</span> {transcript}
            </div>
          )}

          {/* Response */}
          {response && (
            <div className="mt-2 text-sm">{response}</div>
          )}

          {/* Service form when intent requires details */}
          {intent && ["hire","project","consult","promote"].includes(intent) && (
            <form className="mt-3 grid gap-2" onSubmit={onSubmitService} aria-label="Service request form">
              <input className="rounded-md bg-background border border-border px-3 py-2 text-sm" name="name" placeholder="Your name" required aria-label="Your name" />
              <input className="rounded-md bg-background border border-border px-3 py-2 text-sm" name="email" placeholder="Email address" type="email" required aria-label="Email" />
              <textarea className="rounded-md bg-background border border-border px-3 py-2 text-sm" name="message" placeholder="Tell me about your needs" rows={3} aria-label="Message" />
              <Button size="sm" type="submit" variant="premium">Send</Button>
            </form>
          )}

          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleMic} disabled={!canUse} aria-label="Start talking">
              {status === 'listening' ? 'Listening…' : status === 'speaking' ? 'Speaking…' : status === 'thinking' ? 'Thinking…' : 'Start Talking'}
            </Button>
            {!canUse && <span className="text-xs text-muted-foreground">Voice not supported</span>}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close voice assistant' : 'Open voice assistant'}
        className={`relative h-14 w-14 rounded-full flex items-center justify-center shadow-[var(--shadow-glow)] border border-border text-foreground btn-gradient`}
      >
        <Mic className="relative z-10" />
        {status === 'listening' && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" aria-hidden />
        )}
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full shadow" aria-hidden>
          {status === 'listening' ? 'REC' : 'AI'}
        </span>
      </button>
    </div>
  );
};

export default VoiceAssistant;
