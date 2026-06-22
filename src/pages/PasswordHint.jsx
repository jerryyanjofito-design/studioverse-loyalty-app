import { useState } from "react";
import { Logo } from "../components/BrandMarks";
import { getMemberByPhoneForHint } from "../lib/supabase";

export function PasswordHint({ flash, onBack, busy }) {
  const [phone, setPhone] = useState("");
  const [hint, setHint] = useState(null);
  const [searching, setSearching] = useState(false);

  const searchHint = async () => {
    if (!phone.trim()) return flash("Isi No. HP dulu ya", "err");
    if (!/^08\d{8,}$/.test(phone.trim())) return flash("No. HP tidak valid", "err");

    setSearching(true);
    try {
      const result = await getMemberByPhoneForHint(phone.trim());

      if (!result.found) {
        flash("No. HP tidak ditemukan", "err");
      } else if (!result.has_hint) {
        setHint({ found: true, hasHint: false, message: "Anda belum membuat password hint saat registrasi" });
      } else {
        setHint({ found: true, hasHint: true, hint: result.password_hint });
      }
    } catch (error) {
      flash(error.message || "Gagal mencari password hint", "err");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="screen login-bg pad center-col">
      <Logo width={180} className="login-logo" />

      {!hint ? (
        <>
          <div className="field" style={{ width: "100%", maxWidth: "320px" }}>
            <label>No. HP</label>
            <input
              className="input" inputMode="numeric" placeholder="08xxxxxxxxxx"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchHint()}
            />
          </div>

          <button className="btn btn-primary full" onClick={searchHint} disabled={busy || searching} style={{ width: "100%", maxWidth: "320px" }}>
            {searching ? "Mencari…" : "Lihat Hint"}
          </button>

          <button className="btn btn-ghost full" onClick={onBack} disabled={busy} style={{ width: "100%", maxWidth: "320px" }}>
            Kembali
          </button>
        </>
      ) : hint.found && hint.hasHint ? (
        <>
          <div className="success-box" style={{ textAlign: "center", marginBottom: "20px", padding: "20px" }}>
            <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--blue)" }}>
              Berikut merupakan hint untuk password Anda:
            </p>
            <p style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "4px", color: "var(--gold)" }}>
              {hint.hint}
            </p>
          </div>

          <button className="btn btn-primary full" onClick={onBack} style={{ width: "100%", maxWidth: "320px" }}>
            Kembali ke Login
          </button>
        </>
      ) : hint.found && !hint.hasHint ? (
        <>
          <div className="success-box" style={{ textAlign: "center", marginBottom: "20px", padding: "20px" }}>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              ⚠️ {hint.message}
            </p>
            <p style={{ fontSize: "13px", opacity: 0.7, marginTop: "12px" }}>
              Silakan coba mengingat kembali password Anda.
              <br />Kalau masih tidak ingat, hubungi kasir untuk bantuan reset password.
            </p>
          </div>

          <button className="btn btn-primary full" onClick={onBack} style={{ width: "100%", maxWidth: "320px" }}>
            Kembali ke Login
          </button>
        </>
      ) : null}
    </div>
  );
}
