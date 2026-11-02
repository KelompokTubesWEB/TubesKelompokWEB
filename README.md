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


## Struktur CSS (dipecah per fitur)
`src/style.css` kini hanya berisi `@import` (titik masuk). Gaya sebenarnya ada di `src/styles/`:



