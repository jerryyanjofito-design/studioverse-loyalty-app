import { useState, useEffect } from "react";
import { fmt } from "../data/constants";
import { REWARDS } from "../data/constants";

export function AdminNotif({ fetchClaims, fulfillClaim, flash }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      const rows = await fetchClaims();
      setClaims(rows);
    } catch (e) {
      flash(e.message || "Gagal memuat klaim", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFulfill = async (id) => {
    setBusyId(id);
    try {
      await fulfillClaim(id);
      flash("Ditandai selesai", "ok");
      await load();
    } catch (e) {
      flash(e.message || "Gagal menandai selesai", "err");
    } finally {
      setBusyId(null);
    }
  };

  const pending = claims.filter((c) => c.status === "pending_fulfillment" || c.status === "pending_proof");
  const sorted = [...claims].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="apanel">
      <h2 className="apanel-h">Notifikasi Klaim <span className="live">● live</span></h2>
      {!loading && claims.length === 0 && <div className="empty">Belum ada klaim.</div>}
      <div className="notif-list">
        {sorted.map((c) => {
          const isPending = c.status === "pending_fulfillment" || c.status === "pending_proof";
          const reward = REWARDS.find((r) => r.id === c.tier);
          return (
            <div key={c.id} className={`notif ${isPending ? "pending" : ""}`}>
              <div className="notif-ic">{isPending ? "🔔" : "✅"}</div>
              <div className="notif-body">
                <div className="notif-title">
                  {c.members?.name || "—"} <span className="notif-phone">{c.members?.phone}</span>
                </div>
                <div className="notif-reward">klaim: <b>{reward?.label || c.tier}</b></div>
                <div className="notif-time">{fmt(c.created_at)}</div>
              </div>
              {isPending ? (
                <button
                  className="btn btn-primary sm" disabled={busyId === c.id}
                  onClick={() => handleFulfill(c.id)}
                >
                  Tandai Selesai
                </button>
              ) : (
                <span className="done-tag">{c.status === "rejected" ? "Ditolak" : "Selesai"}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
