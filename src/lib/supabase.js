import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — copy .env.example to .env and fill in your project's values."
  );
}

// Regular client — used by the customer app. Respects Row Level
// Security, so a logged-in member can only see/touch their own data.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to invoke Edge Functions
async function invokeEdgeFunction(name, payload) {
  const { data, error } = await supabase.functions.invoke(name, {
    body: payload,
  });
  if (error) throw error;
  return data;
}

/* ============================================================
   PHONE NORMALIZATION
   Supabase phone auth expects E.164 format. We store/display the
   member's phone in the original "081..." local format (matches
   the prototype + Indonesian convention), but auth calls need
   "+62..." — convert at the boundary, never store the +62 form.
   ============================================================ */
export function toAuthPhone(localPhone) {
  const digits = localPhone.trim().replace(/\D/g, "");
  const national = digits.startsWith("0") ? digits.slice(1) : digits;
  return `+62${national}`;
}

/* ============================================================
   AUTH + REGISTRATION
   ============================================================ */

/**
 * Sign up a new member: now calls an Edge Function that handles
 * auth user creation, cleanup of incomplete registrations, and
 * member row creation with welcome/referral stamps.
 */
export async function signUpMember({ phone, pin, name, birthDate, passwordHint, cardTheme, referralCode }) {
  return await invokeEdgeFunction("member-register", {
    phone, pin, name, birthDate, passwordHint, cardTheme, referralCode
  });
}

export async function signInMember({ phone, pin }) {
  const authPhone = toAuthPhone(phone);
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: authPhone,
    password: pin,
  });
  if (error) throw error;
  return data;
}

export async function signOutMember() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Initiates password reset by sending a recovery email to the user.
 * Uses Supabase Auth's built-in password recovery functionality.
 * The user will receive an email with a link to reset their password.
 */
export async function initiatePasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return data;
}

/**
 * Updates a member's password. Used by the "forgot password" flow.
 * NOTE: this requires the member to already be authenticated (e.g.
 * via a magic link/OTP recovery flow) — see the note in ForgotPin.jsx
 * about what's still a placeholder vs. production-ready.
 */
export async function updateMemberPin(newPin) {
  const { error } = await supabase.auth.updateUser({ password: newPin });
  if (error) throw error;
}

/* ============================================================
   MEMBER DATA (customer app — uses the RLS-respecting client)
   ============================================================ */

export async function fetchMemberById(memberId) {
  const { data, error } = await supabase.from("members").select("*").eq("id", memberId).single();
  if (error) throw error;
  return data;
}

/**
 * Returns one row per reward tier (free_spin / keychain_50off /
 * free_photobooth) for the member's CURRENT level, with live/lifetime
 * stamp counts, threshold, eligibility, and claim status.
 */
export async function fetchMemberProgress(memberId) {
  const { data, error } = await supabase.rpc("get_member_progress", { p_member_id: memberId });
  if (error) throw error;
  return data;
}

/**
 * Fetch member's password hint by phone number (for password recovery)
 * Used by the "Lihat Password Hint" feature
 * Uses RPC function with security definer to bypass RLS for unauthenticated users
 */
export async function getMemberByPhoneForHint(phone) {
  const { data, error } = await supabase.rpc("get_password_hint_by_phone", {
    p_phone: phone.trim(),
  });
  if (error) throw error;
  return data;
}

export async function claimRewardTier(tier) {
  const { data, error } = await supabase.rpc("claim_reward", { p_tier: tier });
  if (error) throw error;
  return data;
}

export async function fetchMemberClaims(memberId) {
  const { data, error } = await supabase
    .from("reward_claims")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchMemberStampHistory(memberId) {
  const { data, error } = await supabase
    .from("stamps")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/* ============================================================
   CASHIER / ADMIN (now via Edge Functions — secret key never
   exposed to the browser)
   ============================================================ */

export async function verifyAdminPassword(password) {
  const result = await invokeEdgeFunction("admin-verify", { password });
  return result.valid === true;
}

export async function cashierFindMemberByPhone(phone) {
  const result = await invokeEdgeFunction("cashier-member-get", { phone });
  return result.member || null;
}

/** Free-text search by name or phone fragment, for the cashier search screen. */
export async function cashierSearchMembers(query) {
  const result = await invokeEdgeFunction("cashier-member-search", { query });
  return result.members || [];
}

export async function cashierAddStamp({ phone, source = "photobooth", quantity = 1, photoProofUrl = null }) {
  return await invokeEdgeFunction("cashier-stamp-add", {
    phone, source, quantity, photoProofUrl
  });
}

export async function cashierRemoveStamp({ stampId, reason }) {
  return await invokeEdgeFunction("cashier-stamp-remove", { stampId, reason });
}

export async function cashierListStampsForMember(phone) {
  const result = await invokeEdgeFunction("cashier-stamps-list", { phone });
  return result.stamps || [];
}

export async function cashierFetchAllClaims() {
  const result = await invokeEdgeFunction("cashier-claims-fetch", {});
  return result.claims || [];
}

export async function cashierFulfillClaim(claimId, fulfilledBy = "kasir") {
  return await invokeEdgeFunction("cashier-claim-fulfill", { claimId, fulfilledBy });
}

export async function cashierRejectClaim(claimId, reason) {
  return await invokeEdgeFunction("cashier-claim-reject", { claimId, reason });
}

export async function cashierFetchStats() {
  return await invokeEdgeFunction("cashier-stats", {});
}
