import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const [membersCountRes, claimsRes, levelsRes] = await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("reward_claims").select("tier, status"),
      supabase.from("members").select("level"),
    ])

    if (membersCountRes.error) throw membersCountRes.error
    if (claimsRes.error) throw claimsRes.error
    if (levelsRes.error) throw levelsRes.error

    return new Response(
      JSON.stringify({
        totalMembers: membersCountRes.count || 0,
        claims: claimsRes.data || [],
        members: levelsRes.data || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
