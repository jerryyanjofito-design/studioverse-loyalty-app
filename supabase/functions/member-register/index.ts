import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Convert local phone (0812...) to E.164 format (+62812...)
function toAuthPhone(localPhone: string): string {
  const digits = localPhone.trim().replace(/\D/g, "")
  const national = digits.startsWith("0") ? digits.slice(1) : digits
  return `+62${national}`
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { phone, pin, name, birthDate, passwordHint, cardTheme, referralCode } = await req.json()

    if (!phone || !pin || !name) {
      return new Response(
        JSON.stringify({ error: "Phone, PIN, and name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const authPhone = toAuthPhone(phone)

    // Use admin client for auth cleanup
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    // Cleanup any incomplete registration
    try {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = users?.find(u => u.phone === authPhone)

      if (existingUser) {
        await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
        console.log("Cleaned up incomplete registration for:", phone)
      }
    } catch (e) {
      console.warn("Cleanup attempt:", e.message)
    }

    // Create auth user
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      phone: authPhone,
      password: pin,
    })

    if (signUpError) throw signUpError

    const userId = signUpData.user?.id
    if (!userId) throw new Error("Sign up did not return a user id")

    // Create member row
    const { data: memberData, error: rpcError } = await supabaseClient.rpc("register_member", {
      p_auth_user_id: userId,
      p_phone: phone.trim(),
      p_name: name.trim(),
      p_card_theme: cardTheme,
      p_referral_code: referralCode ? referralCode.trim() : null,
      p_birth_date: birthDate || null,
      p_password_hint: passwordHint ? passwordHint.trim() : null,
    })

    if (rpcError) throw rpcError

    return new Response(
      JSON.stringify({ data: memberData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
