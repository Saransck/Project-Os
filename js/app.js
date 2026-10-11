/**
 * Main Application Coordinator
 */

import { UIController } from './ui.js';
import { GanttChartRenderer } from './gantt.js';
import { SimulationEngine } from './simulation.js';
import { PRESETS, generateRandomWorkload } from './presets.js';

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UIController();
  const sim = new SimulationEngine();

  const ganttContainer = document.getElementById('gantt-container');
  const tooltip = document.getElementById('gantt-tooltip');
  const gantt = new GanttChartRenderer(ganttContainer, tooltip);

  // Initialize with SRTF Preemptive SJF preset by default
  const defaultPreset = PRESETS.srtf_preemptive;
  ui.initProcesses(defaultPreset.processes);

  // Populate Presets Select Dropdown
  const presetSelect = document.getElementById('preset-select');
  if (presetSelect) {
    presetSelect.innerHTML = '<option value="">-- เลือกชุดข้อมูลตัวอย่าง (Presets) --</option>';
    Object.values(PRESETS).forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      presetSelect.appendChild(opt);
    });
    presetSelect.value = defaultPreset.id;
  }

  // Set algorithm dropdown to match default preset
  const algoSelect = document.getElementById('algorithm-select');
  if (algoSelect) {
    algoSelect.value = defaultPreset.algorithm;
    ui.updateAlgorithmOptionsVisibility(defaultPreset.algorithm);
  }

  // Run initial simulation
  function runSimulation() {
    const result = ui.executeCurrentSchedule();
    ui.renderResults(result);
    gantt.render(result);
    sim.loadResult(result);
  }

  // Hook UI process changes (add, delete, edit inputs) to re-simulate automatically
  ui.onProcessChange(() => {
    runSimulation();
  });

  // Simulation Update Hook
  sim.onUpdate((state) => {
    ui.updateLiveStepView(state);
    if (state.currentStep) {
      gantt.updatePlayhead(state.currentStep.time);
    } else {
      gantt.updatePlayhead(null);
    }
  });

  // Gantt block click -> jump simulation time
  gantt.onBlockClick((startTime) => {
    if (sim.result && sim.result.steps) {
      const stepIdx = sim.result.steps.findIndex((s) => s.time === startTime);
      if (stepIdx !== -1) {
        sim.jumpToStep(stepIdx);
      }
    }
  });

  // Event Listeners: Process Management
  document.getElementById('btn-add-process')?.addEventListener('click', () => {
    ui.addProcess();
  });

  document.getElementById('btn-clear-processes')?.addEventListener('click', () => {
    if (confirm('คุณต้องการล้างรายการ Process ทั้งหมดใช่หรือไม่?')) {
      ui.clearProcesses();
    }
  });

  document.getElementById('btn-random-generate')?.addEventListener('click', () => {
    const count = Number(prompt('ต้องการสุ่มจำนวน Process กี่ตัว? (3-8)', '5')) || 5;
    const randomList = generateRandomWorkload(Math.min(10, Math.max(2, count)));
    ui.initProcesses(randomList);
    runSimulation();
  });

  // Algorithm Select Change
  algoSelect?.addEventListener('change', (e) => {
    ui.updateAlgorithmOptionsVisibility(e.target.value);
    runSimulation();
  });

  // Presets Select Change
  presetSelect?.addEventListener('change', (e) => {
    const presetId = e.target.value;
    if (!presetId || !PRESETS[presetId]) return;
    const p = PRESETS[presetId];

    if (algoSelect) {
      algoSelect.value = p.algorithm;
      ui.updateAlgorithmOptionsVisibility(p.algorithm);
    }

    if (p.options) {
      if (p.options.quantum) {
        const qEl = document.getElementById('input-quantum');
        if (qEl) qEl.value = p.options.quantum;
      }
      if (p.options.q0Quantum) {
        const q0El = document.getElementById('input-mlfq-q0');
        if (q0El) q0El.value = p.options.q0Quantum;
      }
      if (p.options.q1Quantum) {
        const q1El = document.getElementById('input-mlfq-q1');
        if (q1El) q1El.value = p.options.q1Quantum;
      }
      if (p.options.contextSwitch !== undefined) {
        const csEl = document.getElementById('input-context-switch');
        if (csEl) csEl.value = p.options.contextSwitch;
      }
    }

    ui.initProcesses(p.processes);
    runSimulation();
  });

  // Options input change
  const optionInputs = ['input-quantum', 'input-context-switch', 'input-aging-rate', 'input-mlfq-q0', 'input-mlfq-q1', 'input-mlfq-aging'];
  optionInputs.forEach((id) => {
    document.getElementById(id)?.addEventListener('change', () => {
      runSimulation();
    });
  });

  // Playback Controls
  document.getElementById('btn-play')?.addEventListener('click', () => {
    if (sim.isPlaying) {
      sim.pause();
    } else {
      sim.play();
    }
  });

  document.getElementById('btn-step-forward')?.addEventListener('click', () => {
    sim.stepForward();
  });

  document.getElementById('btn-step-backward')?.addEventListener('click', () => {
    sim.stepBackward();
  });

  document.getElementById('btn-reset')?.addEventListener('click', () => {
    sim.reset();
  });

  // Speed Slider
  const speedSlider = document.getElementById('sim-speed-slider');
  const speedDisplay = document.getElementById('sim-speed-val');
  speedSlider?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    sim.setSpeed(val);
    if (speedDisplay) speedDisplay.textContent = `${val.toFixed(1)}x`;
  });

  // Trigger initial run
  runSimulation();

  // Tab Switching
  const tabSimBtn = document.getElementById('tab-btn-sim');
  const tabCompareBtn = document.getElementById('tab-btn-compare');
  const tabTheoryBtn = document.getElementById('tab-btn-theory');

  const viewSim = document.getElementById('view-simulation');
  const viewCompare = document.getElementById('view-comparison');
  const viewTheory = document.getElementById('view-theory');

  function switchTab(activeTab) {
    [tabSimBtn, tabCompareBtn, tabTheoryBtn].forEach((btn) => btn?.classList.remove('active'));
    [viewSim, viewCompare, viewTheory].forEach((v) => v?.classList.remove('active'));

    if (activeTab === 'sim') {
      tabSimBtn?.classList.add('active');
      viewSim?.classList.add('active');
    } else if (activeTab === 'compare') {
      tabCompareBtn?.classList.add('active');
      viewCompare?.classList.add('active');
      ui.runComparison();
    } else if (activeTab === 'theory') {
      tabTheoryBtn?.classList.add('active');
      viewTheory?.classList.add('active');
    }
  }

  tabSimBtn?.addEventListener('click', () => switchTab('sim'));
  tabCompareBtn?.addEventListener('click', () => switchTab('compare'));
  tabTheoryBtn?.addEventListener('click', () => switchTab('theory'));

  // Re-run Comparison button
  document.getElementById('btn-refresh-compare')?.addEventListener('click', () => {
    ui.runComparison();
  });

  // Export JSON / CSV
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ui.processes, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'cpu_processes.json');
    dlAnchor.click();
  });

  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const result = ui.executeCurrentSchedule();
    let csvContent = '\uFEFFProcess,Arrival Time,Burst Time,Priority,Start Time,Completion Time,Turnaround Time,Waiting Time,Response Time\n';
    Object.values(result.processStats).forEach((p) => {
      csvContent += `"${p.name}",${p.arrivalTime},${p.burstTime},${p.priority},${p.startTime},${p.completionTime},${p.turnaroundTime},${p.waitingTime},${p.responseTime}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', url);
    dlAnchor.setAttribute('download', `cpu_schedule_${ui.currentAlgorithm}.csv`);
    dlAnchor.click();
    URL.revokeObjectURL(url);
  });
});
