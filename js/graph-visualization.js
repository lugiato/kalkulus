/**
 * graph-visualization.js
 * Engine untuk menggambarkan graf logistik PT X menggunakan SVG secara interaktif.
 * Mendukung rendering statis (halaman Graf) dan rendering dinamis (halaman Simulasi).
 */

window.GRAPH_VIS = {
  // Radius lingkaran node
  NODE_RADIUS: 24,

  /**
   * Menggambar graf ke dalam elemen SVG
   * @param {string} svgId - ID elemen <svg>
   * @param {Object} currentState - State simulasi saat ini (null jika rendering statis)
   * @param {Object} options - Pengaturan tambahan { interactive: boolean, showFinalPath: boolean }
   */
  draw: function(svgId, currentState, options = {}) {
    const svg = document.getElementById(svgId);
    if (!svg) return;

    // Bersihkan SVG terlebih dahulu
    svg.innerHTML = "";

    const data = window.GRAPH_DATA.currentGraph;
    const nodePositions = data.nodePositions;
    const graph = data.graph;
    const nodeNames = data.nodeNames;

    // Definisikan defs untuk marker panah dan filter glow
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <!-- Panah Abu-abu -->
      <marker id="arrow-default" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#4b5563" />
      </marker>
      <!-- Panah Kuning (Proses) -->
      <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
      </marker>
      <!-- Panah Hijau (Permanen) -->
      <marker id="arrow-permanent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
      </marker>
      <!-- Panah Merah (Jalur Akhir) -->
      <marker id="arrow-final" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
      </marker>
      <!-- Neon Glow Filter -->
      <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    // Dapatkan rute terpendek akhir jika diinginkan
    const isFinalPathActive = options.showFinalPath;
    const finalPath = window.DIJKSTRA_SIMULATION.shortestPath;

    // -------------------------------------------------------------
    // 1. GAMBAR EDGE (GARIS HUBUNGAN)
    // -------------------------------------------------------------
    for (const fromNodeStr in graph) {
      const fromId = parseInt(fromNodeStr);
      const fromPos = nodePositions[fromId];

      for (const toNodeStr in graph[fromId]) {
        const toId = parseInt(toNodeStr);
        const toPos = nodePositions[toId];
        const weight = graph[fromId][toId];

        // Hitung jarak matematis antara dua node
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        // Ambil vektor satuan arah
        const ux = dx / length;
        const uy = dy / length;

        // Potong garis agar tepat berada di tepi lingkaran node
        const x1 = fromPos.x + this.NODE_RADIUS * ux;
        const y1 = fromPos.y + this.NODE_RADIUS * uy;
        const x2 = toPos.x - (this.NODE_RADIUS + 4) * ux; // Tambah offset kecil untuk kepala panah
        const y2 = toPos.y - (this.NODE_RADIUS + 4) * uy;

        // Tentukan status edge berdasarkan step simulasi saat ini
        let edgeClass = "edge-line";
        let markerId = "arrow-default";
        let strokeColor = "#374151";

        if (currentState) {
          const isFromPermanent = currentState.permanentNodes.includes(fromId);
          const isToPermanent = currentState.permanentNodes.includes(toId);

          // Cek apakah edge ini sedang dieksplorasi di step ini
          const isActiveExploration = (currentState.activeNode === fromId && currentState.processingNeighbors.includes(toId));

          // Cek apakah edge ini bagian dari jalur final
          const isFinalEdge = isFinalPathActive && this.isEdgeInPath(fromId, toId, finalPath);

          if (isFinalEdge) {
            edgeClass = "edge-line edge-final";
            markerId = "arrow-final";
            strokeColor = "#f43f5e";
          } else if (isActiveExploration) {
            edgeClass = "edge-line edge-active";
            markerId = "arrow-active";
            strokeColor = "#fbbf24";
          } else if (isFromPermanent && isToPermanent) {
            // Check if this was the predecessor link
            // In a strict visualization, we color links that are part of the current shortest path
            if (this.isEdgeInCurrentTree(fromId, toId, currentState)) {
              edgeClass = "edge-line edge-permanent";
              markerId = "arrow-permanent";
              strokeColor = "#10b981";
            }
          }
        } else if (isFinalPathActive) {
          // Mode statis dengan visualisasi rute terpendek
          const isFinalEdge = this.isEdgeInPath(fromId, toId, finalPath);
          if (isFinalEdge) {
            edgeClass = "edge-line edge-final";
            markerId = "arrow-final";
            strokeColor = "#f43f5e";
          }
        }

        // Buat elemen garis SVG
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("class", edgeClass);
        line.setAttribute("stroke", strokeColor);
        line.setAttribute("marker-end", `url(#${markerId})`);
        svg.appendChild(line);

        // Tambah teks bobot di tengah garis
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        
        // Buat background untuk label bobot agar terbaca jelas
        const textBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        textBg.setAttribute("x", mx - 18);
        textBg.setAttribute("y", my - 10);
        textBg.setAttribute("width", 36);
        textBg.setAttribute("height", 18);
        textBg.setAttribute("rx", 4);
        textBg.setAttribute("class", "edge-weight-bg");
        svg.appendChild(textBg);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", mx);
        text.setAttribute("y", my + 4);
        text.setAttribute("class", `edge-weight-text ${edgeClass.includes("edge-final") ? "text-final" : ""}`);
        text.textContent = weight;
        svg.appendChild(text);
      }
    }

    // -------------------------------------------------------------
    // 2. GAMBAR NODE (KOTA)
    // -------------------------------------------------------------
    const formatDistance = (value) => {
      if (value === Infinity) return "∞";
      if (typeof value === "number") {
        const formatted = value.toFixed(1);
        return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
      }
      return String(value);
    };

    for (const nodeIdStr in nodePositions) {
      const nodeId = parseInt(nodeIdStr);
      const pos = nodePositions[nodeId];
      const name = nodeNames[nodeId];

      let nodeStatus = "unvisited"; // default: abu-abu
      let badgeVal = "∞";

      if (currentState) {
        const dist = currentState.distances[nodeId];
        const isPerm = currentState.permanentNodes.includes(nodeId);
        badgeVal = dist === Infinity ? "∞" : formatDistance(dist);

        if (isFinalPathActive && finalPath.includes(nodeId)) {
          nodeStatus = "final"; // merah
        } else if (currentState.activeNode === nodeId) {
          nodeStatus = "active"; // kuning
        } else if (isPerm) {
          nodeStatus = "permanent"; // hijau
          badgeVal = badgeVal + "*";
        } else if (dist !== Infinity) {
          nodeStatus = "discovered"; // terjangkau, masih sementara (tetap abu-abu tua/kuning soft)
        }
      } else if (isFinalPathActive && finalPath.includes(nodeId)) {
        nodeStatus = "final";
      }

      // Group untuk setiap node agar mudah diatur hover & event-nya
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", `node-group status-${nodeStatus}`);
      group.setAttribute("data-node-id", nodeId);

      if (options.interactive) {
        group.addEventListener("click", () => {
          if (typeof options.onNodeClick === "function") {
            options.onNodeClick(nodeId);
          }
        });
      }

      // Efek bayangan glow untuk node aktif/final
      let glowCircle;
      if (nodeStatus === "active" || nodeStatus === "final") {
        glowCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        glowCircle.setAttribute("cx", pos.x);
        glowCircle.setAttribute("cy", pos.y);
        glowCircle.setAttribute("r", this.NODE_RADIUS + 4);
        glowCircle.setAttribute("class", "node-glow");
        group.appendChild(glowCircle);
      }

      // Lingkaran utama node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", pos.x);
      circle.setAttribute("cy", pos.y);
      circle.setAttribute("r", this.NODE_RADIUS);
      circle.setAttribute("class", "node-circle");
      group.appendChild(circle);

      // Angka ID Node di tengah lingkaran
      const idText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      idText.setAttribute("x", pos.x);
      idText.setAttribute("y", pos.y + 6);
      idText.setAttribute("class", "node-id-text");
      idText.textContent = nodeId;
      group.appendChild(idText);

      // Label Nama Kota di atas/bawah node
      const nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      nameText.setAttribute("x", pos.x);
      // Posisikan nama di atas jika node ada di bagian bawah, posisikan di bawah jika node ada di bagian atas
      const isBottomNode = pos.y > 280;
      nameText.setAttribute("y", pos.y + (isBottomNode ? 42 : -32));
      nameText.setAttribute("class", "node-name-text");
      nameText.textContent = name;
      group.appendChild(nameText);

      // Badge Nilai Dijkstra (misal: "27.5*" atau "∞") di samping/atas node
      if (currentState) {
        const badgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Posisikan badge nilai secara dinamis agar tidak tumpang tindih
        const bx = pos.x + 30;
        const by = pos.y - 12;

        const badgeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        badgeRect.setAttribute("x", bx - 22);
        badgeRect.setAttribute("y", by - 12);
        badgeRect.setAttribute("width", 44);
        badgeRect.setAttribute("height", 18);
        badgeRect.setAttribute("rx", 4);
        badgeRect.setAttribute("class", `node-badge-bg badge-${nodeStatus}`);

        const badgeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        badgeText.setAttribute("x", bx);
        badgeText.setAttribute("y", by + 1);
        badgeText.setAttribute("class", "node-badge-text");
        badgeText.textContent = badgeVal;

        badgeGroup.appendChild(badgeRect);
        badgeGroup.appendChild(badgeText);
        group.appendChild(badgeGroup);
      }

      svg.appendChild(group);
    }
  },

  /**
   * Memeriksa apakah suatu edge merupakan bagian dari rute tertentu
   */
  isEdgeInPath: function(u, v, path) {
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === u && path[i + 1] === v) {
        return true;
      }
    }
    return false;
  },

  /**
   * Memeriksa apakah edge u->v adalah koneksi terpendek aktif dalam iterasi saat ini
   * (Membantu visualisasi pohon rentang terpendek yang sedang terbentuk)
   */
  isEdgeInCurrentTree: function(u, v, state) {
    if (!state) return false;

    // Pada dasarnya, cek apakah predecessor dari v adalah u
    // Kami melacaknya dari representasi rute akhir Dijkstra.
    const targetPath = window.DIJKSTRA_SIMULATION?.shortestPath || [];
    const uIdx = targetPath.indexOf(u);
    const vIdx = targetPath.indexOf(v);
    
    // Jika keduanya ada di rute final dan berurutan
    if (uIdx !== -1 && vIdx !== -1 && vIdx === uIdx + 1) {
      // Pastikan node v sudah berstatus permanen pada state saat ini
      return state.permanentNodes.includes(v);
    }
    
    // Fallback: cek bobot yang cocok untuk node permanen
    const expectedDistV = state.distances[v];
    const distU = state.distances[u];
    const weightUV = window.GRAPH_DATA.currentGraph.graph[u]?.[v];
    
    if (weightUV !== undefined && distU !== Infinity && expectedDistV !== Infinity) {
      return Math.abs(distU + weightUV - expectedDistV) < 0.01;
    }
    return false;
  }
};
