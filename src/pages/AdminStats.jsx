import { useState, useEffect } from "react";
import { REWARDS } from "../data/constants";

export function AdminStats({ fetchStats, flash }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setStats(await fetchStats());
      } catch (e) {
        flash(e.message || "Gagal memuat statistik", "err");
      }
    })();
  }, []);

  if (!stats) return <div className="apanel"><div className="empty">Memuat…</div></div>;

  const totalClaims = stats.claims.length;
  const pending = stats.claims.filter(
    (c) => c.status === "pending_fulfillment" || c.status === "pending_proof"
  ).length;
  const byReward = REWARDS.map((r) => ({
    id: r.id,
    label: r.label,
    n: stats.claims.filter((c) => c.tier === r.id).length,
  }));
  const maxR = Math.max(1, ...byReward.map((b) => b.n));
  const levels = {};
  stats.members.forEach((m) => { levels[m.level] = (levels[m.level] || 0) + 1; });

  return (
    <div className="apanel">
      <h2 className="apanel-h">Statistik</h2>
      <div className="stat-grid">
        <Stat n={stats.totalMembers} label="Total member" />
        <Stat n={totalClaims} label="Total klaim" />
        <Stat n={pending} label="Klaim pending" warn={pending > 0} />
      </div>
      <div className="stat-block">
        <div className="sb-title">Klaim per hadiah</div>
        {byReward.map((b) => (
          <div key={b.label} className="bar-row">
            <div className="bar-label">{b.label}</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${(b.n / maxR) * 100}%` }} /></div>
            <div className="bar-n">{b.n}</div>
          </div>
        ))}
      </div>
      <div className="stat-block">
        <div className="sb-title">Distribusi level</div>
        <div className="lvl-chips">
          {Object.keys(levels).sort().map((l) => (
            <div key={l} className="lvl-chip"><b>{levels[l]}</b> member · Level {l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label, warn }) {
  return (
    <div className={`stat ${warn ? "warn" : ""}`}>
      <div className="stat-n">{n}</div>
      <div className="stat-l">{label}</div>
    </div>
  );
}
