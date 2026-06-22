import { FlipCard } from "../components/FlipCard";
import { Mascot, RewardIcon, RoomGallery } from "../components/BrandMarks";
import { REWARDS } from "../data/constants";

/**
 * `progress` is the array returned by get_member_progress: one row
 * per tier (free_spin / keychain_50off / free_photobooth) for the
 * member's CURRENT level, each with { threshold, eligible,
 * already_claimed, claim_status, live_stamp_count, lifetime_stamp_count }.
 * live_stamp_count/lifetime_stamp_count are the same across all 3 rows.
 */
export function Dashboard({ member, progress, onClaim, onHistory, onLogout, claimingTier, flash }) {
  const liveStampCount = progress?.[0]?.live_stamp_count ?? 0;
  const referralCode = member.referral_code;

  // Find the next tier the member hasn't claimed yet, to show the "need N more" note.
  const nextTier = progress?.find((p) => !p.already_claimed && !p.eligible);
  const rewardRow = (rewardId) => progress?.find((p) => p.tier === rewardId);

  return (
    <div className="screen">
      <div className="dash-head starfield">
        <div className="dh-left">
          <div>
            <div className="hello">Halo, {member.name.split(" ")[0]}</div>
            <div className="lvl-badge">Level {member.level}</div>
          </div>
        </div>
        <div className="dh-right">
          <button className="text-btn" onClick={onLogout}>Log Out</button>
        </div>
      </div>

      <div className="pad-x">
        <FlipCard member={member} liveStampCount={liveStampCount} />
        <div className="flip-caption">Ketuk kartu untuk lihat Photo License</div>
        <div className="progress-note">
          {nextTier ? (
            <>
              Tinggal <b>{nextTier.threshold - nextTier.lifetime_stamp_count} stamp</b> lagi menuju{" "}
              <b>{REWARDS.find((r) => r.id === nextTier.tier)?.label}</b>
            </>
          ) : (
            <>Kamu bisa klaim semua hadiah sekarang!</>
          )}
        </div>

        <div className="section-label">Tukar Hadiah</div>
        {REWARDS.map((r) => {
          const row = rewardRow(r.id);
          const can = row?.eligible && !row?.already_claimed;
          const claimed = row?.already_claimed;
          const need = row ? Math.max(0, row.threshold - row.lifetime_stamp_count) : r.cost;
          return (
            <div key={r.id} className={`reward ${can || claimed ? "" : "locked"}`}>
              <div className="reward-main">
                <div className="reward-top">
                  <div className="reward-ic"><RewardIcon id={r.id} size={28} /></div>
                  <div className="reward-head">
                    <div className="reward-title">{r.label}</div>
                    <div className="reward-cost"><span className="cost-star">★</span> {r.cost} stamp</div>
                  </div>
                </div>
                <p className="reward-desc">{r.desc}</p>
              </div>
              <button
                className="claim-btn"
                disabled={!can || claimingTier === r.id}
                onClick={() => onClaim(r.id)}
              >
                {claimed ? "Sudah diklaim" : can ? (claimingTier === r.id ? "…" : "Claim") : `Kurang ${need}`}
              </button>
            </div>
          );
        })}

        <div className="section-label">Pilihan Ruangan</div>
        <RoomGallery />

        <button className="btn btn-ghost full hist-btn" onClick={onHistory}>Riwayat</button>

        <div className="referral starfield">
          <div className="ref-head">Ajak teman, dapat stamp gratis</div>
          <p>
            Teman daftar pakai kode referral kamu dan langsung dapat <b>+3 stamp</b>. Begitu mereka
            selesai photobooth pertama, <b>kamu dapat +1 stamp.</b>
          </p>
          <div className="ref-code">
            <span>{referralCode}</span>
            <button
              className="copy"
              onClick={() => {
                navigator.clipboard?.writeText(referralCode);
                flash?.("Kode referral disalin", "ok");
              }}
            >
              Salin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
