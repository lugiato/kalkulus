/**
 * data-graph.js
 * Data representasi beberapa graf simulasi untuk pembelajaran Algoritma Dijkstra.
 * Menggunakan variabel global agar mudah diakses oleh modul JS lainnya.
 */

window.GRAPH_DATA = {
  storageKey: "dijkstra-current-graph",

  currentGraphKey: localStorage.getItem("dijkstra-current-graph") || "logistik",

  graphs: {
    logistik: {
      id: "logistik",
      title: "Simulasi 1 - Logistik PT X",
      description: "Studi kasus distribusi logistik PT X Bandung menuju Gudang Jakarta Timur.",
      startNode: 0,
      endNode: 9,
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
      nodePositions: {
        0: { x: 730, y: 380 },
        1: { x: 620, y: 310 },
        2: { x: 500, y: 190 },
        3: { x: 530, y: 410 },
        4: { x: 390, y: 220 },
        5: { x: 380, y: 430 },
        6: { x: 260, y: 140 },
        7: { x: 230, y: 370 },
        8: { x: 150, y: 190 },
        9: { x: 70, y: 270 }
      }
    },

    sederhana: {
      id: "sederhana",
      title: "Simulasi 2 - Graf Sederhana",
      description: "Graf sederhana untuk memahami dasar kerja Algoritma Dijkstra.",
      startNode: 0,
      endNode: 5,
      graph: {
        0: { 1: 4, 2: 3 },
        1: { 0: 4, 3: 3, 4: 2 },
        2: { 0: 3, 4: 5 },
        3: { 1: 3, 5: 2 },
        4: { 1: 2, 2: 5, 5: 2 },
        5: { 3: 2, 4: 2 }
      },
      nodeNames: {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F"
      },
      nodePositions: {
        0: { x: 120, y: 240 },
        1: { x: 300, y: 120 },
        2: { x: 300, y: 360 },
        3: { x: 520, y: 120 },
        4: { x: 520, y: 360 },
        5: { x: 700, y: 240 }
      }
    },

    kompleks: {
      id: "kompleks",
      title: "Simulasi 3 - Graf Kompleks",
      description: "Graf yang lebih kompleks untuk memperlihatkan proses relaksasi pada banyak node.",
      startNode: 0,
      endNode: 6,
      graph: {
        0: { 1: 3, 2: 2, 4: 8 },
        1: { 0: 3, 2: 5, 3: 4 },
        2: { 0: 2, 1: 5, 3: 3, 4: 7 },
        3: { 1: 4, 2: 3, 4: 1, 5: 1 },
        4: { 0: 8, 2: 7, 3: 1, 6: 5 },
        5: { 3: 1, 6: 2 },
        6: { 4: 5, 5: 2 }
      },
      nodeNames: {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F",
        6: "G"
      },
      nodePositions: {
        0: { x: 120, y: 240 },
        1: { x: 260, y: 100 },
        2: { x: 260, y: 380 },
        3: { x: 430, y: 140 },
        4: { x: 430, y: 340 },
        5: { x: 620, y: 100 },
        6: { x: 620, y: 380 }
      }
    }
  },

  get currentGraph() {
    return this.graphs[this.currentGraphKey] || this.graphs.logistik;
  },

  setCurrentGraphKey: function(key) {
    if (!this.graphs[key]) return;
    this.currentGraphKey = key;
    localStorage.setItem(this.storageKey, key);
  }
};
