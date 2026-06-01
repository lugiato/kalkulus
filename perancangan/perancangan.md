# WEBSITE PEMBELAJARAN ALGORITMA DIJKSTRA
## Studi Kasus Penentuan Rute Terpendek Distribusi Logistik PT X

---

# 1. Deskripsi Project

Website pembelajaran interaktif yang bertujuan membantu mahasiswa memahami Algoritma Dijkstra menggunakan studi kasus distribusi logistik dari PT X Bandung menuju Gudang Jakarta Timur.

Website menampilkan proses pencarian lintasan terpendek secara visual dan langkah demi langkah sehingga pengguna dapat memahami bagaimana algoritma bekerja dari node awal hingga node tujuan.

---

# 2. Tujuan Project

- Memahami konsep Algoritma Dijkstra.
- Memahami representasi graf berbobot.
- Memvisualisasikan proses pencarian lintasan terpendek.
- Menampilkan proses relaksasi node.
- Menampilkan perubahan nilai setiap iterasi.
- Menampilkan jalur terpendek hasil perhitungan.
- Menjadi media pembelajaran interaktif.

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
project-dijkstra-logistik/

│
├── index.html
│
├── pages/
│   ├── materi.html
│   ├── graf.html
│   ├── simulasi.html
│   └── hasil.html
│
├── css/
│   ├── style.css
│   ├── materi.css
│   ├── graf.css
│   ├── simulasi.css
│   └── hasil.css
│
├── js/
│   ├── data-graph.js
│   ├── dijkstra.js
│   ├── graph-visualization.js
│   ├── main.js
│   └── simulation.js
│
├── asset/
│   ├── images/
│   └── icons/
│
└── docs/
```

---

# 5. Mapping Node

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

# 6. Data Graf

```javascript
const graph = {
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

# 7. Halaman Website

## Halaman Beranda (index.html)

Berisi:

- Judul Website
- Deskripsi Singkat Algoritma Dijkstra
- Tujuan Pembelajaran
- Tombol Mulai Pembelajaran

---

## Halaman Materi (materi.html)

Berisi:

- Pengertian Graf
- Pengertian Node
- Pengertian Edge
- Pengertian Bobot
- Pengertian Algoritma Dijkstra
- Cara Kerja Algoritma Dijkstra

---

## Halaman Graf (graf.html)

Berisi:

- Visualisasi Graf PT X
- Daftar Node
- Daftar Bobot Antar Node

---

## Halaman Simulasi (simulasi.html)

Berisi:

- Visualisasi Graf Interaktif
- Status Node
- Panel Perhitungan
- Riwayat Perubahan Nilai
- Tombol Kontrol Simulasi

---

## Halaman Hasil (hasil.html)

Berisi:

- Jalur Terpendek
- Total Jarak
- Ringkasan Proses

---

# 8. Aturan Warna Node

| Warna | Keterangan |
|--------|------------|
| Abu-abu | Belum dikunjungi |
| Kuning | Sedang diproses |
| Hijau | Nilai permanen |
| Merah | Jalur terpendek akhir |

---

# 9. Aturan Nilai

## Nilai Permanen

Nilai yang sudah dipilih sebagai nilai minimum diberi tanda:

```text
*
```

Contoh:

```text
0 = 0*
1 = 27.5*
3 = 45.8*
```

## Nilai Sementara

Nilai yang masih dapat berubah tidak diberi tanda.

Contoh:

```text
2 = 47.5
4 = 90.8
5 = 125.4
```

---

# 10. Simulasi Step-by-Step

## Iterasi 0

```text
Node Aktif : 0

0 = 0*

1 = 27.5
2 = ∞
3 = ∞
4 = ∞
5 = ∞
6 = ∞
7 = ∞
8 = ∞
9 = ∞
```

## Iterasi 1

```text
Node Aktif : 1

0 = 0*
1 = 27.5*

2 = 47.5
3 = 45.8
4 = ∞
5 = ∞
6 = ∞
7 = ∞
8 = ∞
9 = ∞
```

## Iterasi 2

```text
Node Aktif : 3

0 = 0*
1 = 27.5*
3 = 45.8*

2 = 47.5
4 = 79.5
5 = 125.4
6 = ∞
7 = ∞
8 = ∞
9 = ∞
```

## Iterasi 3

```text
Node Aktif : 2

0 = 0*
1 = 27.5*
3 = 45.8*
2 = 47.5*

4 = 79.5
5 = 125.4
6 = ∞
7 = ∞
8 = ∞
9 = ∞
```

## Iterasi 4

```text
Node Aktif : 4

0 = 0*
1 = 27.5*
3 = 45.8*
2 = 47.5*
4 = 79.5*

5 = 125.4
6 = 108.5
7 = 155.5
8 = ∞
9 = ∞
```

## Iterasi 5

```text
Node Aktif : 6

0 = 0*
1 = 27.5*
3 = 45.8*
2 = 47.5*
4 = 79.5*
6 = 108.5*

5 = 125.4
7 = 155.5
8 = 148.5
9 = ∞
```

## Iterasi 6

```text
Node Aktif : 5

0 = 0*
1 = 27.5*
3 = 45.8*
2 = 47.5*
4 = 79.5*
6 = 108.5*
5 = 125.4*

7 = 155.5
8 = 148.5
9 = ∞
```

## Iterasi 7

```text
Node Aktif : 8

0 = 0*
1 = 27.5*
3 = 45.8*
2 = 47.5*
4 = 79.5*
6 = 108.5*
5 = 125.4*
8 = 148.5*

7 = 155.5
9 = 168.0
```

## Iterasi 8

```text
Node Aktif : 7

0 = 0*
1 = 27.5*
3 = 45.8*
2 = 47.5*
4 = 79.5*
6 = 108.5*
5 = 125.4*
8 = 148.5*
7 = 155.5*

9 = 168.0
```

## Iterasi 9

```text
Node Aktif : 9

0 = 0*
1 = 27.5*
3 = 45.8*
2 = 47.5*
4 = 79.5*
6 = 108.5*
5 = 125.4*
8 = 148.5*
7 = 155.5*
9 = 168.0*
```

---

# 11. Hasil Simulasi

## Jalur Terpendek

Jalur terpendek dari PT X Bandung ke Gudang Jakarta Timur adalah:

```text
0 -> 1 -> 2 -> 4 -> 6 -> 8 -> 9
```

## Total Jarak

```text
168.0 km
```

## Kesimpulan

- Algoritma Dijkstra menemukan jalur terpendek melalui node 1, 2, 4, 6, dan 8.
- Proses pencarian memperbarui nilai sementara setiap iterasi hingga nilai permanen ditetapkan.
- Visualisasi membantu memahami relaksasi node dan pilihan jalur terbaik.


---

# 12. Riwayat Perubahan Node

## Node 4

```text
∞
↓
90.8
↓
79.5
```

## Node 8

```text
∞
↓
148.5
```

## Node 9

```text
∞
↓
168
```

---

# 13. Tombol Kontrol Simulasi

```text
[ Mulai Simulasi ]

[ Iterasi Berikutnya ]

[ Iterasi Sebelumnya ]

[ Jalankan Otomatis ]

[ Reset ]
```

---

# 14. Keunggulan Website

1. Menampilkan visualisasi graf interaktif.
2. Menampilkan simulasi Dijkstra langkah demi langkah.
3. Menampilkan proses relaksasi secara visual.
4. Menampilkan nilai permanen dan nilai sementara.
5. Menampilkan riwayat perubahan nilai node.
6. Cocok digunakan sebagai media pembelajaran.
7. Membantu memahami Algoritma Dijkstra secara interaktif.
8. Menjadi media praktis untuk belajar algoritma graf.
9. Membantu pengguna mengikuti proses pemilihan jalur terpendek secara sistematis.