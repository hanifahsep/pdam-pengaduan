# 🌊 PT INPAM TEKNO - Sistem Pengaduan PDAM

Aplikasi web corporate untuk PT INPAM TEKNO yang menyediakan layanan pengaduan pelanggan PDAM dengan tampilan yang modern, profesional, dan eye-catching.

## ✨ Fitur

### User (Pelanggan)
- 📝 Registrasi dan Login
- 📋 Form pengaduan dengan upload lampiran
- 📜 Riwayat pengaduan
- 🔔 Status pengaduan (Baru, Proses, Selesai)
- 💬 Catatan dari admin pada setiap pengaduan

### Admin
- 📊 Dashboard dengan statistik lengkap
- 👥 Manajemen pengaduan
- ✏️ Update status pengaduan
- 💬 Tambah catatan untuk pelanggan
- 🗑️ Hapus pengaduan

## 🎨 Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Database**: SQLite
- **File Upload**: Multer
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs

## 📦 Instalasi

### 1. Install Dependencies

```bash
cd pdam-pengaduan
npm install
```

### 2. Jalankan Server

```bash
npm start
```

Atau untuk development dengan auto-reload:

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

## 👤 Akun Default

### Admin
- **Username**: admin
- **Password**: admin123

### User (Buat akun baru melalui halaman register)

## 📁 Struktur Project

```
pdam-pengaduan/
├── backend/
│   ├── server.js              # Main server file
│   ├── database.js            # Database setup & schema
│   ├── routes/
│   │   ├── auth.js            # Login & Register
│   │   ├── complaints.js      # User complaints
│   │   └── admin.js           # Admin management
│   └── middleware/
│       └── auth.js            # JWT authentication
├── frontend/
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   ├── register.html          # Register page
│   ├── dashboard.html         # User dashboard
│   ├── admin.html             # Admin dashboard
│   ├── css/
│   │   └── style.css          # All styles
│   └── js/
│       └── auth.js            # Authentication logic
├── uploads/                    # Uploaded files
├── pdam.db                    # SQLite database (auto-created)
└── package.json
```

## 🚀 Cara Menggunakan

### Untuk Pelanggan:

1. Buka browser dan akses `http://localhost:3000`
2. Klik "Register" untuk membuat akun baru
3. Login dengan akun yang telah dibuat
4. Isi form pengaduan dan klik "Kirim"
5. Lihat riwayat pengaduan di bagian "History"

### Untuk Admin:

1. Login dengan akun admin (username: `admin`, password: `admin123`)
2. Lihat statistik pengaduan di dashboard
3. Klik "Detail" pada tabel untuk melihat detail pengaduan
4. Update status dan tambahkan catatan admin
5. Klik "Update Status" untuk menyimpan perubahan

## 🎨 Fitur Eye-Catching

- ✨ Animasi smooth pada semua transisi
- 🌈 Gradient colors yang modern
- 🎯 Hover effects yang interaktif
- 📱 Responsive design
- 🎭 Loading animations
- 💫 Card animations (scale, slide, fade)
- 🎨 Custom scrollbar
- 🌊 Floating background shapes

## 📝 Kategori Pengaduan

1. Tagihan/Rekening
2. Kualitas Air
3. Tekanan Air
4. Kebocoran Pipa
5. Pelayanan
6. Lainnya

## 🔐 Keamanan

- Password di-hash menggunakan bcryptjs
- Authentication menggunakan JWT
- Protected routes untuk admin
- File upload validation
- SQL injection prevention

## 📸 Screenshot

Landing page dengan desain eye-catching, form pengaduan yang user-friendly, dan dashboard admin yang informatif dengan statistik real-time.

## 🛠️ Development

Untuk development, gunakan:

```bash
npm run dev
```

Server akan restart otomatis setiap kali ada perubahan file.

## 📄 License

MIT License - bebas digunakan untuk keperluan apapun.

## 👨‍💻 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**PT INPAM TEKNO** - Solusi Digital untuk Layanan Pengaduan PDAM
Dibuat dengan ❤️ untuk kemudahan pelanggan PDAM Indonesia
