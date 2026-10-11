/**
 * Gantt Chart Renderer
 * Renders a fixed 100% responsive Gantt chart that scales proportionally
 * to container width without overflowing or breaking through the screen.
 */

const PROCESS_COLORS = [
  { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: '#818cf8', text: '#ffffff' }, // Indigo (P1)
  { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: '#22d3ee', text: '#ffffff' }, // Cyan (P2)
  { bg: 'linear-gradient(135deg, #10b981, #059669)', border: '#34d399', text: '#ffffff' }, // Emerald (P3)
  { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fbbf24', text: '#ffffff' }, // Amber (P4)
  { bg: 'linear-gradient(135deg, #ec4899, #db2777)', border: '#f472b6', text: '#ffffff' }, // Pink (P5)
  { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: '#a78bfa', text: '#ffffff' }, // Purple (P6)
  { bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', border: '#2dd4bf', text: '#ffffff' }, // Teal (P7)
  { bg: 'linear-gradient(135deg, #f43f5e, #e11d48)', border: '#fb7185', text: '#ffffff' }, // Rose (P8)
  { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '#60a5fa', text: '#ffffff' }, // Blue (P9)
  { bg: 'linear-gradient(135deg, #84cc16, #65a30d)', border: '#a3e635', text: '#ffffff' }, // Lime (P10)
];

export function getProcessColor(processId) {
  if (processId === null || processId === undefined) {
    return {
      bg: 'repeating-linear-gradient(45deg, #334155, #334155 10px, #1e293b 10px, #1e293b 20px)',
      border: '#64748b',
      text: '#94a3b8',
    };
  }
  const idx = (Math.abs(Number(processId)) - 1) % PROCESS_COLORS.length;
  return PROCESS_COLORS[idx];
}

export class GanttChartRenderer {
  constructor(containerElement, tooltipElement) {
    this.container = containerElement;
    this.tooltip = tooltipElement;
    this.timeline = [];
    this.totalTime = 0;
    this.currentResult = null;
    this.onBlockClickCallback = null;
  }

  onBlockClick(fn) {
    this.onBlockClickCallback = fn;
  }

  // Zoom no-ops preserved for backward compatibility
  zoomIn() {}
  zoomOut() {}
  resetZoom() {}

  render(result) {
    if (!this.container) return;
    this.currentResult = result;
    this.container.innerHTML = '';
    if (!result || !result.timeline || result.timeline.length === 0) {
      this.container.innerHTML = '<div class="empty-gantt">ไม่มีข้อมูลสำหรับสร้าง Gantt Chart</div>';
      return;
    }

    this.timeline = result.timeline.filter((b) => b.endTime > b.startTime);
    this.totalTime = Math.max(1, result.totalTime || (this.timeline.length > 0 ? Math.max(...this.timeline.map((b) => b.endTime)) : 1));

    // Fixed 100% responsive width layout - never overflows container
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'gantt-wrapper';
    chartWrapper.style.width = '100%';

    // 1. Gantt Bar Row
    const barRow = document.createElement('div');
    barRow.className = 'gantt-bar-row';

    // 2. Ticks Row
    const ticksRow = document.createElement('div');
    ticksRow.className = 'gantt-ticks-row';

    // 3. Playhead Cursor
    const playhead = document.createElement('div');
    playhead.className = 'gantt-playhead';
    playhead.id = 'gantt-playhead';
    playhead.style.display = 'none';

    // Add 0 tick mark at start
    const tickZero = document.createElement('span');
    tickZero.className = 'tick-mark start-zero';
    tickZero.textContent = '0';
    tickZero.style.left = '0%';
    ticksRow.appendChild(tickZero);

    let lastTickPct = 0;

    this.timeline.forEach((block, index) => {
      const duration = block.endTime - block.startTime;
      if (duration <= 0) return;
      const widthPct = (duration / this.totalTime) * 100;
      const leftPct = (block.startTime / this.totalTime) * 100;

      const blockEl = document.createElement('div');
      blockEl.className = 'gantt-block';
      blockEl.dataset.index = index;
      blockEl.dataset.startTime = block.startTime;
      blockEl.dataset.endTime = block.endTime;
      blockEl.dataset.processId = block.processId || 'idle';

      blockEl.style.left = `${leftPct}%`;
      blockEl.style.width = `${widthPct}%`;

      // Adaptive label formatting based on percentage of available width
      const isVeryNarrow = widthPct < 3.2;
      const isNarrow = widthPct < 7.0;

      if (block.isIdle) {
        blockEl.classList.add('block-idle');
        if (isVeryNarrow) {
          blockEl.innerHTML = '';
        } else if (isNarrow) {
          blockEl.innerHTML = `<span class="block-label compact">IDLE</span>`;
        } else {
          blockEl.innerHTML = `<span class="block-label">IDLE</span><span class="block-sub">${duration}ms</span>`;
        }
      } else if (block.isContextSwitch) {
        blockEl.classList.add('block-cs');
        blockEl.innerHTML = isVeryNarrow ? '' : `<span class="block-label compact">CS</span>`;
      } else {
        const color = getProcessColor(block.processId);
        blockEl.style.background = color.bg;
        blockEl.style.borderColor = color.border;
        blockEl.style.color = color.text;
        const qBadge = block.queueLevel !== undefined ? `<small class="q-badge">Q${block.queueLevel}</small>` : '';

        if (isVeryNarrow) {
          blockEl.innerHTML = '';
        } else if (isNarrow) {
          blockEl.innerHTML = `<span class="block-label compact">${block.processName}</span>`;
        } else {
          blockEl.innerHTML = `
            <span class="block-label">${block.processName} ${qBadge}</span>
            <span class="block-sub">${duration}ms</span>
          `;
        }
      }

      // Hover Tooltip Events
      blockEl.addEventListener('mouseenter', (e) => this.showTooltip(e, block, duration));
      blockEl.addEventListener('mousemove', (e) => this.moveTooltip(e));
      blockEl.addEventListener('mouseleave', () => this.hideTooltip());

      // Click to jump simulation
      blockEl.addEventListener('click', () => {
        if (this.onBlockClickCallback) {
          this.onBlockClickCallback(block.startTime);
        }
      });

      barRow.appendChild(blockEl);

      // Add Tick mark for End Time (avoid overlapping if blocks are tiny)
      const tickPct = (block.endTime / this.totalTime) * 100;
      const isLast = index === this.timeline.length - 1;
      if (isLast || (tickPct - lastTickPct >= 3.8)) {
        const tick = document.createElement('span');
        tick.className = 'tick-mark';
        if (isLast) tick.classList.add('tick-end');
        tick.textContent = block.endTime;
        tick.style.left = `${tickPct}%`;
        ticksRow.appendChild(tick);
        lastTickPct = tickPct;
      }
    });

    chartWrapper.appendChild(barRow);
    chartWrapper.appendChild(ticksRow);
    chartWrapper.appendChild(playhead);
    this.container.appendChild(chartWrapper);
  }

  updatePlayhead(currentTime) {
    const playhead = document.getElementById('gantt-playhead');
    if (!playhead || this.totalTime <= 0) return;

    if (currentTime === null || currentTime === undefined || currentTime < 0) {
      playhead.style.display = 'none';
      return;
    }

    playhead.style.display = 'block';
    const pct = Math.min(100, Math.max(0, (currentTime / this.totalTime) * 100));
    playhead.style.left = `${pct}%`;
  }

  showTooltip(e, block, duration) {
    if (!this.tooltip) return;
    const type = block.isIdle ? 'CPU Idle' : block.isContextSwitch ? 'Context Switch Overhead' : `Process ${block.processName}`;
    const qInfo = block.queueLevel !== undefined ? `<p><strong>Queue:</strong> Level Q${block.queueLevel}</p>` : '';

    this.tooltip.innerHTML = `
      <div class="tooltip-header">${type}</div>
      <div class="tooltip-body">
        <p><strong>ช่วงเวลา (Time):</strong> [${block.startTime} → ${block.endTime}] ms</p>
        <p><strong>ระยะเวลา (Duration):</strong> ${duration} ms</p>
        ${qInfo}
      </div>
    `;
    this.tooltip.classList.add('visible');
    this.moveTooltip(e);
  }

  moveTooltip(e) {
    if (!this.tooltip) return;
    const offset = 14;
    this.tooltip.style.left = `${e.pageX + offset}px`;
    this.tooltip.style.top = `${e.pageY + offset}px`;
  }

  hideTooltip() {
    if (!this.tooltip) return;
    this.tooltip.classList.remove('visible');
  }
}
