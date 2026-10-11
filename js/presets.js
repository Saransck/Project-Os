/**
 * Presets matching Chapter 4 Operating Systems Slides & Silberschatz textbook
 */

export const PRESETS = {
  fcfs_convoy: {
    id: 'fcfs_convoy',
    name: 'FCFS: Convoy Effect (Long Burst First)',
    algorithm: 'FCFS',
    description: 'P1(24ms), P2(3ms), P3(3ms) arriving at t=0. Demonstrates convoy effect where short processes wait behind a long process (Avg WT = 17ms).',
    options: { contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 24, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
    ],
  },

  fcfs_short_first: {
    id: 'fcfs_short_first',
    name: 'FCFS: Short Burst First (Optimized Order)',
    algorithm: 'FCFS',
    description: 'Order P2, P3, P1 at t=0. Demonstrates substantial waiting time reduction when short processes are served first (Avg WT = 3ms).',
    options: { contextSwitch: 0 },
    processes: [
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 24, priority: 1, queue: 0 },
    ],
  },

  sjf_non_preemptive: {
    id: 'sjf_non_preemptive',
    name: 'SJF: Non-preemptive Batch',
    algorithm: 'SJF',
    description: 'P1(6), P2(8), P3(7), P4(3) at t=0. Optimal scheduling yielding minimum average waiting time (Avg WT = 7ms).',
    options: { contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 6, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 8, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 7, priority: 1, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
    ],
  },

  srtf_preemptive: {
    id: 'srtf_preemptive',
    name: 'SRTF: Shortest Remaining Time First (Preemptive SJF)',
    algorithm: 'SRTF',
    description: 'P1(AT 0, BT 8), P2(AT 1, BT 4), P3(AT 2, BT 9), P4(AT 3, BT 5). P2 preempts P1 at t=1. Avg WT = 6.5ms.',
    options: { contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 1, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 1, queue: 0 },
    ],
  },

  round_robin_q4: {
    id: 'round_robin_q4',
    name: 'Round Robin: Standard Quantum (q = 4)',
    algorithm: 'RR',
    description: 'P1(24), P2(3), P3(3) with Quantum = 4ms. Fair time-slicing among active processes (Avg WT = 5.67ms).',
    options: { quantum: 4, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 24, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
    ],
  },

  priority_non_preemptive: {
    id: 'priority_non_preemptive',
    name: 'Priority: Non-preemptive Execution',
    algorithm: 'PRIORITY_NP',
    description: 'P1(BT 10, Pri 3), P2(BT 1, Pri 1), P3(BT 2, Pri 4), P4(BT 1, Pri 5), P5(BT 5, Pri 2). Lower number = higher priority. Avg WT = 8.2ms.',
    options: { preemptive: false, agingRate: 0, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 10, priority: 3, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 1, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 2, priority: 4, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 0, burstTime: 1, priority: 5, queue: 0 },
      { id: 5, name: 'P5', arrivalTime: 0, burstTime: 5, priority: 2, queue: 0 },
    ],
  },

  priority_with_rr: {
    id: 'priority_with_rr',
    name: 'Priority + Round Robin (Equal Priority RR, q = 2)',
    algorithm: 'PRIORITY_RR',
    description: 'Executes highest priority first; processes sharing equal priority are round-robined with quantum 2ms.',
    options: { quantum: 2, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 4, priority: 3, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 5, priority: 2, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 8, priority: 2, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 0, burstTime: 7, priority: 1, queue: 0 },
      { id: 5, name: 'P5', arrivalTime: 0, burstTime: 3, priority: 3, queue: 0 },
    ],
  },

  mlfq_3level: {
    id: 'mlfq_3level',
    name: 'Multilevel Feedback Queue (Q0: q=8, Q1: q=16, Q2: FCFS)',
    algorithm: 'MLFQ',
    description: '3-tier feedback queues. Short jobs finish quickly in Q0, medium sink to Q1, long jobs execute in Q2.',
    options: { q0Quantum: 8, q1Quantum: 16, agingThreshold: 25, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 6, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 2, burstTime: 18, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 4, burstTime: 30, priority: 1, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 6, burstTime: 5, priority: 1, queue: 0 },
    ],
  },

  multilevel_queue: {
    id: 'multilevel_queue',
    name: 'Multilevel Queue: System vs Interactive vs Batch',
    algorithm: 'MLQ',
    description: 'Static partition: Q0 (System/RR q=4), Q1 (Interactive/RR q=8), Q2 (Batch/FCFS).',
    options: { q0Quantum: 4, q1Quantum: 8, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1 (Sys)', arrivalTime: 0, burstTime: 6, priority: 1, queue: 0 },
      { id: 2, name: 'P2 (UI)', arrivalTime: 1, burstTime: 9, priority: 2, queue: 1 },
      { id: 3, name: 'P3 (Batch)', arrivalTime: 2, burstTime: 12, priority: 3, queue: 2 },
      { id: 4, name: 'P4 (Sys)', arrivalTime: 5, burstTime: 4, priority: 1, queue: 0 },
      { id: 5, name: 'P5 (UI)', arrivalTime: 8, burstTime: 5, priority: 2, queue: 1 },
    ],
  },
};

/**
 * Generate random workload with reasonable bounds
 */
export function generateRandomWorkload(count = 5, maxArrival = 10, maxBurst = 12, maxPriority = 5) {
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push({
      id: i,
      name: `P${i}`,
      arrivalTime: Math.floor(Math.random() * (maxArrival + 1)),
      burstTime: Math.floor(Math.random() * maxBurst) + 1,
      priority: Math.floor(Math.random() * maxPriority) + 1,
      queue: Math.floor(Math.random() * 3),
    });
  }
  // Ensure at least one process arrives at t=0
  result[0].arrivalTime = 0;
  result.sort((a, b) => a.arrivalTime - b.arrivalTime);
  return result;
}
