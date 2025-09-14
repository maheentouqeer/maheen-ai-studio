import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify hCaptcha token
async function verifyHCaptcha(token: string, remoteip?: string): Promise<boolean> {
  const hCaptchaSecret = Deno.env.get('HCAPTCHA_SECRET') || Deno.env.get('Hcaptcha-Secret');
  if (!hCaptchaSecret) {
    console.error('HCAPTCHA_SECRET not configured');
    return false;
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: hCaptchaSecret,
        response: token,
        ...(remoteip && { remoteip })
      })
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('hCaptcha verification failed:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, captchaToken } = await req.json();
    
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                    req.headers.get('cf-connecting-ip') ||
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Verify hCaptcha (optional but recommended)
    if (captchaToken) {
      const captchaValid = await verifyHCaptcha(captchaToken, clientIP);
      if (!captchaValid) {
        return new Response(JSON.stringify({ error: 'Captcha verification failed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Initialize Supabase client with service role key
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    
    if (!supabaseServiceKey || !supabaseUrl) {
      console.error('Supabase configuration missing');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting: max 3 submissions per hour per IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const { data: rateLimitCheck } = await supabase
      .from('rate_limits')
      .select('id')
      .eq('ip', clientIP)
      .eq('action', 'contact_submit')
      .gte('created_at', oneHourAgo.toISOString());

    if (rateLimitCheck && rateLimitCheck.length >= 3) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Insert contact submission
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert([{ name, email, message, handled: false }])
      .select()
      .single();

    if (contactError) {
      console.error('Error inserting contact:', contactError);
      return new Response(JSON.stringify({ error: 'Failed to submit contact form' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Record rate limit event
    await supabase
      .from('rate_limits')
      .insert([{ ip: clientIP, action: 'contact_submit' }]);

    // Send email notification to admin (if Resend is configured)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        // Get admin emails from database
        const { data: adminEmails } = await supabase
          .from('admin_emails')
          .select('email');

        if (adminEmails && adminEmails.length > 0) {
          await resend.emails.send({
            from: "Portfolio Contact <no-reply@yourdomain.com>",
            to: adminEmails.map(admin => admin.email),
            subject: `New Portfolio Contact: ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>Submitted at ${new Date().toISOString()}</small></p>
            `,
          });
          console.log('Admin notification email sent');
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    console.log('Contact form submitted successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact form submitted successfully',
      id: contactData.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in contact-submit function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});