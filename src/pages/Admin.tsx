import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        nav('/auth');
        return;
      }
      (async () => {
        try {
          const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
          if (!isAdmin) nav('/'); else setAllowed(true);
        } catch {
          nav('/');
        } finally {
          setLoading(false);
        }
      })();
    }).data.subscription;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        nav('/auth');
        setLoading(false);
      }
    });

    return () => sub.unsubscribe();
  }, [nav]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <section className="container max-w-xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Checking access…</h1>
        </section>
      </main>
    );
  }

  if (!allowed) return null;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="container max-w-xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Panel</h1>
        <p className="text-muted-foreground mb-6">Welcome! Tabs and CRUD UI coming up next.</p>
      </section>
    </main>
  );
};

export default Admin;
