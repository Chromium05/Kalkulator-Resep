# Kalkulator-Resep
Aplikasi web sederhana untuk menghitung biaya resep masakan dalam mata uang Rupiah (IDR). Aplikasi ini membantu pengguna mengelola daftar bahan makanan beserta harganya, membuat resep dengan perhitungan biaya otomatis, dan menyimpan prosedur memasak. Cocok untuk ibu rumah tangga, chef pemula, atau siapa saja yang ingin mengontrol budget dapur.

## Project Overview

Tujuan proyek ini adalah untuk menyediakan solusi praktis bagi ibu rumah tangga, chef pemula, atau siapa saja yang ingin merencanakan anggaran makanan dengan lebih efisien. Aplikasi ini dirancang untuk:

* **Transparansi Biaya:** Memberikan perhitungan yang jelas dan rinci tentang biaya setiap resep
* **Perencanaan Anggaran:** Membantu pengguna merencanakan budget makanan harian atau mingguan
* **Kemudahan Penggunaan:** Interface yang sederhana dan intuitif dalam bahasa Indonesia
* **Aksesibilitas:** Dapat digunakan di berbagai perangkat (desktop, tablet, mobile)
* **Penyimpanan Lokal:** Data tersimpan di browser pengguna untuk privasi maksimal

## Technologies Used

### Frontend Technologies

* **HTML5:** Struktur markup semantik untuk accessibility yang baik
* **CSS3 + Bootstrap 5:** Framework CSS modern untuk desain responsif dan konsisten
* **Vanilla JavaScript (ES6+):** Logic aplikasi tanpa dependency framework berat
* **LocalStorage API:** Penyimpanan data di browser untuk persistensi offline

### Development Tools

* **IBM Granite 3.3-8b-instruct:** AI code generation untuk mempercepat development
* **Bootstrap CDN:** Delivery CSS/JS framework yang reliable
* **Modern Browser APIs:** `Intl.NumberFormat` untuk formatting mata uang Rupiah

### Alasan Pemilihan Teknologi

Teknologi dipilih berdasarkan prinsip **simplicity** dan **efficiency**:

* Vanilla JavaScript menghindari overhead framework yang tidak diperlukan
* Bootstrap 5 memberikan komponen UI yang konsisten dan mobile-first
* LocalStorage memastikan data pengguna tetap private dan aplikasi bekerja offline
* IBM Granite membantu menghasilkan kode berkualitas dengan cepat sesuai deadline proyek

## Features

### Fitur Utama

#### Manajemen Bahan

* ✅ Tambah, edit, dan hapus bahan dengan harga dalam Rupiah
* ✅ Berbagai satuan: kilogram, liter, gram, buah, ikat, dll
* ✅ Validasi input dengan feedback yang jelas
* ✅ Konfirmasi penghapusan untuk mencegah kesalahan

#### Pembuat Resep

* ✅ Pilih bahan dari daftar yang tersimpan
* ✅ Tentukan jumlah penggunaan per bahan
* ✅ Perhitungan biaya real-time saat menambah/mengurangi bahan
* ✅ Input jumlah porsi untuk menghitung biaya per porsi
* ✅ Area teks untuk prosedur memasak (opsional)

#### Manajemen Resep

* ✅ Simpan resep dengan perhitungan biaya otomatis
* ✅ Daftar resep tersimpan dengan informasi ringkas
* ✅ Modal detail resep dengan breakdown biaya per bahan
* ✅ Fungsi pencarian resep
* ✅ Hapus resep dengan konfirmasi

### Fitur Tambahan

* ✅ Formatting mata uang Rupiah Indonesia yang tepat
* ✅ Design responsif untuk mobile dan desktop
* ✅ Validasi form dengan pesan error dalam bahasa Indonesia
* ✅ Empty state yang informatif
* ✅ Perlindungan terhadap penghapusan bahan yang digunakan dalam resep

## Logika Aplikasi

Aplikasi menggunakan sistem perhitungan:
**Biaya Bahan = (Harga Bahan / Jumlah Tersedia) × Jumlah Digunakan**

Contoh:

> Jika beras Rp 12.000/kg dan digunakan 0.6 kg, maka biayanya = (12.000/1) × 0.6 = Rp 7.200

## AI Support Explanation

### Penggunaan IBM Granite dalam Development

#### 1. Code Generation

* Struktur HTML: Granite membantu menghasilkan markup Bootstrap yang konsisten
* JavaScript Logic: Implementasi fungsi-fungsi kompleks seperti perhitungan biaya dan manajemen state
* CSS Styling: Optimasi tampilan responsif dan user experience

#### 2. Problem Solving

* Bug Fixing: Identifikasi dan perbaikan masalah seperti scope variable dan logic error
* Optimization: Peningkatan performa dan clean code practices
* Validation: Implementasi form validation yang robust

#### 3. Development Acceleration

Dengan bantuan Granite, development time dipercepat dari estimasi 5-6 hari menjadi 3.5 hari:

* **Day 1:** Struktur dasar dan manajemen bahan
* **Day 2:** Logic pembuatan resep dan perhitungan
* **Day 3:** Polish UI/UX dan testing
* **Day 4:** Deployment dan dokumentasi

#### 4. Code Quality Assurance

Granite membantu mengidentifikasi potential issues seperti:

* Variable scope problems
* Memory leaks dalam event listeners
* Edge cases dalam perhitungan
* Cross-browser compatibility

### Dampak Nyata Penggunaan AI

* **Produktivitas:** 40% lebih cepat dari coding manual
* **Kualitas:** Fewer bugs dan struktur kode lebih konsisten
* **Learning:** Exposure ke best practices dan modern JavaScript patterns
* **Focus:** Lebih banyak waktu untuk UX design dan business logic

## Installation & Usage

### Prerequisites

* Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
* Tidak memerlukan server backend atau database

### Quick Start

#### Clone atau Download

```bash
git clone [repository-url]
cd recipe-cost-calculator
```

#### Buka di Browser

```bash
# Buka file index.html di browser
open index.html
# atau akses menggunakan link berikut
https://chromium05.github.io/Kalkulator-Resep/
```

#### Mulai Menggunakan

* Tambahkan bahan-bahan dengan harga
* Buat resep pertama Anda
* Lihat perhitungan biaya otomatis

## File Structure

```
recipe-cost-calculator/
├── recipeCalculator.html    # Main HTML file
├── ingredientScript.js      # Ingredient management logic
├── recipeScript.js          # Recipe creation & management logic
├── style.css                # Custom styling
└── README.md                # Documentation
```

## Demo & Testing

### Test Cases Tersedia

Aplikasi telah diuji dengan resep-resep Indonesia populer:

* Nasi Goreng Kampung (4 porsi) - \~Rp 18.500
* Mie Ayam (2 porsi) - \~Rp 20.750
* Gado-Gado (3 porsi) - \~Rp 31.300
* Soto Ayam (6 porsi) - \~Rp 56.400

### Browser Compatibility

* ✅ Chrome 90+ (Recommended)
* ✅ Firefox 88+
* ✅ Safari 14+
* ✅ Edge 90+
* ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Kontribusi sangat welcome! Beberapa area yang bisa dikembangkan:

* Export/Import: Fitur backup data ke file JSON
* Recipe Sharing: QR code atau link sharing
* Nutrition Calculator: Integrasi dengan data nutrisi
* Shopping List: Generate daftar belanja dari resep
* Dark Mode: Theme switching capability

---

Dibuat dengan ❤️ untuk komunitas kuliner Indonesia
