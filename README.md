# Frontend - Inventory Management Web App

Aplikasi web untuk mengelola inventaris produk, dibangun dengan React, TypeScript, dan Tailwind CSS. Aplikasi ini terintegrasi dengan API backend Laravel untuk operasi CRUD produk.

## Persyaratan Sistem

- Node.js versi 18 atau yang lebih baru
- npm atau yarn untuk manajemen paket

## Cara Menjalankan Frontend

1. Pastikan backend API sudah berjalan di `http://localhost:8000` (lihat README di folder backend untuk instruksi setup)
2. Masuk ke folder frontend: `cd frontend`
3. Install dependencies: `npm install`
4. Jalankan development server: `npm run dev`

Aplikasi web akan berjalan di `http://localhost:5173` (port default Vite).

## Fitur Utama

- **Autentikasi**: Registrasi user baru dan login
- **Dashboard**: Halaman utama setelah login
- **Manajemen Produk**:
  - Melihat daftar produk dengan pagination dan search
  - Menambah produk baru
  - Mengedit produk existing
  - Menghapus produk
- **State Management**: Menangani loading state dan pesan error/sukses

## Credentials untuk Testing

Gunakan credentials yang sama dengan yang digunakan di backend API. Anda dapat:

1. Registrasi user baru melalui halaman register aplikasi
2. Atau gunakan contoh credentials berikut untuk testing:
   - Email: test@example.com
   - Password: password123

Pastikan user tersebut sudah terdaftar di backend. Setelah login berhasil, token akan disimpan secara otomatis dan Anda dapat mengakses semua fitur manajemen produk.
