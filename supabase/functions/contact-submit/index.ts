import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();
    console.log('Contact form submission received:', { name, email });

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!supabaseServiceKey || !supabaseUrl) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert contact submission
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert([{ name, email, message, handled: false }])
      .select()
      .single();

    if (contactError) {
      console.error('Error inserting contact:', contactError);
      return new Response(JSON.stringify({ error: 'Failed to submit contact form' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Contact saved, id:', contactData.id);

    const esc = (v: string) => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
    let gmailSent = false;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const gmailKey = Deno.env.get('GOOGLE_MAIL_API_KEY');
    if (lovableKey && gmailKey) {
      try {
        const b64 = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(''));
        const hdr = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);
        const safeName = String(name).replace(/[\r\n]/g, ' ');
        const safeEmail = String(email).replace(/[\r\n]/g, '');
        const mime = [
          'To: maheentouqeer76@gmail.com',
          `Reply-To: ${safeEmail}`,
          `Subject: ${hdr(`New portfolio contact: ${safeName}`)}`,
          'MIME-Version: 1.0',
          'Content-Type: text/html; charset="UTF-8"',
          '',
          `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${esc(name)}</p><p><strong>Email:</strong> ${esc(email)}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${esc(message)}</p>`,
        ].join('\r\n');
        const raw = b64(mime).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const r = await fetch('https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': gmailKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw }),
        });
        if (!r.ok) console.error(`Gmail send failed [${r.status}]: ${await r.text()}`);
        else { gmailSent = true; console.log('Gmail notification sent'); }
      } catch (e) {
        console.error('Gmail error:', e);
      }
    }

    // Fallback email notification
    if (!gmailSent && resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: ["maheentouqeer76@gmail.com"],
          subject: `New Contact: ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p><small>Sent from your portfolio contact form</small></p>
          `,
        });
        console.log('Email notification sent');
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Contact form submitted', id: contactData.id }), {
      status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in contact-submit:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});