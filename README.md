# Studioverse Loyalty — React + Supabase

Ini versi production-track dari prototype loyalty app Studioverse — React asli
(Vite) yang terhubung ke Supabase sungguhan, siap untuk dikembangkan lebih
jauh dan akhirnya di-deploy.

## Cara menjalankan (di komputer kamu, lewat Claude Code)

```bash
npm install
cp .env.example .env
# lalu edit .env, isi dengan Project URL + Publishable key + Secret key
# dari Supabase Dashboard > Settings > API
npm run dev
```

Buka URL yang ditampilkan (biasanya `http://localhost:5173`).

## Struktur project

```
src/
  lib/supabase.js       — semua koneksi & fungsi Supabase (auth, member, cashier)
  data/                 — config statis: tema kartu, daftar ruangan, daftar hadiah
  components/           — komponen UI yang dipakai berkali-kali (FlipCard, Logo, dst)
  pages/                — satu file per "halaman" (Login, Dashboard, AdminSearch, dst)
  assets/                — semua gambar asli (kartu, license, ruangan, logo)
  App.jsx               — kerangka utama, menyatukan semua halaman
  styles.js             — semua CSS (dipindah dari template string raksasa)
```

Ini sengaja dipecah jadi banyak file kecil (beda dari prototype 1-file lama)
karena project ini akan terus tumbuh — lebih mudah dicari & diedit.

## Yang SUDAH terhubung ke Supabase asli

- Registrasi member (phone + PIN, otomatis dapat welcome/referral stamp)
- Login (phone + PIN, tanpa OTP/SMS)
- Dashboard: kartu loyalty, progress hadiah, klaim hadiah
- Riwayat stamp & klaim
- Cashier panel: cari member, tambah/kurangi stamp, notifikasi klaim, statistik

## Yang BELUM selesai / perlu diperhatikan sebelum deploy sungguhan

1. **Secret key ada di frontend.** File `.env` berisi `VITE_SUPABASE_SECRET_KEY`
   yang dipakai cashier panel. Ini OK selama HANYA Jerry yang pakai untuk
   testing. **Sebelum cashier lain pakai atau sebelum di-deploy ke publik**,
   semua panggilan yang pakai secret key (`cashierAddStamp`, `cashierRemoveStamp`,
   `verifyAdminPassword`, dll di `src/lib/supabase.js`) harus dipindah ke
   server/Edge Function — supaya secret key tidak pernah ada di browser.

2. **"Lupa PIN" belum ada.** Prototype lama punya flow ini tapi pakai OTP
   palsu yang di-generate di browser (`Math.random()`) — itu bukan keamanan
   sungguhan, jadi sengaja TIDAK dibawa ke versi ini. Perlu didesain ulang
   pakai OTP asli (lewat WhatsApp/SMS provider, atau email recovery) sebelum
   ditambahkan.

3. **Status klaim tidak live-update.** Layar "Tunjukkan ke kasir" (ClaimProof)
   tidak otomatis berubah saat kasir menandai selesai — perlu refresh manual.
   Bisa diperbaiki dengan Supabase Realtime subscription.

4. **Belum ada loading/error state yang lengkap di semua halaman** — fokus
   awal adalah memastikan jalur utama (login → dashboard → klaim, cashier
   cari → tambah stamp) berfungsi, bukan polish UX penuh.

5. **`.gitignore` sudah menyertakan `.env`** — pastikan TIDAK pernah
   commit file `.env` (yang isinya kunci asli) ke git/GitHub.

## Tentang desain kartu (jangan diubah tanpa alasan kuat)

Kartu loyalty pakai pendekatan "swap gambar utuh per jumlah stamp" — BUKAN
overlay stamp dinamis. Ini hasil dari banyak percobaan yang gagal sebelumnya
(lihat catatan di `src/components/FlipCard.jsx`). Posisi nama & tanggal di
halaman belakang kartu (license) sudah dikalibrasi pas untuk ketiga tema —
jangan ubah konstanta `VW`, `VH`, `FS`, `OFF` di `FlipCard.jsx` kecuali memang
perlu mengkalibrasi ulang.
