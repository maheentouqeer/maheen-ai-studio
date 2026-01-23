import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Allowed tables for admin CRUD operations
const ALLOWED_TABLES = [
  'about',
  'skills', 
  'education',
  'experience',
  'categories',
  'projects',
  'hire_links',
  'assistant_knowledge'
];

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin token
    const adminToken = req.headers.get("x-admin-token");
    
    const tokenResult = verifyAdminToken(adminToken || "");
    if (!tokenResult.valid) {
      console.log("Token verification failed:", tokenResult.error);
      return new Response(
        JSON.stringify({ error: tokenResult.error }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { action, table, data, id } = await req.json();
    
    console.log(`Admin CRUD request: ${action} on ${table}`);

    // Validate table name
    if (!ALLOWED_TABLES.includes(table)) {
      return new Response(
        JSON.stringify({ error: `Table '${table}' is not allowed` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate action
    if (!['select', 'insert', 'update', 'delete'].includes(action)) {
      return new Response(
        JSON.stringify({ error: `Invalid action '${action}'` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result;

    switch (action) {
      case 'select':
        const { data: selectData, error: selectError } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (selectError) {
          console.error("Select error:", selectError);
          throw selectError;
        }
        result = { data: selectData };
        console.log(`Selected ${selectData?.length || 0} rows from ${table}`);
        break;

      case 'insert':
        if (!data) {
          return new Response(
            JSON.stringify({ error: "Data is required for insert" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(data)
          .select()
          .single();
        
        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
        result = { data: insertData };
        console.log(`Inserted row into ${table}`);
        break;

      case 'update':
        if (!id) {
          return new Response(
            JSON.stringify({ error: "ID is required for update" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (!data) {
          return new Response(
            JSON.stringify({ error: "Data is required for update" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single();
        
        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
        result = { data: updateData };
        console.log(`Updated row ${id} in ${table}`);
        break;

      case 'delete':
        if (!id) {
          return new Response(
            JSON.stringify({ error: "ID is required for delete" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
        
        if (deleteError) {
          console.error("Delete error:", deleteError);
          throw deleteError;
        }
        result = { success: true };
        console.log(`Deleted row ${id} from ${table}`);
        break;
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Admin CRUD error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
