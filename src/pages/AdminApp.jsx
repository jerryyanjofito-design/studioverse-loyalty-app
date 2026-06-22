import { Logo } from "../components/BrandMarks";
import { AdminLogin } from "./AdminLogin";
import { AdminSearch } from "./AdminSearch";
import { AdminNotif } from "./AdminNotif";
import { AdminStats } from "./AdminStats";

export function AdminApp({
  authed, setAuthed, tab, setTab, pendingCount,
  verifyPassword, searchMembers, getMemberDetail, addStamp, removeStamp, listStamps,
  fetchClaims, fulfillClaim, fetchStats, flash,
}) {
  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} flash={flash} verifyPassword={verifyPassword} />;

  return (
    <div className="admin">
      <div className="admin-side starfield">
        <div className="admin-logo"><Logo width={150} /></div>
        <div className="admin-tag">Cashier Panel</div>
        <button className={`anav ${tab === "search" ? "on" : ""}`} onClick={() => setTab("search")}>
          🔍 <span>Cari Member</span>
        </button>
        <button className={`anav ${tab === "notif" ? "on" : ""}`} onClick={() => setTab("notif")}>
          🔔 <span>Notifikasi</span> {pendingCount > 0 && <span className="anav-badge">{pendingCount}</span>}
        </button>
        <button className={`anav ${tab === "stats" ? "on" : ""}`} onClick={() => setTab("stats")}>
          📊 <span>Statistik</span>
        </button>
        <div className="admin-spacer" />
        <button className="anav muted-nav" onClick={() => setAuthed(false)}>⏋ <span>Keluar</span></button>
      </div>
      <div className="admin-main">
        {tab === "search" && (
          <AdminSearch
            searchMembers={searchMembers} getMemberDetail={getMemberDetail}
            addStamp={addStamp} removeStamp={removeStamp} listStamps={listStamps} flash={flash}
          />
        )}
        {tab === "notif" && <AdminNotif fetchClaims={fetchClaims} fulfillClaim={fulfillClaim} flash={flash} />}
        {tab === "stats" && <AdminStats fetchStats={fetchStats} flash={flash} />}
      </div>
    </div>
  );
}
