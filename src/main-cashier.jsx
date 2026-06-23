import { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  verifyAdminPassword, cashierSearchMembers, cashierFindMemberByPhone,
  cashierAddStamp, cashierRemoveStamp, cashierListStampsForMember,
  cashierFetchAllClaims, cashierFulfillClaim, cashierFetchStats,
} from "./lib/supabase";
import { AdminApp } from "./pages/AdminApp";
import { CSS } from "./styles";

function Tablet({ children }) {
  return <div className="tablet">{children}</div>;
}

function App() {
  const [toast, setToast] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [aTab, setATab] = useState("search");
  const [pendingCount, setPendingCount] = useState(0);

  const flash = useCallback((msg, type = "ok") => {
    setToast({ msg, type, id: Math.random().toString(36).slice(2) });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!adminAuthed) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await cashierFetchAllClaims();
        if (!cancelled) {
          setPendingCount(
            rows.filter((c) => c.status === "pending_fulfillment" || c.status === "pending_proof").length
          );
        }
      } catch (e) { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [adminAuthed, aTab]);

  return (
    <div className="sv-root">
      <style>{CSS}</style>
      <div className="stage">
        <Tablet>
          <AdminApp
            authed={adminAuthed} setAuthed={setAdminAuthed}
            tab={aTab} setTab={setATab} pendingCount={pendingCount}
            verifyPassword={verifyAdminPassword}
            searchMembers={cashierSearchMembers}
            getMemberDetail={cashierFindMemberByPhone}
            addStamp={cashierAddStamp}
            removeStamp={cashierRemoveStamp}
            listStamps={cashierListStampsForMember}
            fetchClaims={cashierFetchAllClaims}
            fulfillClaim={cashierFulfillClaim}
            fetchStats={cashierFetchStats}
            flash={flash}
          />
        </Tablet>
      </div>
      {toast && <div key={toast.id} className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
