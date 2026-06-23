import { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  supabase,
  signUpMember, signInMember, signOutMember, getCurrentSession,
  fetchMemberById, fetchMemberProgress, claimRewardTier,
  fetchMemberClaims, fetchMemberStampHistory,
} from "./lib/supabase";
import { CustomerApp } from "./pages/CustomerApp";
import { CSS } from "./styles";

function Phone({ children }) {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="phone-screen">{children}</div>
    </div>
  );
}

function App() {
  const [toast, setToast] = useState(null);
  const [cScreen, setCScreen] = useState("login");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [member, setMember] = useState(null);
  const [progress, setProgress] = useState(null);
  const [stamps, setStamps] = useState([]);
  const [claims, setClaims] = useState([]);
  const [proofClaim, setProofClaim] = useState(null);
  const [claimingTier, setClaimingTier] = useState(null);

  const flash = useCallback((msg, type = "ok") => {
    setToast({ msg, type, id: Math.random().toString(36).slice(2) });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    (async () => {
      try {
        const session = await getCurrentSession();
        if (session?.user) {
          await loadMemberData(session.user.id);
          setCScreen("dashboard");
        }
      } catch (e) {
        // No session, stay on login
      }
    })();
  }, []);

  async function loadMemberData(memberId) {
    const m = await fetchMemberById(memberId);
    setMember(m);
    const [p, s, c] = await Promise.all([
      fetchMemberProgress(memberId),
      fetchMemberStampHistory(memberId),
      fetchMemberClaims(memberId),
    ]);
    setProgress(p);
    setStamps(s);
    setClaims(c);
  }

  async function handleLogin() {
    setAuthBusy(true);
    try {
      const { user } = await signInMember({ phone, pin });
      await loadMemberData(user.id);
      setCScreen("dashboard");
      setPhone(""); setPin("");
    } catch (e) {
      flash(e.message?.includes("Invalid") ? "No. HP atau Password salah" : (e.message || "Gagal masuk"), "err");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleRegister({ name, phone: regPhone, birthDate, passwordHint, pin: regPin, cardTheme, referralCode }) {
    setAuthBusy(true);
    try {
      const newMember = await signUpMember({ phone: regPhone, pin: regPin, name, birthDate, passwordHint, cardTheme, referralCode });
      await loadMemberData(newMember.id);
      setCScreen("dashboard");
      flash("Selamat datang di multiverse! 🎉", "ok");
    } catch (e) {
      console.error("Registration error:", e);
      const msg = e.message?.includes("already registered") || e.message?.includes("duplicate") || e.message?.includes("Phone number already registered")
        ? "No. HP sudah terdaftar"
        : (e.message || "Gagal mendaftar");
      flash(msg, "err");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    await signOutMember();
    setMember(null); setProgress(null); setStamps([]); setClaims([]);
    setCScreen("login"); setProofClaim(null);
  }

  async function handleClaim(tier) {
    setClaimingTier(tier);
    try {
      const claim = await claimRewardTier(tier);
      setProofClaim(claim);
      flash("Klaim berhasil — tunjukkan ke kasir!", "ok");
      await loadMemberData(member.id);
    } catch (e) {
      flash(e.message || "Gagal klaim hadiah", "err");
    } finally {
      setClaimingTier(null);
    }
  }

  return (
    <div className="sv-root">
      <style>{CSS}</style>
      <div className="stage">
        <Phone>
          <CustomerApp
            cScreen={cScreen} setCScreen={setCScreen}
            phone={phone} setPhone={setPhone} pin={pin} setPin={setPin}
            onLogin={handleLogin} onRegister={handleRegister} onLogout={handleLogout} busy={authBusy}
            member={member} progress={progress} stamps={stamps} claims={claims}
            proofClaim={proofClaim} setProofClaim={setProofClaim}
            onClaim={handleClaim} claimingTier={claimingTier}
            flash={flash}
          />
        </Phone>
      </div>
      {toast && <div key={toast.id} className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
