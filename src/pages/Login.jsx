import { Logo } from "../components/BrandMarks";

export function Login({ phone, setPhone, pin, setPin, onLogin, goRegister, goPasswordHint, busy }) {
  return (
    <div className="screen login-bg pad center-col">
      <Logo width={220} className="login-logo" />
      <div className="field">
        <label>No. HP</label>
        <input
          className="input" inputMode="numeric" placeholder="08xxxxxxxxxx"
          value={phone} onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Password</label>
        <input
          className="input" type="password" placeholder="Password"
          value={pin} onChange={(e) => setPin(e.target.value)}
        />
      </div>
      <button className="btn btn-primary full" onClick={onLogin} disabled={busy}>
        {busy ? "Memuat…" : "Masuk"}
      </button>
      <button className="link" onClick={goPasswordHint} disabled={busy}>
        Lupa Password?
      </button>
      <div className="divider"><span>atau</span></div>
      <button className="btn btn-ghost full" onClick={goRegister} disabled={busy}>
        Daftar member baru
      </button>
    </div>
  );
}
