import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("PROJECT_URL")!
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY")!
const supabaseAnonKey = Deno.env.get("ANON_KEY")!

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

  // Check env vars
  if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
    console.error("Missing environment variables:", {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey
    })
    return new Response(
      JSON.stringify({ error: "Server configuration error: missing environment variables" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  try {
    // Log request details
    console.log("Headers:", Object.fromEntries(req.headers.entries()))
    const bodyText = await req.text()
    console.log("Raw body:", bodyText)
    const { phone, pin, name, birthDate, passwordHint, cardTheme, referralCode } = JSON.parse(bodyText)

    if (!phone || !pin || !name) {
      return new Response(
        JSON.stringify({ error: "Phone, PIN, and name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const authPhone = toAuthPhone(phone)
    console.log("Registration attempt for:", authPhone)

    // Use admin client for auth cleanup
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    // Check if user already exists in auth
    try {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = users?.find(u => u.phone === authPhone)

      if (existingUser) {
        // Check if member row exists
        const { data: existingMember } = await supabaseClient
          .from("members")
          .select("id")
          .eq("id", existingUser.id)
          .single()

        if (existingMember) {
          // User and member both exist - phone already registered
          console.log("Phone already registered:", phone)
          return new Response(
            JSON.stringify({ error: "Phone number already registered" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          )
        } else {
          // Auth user exists but no member row - incomplete registration, clean up
          await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
          console.log("Cleaned up incomplete registration for:", phone)
        }
      }
    } catch (e) {
      console.warn("Check/cleanup attempt:", e.message)
    }

    // Create auth user
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      phone: authPhone,
      password: pin,
    })

    if (signUpError) {
      console.error("Sign up error:", signUpError)
      // If user already exists but we didn't catch it above, return friendly error
      if (signUpError.message?.includes("already exists") || signUpError.code === "user_already_exists") {
        return new Response(
          JSON.stringify({ error: "Phone number already registered" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      throw signUpError
    }

    const userId = signUpData.user?.id
    if (!userId) throw new Error("Sign up did not return a user id")

    console.log("User created:", userId)

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

    if (rpcError) {
      console.error("RPC error:", rpcError)
      throw rpcError
    }

    console.log("Member created successfully")
    return new Response(
      JSON.stringify({ data: memberData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
