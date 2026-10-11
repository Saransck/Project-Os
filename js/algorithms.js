/**
 * CPU Scheduling Simulator - Core Algorithms
 * Based on Operating System Concepts (Silberschatz) & Chapter 4 OS Theory
 */

export class Process {
  constructor({ id, name, arrivalTime, burstTime, priority = 1, queue = 0 }) {
    this.id = id;
    this.name = name || `P${id}`;
    this.arrivalTime = Math.max(0, Number(arrivalTime) || 0);
    this.burstTime = Math.max(1, Number(burstTime) || 1);
    this.priority = Math.max(0, Number(priority) || 0);
    this.queue = Math.max(0, Math.min(2, Number(queue) || 0)); // For MLQ / MLFQ (0, 1, 2)
  }

  clone() {
    return new Process({
      id: this.id,
      name: this.name,
      arrivalTime: this.arrivalTime,
      burstTime: this.burstTime,
      priority: this.priority,
      queue: this.queue,
    });
  }
}

/**
 * Result structure returned by all algorithms:
 * - timeline: Array of execution intervals:
 *   [{ processId, processName, startTime, endTime, isIdle, isContextSwitch, queueLevel }]
 * - steps: Array of discrete time steps (t=0, 1, 2, ...) with full machine snapshot:
 *   [{ time, runningProcess, readyQueue, completedProcesses, notArrived, queues, actionDescription }]
 * - processStats: Map or Object of process statistics:
 *   { [id]: { arrivalTime, burstTime, priority, startTime, completionTime, turnaroundTime, waitingTime, responseTime } }
 * - summary: { avgWaitingTime, avgTurnaroundTime, avgResponseTime, cpuUtilization, throughput, totalTime }
 */

// Helper to compute standard metrics from execution timeline
export function computeMetrics(processes, timeline, totalTime, contextSwitchTime = 0) {
  const stats = {};
  const firstStartTime = {};
  const completionTime = {};

  processes.forEach((p) => {
    firstStartTime[p.id] = null;
    completionTime[p.id] = 0;
  });

  let busyCpuTime = 0;

  timeline.forEach((block) => {
    if (!block.isIdle && !block.isContextSwitch) {
      busyCpuTime += block.endTime - block.startTime;
      if (firstStartTime[block.processId] === null) {
        firstStartTime[block.processId] = block.startTime;
      }
      completionTime[block.processId] = Math.max(completionTime[block.processId], block.endTime);
    }
  });

  let totalWT = 0;
  let totalTAT = 0;
  let totalRT = 0;

  processes.forEach((p) => {
    const ct = completionTime[p.id] !== undefined ? completionTime[p.id] : p.arrivalTime;
    const st = firstStartTime[p.id] !== null ? firstStartTime[p.id] : ct;
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = st - p.arrivalTime;

    stats[p.id] = {
      id: p.id,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      queue: p.queue,
      startTime: st,
      completionTime: ct,
      turnaroundTime: Math.max(0, tat),
      waitingTime: Math.max(0, wt),
      responseTime: Math.max(0, rt),
    };

    totalTAT += stats[p.id].turnaroundTime;
    totalWT += stats[p.id].waitingTime;
    totalRT += stats[p.id].responseTime;
  });

  const n = processes.length;
  const finishTime = Math.max(1, totalTime);
  const cpuUtilization = totalTime > 0 ? (busyCpuTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? n / totalTime : 0;

  return {
    processStats: stats,
    summary: {
      avgWaitingTime: n > 0 ? Number((totalWT / n).toFixed(2)) : 0,
      avgTurnaroundTime: n > 0 ? Number((totalTAT / n).toFixed(2)) : 0,
      avgResponseTime: n > 0 ? Number((totalRT / n).toFixed(2)) : 0,
      cpuUtilization: Number(cpuUtilization.toFixed(2)),
      throughput: Number(throughput.toFixed(4)),
      totalTime: totalTime,
      busyTime: busyCpuTime,
    },
  };
}

/**
 * 1. FIRST-COME, FIRST-SERVED (FCFS)
 * Non-preemptive scheduling in FIFO order.
 */
export function scheduleFCFS(inputProcesses, options = {}) {
  const cs = Math.max(0, Number(options.contextSwitch) || 0);
  const procs = inputProcesses.map((p) => p.clone());
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id);

  const timeline = [];
  const steps = [];
  let currentTime = 0;
  let lastProcId = null;

  const completed = new Set();
  const readyQueue = [];
  const arrived = new Set();

  function admitArrivals(time) {
    procs.forEach((p) => {
      if (p.arrivalTime <= time && !arrived.has(p.id)) {
        arrived.add(p.id);
        readyQueue.push(p.id);
      }
    });
  }

  admitArrivals(currentTime);

  while (completed.size < procs.length) {
    admitArrivals(currentTime);

    if (readyQueue.length === 0) {
      const unarrived = procs.filter((p) => !arrived.has(p.id));
      if (unarrived.length === 0) break;

      const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));
      if (nextArr > currentTime) {
        timeline.push({
          processId: null,
          processName: 'IDLE',
          startTime: currentTime,
          endTime: nextArr,
          isIdle: true,
        });

        for (let t = currentTime; t < nextArr; t++) {
          steps.push({
            time: t,
            runningProcess: null,
            readyQueue: [],
            completedProcesses: Array.from(completed),
            actionDescription: 'CPU Idle: Waiting for arrivals',
          });
        }

        currentTime = nextArr;
      }
      admitArrivals(currentTime);
      continue;
    }

    const currentId = readyQueue.shift();
    const p = procs.find((proc) => proc.id === currentId);

    // Context switch if needed
    if (cs > 0 && lastProcId !== null && lastProcId !== currentId) {
      timeline.push({
        processId: null,
        processName: 'CS',
        startTime: currentTime,
        endTime: currentTime + cs,
        isContextSwitch: true,
      });
      for (let t = 0; t < cs; t++) {
        admitArrivals(currentTime + t + 1);
        steps.push({
          time: currentTime + t,
          runningProcess: null,
          readyQueue: [currentId, ...readyQueue],
          completedProcesses: Array.from(completed),
          actionDescription: `Context Switch to ${p.name} (${cs}ms)`,
        });
      }
      currentTime += cs;
    }

    lastProcId = currentId;
    const start = currentTime;
    const burst = p.burstTime;

    timeline.push({
      processId: p.id,
      processName: p.name,
      startTime: start,
      endTime: start + burst,
      isIdle: false,
    });

    for (let b = 0; b < burst; b++) {
      const stepTime = currentTime + b;
      admitArrivals(stepTime + 1);

      steps.push({
        time: stepTime,
        runningProcess: p.id,
        readyQueue: [...readyQueue],
        completedProcesses: Array.from(completed),
        remainingTime: { [p.id]: burst - b },
        actionDescription: `Executing ${p.name} (${b + 1}/${burst})`,
      });
    }

    currentTime += burst;
    completed.add(p.id);
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime };
}

/**
 * 2. SHORTEST-JOB-FIRST (SJF Non-preemptive)
 * Select process in ready queue with smallest burst time.
 */
export function scheduleSJF(inputProcesses, options = {}) {
  const cs = Math.max(0, Number(options.contextSwitch) || 0);
  const procs = inputProcesses.map((p) => p.clone());
  const timeline = [];
  const steps = [];
  let currentTime = 0;
  let lastProcId = null;

  const completed = new Set();
  const readyQueue = [];
  const arrived = new Set();

  function admitArrivals(time) {
    procs.forEach((p) => {
      if (p.arrivalTime <= time && !arrived.has(p.id)) {
        arrived.add(p.id);
        readyQueue.push(p.id);
      }
    });
  }

  admitArrivals(currentTime);

  while (completed.size < procs.length) {
    admitArrivals(currentTime);

    if (readyQueue.length === 0) {
      const unarrived = procs.filter((p) => !arrived.has(p.id));
      if (unarrived.length === 0) break;

      const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));
      if (nextArr > currentTime) {
        timeline.push({
          processId: null,
          processName: 'IDLE',
          startTime: currentTime,
          endTime: nextArr,
          isIdle: true,
        });

        for (let t = currentTime; t < nextArr; t++) {
          steps.push({
            time: t,
            runningProcess: null,
            readyQueue: [],
            completedProcesses: Array.from(completed),
            actionDescription: 'CPU Idle',
          });
        }

        currentTime = nextArr;
      }
      admitArrivals(currentTime);
      continue;
    }

    // Sort readyQueue by burst time, tie break by arrival time then id
    readyQueue.sort((aId, bId) => {
      const a = procs.find((p) => p.id === aId);
      const b = procs.find((p) => p.id === bId);
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id - b.id;
    });

    const currentId = readyQueue.shift();
    const p = procs.find((proc) => proc.id === currentId);

    if (cs > 0 && lastProcId !== null && lastProcId !== currentId) {
      timeline.push({
        processId: null,
        processName: 'CS',
        startTime: currentTime,
        endTime: currentTime + cs,
        isContextSwitch: true,
      });
      for (let t = 0; t < cs; t++) {
        admitArrivals(currentTime + t + 1);
        steps.push({
          time: currentTime + t,
          runningProcess: null,
          readyQueue: [currentId, ...readyQueue],
          completedProcesses: Array.from(completed),
          actionDescription: `Context Switch to ${p.name}`,
        });
      }
      currentTime += cs;
    }

    lastProcId = currentId;
    const start = currentTime;
    const burst = p.burstTime;

    timeline.push({
      processId: p.id,
      processName: p.name,
      startTime: start,
      endTime: start + burst,
      isIdle: false,
    });

    for (let b = 0; b < burst; b++) {
      const stepTime = currentTime + b;
      admitArrivals(stepTime + 1);

      steps.push({
        time: stepTime,
        runningProcess: p.id,
        readyQueue: [...readyQueue],
        completedProcesses: Array.from(completed),
        actionDescription: `Executing ${p.name} (SJF, Burst=${burst})`,
      });
    }

    currentTime += burst;
    completed.add(p.id);
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime };
}

/**
 * 3. SHORTEST REMAINING TIME FIRST (SRTF / Preemptive SJF)
 * Process with smallest remaining burst time is executed. Preemption occurs when newly arrived process has shorter burst.
 */
export function scheduleSRTF(inputProcesses, options = {}) {
  const cs = Math.max(0, Number(options.contextSwitch) || 0);
  const procs = inputProcesses.map((p) => p.clone());
  const timeline = [];
  const steps = [];

  const remaining = {};
  procs.forEach((p) => (remaining[p.id] = p.burstTime));

  const completed = new Set();
  let currentTime = 0;
  let runningId = null;
  let lastProcId = null;

  const totalWork = procs.reduce((acc, p) => acc + p.burstTime, 0);
  const maxArr = procs.length > 0 ? Math.max(...procs.map((p) => p.arrivalTime)) : 0;
  const maxLimit = (totalWork + maxArr) * 4 + 200;

  let currentBlock = null;

  while (completed.size < procs.length && currentTime < maxLimit) {
    const available = procs.filter((p) => p.arrivalTime <= currentTime && !completed.has(p.id));

    if (available.length === 0) {
      if (currentBlock) {
        timeline.push(currentBlock);
        currentBlock = null;
      }
      const unarrived = procs.filter((p) => !completed.has(p.id) && p.arrivalTime > currentTime);
      if (unarrived.length === 0) break;

      const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));

      if (nextArr > currentTime) {
        timeline.push({
          processId: null,
          processName: 'IDLE',
          startTime: currentTime,
          endTime: nextArr,
          isIdle: true,
        });

        for (let t = currentTime; t < nextArr; t++) {
          steps.push({
            time: t,
            runningProcess: null,
            readyQueue: [],
            completedProcesses: Array.from(completed),
            actionDescription: 'CPU Idle',
          });
        }

        currentTime = nextArr;
      }
      runningId = null;
      continue;
    }

    // Pick process with minimum remaining time
    available.sort((a, b) => {
      if (remaining[a.id] !== remaining[b.id]) return remaining[a.id] - remaining[b.id];
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id - b.id;
    });

    const chosen = available[0];

    // Context switch check
    if (cs > 0 && lastProcId !== null && lastProcId !== chosen.id && runningId !== chosen.id) {
      if (currentBlock) {
        timeline.push(currentBlock);
        currentBlock = null;
      }
      timeline.push({
        processId: null,
        processName: 'CS',
        startTime: currentTime,
        endTime: currentTime + cs,
        isContextSwitch: true,
      });
      for (let t = 0; t < cs; t++) {
        steps.push({
          time: currentTime + t,
          runningProcess: null,
          readyQueue: available.map((p) => p.id),
          completedProcesses: Array.from(completed),
          actionDescription: `Context Switch to ${chosen.name}`,
        });
      }
      currentTime += cs;
    }

    lastProcId = chosen.id;
    runningId = chosen.id;

    if (!currentBlock || currentBlock.processId !== chosen.id) {
      if (currentBlock) {
        timeline.push(currentBlock);
      }
      currentBlock = {
        processId: chosen.id,
        processName: chosen.name,
        startTime: currentTime,
        endTime: currentTime + 1,
        isIdle: false,
      };
    } else {
      currentBlock.endTime = currentTime + 1;
    }

    const readyQ = available.filter((p) => p.id !== chosen.id).map((p) => p.id);

    steps.push({
      time: currentTime,
      runningProcess: chosen.id,
      readyQueue: readyQ,
      completedProcesses: Array.from(completed),
      remainingTime: { ...remaining, [chosen.id]: remaining[chosen.id] - 1 },
      actionDescription: `Executing ${chosen.name} (Remaining: ${remaining[chosen.id]} -> ${remaining[chosen.id] - 1})`,
    });

    remaining[chosen.id] -= 1;
    currentTime += 1;

    if (remaining[chosen.id] === 0) {
      completed.add(chosen.id);
      runningId = null;
    }
  }

  if (currentBlock) {
    timeline.push(currentBlock);
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime };
}

/**
 * 4. ROUND-ROBIN SCHEDULING (RR)
 * Preemptive scheduling with time quantum.
 */
export function scheduleRoundRobin(inputProcesses, options = {}) {
  const quantum = Math.max(1, Number(options.quantum) || 4);
  const cs = Math.max(0, Number(options.contextSwitch) || 0);
  const procs = inputProcesses.map((p) => p.clone());
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id);

  const timeline = [];
  const steps = [];

  const remaining = {};
  procs.forEach((p) => (remaining[p.id] = p.burstTime));

  const completed = new Set();
  const readyQueue = [];
  const arrived = new Set();
  let currentTime = 0;
  let lastProcId = null;

  function admitArrivals(time) {
    procs.forEach((p) => {
      if (p.arrivalTime <= time && !arrived.has(p.id) && !completed.has(p.id)) {
        arrived.add(p.id);
        readyQueue.push(p.id);
      }
    });
  }

  admitArrivals(currentTime);

  while (completed.size < procs.length) {
    admitArrivals(currentTime);

    if (readyQueue.length === 0) {
      const unarrived = procs.filter((p) => !completed.has(p.id) && p.arrivalTime > currentTime);
      if (unarrived.length === 0) {
        admitArrivals(currentTime);
        if (readyQueue.length === 0) break;
      } else {
        const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));
        if (nextArr > currentTime) {
          timeline.push({
            processId: null,
            processName: 'IDLE',
            startTime: currentTime,
            endTime: nextArr,
            isIdle: true,
          });

          for (let t = currentTime; t < nextArr; t++) {
            steps.push({
              time: t,
              runningProcess: null,
              readyQueue: [],
              completedProcesses: Array.from(completed),
              actionDescription: 'CPU Idle',
            });
          }

          currentTime = nextArr;
        }
        admitArrivals(currentTime);
        continue;
      }
    }

    const currentId = readyQueue.shift();
    const p = procs.find((proc) => proc.id === currentId);

    // Context switch
    if (cs > 0 && lastProcId !== null && lastProcId !== currentId) {
      timeline.push({
        processId: null,
        processName: 'CS',
        startTime: currentTime,
        endTime: currentTime + cs,
        isContextSwitch: true,
      });
      for (let t = 0; t < cs; t++) {
        admitArrivals(currentTime + t + 1);
        steps.push({
          time: currentTime + t,
          runningProcess: null,
          readyQueue: [currentId, ...readyQueue],
          completedProcesses: Array.from(completed),
          actionDescription: `Context Switch to ${p.name}`,
        });
      }
      currentTime += cs;
    }

    lastProcId = currentId;
    const executeTime = Math.min(quantum, remaining[currentId]);
    const start = currentTime;

    timeline.push({
      processId: p.id,
      processName: p.name,
      startTime: start,
      endTime: start + executeTime,
      isIdle: false,
    });

    for (let u = 0; u < executeTime; u++) {
      const stepTime = currentTime + u;
      remaining[currentId] -= 1;

      // Admit new arrivals during this unit BEFORE appending currentId to queue
      admitArrivals(stepTime + 1);

      steps.push({
        time: stepTime,
        runningProcess: p.id,
        readyQueue: [...readyQueue],
        completedProcesses: Array.from(completed),
        remainingTime: { ...remaining },
        actionDescription: `Executing ${p.name} (RR Quantum: ${u + 1}/${quantum}, Rem: ${remaining[currentId]})`,
      });
    }

    currentTime += executeTime;

    if (remaining[currentId] === 0) {
      completed.add(currentId);
    } else {
      readyQueue.push(currentId);
    }
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime, quantum };
}

/**
 * 5. PRIORITY SCHEDULING (Non-preemptive & Preemptive)
 * Low number = High priority.
 * Optional aging support.
 */
export function schedulePriority(inputProcesses, options = {}) {
  const isPreemptive = Boolean(options.preemptive);
  const cs = Math.max(0, Number(options.contextSwitch) || 0);
  const agingRate = Number(options.agingRate) || 0;
  const procs = inputProcesses.map((p) => p.clone());
  const timeline = [];
  const steps = [];

  const remaining = {};
  const currentPriority = {};
  const waitingTracker = {};
  procs.forEach((p) => {
    remaining[p.id] = p.burstTime;
    currentPriority[p.id] = p.priority;
    waitingTracker[p.id] = 0;
  });

  const completed = new Set();
  let currentTime = 0;
  let lastProcId = null;

  if (!isPreemptive) {
    const readyQueue = [];
    const arrived = new Set();

    function admitArrivals(time) {
      procs.forEach((p) => {
        if (p.arrivalTime <= time && !arrived.has(p.id)) {
          arrived.add(p.id);
          readyQueue.push(p.id);
        }
      });
    }

    admitArrivals(currentTime);

    while (completed.size < procs.length) {
      admitArrivals(currentTime);

      if (readyQueue.length === 0) {
        const unarrived = procs.filter((p) => !arrived.has(p.id));
        if (unarrived.length === 0) break;

        const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));
        if (nextArr > currentTime) {
          timeline.push({
            processId: null,
            processName: 'IDLE',
            startTime: currentTime,
            endTime: nextArr,
            isIdle: true,
          });

          for (let t = currentTime; t < nextArr; t++) {
            steps.push({
              time: t,
              runningProcess: null,
              readyQueue: [],
              completedProcesses: Array.from(completed),
              actionDescription: 'CPU Idle',
            });
          }

          currentTime = nextArr;
        }
        admitArrivals(currentTime);
        continue;
      }

      // Sort ready queue by priority (lowest number first), then arrival time, then id
      readyQueue.sort((aId, bId) => {
        if (currentPriority[aId] !== currentPriority[bId]) {
          return currentPriority[aId] - currentPriority[bId];
        }
        const a = procs.find((p) => p.id === aId);
        const b = procs.find((p) => p.id === bId);
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
        return a.id - b.id;
      });

      const currentId = readyQueue.shift();
      const p = procs.find((proc) => proc.id === currentId);

      if (cs > 0 && lastProcId !== null && lastProcId !== currentId) {
        timeline.push({
          processId: null,
          processName: 'CS',
          startTime: currentTime,
          endTime: currentTime + cs,
          isContextSwitch: true,
        });
        for (let t = 0; t < cs; t++) {
          admitArrivals(currentTime + t + 1);
          steps.push({
            time: currentTime + t,
            runningProcess: null,
            readyQueue: [currentId, ...readyQueue],
            completedProcesses: Array.from(completed),
            actionDescription: `Context Switch to ${p.name}`,
          });
        }
        currentTime += cs;
      }

      lastProcId = currentId;
      const start = currentTime;
      const burst = p.burstTime;

      timeline.push({
        processId: p.id,
        processName: p.name,
        startTime: start,
        endTime: start + burst,
        isIdle: false,
      });

      for (let b = 0; b < burst; b++) {
        const stepTime = currentTime + b;
        admitArrivals(stepTime + 1);

        if (agingRate > 0) {
          readyQueue.forEach((qId) => {
            waitingTracker[qId]++;
            if (waitingTracker[qId] >= agingRate) {
              currentPriority[qId] = Math.max(0, currentPriority[qId] - 1);
              waitingTracker[qId] = 0;
            }
          });
        }

        steps.push({
          time: stepTime,
          runningProcess: p.id,
          readyQueue: [...readyQueue],
          completedProcesses: Array.from(completed),
          actionDescription: `Executing ${p.name} (Priority=${currentPriority[p.id]}, Burst=${burst})`,
        });
      }

      currentTime += burst;
      completed.add(p.id);
    }
  } else {
    // Preemptive priority
    let currentBlock = null;
    let runningId = null;

    const totalWork = procs.reduce((acc, p) => acc + p.burstTime, 0);
    const maxArr = procs.length > 0 ? Math.max(...procs.map((p) => p.arrivalTime)) : 0;
    const maxLimit = (totalWork + maxArr) * 4 + 200;

    while (completed.size < procs.length && currentTime < maxLimit) {
      const available = procs.filter((p) => p.arrivalTime <= currentTime && !completed.has(p.id));

      if (available.length === 0) {
        if (currentBlock) {
          timeline.push(currentBlock);
          currentBlock = null;
        }
        const unarrived = procs.filter((p) => !completed.has(p.id) && p.arrivalTime > currentTime);
        if (unarrived.length === 0) break;

        const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));

        if (nextArr > currentTime) {
          timeline.push({
            processId: null,
            processName: 'IDLE',
            startTime: currentTime,
            endTime: nextArr,
            isIdle: true,
          });

          for (let t = currentTime; t < nextArr; t++) {
            steps.push({
              time: t,
              runningProcess: null,
              readyQueue: [],
              completedProcesses: Array.from(completed),
              actionDescription: 'CPU Idle',
            });
          }

          currentTime = nextArr;
        }
        runningId = null;
        continue;
      }

      // Sort by currentPriority, then arrival, then id
      available.sort((a, b) => {
        if (currentPriority[a.id] !== currentPriority[b.id]) {
          return currentPriority[a.id] - currentPriority[b.id];
        }
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
        return a.id - b.id;
      });

      const chosen = available[0];

      if (cs > 0 && lastProcId !== null && lastProcId !== chosen.id && runningId !== chosen.id) {
        if (currentBlock) {
          timeline.push(currentBlock);
          currentBlock = null;
        }
        timeline.push({
          processId: null,
          processName: 'CS',
          startTime: currentTime,
          endTime: currentTime + cs,
          isContextSwitch: true,
        });
        for (let t = 0; t < cs; t++) {
          steps.push({
            time: currentTime + t,
            runningProcess: null,
            readyQueue: available.map((p) => p.id),
            completedProcesses: Array.from(completed),
            actionDescription: `Context Switch to ${chosen.name}`,
          });
        }
        currentTime += cs;
      }

      lastProcId = chosen.id;
      runningId = chosen.id;

      if (!currentBlock || currentBlock.processId !== chosen.id) {
        if (currentBlock) {
          timeline.push(currentBlock);
        }
        currentBlock = {
          processId: chosen.id,
          processName: chosen.name,
          startTime: currentTime,
          endTime: currentTime + 1,
          isIdle: false,
        };
      } else {
        currentBlock.endTime = currentTime + 1;
      }

      if (agingRate > 0) {
        available.forEach((other) => {
          if (other.id !== chosen.id) {
            waitingTracker[other.id]++;
            if (waitingTracker[other.id] >= agingRate) {
              currentPriority[other.id] = Math.max(0, currentPriority[other.id] - 1);
              waitingTracker[other.id] = 0;
            }
          }
        });
      }

      const readyQ = available.filter((p) => p.id !== chosen.id).map((p) => p.id);

      steps.push({
        time: currentTime,
        runningProcess: chosen.id,
        readyQueue: readyQ,
        completedProcesses: Array.from(completed),
        remainingTime: { ...remaining, [chosen.id]: remaining[chosen.id] - 1 },
        actionDescription: `Executing ${chosen.name} (Preemptive Priority=${currentPriority[chosen.id]}, Rem: ${remaining[chosen.id] - 1})`,
      });

      remaining[chosen.id] -= 1;
      currentTime += 1;

      if (remaining[chosen.id] === 0) {
        completed.add(chosen.id);
        runningId = null;
      }
    }

    if (currentBlock) {
      timeline.push(currentBlock);
    }
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime, isPreemptive };
}

/**
 * 6. PRIORITY WITH ROUND-ROBIN FOR EQUAL PRIORITY
 * Highest priority executed first. Equal priorities share CPU via Round Robin quantum.
 * Preempts if a process with strictly higher priority arrives.
 */
export function schedulePriorityRoundRobin(inputProcesses, options = {}) {
  const quantum = Math.max(1, Number(options.quantum) || 2);
  const cs = Math.max(0, Number(options.contextSwitch) || 0);
  const procs = inputProcesses.map((p) => p.clone());
  const timeline = [];
  const steps = [];

  const remaining = {};
  procs.forEach((p) => (remaining[p.id] = p.burstTime));

  const completed = new Set();
  const arrived = new Set();
  let currentTime = 0;
  let lastProcId = null;

  const priorityQueues = {};

  function updateArrivals(time) {
    procs.forEach((p) => {
      if (p.arrivalTime <= time && !arrived.has(p.id) && !completed.has(p.id)) {
        arrived.add(p.id);
        if (!priorityQueues[p.priority]) priorityQueues[p.priority] = [];
        priorityQueues[p.priority].push(p.id);
      }
    });
  }

  updateArrivals(currentTime);

  while (completed.size < procs.length) {
    updateArrivals(currentTime);

    const activePriorities = Object.keys(priorityQueues)
      .map(Number)
      .filter((pri) => priorityQueues[pri] && priorityQueues[pri].length > 0)
      .sort((a, b) => a - b);

    if (activePriorities.length === 0) {
      const unarrived = procs.filter((p) => !completed.has(p.id) && p.arrivalTime > currentTime);
      if (unarrived.length === 0) {
        updateArrivals(currentTime);
        if (Object.keys(priorityQueues).some((pri) => priorityQueues[pri]?.length > 0)) continue;
        break;
      }

      const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));

      if (nextArr > currentTime) {
        timeline.push({
          processId: null,
          processName: 'IDLE',
          startTime: currentTime,
          endTime: nextArr,
          isIdle: true,
        });

        for (let t = currentTime; t < nextArr; t++) {
          steps.push({
            time: t,
            runningProcess: null,
            readyQueue: [],
            completedProcesses: Array.from(completed),
            actionDescription: 'CPU Idle',
          });
        }

        currentTime = nextArr;
      }
      updateArrivals(currentTime);
      continue;
    }

    const highestPri = activePriorities[0];
    const queue = priorityQueues[highestPri];
    const currentId = queue.shift();
    const p = procs.find((proc) => proc.id === currentId);

    // Context switch
    if (cs > 0 && lastProcId !== null && lastProcId !== currentId) {
      timeline.push({
        processId: null,
        processName: 'CS',
        startTime: currentTime,
        endTime: currentTime + cs,
        isContextSwitch: true,
      });
      for (let t = 0; t < cs; t++) {
        updateArrivals(currentTime + t + 1);
        steps.push({
          time: currentTime + t,
          runningProcess: null,
          readyQueue: [currentId, ...queue],
          completedProcesses: Array.from(completed),
          actionDescription: `Context Switch to ${p.name}`,
        });
      }
      currentTime += cs;
    }

    lastProcId = currentId;

    const hasCompetitors = queue.length > 0;
    const maxSlice = hasCompetitors ? quantum : remaining[currentId];
    let executedInSlice = 0;
    const start = currentTime;
    let preemptedByHigher = false;

    while (executedInSlice < maxSlice && remaining[currentId] > 0) {
      updateArrivals(currentTime + 1);

      // Check if a process with HIGHER priority arrived
      const curHigher = Object.keys(priorityQueues)
        .map(Number)
        .filter((pri) => pri < p.priority && priorityQueues[pri] && priorityQueues[pri].length > 0);

      if (curHigher.length > 0) {
        preemptedByHigher = true;
        break;
      }

      const stepTime = currentTime;
      remaining[currentId] -= 1;
      executedInSlice += 1;
      currentTime += 1;

      const allReady = [];
      Object.keys(priorityQueues)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((pri) => {
          allReady.push(...priorityQueues[pri]);
        });

      steps.push({
        time: stepTime,
        runningProcess: p.id,
        readyQueue: [...allReady],
        completedProcesses: Array.from(completed),
        remainingTime: { ...remaining },
        actionDescription: `Executing ${p.name} (Pri=${p.priority}, slice: ${executedInSlice}/${maxSlice})`,
      });
    }

    if (currentTime > start) {
      timeline.push({
        processId: p.id,
        processName: p.name,
        startTime: start,
        endTime: currentTime,
        isIdle: false,
      });
    }

    if (remaining[currentId] === 0) {
      completed.add(currentId);
    } else {
      if (preemptedByHigher) {
        queue.unshift(currentId);
      } else {
        queue.push(currentId);
      }
    }
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime, quantum };
}

/**
 * 7. MULTILEVEL QUEUE SCHEDULING (MLQ)
 * Multiple queues statically assigned.
 * Default:
 * Queue 0: Highest priority (RR with quantum = 4)
 * Queue 1: Medium priority (RR with quantum = 8)
 * Queue 2: Lowest priority (FCFS)
 * Strict priority preemptive across queues.
 */
export function scheduleMultilevelQueue(inputProcesses, options = {}) {
  const q0Quantum = Number(options.q0Quantum) || 4;
  const q1Quantum = Number(options.q1Quantum) || 8;
  const cs = Math.max(0, Number(options.contextSwitch) || 0);
  const procs = inputProcesses.map((p) => p.clone());
  const timeline = [];
  const steps = [];

  const remaining = {};
  procs.forEach((p) => (remaining[p.id] = p.burstTime));

  const completed = new Set();
  const arrived = new Set();
  let currentTime = 0;
  let lastProcId = null;

  const queues = { 0: [], 1: [], 2: [] };

  function updateArrivals(time) {
    procs.forEach((p) => {
      if (p.arrivalTime <= time && !arrived.has(p.id) && !completed.has(p.id)) {
        arrived.add(p.id);
        const qIdx = Math.min(2, Math.max(0, p.queue || 0));
        queues[qIdx].push(p.id);
      }
    });
  }

  updateArrivals(currentTime);

  while (completed.size < procs.length) {
    updateArrivals(currentTime);

    let chosenQ = -1;
    for (let q = 0; q <= 2; q++) {
      if (queues[q].length > 0) {
        chosenQ = q;
        break;
      }
    }

    if (chosenQ === -1) {
      const unarrived = procs.filter((p) => !completed.has(p.id) && p.arrivalTime > currentTime);
      if (unarrived.length === 0) {
        updateArrivals(currentTime);
        if ([0, 1, 2].some((q) => queues[q].length > 0)) continue;
        break;
      }

      const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));

      if (nextArr > currentTime) {
        timeline.push({
          processId: null,
          processName: 'IDLE',
          startTime: currentTime,
          endTime: nextArr,
          isIdle: true,
        });

        for (let t = currentTime; t < nextArr; t++) {
          steps.push({
            time: t,
            runningProcess: null,
            readyQueue: [],
            queues: { 0: [...queues[0]], 1: [...queues[1]], 2: [...queues[2]] },
            completedProcesses: Array.from(completed),
            actionDescription: 'CPU Idle',
          });
        }

        currentTime = nextArr;
      }
      updateArrivals(currentTime);
      continue;
    }

    const currentId = queues[chosenQ].shift();
    const p = procs.find((proc) => proc.id === currentId);

    if (cs > 0 && lastProcId !== null && lastProcId !== currentId) {
      timeline.push({
        processId: null,
        processName: 'CS',
        startTime: currentTime,
        endTime: currentTime + cs,
        isContextSwitch: true,
      });
      for (let t = 0; t < cs; t++) {
        updateArrivals(currentTime + t + 1);
        steps.push({
          time: currentTime + t,
          runningProcess: null,
          readyQueue: [...queues[0], ...queues[1], ...queues[2]],
          queues: { 0: [...queues[0]], 1: [...queues[1]], 2: [...queues[2]] },
          completedProcesses: Array.from(completed),
          actionDescription: `Context Switch to ${p.name}`,
        });
      }
      currentTime += cs;
    }

    lastProcId = currentId;

    let quantum = chosenQ === 0 ? q0Quantum : chosenQ === 1 ? q1Quantum : remaining[currentId];
    let executed = 0;
    const start = currentTime;

    while (executed < quantum && remaining[currentId] > 0) {
      updateArrivals(currentTime + 1);

      let higherArrival = false;
      for (let hq = 0; hq < chosenQ; hq++) {
        if (queues[hq].length > 0) {
          higherArrival = true;
          break;
        }
      }

      if (higherArrival) {
        break;
      }

      const stepTime = currentTime;
      remaining[currentId] -= 1;
      executed += 1;
      currentTime += 1;

      steps.push({
        time: stepTime,
        runningProcess: p.id,
        readyQueue: [...queues[0], ...queues[1], ...queues[2]],
        queues: { 0: [...queues[0]], 1: [...queues[1]], 2: [...queues[2]] },
        completedProcesses: Array.from(completed),
        remainingTime: { ...remaining },
        actionDescription: `Executing ${p.name} from Queue ${chosenQ} (Rem: ${remaining[currentId]})`,
      });
    }

    if (currentTime > start) {
      timeline.push({
        processId: p.id,
        processName: p.name,
        startTime: start,
        endTime: currentTime,
        queueLevel: chosenQ,
        isIdle: false,
      });
    }

    if (remaining[currentId] === 0) {
      completed.add(currentId);
    } else {
      queues[chosenQ].push(currentId);
    }
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime };
}

/**
 * 8. MULTILEVEL FEEDBACK QUEUE (MLFQ)
 * Dynamic process migration between queues:
 * - Queue 0: RR quantum = 8
 * - Queue 1: RR quantum = 16
 * - Queue 2: FCFS
 * Demotion upon quantum expiration.
 * Preemption: Q0 preempts Q1 & Q2; Q1 preempts Q2.
 * Starvation prevention: Aging moves long-waiting processes up.
 */
export function scheduleMLFQ(inputProcesses, options = {}) {
  const q0Quantum = Number(options.q0Quantum) || 8;
  const q1Quantum = Number(options.q1Quantum) || 16;
  const agingThreshold = Number(options.agingThreshold) || 30;
  const cs = Math.max(0, Number(options.contextSwitch) || 0);

  const procs = inputProcesses.map((p) => p.clone());
  const timeline = [];
  const steps = [];

  const remaining = {};
  const currentQueue = {};
  const waitTimeInQueue = {};

  procs.forEach((p) => {
    remaining[p.id] = p.burstTime;
    currentQueue[p.id] = 0;
    waitTimeInQueue[p.id] = 0;
  });

  const completed = new Set();
  const arrived = new Set();
  let currentTime = 0;
  let lastProcId = null;

  const queues = { 0: [], 1: [], 2: [] };

  function updateArrivals(time) {
    procs.forEach((p) => {
      if (p.arrivalTime <= time && !arrived.has(p.id) && !completed.has(p.id)) {
        arrived.add(p.id);
        queues[0].push(p.id);
        currentQueue[p.id] = 0;
      }
    });
  }

  function applyAging() {
    if (agingThreshold <= 0) return;
    [2, 1].forEach((qIdx) => {
      const q = queues[qIdx];
      for (let i = q.length - 1; i >= 0; i--) {
        const pid = q[i];
        waitTimeInQueue[pid]++;
        if (waitTimeInQueue[pid] >= agingThreshold) {
          q.splice(i, 1);
          const newQ = qIdx - 1;
          queues[newQ].push(pid);
          currentQueue[pid] = newQ;
          waitTimeInQueue[pid] = 0;
        }
      }
    });
  }

  updateArrivals(currentTime);

  while (completed.size < procs.length) {
    updateArrivals(currentTime);

    let chosenQ = -1;
    for (let q = 0; q <= 2; q++) {
      if (queues[q].length > 0) {
        chosenQ = q;
        break;
      }
    }

    if (chosenQ === -1) {
      const unarrived = procs.filter((p) => !completed.has(p.id) && p.arrivalTime > currentTime);
      if (unarrived.length === 0) {
        updateArrivals(currentTime);
        if ([0, 1, 2].some((q) => queues[q].length > 0)) continue;
        break;
      }

      const nextArr = Math.min(...unarrived.map((p) => p.arrivalTime));

      if (nextArr > currentTime) {
        timeline.push({
          processId: null,
          processName: 'IDLE',
          startTime: currentTime,
          endTime: nextArr,
          isIdle: true,
        });

        for (let t = currentTime; t < nextArr; t++) {
          steps.push({
            time: t,
            runningProcess: null,
            readyQueue: [],
            queues: { 0: [...queues[0]], 1: [...queues[1]], 2: [...queues[2]] },
            completedProcesses: Array.from(completed),
            actionDescription: 'CPU Idle: Waiting for arrivals',
          });
        }

        currentTime = nextArr;
      }
      updateArrivals(currentTime);
      continue;
    }

    const currentId = queues[chosenQ].shift();
    const p = procs.find((proc) => proc.id === currentId);

    waitTimeInQueue[currentId] = 0;

    if (cs > 0 && lastProcId !== null && lastProcId !== currentId) {
      timeline.push({
        processId: null,
        processName: 'CS',
        startTime: currentTime,
        endTime: currentTime + cs,
        isContextSwitch: true,
      });
      for (let t = 0; t < cs; t++) {
        updateArrivals(currentTime + t + 1);
        applyAging();
        steps.push({
          time: currentTime + t,
          runningProcess: null,
          readyQueue: [...queues[0], ...queues[1], ...queues[2]],
          queues: { 0: [...queues[0]], 1: [...queues[1]], 2: [...queues[2]] },
          completedProcesses: Array.from(completed),
          actionDescription: `Context Switch to ${p.name}`,
        });
      }
      currentTime += cs;
    }

    lastProcId = currentId;

    const maxQuantum = chosenQ === 0 ? q0Quantum : chosenQ === 1 ? q1Quantum : remaining[currentId];
    let executed = 0;
    const start = currentTime;
    let preemptedByHigher = false;

    while (executed < maxQuantum && remaining[currentId] > 0) {
      updateArrivals(currentTime + 1);
      applyAging();

      for (let hq = 0; hq < chosenQ; hq++) {
        if (queues[hq].length > 0) {
          preemptedByHigher = true;
          break;
        }
      }
      if (preemptedByHigher) break;

      const stepTime = currentTime;
      remaining[currentId] -= 1;
      executed += 1;
      currentTime += 1;

      steps.push({
        time: stepTime,
        runningProcess: p.id,
        readyQueue: [...queues[0], ...queues[1], ...queues[2]],
        queues: { 0: [...queues[0]], 1: [...queues[1]], 2: [...queues[2]] },
        completedProcesses: Array.from(completed),
        remainingTime: { ...remaining },
        actionDescription: `Executing ${p.name} in Q${chosenQ} (Slice: ${executed}/${maxQuantum}, Rem: ${remaining[currentId]})`,
      });
    }

    if (currentTime > start) {
      timeline.push({
        processId: p.id,
        processName: p.name,
        startTime: start,
        endTime: currentTime,
        queueLevel: chosenQ,
        isIdle: false,
      });
    }

    if (remaining[currentId] === 0) {
      completed.add(currentId);
    } else {
      if (preemptedByHigher) {
        queues[chosenQ].unshift(currentId);
      } else {
        const nextQ = Math.min(2, chosenQ + 1);
        queues[nextQ].push(currentId);
        currentQueue[currentId] = nextQ;
      }
    }
  }

  const { processStats, summary } = computeMetrics(procs, timeline, currentTime, cs);
  return { timeline, steps, processStats, summary, totalTime: currentTime };
}
