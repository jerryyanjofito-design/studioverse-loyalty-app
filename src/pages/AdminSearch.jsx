import { useState, useEffect, useMemo } from "react";
import { Mascot } from "../components/BrandMarks";
import { fmt } from "../data/constants";

/**
 * Cashier flow: search by phone/name, select a member, see their
 * live/lifetime stamps, add a photobooth stamp (proof checkbox is a
 * UI nudge only — the database does not require photo_proof_url),
 * or remove a stamp with a required reason.
 */
export function AdminSearch({
  searchMembers, getMemberDetail, addStamp, removeStamp, listStamps, flash,
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null); // { member_id, name, phone, ... }
  const [recentStamps, setRecentStamps] = useState([]);
  const [checked, setChecked] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = q.trim();
    if (!s) { setResults([]); return; }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const rows = await searchMembers(s);
        if (!cancelled) setResults(rows);
      } catch (e) {
        if (!cancelled) flash(e.message || "Gagal mencari member", "err");
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q]);

  const openMember = async (phone) => {
    setBusy(true);
    try {
      const detail = await getMemberDetail(phone);
      if (!detail) return flash("Member tidak ditemukan", "err");
      setSelected(detail);
      const stamps = await listStamps(phone);
      setRecentStamps(stamps.slice(0, 6));
    } catch (e) {
      flash(e.message || "Gagal memuat member", "err");
    } finally {
      setBusy(false);
    }
  };

  const refreshSelected = async () => {
    const detail = await getMemberDetail(selected.phone);
    setSelected(detail);
    const stamps = await listStamps(selected.phone);
    setRecentStamps(stamps.slice(0, 6));
  };

  const handleAddStamp = async () => {
    setBusy(true);
    try {
      await addStamp({ phone: selected.phone, source: "photobooth", quantity: 1 });
      setChecked(false);
      flash("Stamp ditambahkan +1", "ok");
      await refreshSelected();
    } catch (e) {
      flash(e.message || "Gagal menambah stamp", "err");
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveStamp = async (stampId) => {
    if (!reason.trim()) return;
    setBusy(true);
    try {
      await removeStamp({ stampId, reason: reason.trim() });
      setRemoving(false);
      setReason("");
      flash("Stamp dikurangi", "ok");
      await refreshSelected();
    } catch (e) {
      flash(e.message || "Gagal mengurangi stamp", "err");
    } finally {
      setBusy(false);
    }
  };

  if (selected) {
    // Match original prototype behavior: removing a stamp removes the
    // MOST RECENTLY earned active stamp, not the oldest.
    const activeStamps = [...recentStamps]
      .filter((s) => !s.removed_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return (
      <div className="apanel">
        <button
          className="back-link"
          onClick={() => { setSelected(null); setChecked(false); setReason(""); setRemoving(false); }}
        >
          ← Kembali ke pencarian
        </button>
        <div className="member-head">
          <Mascot level={selected.level} size={56} />
          <div>
            <div className="mh-name">{selected.name}</div>
            <div className="mh-meta">{selected.phone} · Level {selected.level}</div>
          </div>
          <div className="mh-bal"><span>{selected.live_stamp_count}</span>stamp aktif</div>
        </div>
        <div className="add-box">
          <label className="check">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <span>Sudah cek foto hasil photobooth di HP customer</span>
          </label>
          <button className="btn btn-primary full" disabled={!checked || busy} onClick={handleAddStamp}>
            + Tambah Stamp
          </button>
        </div>
        {!removing ? (
          <button
            className="btn btn-danger-ghost full" onClick={() => setRemoving(true)}
            disabled={selected.live_stamp_count === 0}
          >
            − Kurangi Stamp
          </button>
        ) : (
          <div className="remove-box">
            <label>Alasan pengurangan</label>
            <input
              className="input" value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="cth: salah input, double tap"
            />
            <div className="row2">
              <button className="btn btn-ghost full" onClick={() => { setRemoving(false); setReason(""); }}>
                Batal
              </button>
              <button
                className="btn btn-danger full" disabled={!reason.trim() || busy || activeStamps.length === 0}
                onClick={() => handleRemoveStamp(activeStamps[0].id)}
              >
                Konfirmasi −1
              </button>
            </div>
          </div>
        )}
        <div className="mini-hist">
          <div className="mh-title">Aktivitas terakhir</div>
          {recentStamps.map((s) => (
            <div key={s.id} className="mh-row">
              <span>
                {s.source}{s.removed_at ? " (dibatalkan)" : ` +${s.quantity}`}
              </span>
              <span className="mh-time">{fmt(s.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="apanel">
      <h2 className="apanel-h">Cari Member</h2>
      <input
        className="input search" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Ketik no. HP atau nama…" autoFocus
      />
      <div className="res-list">
        {q.trim() && results.length === 0 && <div className="empty">Tidak ada member ditemukan.</div>}
        {results.map((m) => (
          <button key={m.id} className="res-row" onClick={() => openMember(m.phone)}>
            <Mascot level={m.level} size={34} />
            <div className="rr-info">
              <div className="rr-name">{m.name}</div>
              <div className="rr-phone">{m.phone}</div>
            </div>
          </button>
        ))}
        {!q.trim() && <div className="empty">Mulai ketik untuk mencari member.</div>}
      </div>
    </div>
  );
}
