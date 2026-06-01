/**
 * dijkstra.js
 * Menghasilkan status iterasi Dijkstra secara dinamis berdasarkan data graf.
 * Setiap langkah menampilkan node aktif, tetangga yang diproses, jarak saat ini,
 * node permanen, dan riwayat pembaruan nilai.
 */

window.DIJKSTRA_SIMULATION = {
  currentGraphKey: window.GRAPH_DATA.currentGraphKey,
  shortestPath: [],
  totalDistance: Infinity,
  states: [],

  run: function(graphKey = window.GRAPH_DATA.currentGraphKey) {
    window.GRAPH_DATA.setCurrentGraphKey(graphKey);
    this.currentGraphKey = graphKey;
    const graphData = window.GRAPH_DATA.currentGraph;
    const graph = graphData.graph;
    const nodeNames = graphData.nodeNames;
    const startNode = graphData.startNode;
    const endNode = graphData.endNode;
    const allNodeIds = Object.keys(nodeNames).map(Number).sort((a, b) => a - b);

    this.states = [];
    this.shortestPath = [];
    this.totalDistance = Infinity;

    const distances = {};
    const previous = {};
    const visited = {};
    const history = {};

    allNodeIds.forEach((nodeId) => {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
      visited[nodeId] = false;
      history[nodeId] = ["∞"];
    });

    distances[startNode] = 0;
    history[startNode] = ["0*"];

    const cloneDistances = () => {
      const cloned = {};
      allNodeIds.forEach((nodeId) => {
        cloned[nodeId] = distances[nodeId];
      });
      return cloned;
    };

    const cloneHistory = () => {
      const cloned = {};
      allNodeIds.forEach((nodeId) => {
        cloned[nodeId] = [...history[nodeId]];
      });
      return cloned;
    };

    const getPermanentNodes = () => {
      return allNodeIds.filter((nodeId) => visited[nodeId]);
    };

    const formatDistance = (value) => {
      if (value === Infinity) return "∞";
      if (typeof value === "number") {
        const formatted = value.toFixed(1);
        return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
      }
      return String(value);
    };

    const updateNeighbor = (source, neighbor, weight) => {
      const alt = distances[source] + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = source;
        const formattedAlt = formatDistance(alt);
        if (history[neighbor][history[neighbor].length - 1] !== formattedAlt) {
          history[neighbor].push(formattedAlt);
        }
      }
    };

    const getSmallestUnvisitedNode = () => {
      let minNode = null;
      let minDistance = Infinity;
      allNodeIds.forEach((nodeId) => {
        if (!visited[nodeId] && distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          minNode = nodeId;
        }
      });
      return minNode;
    };

    const addState = (step, title, activeNode, processingNeighbors, log) => {
      const stateHistory = cloneHistory();
      const permanentNodes = getPermanentNodes();
      const stateDistances = cloneDistances();

      if (visited[activeNode] && stateHistory[activeNode][stateHistory[activeNode].length - 1] !== `${formatDistance(stateDistances[activeNode])}*`) {
        stateHistory[activeNode].push(`${formatDistance(stateDistances[activeNode])}*`);
      }

      this.states.push({
        step,
        title,
        activeNode,
        processingNeighbors,
        distances: stateDistances,
        permanentNodes,
        history: stateHistory,
        log
      });
    };

    const startNeighbors = Object.keys(graph[startNode] || {}).map(Number);
    startNeighbors.forEach((neighbor) => {
      updateNeighbor(startNode, neighbor, graph[startNode][neighbor]);
    });

    visited[startNode] = true;

    addState(
      0,
      "Iterasi 0: Inisialisasi Graf",
      startNode,
      startNeighbors,
      `<strong>Inisialisasi Mulai:</strong><br>
       • Node Awal: <strong>${nodeNames[startNode]} (Node ${startNode})</strong> diberi nilai <strong>0*</strong>.<br>
       • Semua node lain dimulai dengan nilai <strong>∞</strong>.<br>
       • Node Aktif: <strong>Node ${startNode}</strong>.`
    );

    let step = 1;

    while (true) {
      const currentNode = getSmallestUnvisitedNode();
      if (currentNode === null || distances[currentNode] === Infinity) {
        break;
      }

      visited[currentNode] = true;
      const neighbors = Object.keys(graph[currentNode] || {}).map(Number);
      const logLines = [
        `<strong>Proses Node ${currentNode} (${nodeNames[currentNode]})</strong>:`,
        `• Node Aktif: <strong>Node ${currentNode}</strong>`
      ];

      if (neighbors.length === 0) {
        logLines.push(`• Tidak ada tetangga yang diproses dari node ini.`);
      }

      neighbors.forEach((neighbor) => {
        const oldDistance = distances[neighbor];
        updateNeighbor(currentNode, neighbor, graph[currentNode][neighbor]);
        logLines.push(
          `• <strong>Node ${neighbor} (${nodeNames[neighbor]})</strong>: ` +
          `\\min(${oldDistance === Infinity ? '∞' : formatDistance(oldDistance)}, ${formatDistance(distances[currentNode])} + ${graph[currentNode][neighbor]}) = ${formatDistance(distances[neighbor])}`
        );
      });

      const nextNode = getSmallestUnvisitedNode();
      if (nextNode !== null) {
        logLines.push(`• Node berikutnya dengan jarak terendah adalah <strong>Node ${nextNode}</strong>.`);
      }

      addState(
        step,
        `Iterasi ${step}: Eksplorasi dari Node ${currentNode}`,
        currentNode,
        neighbors,
        logLines.join('<br>')
      );

      step += 1;
    }

    const finalPath = [];
    let cursor = endNode;
    while (cursor !== null) {
      finalPath.unshift(cursor);
      cursor = previous[cursor];
    }

    if (finalPath.length === 0 || finalPath[0] !== startNode) {
      this.shortestPath = [];
      this.totalDistance = Infinity;
    } else {
      this.shortestPath = finalPath;
      this.totalDistance = distances[endNode];
    }
  }
};

window.DIJKSTRA_SIMULATION.run();
