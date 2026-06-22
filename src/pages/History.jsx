import { Topbar } from "../components/Topbar";
import { fmt } from "../data/constants";

const SOURCE_ICON = {
  welcome: "🎁",
  photobooth: "📸",
  referral_referee: "\uD83D\uDC65",
  referral_referrer: "\uD83D\uDC65",
  manual_adjust: "✏️",
};

const SOURCE_LABEL = {
  welcome: "Bonus pendaftaran",
  photobooth: "Sesi photobooth",
  referral_referee: "Bonus referral (daftar)",
  referral_referrer: "Bonus referral (teman daftar)",
  manual_adjust: "Penyesuaian",
};

/**
 * `stamps` is the raw stamps table rows for this member (newest first).
 * Removed (voided) stamps are shown with a "removed" tag rather than
 * being hidden, so the history stays an honest audit trail.
 */
export function History({ stamps, claims, onBack }) {
  const items = [...(stamps || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="screen">
      <Topbar title="Riwayat" onBack={onBack} sticky />
      <div className="pad">
        {items.length === 0 && <div className="empty">Belum ada aktivitas.</div>}
        {items.map((s) => (
          <div key={s.id} className="hist">
            <div className="hist-ic">{SOURCE_ICON[s.source] || "•"}</div>
            <div className="hist-body">
              <div className="hist-label">
                {SOURCE_LABEL[s.source] || s.source}
                {s.removed_at && <span className="mini-badge pending">dibatalkan</span>}
              </div>
              <div className="hist-time">{fmt(s.created_at)}</div>
            </div>
            {!s.removed_at && (
              <div className="hist-delta plus">+{s.quantity}</div>
            )}
          </div>
        ))}

        {claims?.length > 0 && (
          <>
            <div className="section-label">Klaim Hadiah</div>
            {claims.map((c) => (
              <div key={c.id} className="hist">
                <div className="hist-ic">🎟️</div>
                <div className="hist-body">
                  <div className="hist-label">
                    Tukar: {c.tier}
                    <span className={`mini-badge ${c.status === "fulfilled" ? "fulfilled" : "pending"}`}>
                      {c.status === "fulfilled" ? "selesai" : "menunggu"}
                    </span>
                  </div>
                  <div className="hist-time">{fmt(c.created_at)}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
