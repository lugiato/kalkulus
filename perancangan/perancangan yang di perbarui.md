# WEBSITE PEMBELAJARAN ALGORITMA DIJKSTRA
## Studi Kasus Distribusi Logistik dan Simulasi Graf Interaktif

---

# 1. Deskripsi Project

Website pembelajaran interaktif yang bertujuan membantu mahasiswa memahami Algoritma Dijkstra menggunakan beberapa studi kasus dan simulasi graf.

Website menampilkan proses pencarian lintasan terpendek secara visual dan langkah demi langkah sehingga pengguna dapat memahami bagaimana algoritma bekerja dari node awal hingga node tujuan.

Selain studi kasus distribusi logistik PT X, website juga menyediakan simulasi graf sederhana dan graf kompleks untuk memperkuat pemahaman pengguna terhadap konsep shortest path.

---

# 2. Tujuan Project

- Memahami konsep Algoritma Dijkstra.
- Memahami representasi graf berbobot.
- Memahami konsep node dan edge.
- Memvisualisasikan proses pencarian lintasan terpendek.
- Memahami proses relaksasi node.
- Menampilkan perubahan nilai pada setiap iterasi.
- Menampilkan jalur terpendek hasil perhitungan.
- Menjadi media pembelajaran interaktif berbasis web.

---

# 3. Teknologi

## Frontend

- HTML5
- CSS3
- JavaScript

## Visualisasi Graf

- SVG
- Canvas HTML5
- Cytoscape.js (Opsional)

---

# 4. Struktur Project

```text
project-dijkstra-learning/

│
├── index.html
│
├── pages/
│   ├── materi.html
│   ├── graf.html
│   ├── simulasi.html
│   ├── hasil.html
│   └── tentang.html
│
├── css/
│   ├── style.css
│   ├── materi.css
│   ├── graf.css
│   ├── simulasi.css
│   ├── hasil.css
│   └── tentang.css
│
├── js/
│   ├── data-graph.js
│   ├── dijkstra.js
│   ├── graph-visualization.js
│   ├── simulation.js
│   └── main.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── graphs/
│
└── docs/
```

---

# 5. Daftar Simulasi

Website menyediakan 3 simulasi pembelajaran:

## Simulasi 1

Studi Kasus Distribusi Logistik PT X

```text
PT X Bandung → Gudang Jakarta Timur
```

## Simulasi 2

Graf Sederhana

```text
A → F
```

Digunakan untuk memahami dasar kerja Algoritma Dijkstra.

## Simulasi 3

Graf Kompleks

```text
A → G
```

Digunakan untuk memahami proses relaksasi pada graf yang lebih besar.

---

# 6. Mapping Node Simulasi 1

```text
0 = PT X Bandung
1 = Padalarang
2 = Cikalong
3 = Cipatat
4 = Purwakarta
5 = Jonggol
6 = Karawang
7 = Cileungsi
8 = Bekasi
9 = Gudang Jakarta Timur
```

---

# 7. Data Graf Simulasi 1

```javascript
const graph1 = {
  0: { 1: 27.5 },

  1: {
    2: 20,
    3: 18.3
  },

  2: {
    4: 32
  },

  3: {
    4: 45,
    5: 79.6
  },

  4: {
    6: 29,
    7: 76
  },

  5: {
    7: 53.8
  },

  6: {
    8: 40
  },

  7: {
    9: 37
  },

  8: {
    9: 19.5
  }
};
```

---

# 8. Data Graf Simulasi 2

## Graf Sederhana

```text
A --4-- B --3-- D --2-- F
 \      |
  3     2
   \    |
     C--5--E--2--F
```

```javascript
const graph2 = {
  A: {
    B: 4,
    C: 3
  },

  B: {
    A: 4,
    D: 3,
    E: 2
  },

  C: {
    A: 3,
    E: 5
  },

  D: {
    B: 3,
    F: 2
  },

  E: {
    B: 2,
    C: 5,
    F: 2
  },

  F: {
    D: 2,
    E: 2
  }
};
```

---

# 9. Data Graf Simulasi 3

## Graf Kompleks

```javascript
const graph3 = {
  A: {
    B: 3,
    C: 2,
    E: 8
  },

  B: {
    A: 3,
    C: 5,
    D: 4
  },

  C: {
    A: 2,
    B: 5,
    D: 3,
    E: 7
  },

  D: {
    B: 4,
    C: 3,
    E: 1,
    F: 1,
    G: 9
  },

  E: {
    A: 8,
    C: 7,
    D: 1,
    G: 4
  },

  F: {
    D: 1,
    G: 3
  },

  G: {
    D: 9,
    E: 4,
    F: 3
  }
};
```

---

# 10. Halaman Website

## Halaman Beranda (index.html)

Berisi:

- Judul Website
- Logo
- Deskripsi Singkat Algoritma Dijkstra
- Tujuan Pembelajaran
- Tombol Mulai Pembelajaran

---

## Halaman Materi (materi.html)

Berisi:

### Materi Graf

- Pengertian Graf
- Jenis Graf
- Node
- Edge
- Bobot

### Materi Dijkstra

- Pengertian Algoritma Dijkstra
- Cara Kerja Dijkstra
- Langkah-langkah Dijkstra
- Contoh Perhitungan

---

## Halaman Graf (graf.html)

Berisi:

- Visualisasi Graf Simulasi 1
- Visualisasi Graf Simulasi 2
- Visualisasi Graf Simulasi 3
- Daftar Node
- Daftar Edge
- Daftar Bobot

---

## Halaman Simulasi (simulasi.html)

Berisi:

### Pilihan Simulasi

```text
[ Simulasi 1 - Logistik PT X ]

[ Simulasi 2 - Graf Sederhana ]

[ Simulasi 3 - Graf Kompleks ]
```

### Area Simulasi

- Visualisasi Graf Interaktif
- Node Aktif
- Tabel Iterasi
- Riwayat Relaksasi
- Nilai Permanen
- Nilai Sementara

### Panel Kontrol

```text
[ Mulai ]

[ Iterasi Berikutnya ]

[ Iterasi Sebelumnya ]

[ Jalankan Otomatis ]

[ Reset ]
```

---

## Halaman Hasil (hasil.html)

Berisi:

- Jalur Terpendek
- Total Bobot
- Ringkasan Iterasi
- Node yang Dilalui
- Visualisasi Jalur Akhir

---

## Halaman Tentang (tentang.html)

Berisi:

- Profil Pengembang
- Tujuan Pembuatan Website
- Referensi
- Daftar Pustaka

---

# 11. Warna Node

| Warna | Keterangan |
|---------|---------|
| Abu-abu | Belum dikunjungi |
| Kuning | Sedang diproses |
| Hijau | Nilai permanen |
| Merah | Jalur terpendek akhir |

---

# 12. Status Node

## Nilai Permanen

Node yang telah dipilih sebagai nilai minimum.

Contoh:

```text
0 = 0*
1 = 27.5*
4 = 79.5*
```

Tanda:

```text
*
```

menunjukkan nilai permanen.

---

## Nilai Sementara

Nilai yang masih dapat berubah.

Contoh:

```text
2 = 47.5
5 = 125.4
8 = 148.5
```

---

# 13. Fitur Simulasi

Website menampilkan:

- Node aktif pada setiap iterasi.
- Proses relaksasi node.
- Perubahan nilai jarak.
- Pemilihan node minimum.
- Riwayat perubahan setiap node.
- Jalur akhir hasil Dijkstra.

---

# 14. Hasil Simulasi 1

## Jalur Terpendek

```text
0 → 1 → 2 → 4 → 6 → 8 → 9
```

## Total Jarak

```text
168.0 km
```

---

# 15. Hasil Simulasi 2

## Jalur Terpendek

```text
A → B → E → F
```

## Total Bobot

```text
8
```

---

# 16. Hasil Simulasi 3

## Jalur Terpendek

```text
A → C → D → F → G
```

## Total Bobot

```text
9
```

---

# 17. Riwayat Perubahan Node

Contoh:

## Node 4

```text
∞
↓
90.8
↓
79.5
```

## Node 9

```text
∞
↓
168
```

---

# 18. Tombol Kontrol

```text
[ Mulai Simulasi ]

[ Iterasi Berikutnya ]

[ Iterasi Sebelumnya ]

[ Jalankan Otomatis ]

[ Reset ]
```

---

# 19. Fitur Tambahan

## Mode Belajar

Menampilkan penjelasan setiap langkah algoritma.

Contoh:

```text
Node minimum yang dipilih adalah node 4
karena memiliki nilai sementara terkecil yaitu 79.5
```

---

## Mode Cepat

Menampilkan hasil akhir tanpa proses iterasi.

---

## Highlight Jalur

Setelah simulasi selesai:

- Jalur terpendek berwarna merah.
- Node jalur akhir berwarna merah.
- Total bobot ditampilkan otomatis.

---

# 20. Keunggulan Website

1. Menampilkan 3 studi kasus berbeda.
2. Menampilkan visualisasi graf interaktif.
3. Menampilkan proses Dijkstra langkah demi langkah.
4. Menampilkan proses relaksasi node.
5. Menampilkan nilai permanen dan sementara.
6. Menampilkan riwayat perubahan nilai.
7. Mendukung mode belajar dan mode cepat.
8. Cocok digunakan sebagai media pembelajaran algoritma graf.
9. Mempermudah mahasiswa memahami shortest path.
10. Dapat digunakan sebagai media presentasi dan demonstrasi Algoritma Dijkstra.
11. Meningkatkan pemahaman visual terhadap proses pencarian rute terpendek.