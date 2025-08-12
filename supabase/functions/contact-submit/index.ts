import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyHCaptcha(token: string, remoteip?: string) {
  const secret = Deno.env.get('HCAPTCHA_SECRET');
  if (!secret) throw new Error('HCAPTCHA_SECRET not configured');
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (remoteip) form.set('remoteip', remoteip);

  const resp = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const data = await resp.json();
  return !!data.success;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, captchaToken } = await req.json();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || 'unknown';

    if (!name || !email || !message || !captchaToken) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify CAPTCHA
    const ok = await verifyHCaptcha(captchaToken, ip);
    if (!ok) {
      return new Response(JSON.stringify({ error: 'CAPTCHA verification failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Rate limit: 3/hour/IP
    const { data: recent, error: rlErr } = await supabase
      .from('rate_limits')
      .select('id')
      .gte('created_at', new Date(Date.now() - 60*60*1000).toISOString())
      .eq('ip', ip)
      .eq('action', 'contact');
    if (rlErr) throw rlErr;
    if ((recent?.length || 0) >= 3) {
      return new Response(JSON.stringify({ error: 'Too many submissions. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert contact
    const { error: insertErr } = await supabase.from('contacts').insert({ name, email, message });
    if (insertErr) throw insertErr;

    // Track rate limit event
    await supabase.from('rate_limits').insert({ ip, action: 'contact' });

    // Send admin notification via Resend
    if (resendKey) {
      const resend = new Resend(resendKey);
      const { data: admins } = await supabase.from('admin_emails').select('email');
      const recipients = (admins || []).map((a: any) => a.email).filter(Boolean);
      if (recipients.length > 0) {
        try {
          await resend.emails.send({
            from: 'Lovable Portfolio <onboarding@resend.dev>',
            to: recipients,
            subject: 'New contact form submission',
            html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`
          });
        } catch (e) {
          console.warn('Admin email failed:', e);
        }
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('contact-submit error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
