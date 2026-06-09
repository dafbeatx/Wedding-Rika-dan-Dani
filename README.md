# Undangan Digital Dani & Rika 🌸

Website undangan pernikahan digital untuk pasangan **Dani & Rika** yang modern, bersih, minimalis, dan elegan. Dibangun menggunakan **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, dan **Supabase** sebagai sistem database realtime untuk buku tamu (Guestbook).

## 🌟 Fitur Utama

1. **Two-Layer Navigation**:
   - **Layer 1** (`/invitation/[slug]`): Halaman Personalized Cover berisi nama tamu secara dinamis & tombol interaktif "Buka Undangan".
   - **Layer 2** (`/invitation/[slug]/buka`): Undangan lengkap berisi countdown, foto prewedding, informasi detail akad & resepsi, integrasi Google Maps, galeri foto interaktif, amplop digital, dan realtime rsvp/guestbook.
2. **Dynamic Route & Personalization**: Nama tamu diekstrak otomatis dari dynamic slug URL (misal: `/invitation/ahmad-rizki-dan-keluarga` -> Ahmad Rizki & Keluarga).
3. **Realtime Guestbook**: Ucapan dan status konfirmasi kehadiran ter-update secara otomatis secara realtime tanpa reload halaman menggunakan Supabase Postgres replication.
4. **Admin Panel** (`/admin`): Form generator untuk menambahkan nama tamu baru secara instan, menghasilkan slug yang bersih, menyalin link undangan, dan langsung mengirim via WhatsApp dengan teks undangan siap pakai.
5. **Autoplay Music & Audio Control**: Background music romantis (instrumental piano) menyala otomatis begitu undangan dibuka, dilengkapi tombol putar/jeda melayang.
6. **Amplop Digital (Digital Envelope)**: Salin nomor rekening Bank Mandiri (Dani) atau DANA (Rika) sekali klik dengan toast notifikasi instan.

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 15.x (App Router)
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS v4.x
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Database Backend**: Supabase (`@supabase/supabase-js`)

---

## ⚙️ Persiapan & Instalasi

### 1. Kloning Project & Install Dependensi

Buka terminal di direktori project dan jalankan:
```bash
npm install
```

### 2. Konfigurasi Environment Variables

Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu isi kredensial Supabase Anda di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<id-proyek-anda>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-anda>
```
*Catatan: Aplikasi memiliki fallback otomatis ke LocalStorage jika kunci Supabase dikosongkan, sehingga Anda masih dapat menguji seluruh alur pendaftaran tamu dan pembuatan link di localhost.*

### 3. Setup Database Supabase

Salin seluruh isi berkas `supabase-schema.sql` yang ada di root direktori project, lalu tempel (paste) ke dalam **SQL Editor** pada Dashboard Supabase Anda, kemudian klik **Run**.

Untuk mengaktifkan realtime pada buku tamu:
1. Buka Dashboard Supabase.
2. Buka menu **Database** > **Replication**.
3. Di bagian **Source**, pilih tabel **ucapan** dan centang untuk mengaktifkan realtime replication.

---

## 🚀 Menjalankan Project Secara Lokal

Jalankan perintah berikut di terminal Anda:
```bash
npm run dev
```
Buka browser Anda dan akses:
- **Halaman Utama / Demo**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel Generator**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Halaman Personalisasi Tamu**: [http://localhost:3000/invitation/ahmad-rizki-dan-keluarga](http://localhost:3000/invitation/ahmad-rizki-dan-keluarga)

---

## 📁 Struktur Folder

```
app/
├── admin/
│   └── page.tsx                     # Generator Link & List Tamu
├── invitation/
│   └── [slug]/
│       ├── page.tsx                 # Layer 1 - Cover Personalized Page
│       └── buka/
│           └── page.tsx             # Layer 2 - Undangan Lengkap & Detail
├── layout.tsx                       # Setup font & metadata SEO
├── page.tsx                         # Landing Page Fallback (Tamu Umum)
├── globals.css                      # Konfigurasi Tailwind v4, glassmorphism & animasi
components/
├── audio-player.tsx                 # Floating music player & volume control
├── copy-button.tsx                  # Salin rekening dengan toast feedback
├── countdown.tsx                    # Countdown timer ke 14 Juni 2026
├── gallery.tsx                      # Masonry photo grid & lightbox viewer
└── guestbook.tsx                    # Form RSVP & ucapan dengan Supabase Realtime
lib/
├── supabase/
│   └── client.ts                    # Inisialisasi koneksi Supabase client
└── utils.ts                         # Helper slug, decode, & date formatter
```

---

## 🌸 Data Pasangan & Acara

- **Mempelai Pria**: Dani Ramdani (Dani)
- **Mempelai Wanita**: Rika Rahmawati (Rika)
- **Tanggal Acara**: Ahad, 14 Juni 2026 (10.00 WIB - Selesai)
- **Lokasi Pernikahan**: Kp. Tapos RT.02 RW.08, Desa Pasarean, Kec. Pamijahan, Kab. Bogor
