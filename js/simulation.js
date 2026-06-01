/**
 * simulation.js
 * Mengontrol logika simulasi interaktif langkah-demi-langkah (step-by-step).
 * Menghubungkan visualisasi graf dengan status panel dan riwayat perhitungan.
 */

window.SIMULATOR = {
  currentStep: 0,
  isPlaying: false,
  playInterval: null,
  autoplayDelay: 3000, // 3 detik per langkah
  currentGraphKey: window.GRAPH_DATA.currentGraphKey,

  init: function() {
    this.currentStep = 0;
    this.isPlaying = false;
    this.setupEventListeners();
    this.syncGraphSelector();
    window.DIJKSTRA_SIMULATION.run(this.currentGraphKey);
    this.updateUI();
  },

  setupEventListeners: function() {
    const btnStart = document.getElementById("btn-start");
    const btnNext = document.getElementById("btn-next");
    const btnPrev = document.getElementById("btn-prev");
    const btnAuto = document.getElementById("btn-auto");
    const btnReset = document.getElementById("btn-reset");
    const graphSelector = document.getElementById("graph-selector");

    if (btnStart) btnStart.addEventListener("click", () => this.startSimulation());
    if (btnNext) btnNext.addEventListener("click", () => this.nextStep());
    if (btnPrev) btnPrev.addEventListener("click", () => this.prevStep());
    if (btnAuto) btnAuto.addEventListener("click", () => this.toggleAutoplay());
    if (btnReset) btnReset.addEventListener("click", () => this.resetSimulation());
    if (graphSelector) graphSelector.addEventListener("change", (event) => this.changeGraph(event.target.value));
  },

  syncGraphSelector: function() {
    const graphSelector = document.getElementById("graph-selector");
    if (graphSelector) {
      graphSelector.value = this.currentGraphKey;
    }
    this.updateSimulationDescription();
  },

  changeGraph: function(graphKey) {
    if (!window.GRAPH_DATA.graphs[graphKey]) return;
    this.currentGraphKey = graphKey;
    window.DIJKSTRA_SIMULATION.run(graphKey);
    this.currentStep = 0;
    this.updateUI();
    this.updateSimulationDescription();
  },

  updateSimulationDescription: function() {
    const description = document.getElementById("graph-description");
    const title = document.getElementById("simulation-graph-title");
    const graphData = window.GRAPH_DATA.currentGraph;
    if (title) {
      title.textContent = graphData.title;
    }
    if (description) {
      description.textContent = graphData.description;
    }
  },

  startSimulation: function() {
    this.stopAutoplay();
    this.currentStep = 0;
    this.updateUI();
    
    // Smooth scroll ke visualisasi graf jika tombol "Mulai" ditekan
    const graphSection = document.getElementById("simulation-svg");
    if (graphSection) {
      graphSection.scrollIntoView({ behavior: "smooth" });
    }
  },

  nextStep: function() {
    const totalStates = window.DIJKSTRA_SIMULATION.states.length;
    if (this.currentStep < totalStates - 1) {
      this.currentStep++;
      this.updateUI();
    } else {
      this.stopAutoplay();
      // Arahkan user ke halaman hasil jika sudah selesai dan diklik "Selanjutnya"
      if (confirm("Simulasi selesai! Apakah Anda ingin melihat ringkasan hasil rute terpendek?")) {
        window.location.href = "hasil.html";
      }
    }
  },

  prevStep: function() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateUI();
    }
  },

  toggleAutoplay: function() {
    const btnAuto = document.getElementById("btn-auto");
    if (this.isPlaying) {
      this.stopAutoplay();
    } else {
      this.isPlaying = true;
      if (btnAuto) {
        btnAuto.innerHTML = `<i class="fas fa-pause"></i> Pause Otomatis`;
        btnAuto.classList.add("btn-playing");
      }
      this.playInterval = setInterval(() => {
        const totalStates = window.DIJKSTRA_SIMULATION.states.length;
        if (this.currentStep < totalStates - 1) {
          this.nextStep();
        } else {
          this.stopAutoplay();
        }
      }, this.autoplayDelay);
    }
  },

  stopAutoplay: function() {
    this.isPlaying = false;
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
    const btnAuto = document.getElementById("btn-auto");
    if (btnAuto) {
      btnAuto.innerHTML = `<i class="fas fa-play"></i> Jalankan Otomatis`;
      btnAuto.classList.remove("btn-playing");
    }
  },

  resetSimulation: function() {
    this.stopAutoplay();
    this.currentStep = 0;
    window.DIJKSTRA_SIMULATION.run(this.currentGraphKey);
    this.updateUI();
  },

  updateUI: function() {
    const states = window.DIJKSTRA_SIMULATION.states;
    const currentState = states[this.currentStep];
    const isLastStep = this.currentStep === states.length - 1;

    // 1. Gambar Graf SVG Terkini
    // Jika step terakhir (Iterasi 7), tampilkan juga jalur terpendek akhir (highlight merah)
    window.GRAPH_VIS.draw("simulation-svg", currentState, {
      interactive: false,
      showFinalPath: isLastStep
    });

    // 2. Perbarui Header Iterasi & Keterangan Rinci
    const stepTitle = document.getElementById("step-title");
    const activeNodeInfo = document.getElementById("active-node-info");
    const calculationLogs = document.getElementById("calculation-logs");

    if (stepTitle) stepTitle.textContent = currentState.title;
    
    if (activeNodeInfo) {
      const nodeName = window.GRAPH_DATA.currentGraph.nodeNames[currentState.activeNode];
      activeNodeInfo.innerHTML = `Node Aktif: <span class="active-node-badge">${currentState.activeNode} - ${nodeName}</span>`;
    }

    if (calculationLogs) {
      calculationLogs.innerHTML = currentState.log;
    }

    // 3. Perbarui Tabel Status & Riwayat Perubahan Node
    this.updateStatusTable(currentState);

    // 4. Update Status Disabled Tombol Kontrol
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const btnReset = document.getElementById("btn-reset");

    if (btnPrev) btnPrev.disabled = this.currentStep === 0;
    if (btnNext) {
      if (isLastStep) {
        btnNext.innerHTML = `Lihat Hasil <i class="fas fa-arrow-right"></i>`;
        btnNext.classList.add("btn-success-pulse");
      } else {
        btnNext.innerHTML = `Iterasi Berikutnya <i class="fas fa-step-forward"></i>`;
        btnNext.classList.remove("btn-success-pulse");
      }
    }

    // Sorot progress bar simulasi
    const progressBar = document.getElementById("simulation-progress");
    if (progressBar) {
      const percentage = (this.currentStep / (states.length - 1)) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  },

  updateStatusTable: function(currentState) {
    const tbody = document.getElementById("nodes-status-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const data = window.GRAPH_DATA.currentGraph;
    const nodeNames = data.nodeNames;
    const nodeIds = Object.keys(nodeNames).map(Number).sort((a, b) => a - b);

    const formatDist = (value) => {
      if (value === Infinity) return "∞";
      if (typeof value === "number") {
        const formatted = value.toFixed(1);
        return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
      }
      return String(value);
    };

    nodeIds.forEach((nodeId) => {
      const name = nodeNames[nodeId];
      const isPermanent = currentState.permanentNodes.includes(nodeId);
      const rawDist = currentState.distances[nodeId];
      const displayDist = formatDist(rawDist);

      let statusLabel = "";
      let trClass = "";

      if (currentState.activeNode === nodeId) {
        statusLabel = `<span class="badge badge-active">Sedang Diproses</span>`;
        trClass = "row-active";
      } else if (isPermanent) {
        statusLabel = `<span class="badge badge-permanent">Nilai Permanen (*)</span>`;
        trClass = "row-permanent";
      } else if (rawDist !== Infinity) {
        statusLabel = `<span class="badge badge-discovered">Nilai Sementara</span>`;
        trClass = "row-discovered";
      } else {
        statusLabel = `<span class="badge badge-unvisited">Belum Dikunjungi</span>`;
        trClass = "row-unvisited";
      }

      const historyList = currentState.history[nodeId] || ["∞"];
      const historyHtml = historyList.map((val, idx) => {
        const isLast = idx === historyList.length - 1;
        return isLast
          ? `<strong class="hist-current">${val}</strong>`
          : `<span class="hist-old">${val}</span>`;
      }).join(" → ");

      const tr = document.createElement("tr");
      tr.className = trClass;
      tr.innerHTML = `
        <td><strong>${nodeId}</strong></td>
        <td>${name}</td>
        <td><strong class="dist-cell">${displayDist}${isPermanent ? "*" : ""}</strong></td>
        <td>${statusLabel}</td>
        <td class="history-cell">${historyHtml}</td>
      `;
      tbody.appendChild(tr);
    });
  }
};
