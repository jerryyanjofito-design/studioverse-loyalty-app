export const REWARDS = [
  {
    id: "free_spin",
    label: "Free Spin The Wheel",
    cost: 3,
    desc: "Ambil kesempatan untuk spin 1x dan menangkan hadiah mulai dari keychain hingga photobooth gratis.",
  },
  {
    id: "keychain_50off",
    label: "50% OFF Keychain",
    cost: 6,
    desc: "Tebus keychain eksklusif Studioverse dengan potongan setengah harga.",
  },
  {
    id: "free_photobooth",
    label: "Free Photobooth",
    cost: 8,
    desc: "Nikmati satu sesi photobooth gratis untuk kamu, sekaligus naik ke level berikutnya.",
  },
];

export const rewardById = (id) => REWARDS.find((r) => r.id === id);

export const fmt = (t) =>
  new Date(t).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDate = (t) =>
  new Date(t).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
