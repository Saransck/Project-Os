/**
 * Presets matching Chapter 4 Operating Systems Slides & Silberschatz textbook
 */

export const PRESETS = {
  slide24_fcfs: {
    id: 'slide24_fcfs',
    name: 'Slide 24: FCFS Convoy Effect (Long P1)',
    algorithm: 'FCFS',
    description: 'P1(24ms), P2(3ms), P3(3ms) arriving at t=0. Illustrates convoy effect with Average Waiting Time = 17ms.',
    options: { contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 24, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
    ],
  },

  slide26_fcfs_opt: {
    id: 'slide26_fcfs_opt',
    name: 'Slide 26: FCFS Short First Order',
    algorithm: 'FCFS',
    description: 'Arriving order P2, P3, P1 at t=0. Drastically lowers Average Waiting Time to 3ms.',
    options: { contextSwitch: 0 },
    processes: [
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 24, priority: 1, queue: 0 },
    ],
  },

  slide30_sjf: {
    id: 'slide30_sjf',
    name: 'Slide 30: SJF (Non-preemptive)',
    algorithm: 'SJF',
    description: 'P1(6), P2(8), P3(7), P4(3) at t=0. Optimal scheduling yielding Average Waiting Time = 7ms.',
    options: { contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 6, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 8, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 7, priority: 1, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
    ],
  },

  slide36_srtf: {
    id: 'slide36_srtf',
    name: 'Slide 36: SRTF / Preemptive SJF',
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

  slide40_rr: {
    id: 'slide40_rr',
    name: 'Slide 40: Round Robin (Time Quantum = 4)',
    algorithm: 'RR',
    description: 'P1(24), P2(3), P3(3) with Quantum = 4ms. P1 gets 4ms, then P2 finishes (3ms), P3 finishes (3ms). Avg WT = 5.66ms.',
    options: { quantum: 4, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 24, priority: 1, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 3, priority: 1, queue: 0 },
    ],
  },

  slide48_priority: {
    id: 'slide48_priority',
    name: 'Slide 48: Priority Non-preemptive',
    algorithm: 'PRIORITY_NP',
    description: 'P1(BT 10, Pri 3), P2(BT 1, Pri 1), P3(BT 2, Pri 4), P4(BT 1, Pri 5), P5(BT 5, Pri 2). Avg WT = 8.2ms.',
    options: { preemptive: false, agingRate: 0, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 10, priority: 3, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 1, priority: 1, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 2, priority: 4, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 0, burstTime: 1, priority: 5, queue: 0 },
      { id: 5, name: 'P5', arrivalTime: 0, burstTime: 5, priority: 2, queue: 0 },
    ],
  },

  slide53_priority_rr: {
    id: 'slide53_priority_rr',
    name: 'Slide 53: Priority with Round-Robin (q=2)',
    algorithm: 'PRIORITY_RR',
    description: 'Combines Priority with Round-Robin for equal priority. P4(Pri 1), P2&P3(Pri 2, RR q=2), P1&P5(Pri 3, RR q=2).',
    options: { quantum: 2, contextSwitch: 0 },
    processes: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 4, priority: 3, queue: 0 },
      { id: 2, name: 'P2', arrivalTime: 0, burstTime: 5, priority: 2, queue: 0 },
      { id: 3, name: 'P3', arrivalTime: 0, burstTime: 8, priority: 2, queue: 0 },
      { id: 4, name: 'P4', arrivalTime: 0, burstTime: 7, priority: 1, queue: 0 },
      { id: 5, name: 'P5', arrivalTime: 0, burstTime: 3, priority: 3, queue: 0 },
    ],
  },

  slide63_mlfq: {
    id: 'slide63_mlfq',
    name: 'Slide 63: Multilevel Feedback Queue (Q0: q=8, Q1: q=16, Q2: FCFS)',
    algorithm: 'MLFQ',
    description: '3-Queue feedback scheduler. Short processes finish in Q0, medium demote to Q1, long demote to Q2.',
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
    name: 'Slide 57: Multilevel Queue (Interactive vs Batch)',
    algorithm: 'MLQ',
    description: 'Queue 0: Real-time/System (RR q=4), Queue 1: Interactive (RR q=8), Queue 2: Batch (FCFS).',
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
