import { useState } from "react";
import { Logo } from "../components/BrandMarks";
import { initiatePasswordReset } from "../lib/supabase";

export function ForgotPassword({ flash, onBack, busy }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!email.trim()) return flash("Isi email dulu ya", "err");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return flash("Email tidak valid", "err");

    try {
      await initiatePasswordReset(email.trim());
      setSent(true);
      flash("Link reset password telah dikirim ke email!", "ok");
    } catch (error) {
      flash(error.message || "Gagal mengirim link reset", "err");
    }
  };

  return (
    <div className="screen login-bg pad center-col">
      <Logo width={180} className="login-logo" />

      {!sent ? (
        <>
          <div className="field" style={{ width: "100%", maxWidth: "320px" }}>
            <label>Email</label>
            <input
              className="input" type="email" placeholder="contoh@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <button className="btn btn-primary full" onClick={submit} disabled={busy} style={{ width: "100%", maxWidth: "320px" }}>
            {busy ? "Memproses…" : "Kirim Link Reset"}
          </button>

          <button className="btn btn-ghost full" onClick={onBack} disabled={busy} style={{ width: "100%", maxWidth: "320px" }}>
            Kembali
          </button>
        </>
      ) : (
        <>
          <div className="success-box" style={{ textAlign: "center", marginBottom: "20px" }}>
            <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
              Link reset password telah dikirim ke <b>{email}</b>
            </p>
            <p style={{ fontSize: "14px", opacity: 0.8, marginTop: "12px" }}>
              Cek inbox email Anda dan klik link untuk membuat password baru.
            </p>
          </div>

          <button className="btn btn-primary full" onClick={onBack} style={{ width: "100%", maxWidth: "320px" }}>
            Kembali ke Login
          </button>
        </>
      )}
    </div>
  );
}
