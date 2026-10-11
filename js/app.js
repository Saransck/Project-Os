/**
 * Main Application Coordinator
 * Handles event wiring, themes, playback, zoom, scrubbing, formulas, and export.
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

  // 1. Theme Management (Cyber Dark, Midnight Blue, Clean Light)
  const themes = [
    {
      id: 'dark',
      label: 'Cyber Dark',
      icon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    },
    {
      id: 'midnight',
      label: 'Midnight Blue',
      icon: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    },
    {
      id: 'light',
      label: 'Clean Light',
      icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    },
  ];

  let currentThemeIdx = 0;
  const savedTheme = localStorage.getItem('cpu_sim_theme');
  if (savedTheme) {
    const fIdx = themes.findIndex((t) => t.id === savedTheme);
    if (fIdx !== -1) currentThemeIdx = fIdx;
  }

  function applyTheme(tObj) {
    document.documentElement.setAttribute('data-theme', tObj.id);
    const labelEl = document.getElementById('theme-label');
    const iconEl = document.getElementById('theme-icon');
    if (labelEl) labelEl.textContent = tObj.label;
    if (iconEl) iconEl.innerHTML = tObj.icon;
    localStorage.setItem('cpu_sim_theme', tObj.id);
  }

  applyTheme(themes[currentThemeIdx]);

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    applyTheme(themes[currentThemeIdx]);
  });

  // 2. Preset Banner Updater
  function updatePresetBanner(preset) {
    const tagEl = document.getElementById('preset-desc-tag');
    const textEl = document.getElementById('preset-desc-text');
    if (!preset) return;
    if (tagEl) tagEl.textContent = preset.algorithm;
    if (textEl) textEl.textContent = preset.description || preset.name;
  }

  // 3. Initialize Default Workload (SRTF Preemptive)
  const defaultPreset = PRESETS.srtf_preemptive;
  ui.initProcesses(defaultPreset.processes);
  updatePresetBanner(defaultPreset);

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

  // 4. Run Simulation
  function runSimulation() {
    const result = ui.executeCurrentSchedule();
    ui.renderResults(result);
    gantt.render(result);
    sim.loadResult(result);

    // Update scrubber bounds
    const scrubber = document.getElementById('gantt-time-scrubber');
    const scrubberVal = document.getElementById('scrubber-time-val');
    if (scrubber && result) {
      scrubber.min = 0;
      scrubber.max = Math.max(1, result.summary.totalTime);
      scrubber.value = 0;
      if (scrubberVal) scrubberVal.textContent = 't = 0 ms';
    }
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
      const scrubber = document.getElementById('gantt-time-scrubber');
      const scrubberVal = document.getElementById('scrubber-time-val');
      if (scrubber && !scrubber.matches(':active')) {
        scrubber.value = state.currentStep.time;
      }
      if (scrubberVal) {
        scrubberVal.textContent = `t = ${state.currentStep.time} ms`;
      }
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

  // 5. Gantt Chart Zoom Controls
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    gantt.zoomIn();
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    gantt.zoomOut();
  });

  document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
    gantt.resetZoom();
  });

  // 6. Gantt Timeline Scrubber Slider
  const timeScrubber = document.getElementById('gantt-time-scrubber');
  const scrubberVal = document.getElementById('scrubber-time-val');
  timeScrubber?.addEventListener('input', (e) => {
    const t = Number(e.target.value);
    if (scrubberVal) scrubberVal.textContent = `t = ${t} ms`;
    sim.jumpToTime(t);
  });

  // 7. Formula Breakdown Modal Controls
  const formulaModal = document.getElementById('formula-modal');
  document.getElementById('btn-show-formula')?.addEventListener('click', () => {
    ui.showFormulaBreakdownModal();
  });

  document.getElementById('btn-close-formula-modal')?.addEventListener('click', () => {
    formulaModal?.classList.remove('visible');
  });

  document.getElementById('btn-close-formula-footer')?.addEventListener('click', () => {
    formulaModal?.classList.remove('visible');
  });

  formulaModal?.addEventListener('click', (e) => {
    if (e.target === formulaModal) {
      formulaModal.classList.remove('visible');
    }
  });

  // 8. Event Listeners: Process Management
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
    const tagEl = document.getElementById('preset-desc-tag');
    const textEl = document.getElementById('preset-desc-text');
    if (tagEl) tagEl.textContent = 'RANDOM';
    if (textEl) textEl.textContent = `สุ่มชุดข้อมูล Process ใหม่จำนวน ${randomList.length} รายการ`;
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
    updatePresetBanner(p);
    runSimulation();
  });

  // Options input change
  const optionInputs = [
    'input-quantum',
    'input-context-switch',
    'input-aging-rate',
    'input-mlfq-q0',
    'input-mlfq-q1',
    'input-mlfq-aging',
  ];
  optionInputs.forEach((id) => {
    document.getElementById(id)?.addEventListener('change', () => {
      runSimulation();
    });
  });

  // 9. Playback Controls
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

  // 10. Tab Switching
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

  // 11. Export JSON / CSV
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

  // 12. Keyboard Shortcuts for Power Users
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      return;
    }
    if (e.code === 'Space') {
      e.preventDefault();
      if (sim.isPlaying) sim.pause();
      else sim.play();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      sim.stepForward();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      sim.stepBackward();
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      sim.reset();
    } else if (e.code === 'Escape') {
      formulaModal?.classList.remove('visible');
    }
  });
});
