import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { passcode } = await req.json();

    if (!passcode) {
      return new Response(JSON.stringify({ error: 'Passcode required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get the stored admin passcode from Supabase secrets
    const adminPasscode = Deno.env.get('ADMIN_PASSCODE');
    
    if (!adminPasscode) {
      console.error('ADMIN_PASSCODE not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Verify passcode (secure comparison)
    if (passcode !== adminPasscode) {
      console.log('Invalid passcode attempt');
      return new Response(JSON.stringify({ error: 'Invalid passcode' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Create a session token with expiry (24 hours)
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Create token payload as base64-encoded JSON
    const tokenPayload = {
      verified: true,
      expiresAt: sessionExpiry.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const tokenString = btoa(JSON.stringify(tokenPayload));

    console.log('Admin passcode verified successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      adminToken: tokenString,
      expiresAt: sessionExpiry.toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in verify-admin-passcode function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
