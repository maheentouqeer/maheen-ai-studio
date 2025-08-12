import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactRow { id: string; name: string; email: string; message: string; created_at: string; handled: boolean }

const ContactsManager = () => {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(200);
        if (error) throw error;
        setRows(data as any);
      } catch (e: any) {
        toast({ title: 'Failed to load contacts', description: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markDone = async (id: string, handled: boolean) => {
    try {
      const { data, error } = await supabase.from('contacts').update({ handled }).eq('id', id).select('*').maybeSingle();
      if (error) throw error;
      setRows(r => r.map(x => x.id === id ? (data as any) : x));
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message });
    }
  };

  const remove = async (id: string) => {
    try {
      await supabase.from('contacts').delete().eq('id', id);
      setRows(r => r.filter(x => x.id !== id));
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message });
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Message</th>
            <th className="p-3 text-left">When</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-border">
              <td className="p-3 align-top">{r.name}</td>
              <td className="p-3 align-top">{r.email}</td>
              <td className="p-3 align-top max-w-[480px] whitespace-pre-wrap">{r.message}</td>
              <td className="p-3 align-top">{new Date(r.created_at).toLocaleString()}</td>
              <td className="p-3 align-top text-right whitespace-nowrap">
                <Button size="sm" variant={r.handled ? 'secondary' : 'default'} onClick={() => markDone(r.id, !r.handled)}>
                  {r.handled ? 'Mark as Pending' : 'Mark as Done'}
                </Button>
                <Button size="sm" variant="destructive" className="ml-2" onClick={() => remove(r.id)}>Delete</Button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="p-4 text-sm text-muted-foreground" colSpan={5}>No submissions yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsManager;
