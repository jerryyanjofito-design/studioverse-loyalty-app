import { Login } from "./Login";
import { Register } from "./Register";
import { PasswordHint } from "./PasswordHint";
import { Dashboard } from "./Dashboard";
import { History } from "./History";
import { ClaimProof } from "./ClaimProof";

/**
 * Top-level customer-side screen router. All data (member, progress,
 * stamps, claims) is fetched/owned by App.jsx and passed down — this
 * component only decides which screen to show and wires up callbacks.
 */
export function CustomerApp({
  cScreen, setCScreen,
  phone, setPhone, pin, setPin,
  onLogin, onRegister, onLogout, busy,
  member, progress, stamps, claims,
  proofClaim, setProofClaim,
  onClaim, claimingTier,
  flash,
}) {
  if (proofClaim) return <ClaimProof claim={proofClaim} onClose={() => setProofClaim(null)} />;

  if (cScreen === "login")
    return (
      <Login
        phone={phone} setPhone={setPhone} pin={pin} setPin={setPin}
        onLogin={onLogin} busy={busy}
        goRegister={() => { setPhone(""); setPin(""); setCScreen("register"); }}
        goPasswordHint={() => setCScreen("password-hint")}
      />
    );

  if (cScreen === "password-hint")
    return (
      <PasswordHint
        flash={flash} busy={busy}
        onBack={() => setCScreen("login")}
      />
    );

  if (cScreen === "register")
    return (
      <Register
        flash={flash} busy={busy}
        onSubmit={onRegister}
        onBack={() => setCScreen("login")}
      />
    );

  if (!member) {
    setCScreen("login");
    return null;
  }

  if (cScreen === "history")
    return <History stamps={stamps} claims={claims} onBack={() => setCScreen("dashboard")} />;

  return (
    <Dashboard
      member={member} progress={progress} claimingTier={claimingTier}
      onClaim={onClaim}
      onHistory={() => setCScreen("history")}
      onLogout={onLogout}
      flash={flash}
    />
  );
}
