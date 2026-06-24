import { useState } from "react";
import { themeById } from "../data/card-themes";
import { fmtDate } from "../data/constants";

/* The loyalty card — final solved architecture (see project notes):
   front face swaps the WHOLE pre-rendered image by live stamp count
   (0-9), back face overlays per-member text (name, issued date) on
   the static license art via SVG in a fixed viewBox coordinate system.
   Never attempt to overlay stamps dynamically — see project notes for
   why that approach was abandoned. */
export function FlipCard({ member, liveStampCount }) {
  const [flipped, setFlipped] = useState(false);
  const t = themeById(member.card_theme);
  const bal = Math.max(0, Math.min(9, liveStampCount ?? 0));
  const VW = 1643, VH = 1036, FS = 45, OFF = 35;

  return (
    <div className="flip" onClick={() => setFlipped((v) => !v)}>
      <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
        <div className="flip-face flip-front">
          <img className="card-img" src={t.cards[bal]} alt={`Kartu ${t.name}, ${bal} stamp`} draggable="false" />
        </div>
        <div className="flip-face flip-back">
          <svg className="card-svg" viewBox={`0 0 ${VW} ${VH}`}>
            <image href={t.license} x="0" y="0" width={VW} height={VH} />
            <text
              x={(t.fields.nameX / 100) * VW}
              y={(t.fields.nameY / 100) * VH + OFF}
              fontSize={FS}
              fontWeight="600"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fill={t.fields.color}
            >
              {member.name}
            </text>
            <text
              x={(t.fields.issX / 100) * VW}
              y={(t.fields.issY / 100) * VH + OFF}
              fontSize={FS}
              fontWeight="600"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fill={t.fields.color}
            >
              {member.created_at ? fmtDate(member.created_at) : "—"}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
