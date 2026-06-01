/**
 * main.js
 * Skrip inisialisasi utama untuk seluruh halaman web.
 * Mengatur perutean fungsi berdasarkan halaman yang sedang dibuka.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Deteksi Halaman Aktif berdasarkan keberadaan elemen unik
  
  // Halaman Simulasi
  if (document.getElementById("simulation-svg")) {
    if (window.SIMULATOR) {
      window.SIMULATOR.init();
    }
  }

  // Halaman Graf Statis
  if (document.getElementById("static-graph-svg")) {
    initStaticGraphPage();
  }

  // Halaman Hasil Akhir Rute
  if (document.getElementById("result-graph-svg")) {
    initResultPage();
  }

  // Animasi Navbar (Aktif Link Highlight)
  highlightActiveNavLink();
});

/**
 * Inisialisasi halaman visualisasi graf statis (graf.html)
 */
function initStaticGraphPage() {
  if (!window.GRAPH_VIS) return;

  // Gambar graf secara statis tanpa status simulasi
  window.GRAPH_VIS.draw("static-graph-svg", null, {
    interactive: true,
    showFinalPath: false,
    onNodeClick: (nodeId) => {
      showNodeDetails(nodeId);
    }
  });

  // Tampilkan detail Node 0 sebagai default
  showNodeDetails(0);
}

/**
 * Menampilkan kartu informasi detail ketika sebuah node diklik di halaman graf.html
 */
function showNodeDetails(nodeId) {
  const name = window.GRAPH_DATA.nodeNames[nodeId];
  const graph = window.GRAPH_DATA.graph;

  const nodeNameEl = document.getElementById("selected-node-name");
  const nodeConnectionsEl = document.getElementById("selected-node-connections");

  if (nodeNameEl) {
    nodeNameEl.textContent = `${nodeId} - ${name}`;
  }

  if (nodeConnectionsEl) {
    nodeConnectionsEl.innerHTML = "";
    
    // Cari koneksi Keluar (Out-edges)
    const outEdges = graph[nodeId] || {};
    const outKeys = Object.keys(outEdges);

    // Cari koneksi Masuk (In-edges)
    const inEdges = [];
    for (const fromId in graph) {
      if (graph[fromId][nodeId] !== undefined) {
        inEdges.push({ from: fromId, weight: graph[fromId][nodeId] });
      }
    }

    let html = "";

    // Tampilkan informasi relasi logistik
    if (outKeys.length > 0) {
      html += `<h4 class="text-teal-400 mt-2 mb-1"><i class="fas fa-arrow-right"></i> Jalur Keluar (Logistik ke Tujuan):</h4><ul>`;
      outKeys.forEach(toId => {
        const destName = window.GRAPH_DATA.nodeNames[toId];
        html += `<li>Menuju <strong>Node ${toId} (${destName})</strong> - Jarak: <strong>${outEdges[toId]} km</strong></li>`;
      });
      html += `</ul>`;
    }

    if (inEdges.length > 0) {
      html += `<h4 class="text-rose-400 mt-4 mb-1"><i class="fas fa-arrow-left"></i> Jalur Masuk (Suplai Logistik):</h4><ul>`;
      inEdges.forEach(edge => {
        const sourceName = window.GRAPH_DATA.nodeNames[edge.from];
        html += `<li>Dari <strong>Node ${edge.from} (${sourceName})</strong> - Jarak: <strong>${edge.weight} km</strong></li>`;
      });
      html += `</ul>`;
    }

    if (outKeys.length === 0 && inEdges.length === 0) {
      html = `<p class="text-gray-400">Node terisolasi (tidak ada jalur keluar/masuk).</p>`;
    }

    nodeConnectionsEl.innerHTML = html;
  }

  // Sorot secara visual di SVG
  const allGroups = document.querySelectorAll(".node-group");
  allGroups.forEach(g => {
    g.classList.remove("node-selected");
    if (parseInt(g.getAttribute("data-node-id")) === nodeId) {
      g.classList.add("node-selected");
    }
  });
}

/**
 * Inisialisasi halaman ringkasan hasil akhir rute (hasil.html)
 */
function initResultPage() {
  if (!window.GRAPH_VIS) return;

  // Gambar graf dengan highlight rute terpendek akhir (garis merah menyala)
  window.GRAPH_VIS.draw("result-graph-svg", null, {
    interactive: false,
    showFinalPath: true
  });
}

/**
 * Menyorot tautan menu navigasi yang sesuai dengan halaman saat ini
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    // Periksa kecocokan nama file
    if (currentPath.endsWith(href) || 
       (href === "../index.html" && currentPath.endsWith("projek/")) || 
       (href === "index.html" && currentPath.endsWith("index.html"))) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
