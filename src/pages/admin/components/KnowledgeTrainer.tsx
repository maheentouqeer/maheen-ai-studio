import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const KnowledgeTrainer = () => {
  const [mode, setMode] = useState<'json'|'csv'|'text'>('json');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const train = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const body: any = { type: mode };
      if (mode === 'json') body.items = JSON.parse(content);
      if (mode === 'csv') body.csv = content;
      if (mode === 'text') body.text = content;

      const { data, error } = await supabase.functions.invoke('train-knowledge', { body });
      if (error) throw error;
      toast({ title: 'Training complete', description: `${data?.inserted || 0} items processed.` });
      setContent('');
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Training failed', description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 grid gap-3">
      <div className="flex items-center gap-3">
        <Select value={mode} onValueChange={(v: any) => setMode(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={train} disabled={loading}>{loading ? 'Training…' : 'Train'}</Button>
      </div>
      <Textarea rows={14} placeholder={
        mode === 'json' ? '[{"question":"What is X?","answer":"X is..."}]' :
        mode === 'csv' ? 'question,answer\nWhat is X?,X is...' :
        'Paste paragraphs. Each block (blank line separated) becomes an entry.'
      } value={content} onChange={(e) => setContent(e.target.value)} />
    </div>
  );
};

export default KnowledgeTrainer;
