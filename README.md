# EcoWaste — Frontend Project

Aplikasi demonstrasi pengelolaan sampah dan daur ulang dengan React + Vite, React Router, Fetch API, dan JSON Server.

## Fitur
- Beranda dan statistik ringkas
- Informasi jenis sampah dan harga simulasi
- Direktori bank sampah, pencarian/filter, dan halaman detail
- Formulir permintaan penjemputan dengan validasi
- Pencatatan setoran dan perhitungan nilai ekonomi
- Riwayat setoran dengan pencarian/filter
- Dashboard statistik berat, nilai ekonomi, dan grafik batang
- Loading, error, empty, dan success states
- Responsive CSS dengan Flexbox, Grid, dan media queries

## Menjalankan aplikasi
Pastikan Node.js LTS sudah terpasang. Di terminal pertama:

```bash
npm install
npm run api
```

Di terminal kedua, pada folder yang sama:

```bash
npm run dev
```

Buka alamat yang ditampilkan Vite (umumnya http://localhost:5173). JSON Server berjalan pada http://localhost:3000.

## Rute
- `/`
- `/jenis-sampah`
- `/bank-sampah`
- `/bank-sampah/:id`
- `/penjemputan`
- `/pencatatan-setoran`
- `/riwayat-setoran`
- `/dashboard-ekonomi`

## Struktur data
`db.json` menyediakan `wasteTypes`, `banks`, `pickupRequests`, dan `deposits`. Data bank dan harga bersifat ilustratif untuk demonstrasi, bukan informasi resmi.

## Pembagian kerja kelompok
- Anggota 1: `Home.jsx`, `WasteTypes.jsx`, `WasteCard.jsx`
- Anggota 2: `BankList.jsx`, `BankDetail.jsx`, `PickupRequest.jsx`
- Anggota 3: `DepositForm.jsx`, `DepositHistory.jsx`
- Anggota 4: `EconomicDashboard.jsx`, `Navbar.jsx`, `Footer.jsx`, `App.jsx`, `services/api.js`, `db.json`, integrasi dan pengujian

Sebaiknya setiap anggota mengerjakan branch Git terpisah dan seluruh anggota ikut menguji fitur yang dibuatnya.

## Struktur CSS (dipecah per fitur)
`src/style.css` kini hanya berisi `@import` (titik masuk). Gaya sebenarnya ada di `src/styles/`:

| File | Pemilik | Dipakai oleh |
|---|---|---|
| `shared/base.css` | Anggota 4 | Reset, variabel `:root`, focus, `.container`, `.sr-only` |
| `shared/layout.css` | Anggota 4 | `app-shell`, `page-main`, `page-heading`, `section`, `eyebrow`, `text-link` |
| `shared/buttons.css` | Anggota 4 | Semua varian `.button` |
| `shared/status.css` | Anggota 4 | `status-box`, `error-box`, `spinner` |
| `shared/forms.css` | Anggota 4 | Form bersama (PickupRequest & DepositForm) |
| `shared/filters.css` | Anggota 4 | Search & filter (BankList & DepositHistory) |
| `shared/common.css` | Anggota 4 | `card`, `tag`, `empty-state`, `data-disclaimer`, `money-cell` |
| `components/navbar.css`, `footer.css` | Anggota 4 | Navbar.jsx, Footer.jsx |
| `components/waste-card.css` | Anggota 1 | WasteCard.jsx + `waste-grid` |
| `pages/home.css`, `waste-types.css` | Anggota 1 | Home.jsx, WasteTypes.jsx |
| `pages/bank-list.css`, `bank-detail.css`, `pickup.css` | Anggota 2 | BankList, BankDetail, PickupRequest |
| `pages/deposit-form.css`, `deposit-history.css` | Anggota 3 | DepositForm, DepositHistory |
| `pages/dashboard.css` | Anggota 4 | EconomicDashboard.jsx |

Aturan: edit CSS fitur di file milik sendiri. Perubahan di `shared/` dikoordinasikan dengan Anggota 4. File CSS baru harus didaftarkan Anggota 4 di `style.css` (urutan import penting: shared → components → pages).
