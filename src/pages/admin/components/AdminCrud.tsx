import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TableName = keyof Database['public']['Tables'];

export type ColumnDef = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'date' | 'select';
  required?: boolean;
  options?: { label: string; value: string }[];
  optionsSource?: { table: TableName; value: string; label: string };
};

interface AdminCrudProps {
  table: TableName;
  columns: ColumnDef[];
}

const AdminCrud = ({ table, columns }: AdminCrudProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [optionsMap, setOptionsMap] = useState<Record<string, { label: string; value: string }[]>>({});

  const visibleColumns = useMemo(() => columns.filter(c => c.key !== 'id'), [columns]);

  useEffect(() => {
    (async () => {
      try {
        // Load select options from sources
        const opt: Record<string, { label: string; value: string }[]> = {};
        await Promise.all(columns.map(async (c) => {
          if (c.type === 'select' && c.optionsSource) {
            const { data } = await (supabase.from as any)(c.optionsSource.table).select(`${c.optionsSource.value}, ${c.optionsSource.label}`);
            opt[c.key] = (data || []).map((r: any) => ({ value: r[c.optionsSource!.value], label: r[c.optionsSource!.label] }));
          } else if (c.type === 'select' && c.options) {
            opt[c.key] = c.options;
          }
        }));
        setOptionsMap(opt);

        const { data, error } = await (supabase.from as any)(table).select('*').limit(200);
        if (error) throw error;
        setRows(data || []);
      } catch (e: any) {
        console.error(e);
        toast({ title: 'Load failed', description: e.message });
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const startEdit = (row?: any) => {
    setEditing(row || {});
    setForm(row || {});
  };

  const cancel = () => {
    setEditing(null);
    setForm({});
  };

  const change = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async () => {
    try {
      if (editing && editing.id) {
        const { data, error } = await (supabase.from as any)(table).update(form).eq('id', editing.id).select('*').maybeSingle();
        if (error) throw error;
        setRows((r) => r.map((x) => (x.id === editing.id ? data : x)) as any);
        toast({ title: 'Updated' });
      } else {
        const { data, error } = await (supabase.from as any)(table).insert(form).select('*').maybeSingle();
        if (error) throw error;
        setRows((r) => [data, ...r]);
        toast({ title: 'Created' });
      }
      cancel();
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Save failed', description: e.message });
    }
  };

  const remove = async (id: string) => {
    try {
      await (supabase.from as any)(table).delete().eq('id', id);
      setRows((r) => r.filter((x) => x.id !== id));
      toast({ title: 'Deleted' });
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message });
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      <div className="md:col-span-2">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr>
                {visibleColumns.map(c => (
                  <th key={c.key} className="text-left p-3 border-b border-border">{c.label}</th>
                ))}
                <th className="p-3 border-b border-border" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40">
                  {visibleColumns.map(c => (
                    <td key={c.key} className="p-3 border-b border-border align-top">
                      {c.type === 'select' && optionsMap[c.key]
                        ? (optionsMap[c.key].find(o => o.value === r[c.key])?.label || '')
                        : String(r[c.key] ?? '')}
                    </td>
                  ))}
                  <td className="p-3 border-b border-border text-right whitespace-nowrap">
                    <Button variant="secondary" size="sm" onClick={() => startEdit(r)}>Edit</Button>
                    <Button variant="destructive" size="sm" className="ml-2" onClick={() => remove(r.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-4 text-sm text-muted-foreground" colSpan={visibleColumns.length + 1}>No data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="rounded-lg border border-border p-4 bg-card/60">
          <h3 className="font-semibold mb-3">{editing?.id ? 'Edit' : 'Create'} {table}</h3>
          <div className="grid gap-3">
            {visibleColumns.map((c) => (
              <div key={c.key} className="grid gap-1">
                <label className="text-xs text-muted-foreground">{c.label}</label>
                {c.type === 'textarea' ? (
                  <Textarea value={form[c.key] ?? ''} onChange={(e) => change(c.key, e.target.value)} rows={3} />
                ) : c.type === 'number' ? (
                  <Input type="number" value={form[c.key] ?? ''} onChange={(e) => change(c.key, e.target.value === '' ? null : Number(e.target.value))} />
                ) : c.type === 'date' ? (
                  <Input type="date" value={form[c.key] ?? ''} onChange={(e) => change(c.key, e.target.value || null)} />
                ) : c.type === 'select' ? (
                  <Select onValueChange={(v) => change(c.key, v)} value={form[c.key] ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${c.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(optionsMap[c.key] || []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={form[c.key] ?? ''} onChange={(e) => change(c.key, e.target.value)} />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={save}>{editing?.id ? 'Update' : 'Create'}</Button>
              {editing && <Button variant="secondary" onClick={cancel}>Cancel</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCrud;
