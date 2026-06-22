import logoImg from "../assets/logo.png";
import { ROOMS } from "../data/rooms";

/* Orbit + sparkle logomark — echoes the "o" in the studioverse logo */
export function OrbitMark({ size = 40, ring = "#2A6BD0", planet = "#2A6BD0", star = "#FFCB5C" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block" }}>
      <circle cx="50" cy="50" r="30" fill="none" stroke={planet} strokeWidth="6" />
      <g transform="rotate(-22 50 50)">
        <ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke={ring} strokeWidth="4" opacity="0.9" />
      </g>
      <path d="M50 34 l3.4 9.6 l9.6 3.4 l-9.6 3.4 l-3.4 9.6 l-3.4 -9.6 l-9.6 -3.4 l9.6 -3.4 z" fill={star} />
    </svg>
  );
}

export function Wordmark({ size = 30, color = "#141A35", onDark = false }) {
  return (
    <span className="wordmark" style={{ fontSize: size, color }}>
      studi
      <OrbitMark size={size * 0.92} ring={onDark ? "#90D5FF" : "#2A6BD0"} planet={color} star="#FFCB5C" />
      verse
    </span>
  );
}

/* Mascot "Astra" the cosmonaut — placeholder, evolves per level.
   (Swap with the real Studioverse mascot when ready.) */
export function Mascot({ level = 1, size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {level >= 2 && (
        <ellipse
          cx="50" cy="52" rx="44" ry="16" fill="none" stroke="#90D5FF" strokeWidth="3" opacity="0.7"
          transform="rotate(-20 50 52)"
        />
      )}
      <rect x="30" y="64" width="40" height="30" rx="14" fill="#fff" stroke="#141A35" strokeWidth="3" />
      <rect x="44" y="74" width="12" height="10" rx="3" fill="#90D5FF" />
      <circle cx="50" cy="44" r="28" fill="#fff" stroke="#141A35" strokeWidth="3" />
      <ellipse cx="50" cy="45" rx="20" ry="17" fill="#141A35" />
      <ellipse cx="43" cy="39" rx="6" ry="4" fill="#90D5FF" opacity="0.85" />
      <circle cx="57" cy="50" r="2.5" fill="#90D5FF" opacity="0.6" />
      {level >= 2 && (
        <path
          d="M50 16 l2.6 7 l7 2.6 l-7 2.6 l-2.6 7 l-2.6 -7 l-7 -2.6 l7 -2.6 z"
          fill="#FFCB5C" stroke="#141A35" strokeWidth="1"
        />
      )}
      {level >= 3 && (
        <>
          <path d="M16 30 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#FFCB5C" />
          <path d="M82 64 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 z" fill="#FFCB5C" />
          <circle cx="20" cy="68" r="2" fill="#90D5FF" />
        </>
      )}
    </svg>
  );
}

/* Reward icons — clean vector glyphs in brand colors.
   IDs match the reward_tier enum: free_spin / keychain_50off / free_photobooth */
export function RewardIcon({ id, size = 30 }) {
  const blue = "#2A6BD0", gold = "#FFCB5C";
  if (id === "free_spin")
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 3 l4.5 7 h-9 z" fill={gold} />
        <circle cx="24" cy="27" r="15" stroke={blue} strokeWidth="2.5" />
        <line x1="24" y1="12" x2="24" y2="42" stroke={blue} strokeWidth="1.5" />
        <line x1="9" y1="27" x2="39" y2="27" stroke={blue} strokeWidth="1.5" />
        <line x1="13.4" y1="16.4" x2="34.6" y2="37.6" stroke={blue} strokeWidth="1.5" />
        <line x1="13.4" y1="37.6" x2="34.6" y2="16.4" stroke={blue} strokeWidth="1.5" />
        <circle cx="24" cy="27" r="4.2" fill={gold} stroke="#fff" strokeWidth="1.2" />
      </svg>
    );
  if (id === "keychain_50off")
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="9" stroke={blue} strokeWidth="2.5" />
        <circle cx="18" cy="18" r="3.4" fill={gold} />
        <path d="M24 24 L38 38" stroke={blue} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 32 l4 -4" stroke={blue} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M35.5 35.5 l3.5 -3.5" stroke={blue} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="7" y="16" width="34" height="24" rx="6" stroke={blue} strokeWidth="2.5" />
      <path d="M17 16 l3 -4 h8 l3 4" stroke={blue} strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <circle cx="24" cy="28" r="7" stroke={blue} strokeWidth="2.5" />
      <circle cx="24" cy="28" r="3" fill={gold} />
      <circle cx="35" cy="21" r="1.7" fill={gold} />
    </svg>
  );
}

/* Room choices showcase */
export function RoomGallery() {
  return (
    <div className="room-scroll">
      {ROOMS.map((r) =>
        r.soon ? (
          <div className="room-card room-soon starfield" key={r.name}>
            <div className="soon-inner">
              <div className="soon-badge">Coming Soon</div>
              <div className="soon-name">{r.name}</div>
            </div>
          </div>
        ) : (
          <div className="room-card" key={r.name}>
            <img src={r.img} alt={r.name} loading="lazy" />
            <div className="room-name">{r.name}</div>
          </div>
        )
      )}
    </div>
  );
}

/* Brand logo (real Studioverse wordmark, transparent) */
export function Logo({ width = 200, className = "" }) {
  return <img src={logoImg} alt="studioverse" className={`sv-logo ${className}`.trim()} style={{ width }} />;
}
