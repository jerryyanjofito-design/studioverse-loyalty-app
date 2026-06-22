import { useState } from "react";
import { Logo } from "../components/BrandMarks";

export function AdminLogin({ onAuth, flash, verifyPassword }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setBusy(true);
    try {
      const ok = await verifyPassword(pw);
      if (ok) onAuth();
      else flash("Password salah", "err");
    } catch (e) {
      flash(e.message || "Gagal memverifikasi password", "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login starfield">
      <Logo width={230} />
      <div className="admin-tag light">Cashier Panel</div>
      <div className="field" style={{ width: 260 }}>
        <label className="lbl-light">Password kasir</label>
        <input
          className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="••••••" onKeyDown={(e) => e.key === "Enter" && go()}
        />
      </div>
      <button className="btn btn-primary" style={{ width: 260 }} onClick={go} disabled={busy}>
        {busy ? "Memeriksa…" : "Masuk"}
      </button>
    </div>
  );
}
