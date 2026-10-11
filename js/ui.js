/**
 * UI Controller and DOM Manipulation
 * Coordinates inputs, tables, comparison views, tooltips, and real-time state displays.
 */

import { PRESETS, generateRandomWorkload } from './presets.js';
import { getProcessColor } from './gantt.js';
import {
  scheduleFCFS,
  scheduleSJF,
  scheduleSRTF,
  scheduleRoundRobin,
  schedulePriority,
  schedulePriorityRoundRobin,
  scheduleMultilevelQueue,
  scheduleMLFQ,
  Process,
} from './algorithms.js';

export class UIController {
  constructor() {
    this.processes = [];
    this.currentAlgorithm = 'FCFS';
    this.nextProcessId = 1;
  }

  initProcesses(initialList) {
    this.processes = initialList.map((p) => ({ ...p }));
    this.nextProcessId = Math.max(...this.processes.map((p) => p.id), 0) + 1;
    this.renderProcessTable();
  }

  addProcess() {
    const id = this.nextProcessId++;
    const defaultArrival = this.processes.length > 0 ? Math.max(...this.processes.map((p) => p.arrivalTime)) : 0;
    this.processes.push({
      id,
      name: `P${id}`,
      arrivalTime: defaultArrival,
      burstTime: Math.floor(Math.random() * 8) + 2,
      priority: 1,
      queue: 0,
    });
    this.renderProcessTable();
  }

  removeProcess(id) {
    if (this.processes.length <= 1) {
      alert('ต้องมี Process อย่างน้อย 1 รายการ');
      return;
    }
    this.processes = this.processes.filter((p) => p.id !== id);
    this.renderProcessTable();
  }

  clearProcesses() {
    this.processes = [];
    this.nextProcessId = 1;
    this.addProcess();
  }

  renderProcessTable() {
    const tbody = document.getElementById('process-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const showPriority = ['PRIORITY_NP', 'PRIORITY_P', 'PRIORITY_RR'].includes(this.currentAlgorithm);
    const showQueue = ['MLQ'].includes(this.currentAlgorithm);

    // Update table header visibility
    const priHeader = document.getElementById('th-priority');
    const qHeader = document.getElementById('th-queue');
    if (priHeader) priHeader.style.display = showPriority ? '' : 'none';
    if (qHeader) qHeader.style.display = showQueue ? '' : 'none';

    this.processes.forEach((p, index) => {
      const color = getProcessColor(p.id);
      const tr = document.createElement('tr');
      tr.id = `row-proc-${p.id}`;

      tr.innerHTML = `
        <td>
          <div class="process-badge" style="background: ${color.bg}; border-color: ${color.border}">
            ${p.name}
          </div>
        </td>
        <td>
          <input type="number" min="0" max="999" class="table-input at-input" value="${p.arrivalTime}" data-id="${p.id}" data-field="arrivalTime" />
        </td>
        <td>
          <input type="number" min="1" max="999" class="table-input bt-input" value="${p.burstTime}" data-id="${p.id}" data-field="burstTime" />
        </td>
        <td class="td-priority" style="display: ${showPriority ? '' : 'none'}">
          <input type="number" min="0" max="99" class="table-input pri-input" value="${p.priority}" data-id="${p.id}" data-field="priority" />
        </td>
        <td class="td-queue" style="display: ${showQueue ? '' : 'none'}">
          <select class="table-select q-select" data-id="${p.id}" data-field="queue">
            <option value="0" ${p.queue === 0 ? 'selected' : ''}>Q0 (High/RR)</option>
            <option value="1" ${p.queue === 1 ? 'selected' : ''}>Q1 (Med/RR)</option>
            <option value="2" ${p.queue === 2 ? 'selected' : ''}>Q2 (Low/FCFS)</option>
          </select>
        </td>
        <td class="table-actions">
          <button class="btn-icon btn-delete" data-id="${p.id}" title="ลบ Process">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
            </svg>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Attach listeners to input fields
    tbody.querySelectorAll('input, select').forEach((el) => {
      el.addEventListener('change', (e) => {
        const id = Number(e.target.dataset.id);
        const field = e.target.dataset.field;
        const val = Number(e.target.value);
        const targetProc = this.processes.find((p) => p.id === id);
        if (targetProc) {
          targetProc[field] = Math.max(field === 'burstTime' ? 1 : 0, val);
        }
      });
    });

    tbody.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = Number(btn.dataset.id);
        this.removeProcess(id);
      });
    });
  }

  updateAlgorithmOptionsVisibility(algo) {
    this.currentAlgorithm = algo;
    const optQuantum = document.getElementById('opt-quantum-group');
    const optAging = document.getElementById('opt-aging-group');
    const optMlfq = document.getElementById('opt-mlfq-group');

    if (optQuantum) {
      optQuantum.style.display = ['RR', 'PRIORITY_RR', 'MLQ'].includes(algo) ? 'flex' : 'none';
    }
    if (optAging) {
      optAging.style.display = ['PRIORITY_NP', 'PRIORITY_P', 'MLFQ'].includes(algo) ? 'flex' : 'none';
    }
    if (optMlfq) {
      optMlfq.style.display = ['MLFQ'].includes(algo) ? 'flex' : 'none';
    }

    // Re-render table columns if priority/queue needed
    this.renderProcessTable();
  }

  getCurrentOptions() {
    return {
      quantum: Number(document.getElementById('input-quantum')?.value) || 4,
      contextSwitch: Number(document.getElementById('input-context-switch')?.value) || 0,
      agingRate: Number(document.getElementById('input-aging-rate')?.value) || 0,
      agingThreshold: Number(document.getElementById('input-mlfq-aging')?.value) || 25,
      q0Quantum: Number(document.getElementById('input-mlfq-q0')?.value) || 8,
      q1Quantum: Number(document.getElementById('input-mlfq-q1')?.value) || 16,
      preemptive: this.currentAlgorithm === 'PRIORITY_P',
    };
  }

  executeCurrentSchedule() {
    const procs = this.processes.map((p) => new Process(p));
    const opts = this.getCurrentOptions();

    switch (this.currentAlgorithm) {
      case 'FCFS':
        return scheduleFCFS(procs, opts);
      case 'SJF':
        return scheduleSJF(procs, opts);
      case 'SRTF':
        return scheduleSRTF(procs, opts);
      case 'RR':
        return scheduleRoundRobin(procs, opts);
      case 'PRIORITY_NP':
        return schedulePriority(procs, { ...opts, preemptive: false });
      case 'PRIORITY_P':
        return schedulePriority(procs, { ...opts, preemptive: true });
      case 'PRIORITY_RR':
        return schedulePriorityRoundRobin(procs, opts);
      case 'MLQ':
        return scheduleMultilevelQueue(procs, opts);
      case 'MLFQ':
        return scheduleMLFQ(procs, opts);
      default:
        return scheduleFCFS(procs, opts);
    }
  }

  renderResults(result) {
    if (!result) return;
    const { processStats, summary } = result;

    // Summary Metric Cards
    const avgWtEl = document.getElementById('metric-avg-wt');
    const avgTatEl = document.getElementById('metric-avg-tat');
    const avgRtEl = document.getElementById('metric-avg-rt');
    const cpuUtilEl = document.getElementById('metric-cpu-util');
    const throughputEl = document.getElementById('metric-throughput');
    const totalTimeEl = document.getElementById('metric-total-time');

    if (avgWtEl) avgWtEl.textContent = `${summary.avgWaitingTime} ms`;
    if (avgTatEl) avgTatEl.textContent = `${summary.avgTurnaroundTime} ms`;
    if (avgRtEl) avgRtEl.textContent = `${summary.avgResponseTime} ms`;
    if (cpuUtilEl) cpuUtilEl.textContent = `${summary.cpuUtilization}%`;
    if (throughputEl) throughputEl.textContent = `${summary.throughput} /ms`;
    if (totalTimeEl) totalTimeEl.textContent = `${summary.totalTime} ms`;

    // Process Result Table
    const tbody = document.getElementById('results-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    Object.values(processStats).forEach((p) => {
      const color = getProcessColor(p.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <span class="process-badge" style="background: ${color.bg}; border-color: ${color.border}">
            ${p.name}
          </span>
        </td>
        <td>${p.arrivalTime}</td>
        <td>${p.burstTime}</td>
        <td>${p.priority}</td>
        <td><span class="highlight-val">${p.startTime}</span></td>
        <td><span class="highlight-val">${p.completionTime}</span></td>
        <td><strong class="tat-cell">${p.turnaroundTime}</strong></td>
        <td><strong class="wt-cell">${p.waitingTime}</strong></td>
        <td>${p.responseTime}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  updateLiveStepView(stepState) {
    if (!stepState) return;
    const { currentStep, isPlaying, stepIndex, totalSteps, isFinished } = stepState;
    if (!currentStep) return;

    // Time indicator
    const timeEl = document.getElementById('sim-current-time');
    if (timeEl) timeEl.textContent = `${currentStep.time} ms`;

    // Step index
    const stepEl = document.getElementById('sim-step-index');
    if (stepEl) stepEl.textContent = `Step ${stepIndex + 1} / ${totalSteps}`;

    // Play/Pause button icon & state
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.innerHTML = isPlaying
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> พัก (Pause)`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> เล่น (Play)`;
    }

    // CPU Core Status Card
    const cpuStatusEl = document.getElementById('cpu-status-indicator');
    const cpuNameEl = document.getElementById('cpu-running-name');
    const cpuDescEl = document.getElementById('cpu-action-desc');

    if (currentStep.runningProcess !== null && currentStep.runningProcess !== undefined) {
      const proc = this.processes.find((p) => p.id === currentStep.runningProcess);
      const color = getProcessColor(currentStep.runningProcess);
      if (cpuStatusEl) {
        cpuStatusEl.className = 'cpu-core active-cpu';
        cpuStatusEl.style.borderColor = color.border;
      }
      if (cpuNameEl) {
        cpuNameEl.textContent = proc ? proc.name : `P${currentStep.runningProcess}`;
        cpuNameEl.style.color = '#38bdf8';
      }
    } else {
      if (cpuStatusEl) {
        cpuStatusEl.className = 'cpu-core idle-cpu';
        cpuStatusEl.style.borderColor = '#475569';
      }
      if (cpuNameEl) {
        cpuNameEl.textContent = 'IDLE';
        cpuNameEl.style.color = '#94a3b8';
      }
    }

    if (cpuDescEl) {
      cpuDescEl.textContent = currentStep.actionDescription || 'กำลังประมวลผล...';
    }

    // Live Ready Queue Display
    const queueContainer = document.getElementById('live-ready-queue');
    if (queueContainer) {
      queueContainer.innerHTML = '';

      if (currentStep.queues) {
        // Multi-queue display for MLQ / MLFQ
        const wrapper = document.createElement('div');
        wrapper.className = 'mlq-queues-list';

        [0, 1, 2].forEach((qNum) => {
          const qRow = document.createElement('div');
          qRow.className = 'mlq-queue-row';
          const qName = qNum === 0 ? 'Q0 (High)' : qNum === 1 ? 'Q1 (Med)' : 'Q2 (Low)';
          const items = (currentStep.queues[qNum] || []).map((pid) => {
            const pr = this.processes.find((p) => p.id === pid);
            const clr = getProcessColor(pid);
            return `<div class="queue-chip" style="background:${clr.bg}; border-color:${clr.border}">${pr ? pr.name : `P${pid}`}</div>`;
          }).join('');

          qRow.innerHTML = `<span class="queue-level-label">${qName}:</span> <div class="queue-chips-wrap">${items || '<span class="empty-q-tag">ว่าง</span>'}</div>`;
          wrapper.appendChild(qRow);
        });

        queueContainer.appendChild(wrapper);
      } else {
        // Single ready queue
        if (!currentStep.readyQueue || currentStep.readyQueue.length === 0) {
          queueContainer.innerHTML = '<span class="empty-q-tag">Ready Queue ว่างเปล่า</span>';
        } else {
          currentStep.readyQueue.forEach((pid) => {
            const pr = this.processes.find((p) => p.id === pid);
            const clr = getProcessColor(pid);
            const chip = document.createElement('div');
            chip.className = 'queue-chip';
            chip.style.background = clr.bg;
            chip.style.borderColor = clr.border;
            chip.textContent = pr ? pr.name : `P${pid}`;
            queueContainer.appendChild(chip);
          });
        }
      }
    }
  }

  runComparison() {
    const procs = this.processes.map((p) => new Process(p));
    const opts = this.getCurrentOptions();

    const algos = [
      { name: 'FCFS', runner: () => scheduleFCFS(procs, opts) },
      { name: 'SJF (Non-preemptive)', runner: () => scheduleSJF(procs, opts) },
      { name: 'SRTF (Preemptive SJF)', runner: () => scheduleSRTF(procs, opts) },
      { name: `Round Robin (q=${opts.quantum})`, runner: () => scheduleRoundRobin(procs, opts) },
      { name: 'Priority (Non-preemptive)', runner: () => schedulePriority(procs, { ...opts, preemptive: false }) },
      { name: 'Priority (Preemptive)', runner: () => schedulePriority(procs, { ...opts, preemptive: true }) },
      { name: 'Priority + RR (q=2)', runner: () => schedulePriorityRoundRobin(procs, { ...opts, quantum: 2 }) },
      { name: 'MLFQ (3-Queue)', runner: () => scheduleMLFQ(procs, opts) },
    ];

    const results = algos.map((item) => {
      const res = item.runner();
      return {
        algorithm: item.name,
        res,
        ...res.summary,
      };
    });

    // Find winners
    const minWt = Math.min(...results.map((r) => r.avgWaitingTime));
    const minTat = Math.min(...results.map((r) => r.avgTurnaroundTime));

    const tbody = document.getElementById('comparison-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    results.forEach((row) => {
      const isBestWt = row.avgWaitingTime === minWt;
      const isBestTat = row.avgTurnaroundTime === minTat;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${row.algorithm}</strong></td>
        <td>
          <span class="${isBestWt ? 'winner-badge' : ''}">${row.avgWaitingTime} ms</span>
          ${isBestWt ? ' 🏆' : ''}
        </td>
        <td>
          <span class="${isBestTat ? 'winner-badge' : ''}">${row.avgTurnaroundTime} ms</span>
          ${isBestTat ? ' ⚡' : ''}
        </td>
        <td>${row.avgResponseTime} ms</td>
        <td>${row.cpuUtilization}%</td>
        <td>${row.throughput} /ms</td>
        <td>${row.totalTime} ms</td>
      `;
      tbody.appendChild(tr);
    });

    // Render Mini Gantts
    const miniContainer = document.getElementById('comparison-gantts-list');
    if (miniContainer) {
      miniContainer.innerHTML = '';
      results.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'mini-gantt-card';
        card.innerHTML = `
          <div class="mini-gantt-title">
            <span>${item.algorithm}</span>
            <small>Avg WT: <strong>${item.avgWaitingTime}ms</strong> | Avg TAT: <strong>${item.avgTurnaroundTime}ms</strong></small>
          </div>
          <div class="mini-gantt-bars" id="mini-gantt-${item.algorithm.replace(/[^a-zA-Z0-9]/g, '')}"></div>
        `;
        miniContainer.appendChild(card);

        const barWrapper = card.querySelector('.mini-gantt-bars');
        const maxTime = item.res.totalTime;

        item.res.timeline.forEach((blk) => {
          const wPct = ((blk.endTime - blk.startTime) / maxTime) * 100;
          const bar = document.createElement('div');
          bar.className = 'mini-bar';
          bar.style.width = `${wPct}%`;
          if (blk.isIdle) {
            bar.classList.add('mini-idle');
            bar.textContent = 'IDLE';
          } else if (blk.isContextSwitch) {
            bar.classList.add('mini-cs');
            bar.textContent = 'CS';
          } else {
            const clr = getProcessColor(blk.processId);
            bar.style.background = clr.bg;
            bar.textContent = blk.processName;
          }
          bar.title = `${blk.processName}: [${blk.startTime}-${blk.endTime}]`;
          barWrapper.appendChild(bar);
        });
      });
    }
  }
}
