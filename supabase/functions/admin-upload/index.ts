import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function verifyAdminToken(token: string): { valid: boolean; error?: string } {
  if (!token) {
    return { valid: false, error: "No token provided" };
  }

  try {
    const tokenData = JSON.parse(atob(token));
    
    if (!tokenData.verified) {
      return { valid: false, error: "Token not verified" };
    }
    
    const expiresAt = new Date(tokenData.expiresAt);
    if (expiresAt < new Date()) {
      return { valid: false, error: "Token expired" };
    }
    
    return { valid: true };
  } catch (e) {
    console.error("Token verification error:", e);
    return { valid: false, error: "Invalid token format" };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin token from header
    const adminToken = req.headers.get("x-admin-token");
    
    const tokenResult = verifyAdminToken(adminToken || "");
    if (!tokenResult.valid) {
      console.log("Token verification failed:", tokenResult.error);
      return new Response(
        JSON.stringify({ error: tokenResult.error }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string || "media";
    const path = formData.get("path") as string || "uploads";

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return new Response(
        JSON.stringify({ error: "Only image files are allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 10MB" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop();
    const fileName = `${path}/${timestamp}-${randomStr}.${extension}`;

    console.log(`Uploading file to ${bucket}/${fileName}`);

    // Upload file using service role (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { 
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log(`Upload successful: ${urlData.publicUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: urlData.publicUrl,
        path: fileName 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
