import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { about, education, projects, skills, certifications } from "@/data/siteData";

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;

const knowledgeBase = () => {
  const basics = `I am ${about.name}, ${about.title}. Based in ${about.location}. Contact: ${about.email}.`;
  const tech = `Core stack: ${skills.join(', ')}.`;
  const edu = `Education includes ${education.map(e => `${e.detail} at ${e.school} (${e.period})`).join('; ')}.`;
  const certs = `Certifications: ${certifications.join(', ')}.`;
  const projs = `Projects include ${projects.map(p => `${p.name} (${p.category})`).join('; ')}.`;
  return [basics, tech, edu, certs, projs].join(' ');
};

const answer = (q: string): string => {
  const lower = q.toLowerCase();
  if (lower.includes('name')) return `I am ${about.name}.`;
  if (lower.includes('email')) return `You can email me at ${about.email}.`;
  if (lower.includes('linkedin')) return `Find me on LinkedIn at ${about.linkedin}.`;
  if (lower.includes('skills') || lower.includes('stack')) return `My core skills include ${skills.join(', ')}.`;
  if (lower.includes('project')) return `Some highlights are ${projects.slice(0,3).map(p=>p.name).join(', ')}.`;
  if (lower.includes('education')) return `I study ${education[0].detail} at ${education[0].school}.`;
  if (lower.includes('hire') || lower.includes('contact')) return `I would love to connect. Please open the contact section to send me a message.`;
  return `About me: ${knowledgeBase()}`;
};

const VoiceAssistant = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle'|'listening'|'speaking'>('idle');
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setStatus('listening');
    rec.onend = () => setStatus('idle');
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript as string;
      const reply = answer(text);
      if (synth) {
        const utter = new SpeechSynthesisUtterance(reply);
        utter.onstart = () => setStatus('speaking');
        utter.onend = () => setStatus('idle');
        synth.speak(utter);
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-72 rounded-xl border border-border bg-card/80 backdrop-blur p-4 shadow-[var(--shadow-elevate)] animate-enter">
          <p className="text-sm text-muted-foreground">Ask about Maheen, skills, projects, or say "contact" to be guided.</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleMic} disabled={!canUse}>
              {status === 'listening' ? 'Listening…' : status === 'speaking' ? 'Speaking…' : 'Start Talking'}
            </Button>
            {!canUse && <span className="text-xs text-muted-foreground">Voice not supported</span>}
          </div>
        </div>
      )}
      <Button variant="secondary" onClick={() => setOpen(v => !v)} aria-label="Toggle voice assistant">
        {open ? 'Close Assistant' : 'Voice Assistant'}
      </Button>
    </div>
  );
};

export default VoiceAssistant;
