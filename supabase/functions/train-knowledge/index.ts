import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrainPayload {
  type: 'json'|'csv'|'text';
  items?: { question?: string; answer: string }[];
  csv?: string;
  text?: string;
}

function parseCSV(csv: string): { question: string; answer: string }[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const rows: { question: string; answer: string }[] = [];
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length >= 2) {
      const q = parts[0].trim();
      const a = parts.slice(1).join(',').trim();
      if (a) rows.push({ question: q || a.slice(0, 60), answer: a });
    }
  }
  return rows;
}

function parseText(text: string): { question: string; answer: string }[] {
  const lines = text.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
  return lines.map((block, i) => ({
    question: block.split(/\s+/).slice(0, 8).join(' ') + ` (#${i+1})`,
    answer: block,
  }));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
  const groqKey = Deno.env.get('Grok-api-key');
  const embedModelEnv = Deno.env.get('GROQ_EMBED_MODEL');

  if (!groqKey) {
    return new Response(JSON.stringify({ error: 'Grok-api-key not set' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Ensure admin role
    const { data: isAdmin, error: roleErr } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (roleErr || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const payload: TrainPayload = await req.json();
    let rows: { question: string; answer: string }[] = [];
    if (payload.type === 'json' && payload.items) rows = payload.items.filter(i => !!i.answer);
    else if (payload.type === 'csv' && payload.csv) rows = parseCSV(payload.csv);
    else if (payload.type === 'text' && payload.text) rows = parseText(payload.text);
    else return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // Insert knowledge rows (RLS allows admin)
    const inserts = rows.map(r => ({ question: r.question, answer: r.answer }));
    const { data: inserted, error: insertErr } = await supabase
      .from('assistant_knowledge')
      .insert(inserts)
      .select('id, answer');
    if (insertErr) throw insertErr;

    // Create embeddings in batch via Groq OpenAI-compatible endpoint
    const texts = inserted.map((r: any) => r.answer);
    const model = embedModelEnv || 'nomic-embed-text';
    const embedResp = await fetch('https://api.groq.com/openai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, input: texts }),
    });
    if (!embedResp.ok) {
      const t = await embedResp.text();
      console.error('Groq embeddings batch error:', t);
      throw new Error('Embedding request failed');
    }
    const embedData = await embedResp.json();
    const vectors: number[][] = embedData.data.map((d: any) => d.embedding);

    // Update rows with embeddings
    for (let i = 0; i < inserted.length; i++) {
      const id = inserted[i].id;
      const embedding = vectors[i];
      const { error: upErr } = await supabase
        .from('assistant_knowledge')
        .update({ embedding })
        .eq('id', id);
      if (upErr) console.error('Update embedding error:', upErr.message);
    }

    return new Response(JSON.stringify({ inserted: inserted.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('train-knowledge error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
