import { Logo } from "../components/BrandMarks";
import { fmt } from "../data/constants";
import { REWARDS } from "../data/constants";

export function ClaimProof({ claim, onClose }) {
  const reward = REWARDS.find((r) => r.id === claim.tier);
  const isFulfilled = claim.status === "fulfilled";
  return (
    <div className="screen proof starfield">
      <div className="proof-card">
        <div className="proof-mark"><Logo width={175} /></div>
        <div className="proof-title">Tunjukkan layar ini ke kasir</div>
        <div className="proof-reward">{reward?.label || claim.tier}</div>
        <div className="proof-rows">
          <div><span>Waktu</span><b>{fmt(claim.created_at)}</b></div>
          <div>
            <span>Status</span>
            <b className={`pstat ${isFulfilled ? "fulfilled" : "pending"}`}>
              {isFulfilled ? "Selesai" : "Menunggu kasir"}
            </b>
          </div>
        </div>
        {!isFulfilled && <div className="proof-pulse" />}
        <button className="btn btn-ghost full" onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}
