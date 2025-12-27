import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OWNER_EMAIL = "maheentouqeer76@gmail.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();
    
    console.log('Contact form submission received:', { name, email });

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed: missing fields');
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
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

    console.log('Contact form submitted successfully, id:', contactData.id);

    // Send email notification to owner
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        const emailResponse = await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [OWNER_EMAIL],
          subject: `New Contact Form Message from ${name}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%); color: #ffffff; padding: 40px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="background: linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
                <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #3b82f6, #60a5fa); margin: 15px auto; border-radius: 2px;"></div>
              </div>
              
              <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                <h2 style="color: #60a5fa; margin: 0 0 15px 0; font-size: 18px;">📧 Contact Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #93c5fd;">Name:</strong> ${name}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #93c5fd;">Email:</strong> <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></p>
              </div>
              
              <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 25px;">
                <h2 style="color: #60a5fa; margin: 0 0 15px 0; font-size: 18px;">💬 Message</h2>
                <p style="margin: 0; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(59, 130, 246, 0.2);">
                <p style="color: #64748b; font-size: 12px; margin: 0;">This email was sent from your portfolio contact form</p>
              </div>
            </div>
          `,
        });

        console.log('Email notification sent successfully:', emailResponse?.id ?? emailResponse);
      } catch (emailError: any) {
        console.error('Error sending email notification:', emailError?.message || emailError);
        // Don't fail the request if email fails - contact was still saved
      }
    } else {
      console.log('RESEND_API_KEY not configured, skipping email notification');
    }

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
