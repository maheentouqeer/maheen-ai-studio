import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Attempt role assignment if listed
        setTimeout(async () => {
          try { await supabase.rpc('assign_admin_if_listed'); } catch (e) {}
          nav('/admin');
        }, 0);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) nav('/admin');
    });
    return () => subscription.unsubscribe();
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl }
        });
        if (error) throw error;
        toast({ title: 'Check your email', description: 'Confirm your email to complete signup.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Logged in', description: 'Redirecting…' });
      }
    } catch (err: any) {
      toast({ title: 'Auth error', description: String(err?.message || err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="container max-w-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{mode === 'login' ? 'Admin Login' : 'Create Admin Account'}</h1>
        <p className="text-muted-foreground mb-6">Only approved admin emails can access the dashboard.</p>
        <form onSubmit={submit} className="grid gap-3">
          <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required />
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required />
          <Button type="submit" disabled={loading}>{loading ? 'Please wait…' : (mode==='login'?'Login':'Sign up')}</Button>
        </form>
        <button className="mt-3 text-sm story-link" onClick={()=>setMode(mode==='login'?'signup':'login')}>
          {mode==='login' ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
      </section>
    </main>
  );
};

export default Auth;
