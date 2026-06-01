/**
 * data-graph.js
 * Data representasi graf untuk studi kasus penentuan rute terpendek PT X.
 * Menggunakan variabel global agar mudah diakses oleh modul JS lainnya.
 */

window.GRAPH_DATA = {
  // Hubungan antar node (Adjacency List) beserta bobot (jarak dalam km)
  graph: {
    0: { 1: 27.5 },
    1: { 2: 20, 3: 18.3 },
    2: { 4: 32 },
    3: { 4: 45, 5: 79.6 },
    4: { 6: 29, 7: 76 },
    5: { 7: 53.8 },
    6: { 8: 40 },
    7: { 9: 37 },
    8: { 9: 19.5 }
  },

  // Pemetaan ID Node ke Nama Lokasi
  nodeNames: {
    0: "PT X Bandung",
    1: "Padalarang",
    2: "Cikalong",
    3: "Cipatat",
    4: "Purwakarta",
    5: "Jonggol",
    6: "Karawang",
    7: "Cileungsi",
    8: "Bekasi",
    9: "Gudang Jakarta Timur"
  },

  // Koordinat relatif untuk penggambaran graf di kanvas SVG (800x480)
  nodePositions: {
    0: { x: 730, y: 380 }, // PT X Bandung (Kanan Bawah)
    1: { x: 620, y: 310 }, // Padalarang
    2: { x: 500, y: 190 }, // Cikalong
    3: { x: 530, y: 410 }, // Cipatat
    4: { x: 390, y: 220 }, // Purwakarta
    5: { x: 380, y: 430 }, // Jonggol
    6: { x: 260, y: 140 }, // Karawang
    7: { x: 230, y: 370 }, // Cileungsi
    8: { x: 150, y: 190 }, // Bekasi
    9: { x: 70, y: 270 }   // Gudang Jakarta Timur (Kiri Tengah)
  }
};
