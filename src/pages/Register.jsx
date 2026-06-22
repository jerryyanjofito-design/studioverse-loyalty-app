import { useState } from "react";
import { CARD_THEMES } from "../data/card-themes";
import { Topbar } from "../components/Topbar";

export function Register({ flash, onSubmit, onBack, busy }) {
  const [f, setF] = useState({ name: "", phone: "", birthDate: "", ref: "", pin: "", pin2: "", card: "classic" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  // Auto-format DD/MM/YYYY saat mengetik
  const handleBirthDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Hapus semua non-digit

    // Batasi 8 digit (DDMMYYYY)
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Tambah "/" otomatis
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '/';
      }
      formatted += value[i];
    }

    set("birthDate", formatted);
  };

  // Validasi format tanggal DD/MM/YYYY
  const isValidDate = (dateStr) => {
    if (!dateStr) return true; // Opsional, boleh kosong

    // Cek format DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;

    const [, day, month, year] = dateStr.match(regex);
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    // Cek range dasar
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    if (y < 1900 || y > new Date().getFullYear()) return false;

    // Cek hari valid per bulang (termasuk leap year)
    const daysInMonth = [31, (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (d > daysInMonth[m - 1]) return false;

    return true;
  };

  const submit = () => {
    if (!f.name.trim()) return flash("Isi nama dulu ya", "err");
    if (!/^08\d{8,}$/.test(f.phone.trim())) return flash("No. HP tidak valid", "err");
    if (f.birthDate && !isValidDate(f.birthDate)) return flash("Format tanggal harus DD/MM/YYYY", "err");
    if (f.pin.length < 6) return flash("Password minimal 6 karakter", "err");
    if (f.pin !== f.pin2) return flash("Konfirmasi Password tidak cocok", "err");

    // Generate password hint otomatis: first char + **** + last char
    const generateHint = (password) => {
      if (!password || password.length < 2) return null;
      return `${password.charAt(0)}****${password.charAt(password.length - 1)}`;
    };

    // Convert DD/MM/YYYY to YYYY-MM-DD for database
    const convertBirthDate = (dateStr) => {
      if (!dateStr) return null;
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!regex.test(dateStr)) return null;
      const [, day, month, year] = dateStr.match(regex);
      return `${year}-${month}-${day}`;
    };

    onSubmit({
      name: f.name.trim(),
      phone: f.phone.trim(),
      birthDate: convertBirthDate(f.birthDate),
      passwordHint: generateHint(f.pin),
      pin: f.pin,
      cardTheme: f.card,
      referralCode: f.ref.trim() || null,
    });
  };

  return (
    <div className="screen pad">
      <Topbar title="Daftar Member" onBack={onBack} />
      <div className="field">
        <label>Nama</label>
        <input className="input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Nama kamu" />
      </div>
      <div className="field">
        <label>No. HP</label>
        <input
          className="input" inputMode="numeric" value={f.phone}
          onChange={(e) => set("phone", e.target.value)} placeholder="08xxxxxxxxxx"
        />
      </div>
      <div className="field">
        <label>Tanggal Lahir <span className="opt">(opsional, untuk promo ulang tahun)</span></label>
        <input
          className="input"
          type="text"
          inputMode="numeric"
          value={f.birthDate}
          onChange={handleBirthDateChange}
          placeholder="DD/MM/YYYY"
          maxLength={10}
        />
      </div>
      <div className="field">
        <label>Kode referral <span className="opt">(opsional)</span></label>
        <input
          className="input" value={f.ref} onChange={(e) => set("ref", e.target.value)}
          placeholder="Kode dari teman yang ngajak kamu"
        />
      </div>
      <div className="row2">
        <div className="field">
          <label>Buat Password</label>
          <input
            className="input" type="password" value={f.pin}
            onChange={(e) => set("pin", e.target.value)} placeholder="Min. 6 karakter"
          />
        </div>
        <div className="field">
          <label>Ulangi Password</label>
          <input
            className="input" type="password" value={f.pin2}
            onChange={(e) => set("pin2", e.target.value)} placeholder="Min. 6 karakter"
          />
        </div>
      </div>
      <div className="field">
        <label>Pilih desain kartu</label>
        <div className="theme-picker">
          {CARD_THEMES.map((t) => (
            <button
              key={t.id} className={`theme-opt ${f.card === t.id ? "sel" : ""}`}
              onClick={() => set("card", t.id)} title={t.name}
            >
              <img src={t.cards[0]} alt={t.name} />
              <span className="theme-name">{t.name}{f.card === t.id ? " ✓" : ""}</span>
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary full" onClick={submit} disabled={busy}>
        {busy ? "Memproses…" : "Buat akun"}
      </button>
    </div>
  );
}
