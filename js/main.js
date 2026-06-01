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
  const graphData = window.GRAPH_DATA.currentGraph;
  const name = graphData.nodeNames[nodeId];
  const graph = graphData.graph;

  const nodeNameEl = document.getElementById("selected-node-name");
  const nodeConnectionsEl = document.getElementById("selected-node-connections");

  if (nodeNameEl) {
    nodeNameEl.textContent = `${nodeId} - ${name}`;
  }

  if (nodeConnectionsEl) {
    nodeConnectionsEl.innerHTML = "";
    
    // Cari koneksi Keluar (Out-edges)
    const graphData = window.GRAPH_DATA.currentGraph;
    const outEdges = graphData.graph[nodeId] || {};
    const outKeys = Object.keys(outEdges);

    // Cari koneksi Masuk (In-edges)
    const inEdges = [];
    for (const fromId in graphData.graph) {
      if (graphData.graph[fromId][nodeId] !== undefined) {
        inEdges.push({ from: fromId, weight: graphData.graph[fromId][nodeId] });
      }
    }

    let html = "";

    // Tampilkan informasi relasi logistik
    if (outKeys.length > 0) {
      html += `<h4 class="text-teal-400 mt-2 mb-1"><i class="fas fa-arrow-right"></i> Jalur Keluar (Logistik ke Tujuan):</h4><ul>`;
      outKeys.forEach(toId => {
        const destName = graphData.nodeNames[toId];
        html += `<li>Menuju <strong>Node ${toId} (${destName})</strong> - Jarak: <strong>${outEdges[toId]} km</strong></li>`;
      });
      html += `</ul>`;
    }

    if (inEdges.length > 0) {
      html += `<h4 class="text-rose-400 mt-4 mb-1"><i class="fas fa-arrow-left"></i> Jalur Masuk (Suplai Logistik):</h4><ul>`;
      inEdges.forEach(edge => {
        const sourceName = graphData.nodeNames[edge.from];
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

  const graphData = window.GRAPH_DATA.currentGraph;
  const simulation = window.DIJKSTRA_SIMULATION;

  window.GRAPH_VIS.draw("result-graph-svg", null, {
    interactive: false,
    showFinalPath: true
  });

  const totalDistanceEl = document.getElementById("result-total-distance");
  const nodeCountEl = document.getElementById("result-node-count");
  const iterationCountEl = document.getElementById("result-iteration-count");
  const efficiencyEl = document.getElementById("result-efficiency");
  const routePathEl = document.getElementById("result-route-path");
  const routeDetailsEl = document.getElementById("result-route-details");

  const formatDistance = (value) => {
    if (value === Infinity) return "∞";
    if (typeof value === "number") {
      const formatted = value.toFixed(1);
      return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
    }
    return String(value);
  };

  const path = simulation.shortestPath || [];
  const totalDistance = simulation.totalDistance === Infinity ? "∞" : formatDistance(simulation.totalDistance);
  const nodeCount = path.length;
  const iterationCount = Math.max(0, simulation.states.length - 1);
  const efficiencyText = simulation.totalDistance === Infinity ? "N/A" : `${graphData.startNode === graphData.endNode ? 0 : "Optimal"}`;

  if (totalDistanceEl) totalDistanceEl.textContent = `${totalDistance} km`;
  if (nodeCountEl) nodeCountEl.textContent = nodeCount;
  if (iterationCountEl) iterationCountEl.textContent = iterationCount;
  if (efficiencyEl) efficiencyEl.textContent = efficiencyText;

  if (routePathEl) {
    routePathEl.innerHTML = "";
    if (path.length > 0) {
      path.forEach((nodeId, index) => {
        const nodeName = graphData.nodeNames[nodeId] || nodeId;
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "flow-node";
        nodeDiv.title = nodeName;
        nodeDiv.textContent = nodeId;
        routePathEl.appendChild(nodeDiv);

        if (index < path.length - 1) {
          const arrow = document.createElement("div");
          arrow.className = "flow-arrow";
          arrow.innerHTML = "&rarr;";
          routePathEl.appendChild(arrow);
        }
      });
    }
  }

  if (routeDetailsEl) {
    if (path.length === 0 || simulation.totalDistance === Infinity) {
      routeDetailsEl.innerHTML = `<strong>Rincian Penjumlahan Bobot Jarak:</strong><br><span style="color: var(--text-muted);">Tidak ditemukan jalur terpendek untuk graf ini.</span>`;
    } else {
      const graph = graphData.graph;
      const parts = [];
      let sum = 0;
      for (let i = 0; i < path.length - 1; i += 1) {
        const current = path[i];
        const next = path[i + 1];
        const weight = graph[current][next];
        parts.push(`${formatDistance(weight)}`);
        sum += weight;
      }
      routeDetailsEl.innerHTML = `<strong>Rincian Penjumlahan Bobot Jarak:</strong><br><code style="font-size: 1rem; color: white; background: rgba(0,0,0,0.3); padding: 0.2rem 0.5rem; border-radius: 4px; display: inline-block; margin-top: 0.4rem;">${parts.join(" + ")} = ${formatDistance(sum)} km</code>`;
    }
  }
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
