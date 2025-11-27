# 🏥 Klinik Sentosa - Sistem Informasi Manajemen Klinik

Sistem Informasi Manajemen Klinik berbasis web yang komprehensif untuk mengelola operasional klinik termasuk manajemen pasien, janji temu, antrian, rekam medis, pembayaran, dan apotek.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Instalasi](#-instalasi)
- [Pengguna & Password](#-pengguna--password)
- [Alur Sistem](#-alur-sistem)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Penggunaan](#-penggunaan)
- [Push ke GitHub](#-push-ke-github)

---

## 🌟 Fitur Utama

### 1. **Manajemen Multi-Role**
- 👨‍💼 **Owner/Pemilik**: Dashboard statistik, laporan keuangan, aktivitas klinik
- 🛡️ **Admin**: Manajemen user, pendaftaran pasien, kasir pembayaran
- 👨‍⚕️ **Dokter**: Pemeriksaan pasien, resep obat, rekam medis
- 👩‍⚕️ **Perawat**: Pemeriksaan tanda vital, antrian pasien
- 💊 **Apoteker**: Verifikasi resep, manajemen obat
- 👤 **Pasien**: Janji temu, antrian, rekam medis, pembayaran

### 2. **Sistem Antrian Digital**
- Nomor antrian otomatis
- Status antrian real-time
- Notifikasi untuk pasien
- Manajemen antrian untuk perawat dan dokter

### 3. **Rekam Medis Elektronik**
- Riwayat pemeriksaan lengkap
- Tanda vital (tekanan darah, suhu, berat, tinggi, dll)
- Diagnosis dan resep terintegrasi
- Riwayat pembayaran

### 4. **Sistem Pembayaran**
- Pembayaran tunai
- Integrasi BPJS
- Upload bukti pembayaran
- Verifikasi oleh admin
- Laporan keuangan

### 5. **Manajemen Apotek**
- Inventori obat
- Verifikasi resep
- Antrian resep
- Riwayat pengeluaran obat

### 6. **Dashboard & Laporan**
- Statistik real-time
- Grafik pendapatan (Chart.js)
- Grafik kunjungan pasien
- Laporan keuangan dengan filter tanggal
- Log aktivitas sistem

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Lucide React** - Icons
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling (via custom CSS)

### Utilities
- **Vite** - Build tool
- **Axios** - HTTP client

---

## 📦 Instalasi

### Prerequisites
- Node.js v16+ dan npm
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/klinik-sentosa.git
cd klinik-sentosa
```

### Step 2: Setup Backend

```bash
cd backend
npm install
node server.js
```

Server berjalan di: **http://localhost:3000**

### Step 3: Setup Frontend

```bash
cd klinik-sentosa-react
npm install
npm run dev
```

Frontend berjalan di: **http://localhost:5173**

### Step 4: Database Setup

Database SQLite (`klinik_sentosa.db`) akan otomatis dibuat saat server pertama kali dijalankan.

---

## 🔐 Pengguna & Password

**Total: 9 Akun Utama** - Berikut adalah daftar lengkap semua akun aktif di sistem:

> **Note**: Semua password adalah `admin123` kecuali disebutkan lain.

| No | Email | Username | Password | Role | Nama Lengkap |
|----|-------|----------|----------|------|--------------|
| 1  | owner@klinik.com | - | admin123 | owner | Stevanus Bojoh |
| 2  | admin@email.com | - | admin123 | admin | IT_Administrator |
| 3  | Fael@email.com | Fael | admin123 | admin | Rafael Kristanto |
| 4  | Seon@email.com | Seon | admin123 | doctor | Dr. Brayndo Seon |
| 5  | Steven@email.com | - | admin123 | doctor | Dr. Steven Matar |
| 6  | nurse@email.com | - | admin123 | nurse | Ns. Ratna Dewi |
| 7  | Jayden@email.com | - | admin123 | pharmacist | Apt. Jayden Sangari |
| 8  | Emil@email.com | Emil | admin123 | pharmacist | Apt. Emil Waturandang |
| 9  | derel@email.com | Derel | 12345678 atau admin123 | patient | Darel Watak |

---

### 📝 Catatan Password:
- **Default Password**: `admin123` untuk semua user (kecuali disebutkan)
- **Pasien Derel**: Password bisa `12345678` atau `admin123`

---

### Detail Akses Per Role:

#### 👨‍💼 OWNER (1 akun)
**Login:** `owner@klinik.com` / `admin123`
- **Nama**: Stevanus Bojoh
- **Fitur**:
  - Dashboard dengan statistik real-time
  - Grafik pendapatan & kunjungan (7 hari)
  - Laporan keuangan lengkap (filter tanggal)
  - Log aktivitas seluruh sistem
  - Auto-refresh data setiap 30 detik

---

#### 🛡️ ADMIN (2 akun)
**Akun 1:** `admin@email.com` / `admin123`
- **Nama**: IT_Administrator

**Akun 2:** `Fael@email.com` / `admin123`
- **Username**: Fael
- **Nama**: Rafael Kristanto

**Fitur Admin:**
- Manajemen user (tambah, edit, hapus)
- Registrasi pasien baru
- Kasir pembayaran (tunai & BPJS)
- Verifikasi pembayaran & bukti transfer
- Laporan & audit logs

---

#### 👨‍⚕️ DOKTER (2 akun)
**Akun 1:** `Seon@email.com` / `admin123`
- **Username**: Seon
- **Nama**: Dr. Brayndo Seon

**Akun 2:** `Steven@email.com` / `admin123`
- **Nama**: Dr. Steven Matar

**Fitur Dokter:**
- Dashboard antrian pasien hari ini
- Pemeriksaan pasien dengan tanda vital
- Buat/edit rekam medis
- Input diagnosis & resep obat
- Riwayat pasien lengkap

---

#### 👩‍⚕️ PERAWAT (1 akun)
**Login:** `nurse@email.com` / `admin123`
- **Nama**: Ns. Ratna Dewi
- **Fitur**:
  - Dashboard antrian pending
  - Input tanda vital:
    - Tekanan darah (sistol/diastol)
    - Detak jantung (BPM)
    - Suhu tubuh (°C)
    - Berat & tinggi badan
    - Saturasi oksigen (%)
    - Golongan darah
  - Kirim data ke dokter
  - Tolak/lewati antrian

---

#### 💊 APOTEKER (2 akun)
**Akun 1:** `Jayden@email.com` / `admin123`
- **Nama**: Apt. Jayden Sangari

**Akun 2:** `Emil@email.com` / `admin123`
- **Username**: Emil
- **Nama**: Apt. Emil Waturandang

**Fitur Apoteker:**
- Dashboard statistik apotek
- Antrian resep pending
- Verifikasi resep dokter
- Manajemen inventori obat
- Riwayat pengeluaran obat

---

#### 👤 PASIEN (1 akun aktif)
**Login:** `derel@email.com` / `12345678` (atau `admin123`)
- **Username**: Derel
- **Nama**: Darel Watak

**Fitur Pasien:**
- Dashboard pribadi dengan statistik
- Buat janji temu dengan dokter
- Ambil nomor antrian online
- Lihat rekam medis lengkap
- Lihat resep obat
- Upload bukti pembayaran
- Riwayat pembayaran
- Lihat status antrian real-time

> **Note**: Ada pasien test lainnya (BPJS/Mandiri) di database yang dibuat otomatis untuk testing pembayaran.

---

## 🔄 Alur Sistem

### 1. Alur Pasien Baru

```
Registrasi di Web (atau Admin yang daftarkan)
  ↓
Akun dibuat dengan role "patient"
  ↓
Login ke dashboard pasien
  ↓
Buat Janji Temu (pilih dokter, tanggal, waktu)
  ↓
Datang ke klinik → Ambil nomor antrian
  ↓
Status: Menunggu Perawat
```

### 2. Alur Pemeriksaan

```
Pasien di antrian (status: pending)
  ↓
PERAWAT: Pilih pasien → Input tanda vital
  - Tekanan darah
  - Detak jantung
  - Suhu tubuh
  - Berat & tinggi badan
  - Saturasi oksigen
  - Golongan darah
  ↓
Klik "Simpan & Kirim ke Dokter"
  ↓
Status antrian: completed (nurse)
  ↓
DOKTER: Lihat pasien di antrian
  ↓
Klik "Mulai Pemeriksaan"
  ↓
Lihat tanda vital dari perawat
  ↓
Input:
  - Keluhan
  - Diagnosis
  - Resep obat (jika perlu)
  - Catatan tambahan
  ↓
Klik "Simpan Rekam Medis"
  ↓
Status: Selesai Pemeriksaan
```

### 3. Alur Resep Obat

```
Dokter buat resep → Tersimpan di sistem
  ↓
APOTEKER: Lihat antrian resep baru
  ↓
Cek ketersediaan obat
  ↓
Verifikasi resep
  ↓
Status: Siap diambil
  ↓
PASIEN: Lihat resep di dashboard
  ↓
Ambil obat di apotek
```

### 4. Alur Pembayaran

```
Selesai pemeriksaan
  ↓
ADMIN KASIR: Buat tagihan pembayaran
  - Input total biaya
  - Pilih metode (Tunai/BPJS)
  - Jika BPJS: input nomor kartu & jenis
  ↓
Generate kode pembayaran
  ↓
PASIEN (2 opsi):

OPSI 1 - Bayar Langsung di Kasir:
  Admin langsung verifikasi → Status: Lunas

OPSI 2 - Transfer/BPJS:
  Pasien upload bukti pembayaran
    ↓
  ADMIN: Verifikasi bukti
    ↓
  Approve → Status: Lunas
```

### 5. Alur Monitoring (Owner)

```
OWNER Login
  ↓
Dashboard menampilkan real-time:
  - Pendapatan hari ini
  - Pasien baru hari ini
  - Janji temu hari ini
  - Jumlah staf aktif
  ↓
Lihat Grafik:
  - Pendapatan 7 hari terakhir
  - Kunjungan pasien 7 hari terakhir
  ↓
Menu Laporan Keuangan:
  - Pilih rentang tanggal
  - Lihat breakdown pembayaran
  - Chart metode pembayaran
  - Chart BPJS vs Tunai
  - Tabel detail harian
  ↓
Menu Aktivitas Klinik:
  - Log semua aktivitas user
  - Filter berdasarkan tanggal & role
  - Lihat detail aksi yang dilakukan
```

---

## 📁 Struktur Proyek

```
klinik-sentosa/
├── backend/
│   ├── database.js              # Koneksi database SQLite
│   ├── server.js                # Express server
│   ├── klinik_sentosa.db        # Database file (auto-generated)
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   └── authMiddleware.js    # Role-based auth
│   ├── routes/
│   │   ├── admin.js             # Admin & owner endpoints
│   │   ├── appointments.js      # Janji temu endpoints
│   │   ├── auth.js              # Login, register, password
│   │   ├── doctors.js           # Dokter endpoints
│   │   ├── medicines.js         # Obat endpoints
│   │   ├── nurses.js            # Perawat endpoints
│   │   ├── patients.js          # Pasien endpoints
│   │   ├── payments.js          # Pembayaran endpoints
│   │   ├── pharmacy.js          # Apotek endpoints
│   │   ├── prescriptions.js     # Resep endpoints
│   │   ├── queue.js             # Antrian endpoints
│   │   └── users.js             # User management
│   ├── utils/
│   │   └── auditLogger.js       # Logging aktivitas
│   └── package.json
│
├── klinik-sentosa-react/
│   ├── src/
│   │   ├── components/          # Komponen reusable
│   │   │   ├── CountUp.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ScrollReveal.jsx
│   │   │   └── Toast.jsx
│   │   ├── layouts/             # Layout per role
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── DoctorLayout.jsx
│   │   │   ├── NurseLayout.jsx
│   │   │   ├── OwnerLayout.jsx
│   │   │   ├── PatientLayout.jsx
│   │   │   └── PharmacistLayout.jsx
│   │   ├── pages/               # Halaman per role
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   ├── nurse/
│   │   │   ├── owner/
│   │   │   ├── patient/
│   │   │   ├── pharmacist/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md                    # File ini
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request reset password
- `POST /api/auth/reset-password` - Reset password

### Admin & Owner
- `GET /api/admin/dashboard-stats` - Statistik dashboard
- `GET /api/admin/reports/daily` - Laporan harian
- `GET /api/admin/reports/revenue-chart` - Data grafik pendapatan
- `GET /api/admin/reports/visits-chart` - Data grafik kunjungan
- `GET /api/admin/reports/financial` - Laporan keuangan
- `GET /api/admin/activity-logs` - Log aktivitas
- `GET /api/admin/users` - Daftar user
- `POST /api/admin/users` - Tambah user

### Appointments
- `GET /api/appointments` - Daftar janji temu
- `POST /api/appointments` - Buat janji temu
- `PUT /api/appointments/:id` - Update janji temu
- `DELETE /api/appointments/:id` - Hapus janji temu

### Queue
- `GET /api/queue` - Daftar antrian
- `POST /api/queue` - Ambil nomor antrian
- `PUT /api/queue/:id` - Update status antrian

### Doctors
- `GET /api/doctors/dashboard/stats` - Statistik dokter
- `GET /api/doctors/queue/current` - Antrian pasien
- `POST /api/doctors/medical-records` - Buat rekam medis
- `GET /api/doctors/patients/:id/history` - Riwayat pasien

### Nurses
- `GET /api/nurses/dashboard/stats` - Statistik perawat
- `GET /api/nurses/queue/pending` - Antrian pending
- `POST /api/nurses/vital-signs` - Simpan tanda vital
- `DELETE /api/nurses/queue/:id` - Tolak antrian

### Patients
- `GET /api/patients/dashboard/stats` - Statistik pasien
- `GET /api/patients/medical-records` - Rekam medis
- `GET /api/patients/prescriptions` - Resep obat
- `GET /api/patients/payments` - Riwayat pembayaran

### Payments
- `GET /api/payments` - Daftar pembayaran
- `POST /api/payments` - Buat pembayaran
- `POST /api/payments/upload` - Upload bukti
- `PUT /api/payments/:id/verify` - Verifikasi pembayaran

### Pharmacy
- `GET /api/pharmacy/dashboard/stats` - Statistik apotek
- `GET /api/pharmacy/prescriptions/pending` - Resep pending
- `POST /api/pharmacy/verify/:id` - Verifikasi resep
- `GET /api/medicines` - Daftar obat
- `POST /api/medicines` - Tambah obat

---

## 💻 Penggunaan

### Menjalankan Aplikasi

1. **Start Backend Server:**
```bash
cd backend
node server.js
```

2. **Start Frontend Development Server:**
```bash
cd klinik-sentosa-react
npm run dev
```

3. **Akses Aplikasi:**
- Buka browser: `http://localhost:5173`
- Login dengan salah satu akun di atas

### Build untuk Production

```bash
cd klinik-sentosa-react
npm run build
```

File hasil build ada di folder `dist/`

---

## 🚀 Push ke GitHub

### Step 1: Buat .gitignore (sudah dibuat otomatis)

File `.gitignore` sudah dibuat dengan konfigurasi lengkap.

### Step 2: Initialize Git (jika belum)

```bash
cd "C:\Klinik Sentosa Final Project"
git init
```

### Step 3: Add Remote Repository

Ganti `your-username` dan `repository-name` dengan milik Anda:

```bash
git remote add origin https://github.com/your-username/repository-name.git
```

### Step 4: Add & Commit

```bash
git add .
git commit -m "Initial commit - Sistem Informasi Klinik Sentosa"
```

### Step 5: Push ke GitHub

```bash
git branch -M main
git push -u origin main
```

### Jika ada error authentication:

1. **Generate Personal Access Token** di GitHub:
   - Settings → Developer settings → Personal access tokens → Generate new token
   - Pilih scope: `repo`
   - Copy token

2. **Push dengan token:**
```bash
git push https://YOUR_TOKEN@github.com/your-username/repository-name.git main
```

---

## 📊 Database Schema

### Tabel Utama:
- `users` - Data user (semua role)
- `patients` - Data lengkap pasien
- `doctors` - Data dokter
- `nurses` - Data perawat
- `appointments` - Janji temu
- `queues` - Antrian
- `medical_records` - Rekam medis
- `vital_signs` - Tanda vital
- `prescriptions` - Resep obat
- `prescription_items` - Detail resep
- `medicines` - Obat
- `payments` - Pembayaran
- `payment_proofs` - Bukti pembayaran
- `audit_logs` - Log aktivitas

---

## 🐛 Troubleshooting

### Backend tidak bisa start
- Pastikan port 3000 tidak digunakan aplikasi lain
- Jalankan: `taskkill /F /IM node.exe` untuk kill semua proses node
- Coba lagi: `node server.js`

### Frontend tidak bisa start
- Pastikan port 5173 tidak digunakan
- Hapus `node_modules` dan install ulang: `npm install`

### Database error
- Hapus file `klinik_sentosa.db`
- Restart backend server (database akan dibuat otomatis)

---

## 👨‍💻 Developer

**Nama**: SidneyAJ  
**Project**: Final Project SAD (System Analysis and Design)  
**Tahun**: 2024

---

## 📄 License

This project is for educational purposes only.

---

## 📞 Kontak & Support

Untuk pertanyaan atau issues, silakan hubungi developer atau buat issue di GitHub repository.

---

**Terima kasih telah menggunakan Sistem Informasi Klinik Sentosa! 🏥**
