/**
 * CPU Scheduling Simulator — Core Scheduling Algorithms & Pure Functions
 * Reference: Silberschatz, Galvin & Gagne (2018). Operating System Concepts. Chapter 4/5.
 * 
 * Supports:
 * - FCFS (First-Come, First-Served)
 * - SJF (Shortest-Job-First, Non-preemptive)
 * - SRTF (Shortest-Remaining-Time-First / Preemptive SJF)
 * - Round Robin (RR)
 * - Priority (Non-preemptive)
 * - Priority (Preemptive)
 * - Priority + Round Robin (Hybrid)
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CPUScheduler = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const ALGO_LABELS = {
        fcfs: 'FCFS',
        sjf: 'SJF',
        sjf_preemptive: 'SRTF',
        rr: 'Round Robin',
        priority: 'Priority',
        priority_preemptive: 'Priority (Pre)',
        priority_rr: 'Priority + RR',
    };

    const ALL_ALGO_KEYS = Object.keys(ALGO_LABELS);
    const QUANTUM_ALGOS = ['rr', 'priority_rr'];
    const PRIORITY_ALGOS = ['priority', 'priority_preemptive', 'priority_rr'];
    const MAX_ITER = 100000;

    /**
     * Build result object for a completed process.
     * CT = finish
     * TAT = finish - arrival
     * WT = turnaround - burst
     * RT = firstStart - arrival
     */
    function buildResult(p, start, finish) {
        const ct = finish;
        const tat = ct - p.arrival;
        const wt = tat - p.burst;
        const rt = (p.firstStart >= 0 ? p.firstStart : start) - p.arrival;
        return {
            id: p.id,
            name: p.name,
            arrival: p.arrival,
            burst: p.burst,
            priority: p.priority,
            start: p.firstStart >= 0 ? p.firstStart : start,
            finish: ct,
            waiting: Math.max(0, wt),
            turnaround: Math.max(0, tat),
            response: Math.max(0, rt),
            color: p.color,
        };
    }

    /**
     * Helper to append an idle block to Gantt chart if gap exists.
     */
    function emitIdle(gantt, time, target) {
        if (time < target) {
            gantt.push({ pid: null, name: 'idle', start: time, end: target, color: null });
            return target;
        }
        return time;
    }

    /**
     * 1. First-Come, First-Served (FCFS) — Non-preemptive
     */
    function scheduleFCFS(procs) {
        const sorted = [...procs].sort((a, b) => a.arrival - b.arrival || a.id - b.id);
        const gantt = [];
        const results = {};
        let time = 0;

        for (const p of sorted) {
            time = emitIdle(gantt, time, p.arrival);
            const start = time;
            const end = start + p.burst;
            if (p.burst > 0) {
                gantt.push({ pid: p.id, name: p.name, start, end, color: p.color });
            }
            results[p.id] = buildResult(p, start, end);
            time = end;
        }

        return { gantt, results };
    }

    /**
     * 2. Shortest-Job-First (SJF) — Non-preemptive
     * Ties broken by FCFS (Arrival Time, then ID)
     */
    function scheduleSJF(procs) {
        const pool = procs.map(p => ({ ...p, done: false }));
        const gantt = [];
        const results = {};
        let time = 0;
        let completed = 0;

        // Immediately finalize 0-burst processes arriving at 0
        pool.filter(p => p.burst === 0 && p.arrival <= time).forEach(p => {
            p.done = true;
            results[p.id] = buildResult(p, time, time);
            completed++;
        });

        while (completed < pool.length) {
            const avail = pool.filter(p => !p.done && p.arrival <= time);
            if (!avail.length) {
                const uncompleted = pool.filter(p => !p.done).sort((a, b) => a.arrival - b.arrival || a.id - b.id);
                if (!uncompleted.length) break;
                time = emitIdle(gantt, time, uncompleted[0].arrival);
                const zeroJobs = pool.filter(p => !p.done && p.burst === 0 && p.arrival <= time);
                if (zeroJobs.length) {
                    zeroJobs.forEach(p => {
                        p.done = true;
                        results[p.id] = buildResult(p, time, time);
                        completed++;
                    });
                    continue;
                }
                continue;
            }

            // Shortest burst, ties by arrival, then id
            avail.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id - b.id);
            const p = avail[0];
            const start = time;
            const end = start + p.burst;
            if (p.burst > 0) {
                gantt.push({ pid: p.id, name: p.name, start, end, color: p.color });
            }
            results[p.id] = buildResult(p, start, end);
            p.done = true;
            time = end;
            completed++;
        }

        return { gantt, results };
    }

    /**
     * Coalesce consecutive blocks of the same process into gantt.
     */
    function flushBlock(gantt, pool, pid, start, end) {
        if (start >= end) return;
        const p = pool.find(x => x.id === pid);
        if (p) {
            gantt.push({ pid, name: p.name, start, end, color: p.color });
        }
    }

    /**
     * Generic unit-time preemptive scheduler for SRTF and Priority Preemptive.
     * key(p): smaller wins (rem for SRTF, priority for Priority)
     */
    function schedulePreemptiveByKey(procs, key) {
        const pool = procs.map(p => ({ ...p, rem: p.burst, firstStart: -1, done: false }));
        const gantt = [];
        const results = {};
        let time = 0;
        let completed = 0;
        let prevPid = null;
        let blockStart = 0;

        pool.filter(p => p.burst === 0 && p.arrival <= time).forEach(p => {
            p.done = true;
            p.firstStart = time;
            results[p.id] = buildResult(p, time, time);
            completed++;
        });

        const totalBurst = procs.reduce((s, p) => s + p.burst, 0);
        const maxArr = procs.length ? Math.max(...procs.map(p => p.arrival)) : 0;
        const maxT = totalBurst + maxArr + 1000;

        while (completed < pool.length && time <= maxT) {
            const zeroArrived = pool.filter(p => !p.done && p.burst === 0 && p.arrival <= time);
            if (zeroArrived.length) {
                for (const zp of zeroArrived) {
                    zp.done = true;
                    zp.firstStart = time;
                    results[zp.id] = buildResult(zp, time, time);
                    completed++;
                }
                if (completed >= pool.length) break;
            }

            const avail = pool.filter(p => !p.done && p.arrival <= time && p.rem > 0);
            if (!avail.length) {
                if (prevPid !== null) {
                    flushBlock(gantt, pool, prevPid, blockStart, time);
                    prevPid = null;
                }
                const nextJob = pool.filter(p => !p.done).sort((a, b) => a.arrival - b.arrival || a.id - b.id)[0];
                if (!nextJob) break;
                time = emitIdle(gantt, time, nextJob.arrival);
                blockStart = time;
                continue;
            }

            // Strictly less required to preempt currently running process
            const minKey = Math.min(...avail.map(p => key(p)));
            const runningProc = avail.find(p => p.id === prevPid);

            let selected;
            if (runningProc && key(runningProc) === minKey) {
                selected = runningProc;
            } else {
                avail.sort((a, b) => key(a) - key(b) || a.arrival - b.arrival || a.id - b.id);
                selected = avail[0];
            }

            if (selected.id !== prevPid) {
                if (prevPid !== null) {
                    flushBlock(gantt, pool, prevPid, blockStart, time);
                }
                blockStart = time;
                prevPid = selected.id;
            }

            if (selected.firstStart < 0) {
                selected.firstStart = time;
            }

            selected.rem--;
            time++;

            if (selected.rem === 0) {
                flushBlock(gantt, pool, selected.id, blockStart, time);
                results[selected.id] = buildResult(selected, selected.firstStart, time);
                selected.done = true;
                completed++;
                prevPid = null;
                blockStart = time;
            }
        }

        if (prevPid !== null) {
            flushBlock(gantt, pool, prevPid, blockStart, time);
        }

        return { gantt, results };
    }

    /**
     * 3. Shortest Remaining Time First (SRTF / Preemptive SJF)
     */
    function scheduleSRTF(procs) {
        return schedulePreemptiveByKey(procs, p => p.rem);
    }

    /**
     * 4. Round Robin (RR)
     */
    function scheduleRR(procs, quantum) {
        const q = Math.max(1, quantum || 1);
        const pool = procs.map(p => ({ ...p, rem: p.burst, firstStart: -1, done: false }));
        const sorted = [...pool].sort((a, b) => a.arrival - b.arrival || a.id - b.id);
        const queue = [];
        const gantt = [];
        const results = {};
        const queueTrace = [];
        let time = 0;
        let completed = 0;
        let nextIdx = 0;
        let iter = 0;

        const admit = (t) => {
            while (nextIdx < sorted.length && sorted[nextIdx].arrival <= t) {
                const candidate = sorted[nextIdx++];
                if (candidate.burst === 0) {
                    candidate.done = true;
                    candidate.firstStart = t;
                    results[candidate.id] = buildResult(candidate, t, t);
                    completed++;
                } else {
                    queue.push(candidate);
                }
            }
        };

        admit(time);

        while (completed < pool.length && iter < MAX_ITER) {
            iter++;
            if (!queue.length) {
                if (nextIdx >= sorted.length) break;
                time = emitIdle(gantt, time, sorted[nextIdx].arrival);
                admit(time);
                if (!queue.length) continue;
            }

            const p = queue.shift();
            if (p.firstStart < 0) {
                p.firstStart = time;
            }

            const exec = Math.min(q, p.rem);

            for (let tt = time; tt < time + exec; tt++) {
                const currentOrder = queue.map(x => x.id);
                for (let k = nextIdx; k < sorted.length && sorted[k].arrival <= tt; k++) {
                    if (sorted[k].burst > 0 && !currentOrder.includes(sorted[k].id)) {
                        currentOrder.push(sorted[k].id);
                    }
                }
                queueTrace[tt] = currentOrder;
            }

            gantt.push({ pid: p.id, name: p.name, start: time, end: time + exec, color: p.color });
            time += exec;
            p.rem -= exec;

            admit(time);

            if (p.rem > 0) {
                queue.push(p);
            } else {
                p.done = true;
                results[p.id] = buildResult(p, p.firstStart, time);
                completed++;
            }
        }

        return { gantt, results, queueTrace, quantum: q };
    }

    /**
     * 5. Priority Scheduling (Non-preemptive)
     */
    function schedulePriority(procs) {
        const pool = procs.map(p => ({ ...p, done: false }));
        const gantt = [];
        const results = {};
        let time = 0;
        let completed = 0;

        pool.filter(p => p.burst === 0 && p.arrival <= time).forEach(p => {
            p.done = true;
            results[p.id] = buildResult(p, time, time);
            completed++;
        });

        while (completed < pool.length) {
            const avail = pool.filter(p => !p.done && p.arrival <= time);
            if (!avail.length) {
                const uncompleted = pool.filter(p => !p.done).sort((a, b) => a.arrival - b.arrival || a.id - b.id);
                if (!uncompleted.length) break;
                time = emitIdle(gantt, time, uncompleted[0].arrival);
                const zeroJobs = pool.filter(p => !p.done && p.burst === 0 && p.arrival <= time);
                if (zeroJobs.length) {
                    zeroJobs.forEach(p => {
                        p.done = true;
                        results[p.id] = buildResult(p, time, time);
                        completed++;
                    });
                    continue;
                }
                continue;
            }

            avail.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival || a.id - b.id);
            const p = avail[0];
            const start = time;
            const end = start + p.burst;
            if (p.burst > 0) {
                gantt.push({ pid: p.id, name: p.name, start, end, color: p.color });
            }
            results[p.id] = buildResult(p, start, end);
            p.done = true;
            time = end;
            completed++;
        }

        return { gantt, results };
    }

    /**
     * 6. Priority Scheduling (Preemptive)
     */
    function schedulePriorityPre(procs) {
        return schedulePreemptiveByKey(procs, p => p.priority);
    }

    /**
     * 7. Priority + Round Robin (Hybrid)
     */
    function schedulePriorityRR(procs, quantum) {
        const q = Math.max(1, quantum || 1);
        const pool = procs.map(p => ({ ...p, rem: p.burst, firstStart: -1, done: false }));
        const sorted = [...pool].sort((a, b) => a.arrival - b.arrival || a.id - b.id);
        const levels = new Map();
        const gantt = [];
        const results = {};
        const queueTrace = [];
        let time = 0;
        let completed = 0;
        let nextIdx = 0;
        let running = null;
        let used = 0;
        let blockStart = 0;

        const enqueue = (p) => {
            if (!levels.has(p.priority)) levels.set(p.priority, []);
            levels.get(p.priority).push(p);
        };

        const admit = (t) => {
            while (nextIdx < sorted.length && sorted[nextIdx].arrival <= t) {
                const p = sorted[nextIdx++];
                if (p.burst === 0) {
                    p.done = true;
                    p.firstStart = t;
                    results[p.id] = buildResult(p, t, t);
                    completed++;
                } else {
                    enqueue(p);
                }
            }
        };

        const bestLevel = () => {
            let best = null;
            for (const [pr, arr] of levels) {
                if (arr.length && (best === null || pr < best)) {
                    best = pr;
                }
            }
            return best;
        };

        const readyOrder = () => [...levels.keys()].sort((a, b) => a - b).flatMap(pr => levels.get(pr).map(p => p.id));

        admit(time);
        const totalBurst = procs.reduce((s, p) => s + p.burst, 0);
        const maxArr = procs.length ? Math.max(...procs.map(p => p.arrival)) : 0;
        const maxT = totalBurst + maxArr + 1000;

        while (completed < pool.length && time <= maxT) {
            if (running) {
                const bl = bestLevel();
                const higherArrived = bl !== null && bl < running.priority;
                const quantumUp = used >= q && bl !== null && bl === running.priority;

                if (higherArrived || quantumUp) {
                    gantt.push({ pid: running.id, name: running.name, start: blockStart, end: time, color: running.color });
                    enqueue(running);
                    running = null;
                } else if (used >= q) {
                    used = 0;
                }
            }

            if (!running) {
                const bl = bestLevel();
                if (bl === null) {
                    if (nextIdx >= sorted.length) break;
                    time = emitIdle(gantt, time, sorted[nextIdx].arrival);
                    admit(time);
                    continue;
                }
                running = levels.get(bl).shift();
                used = 0;
                blockStart = time;
                if (running.firstStart < 0) {
                    running.firstStart = time;
                }
            }

            queueTrace[time] = readyOrder();
            running.rem--;
            used++;
            time++;

            admit(time);

            if (running.rem === 0) {
                gantt.push({ pid: running.id, name: running.name, start: blockStart, end: time, color: running.color });
                results[running.id] = buildResult(running, running.firstStart, time);
                running.done = true;
                completed++;
                running = null;
            }
        }

        if (running) {
            gantt.push({ pid: running.id, name: running.name, start: blockStart, end: time, color: running.color });
            results[running.id] = buildResult(running, running.firstStart, time);
        }

        return { gantt, results, queueTrace, quantum: q };
    }

    /**
     * Dispatcher map
     */
    const ALGO_FN = {
        fcfs: scheduleFCFS,
        sjf: scheduleSJF,
        sjf_preemptive: scheduleSRTF,
        rr: scheduleRR,
        priority: schedulePriority,
        priority_preemptive: schedulePriorityPre,
        priority_rr: schedulePriorityRR,
    };

    function dispatch(algo, procs, quantum) {
        const fn = ALGO_FN[algo];
        if (!fn) throw new Error(`Unknown algorithm: ${algo}`);
        return QUANTUM_ALGOS.includes(algo) ? fn(procs, quantum) : fn(procs);
    }

    /**
     * Compute statistics:
     * - makespan (totalTime)
     * - idleTime
     * - cpuUtil (%)
     * - throughput (processes / time)
     * - contextSwitches:
     *     - voluntary: previous process finished at boundary
     *     - nonvoluntary: previous process was preempted at boundary
     */
    function computeStats(result, n) {
        const g = result.gantt;
        if (!g || !g.length) {
            return {
                totalTime: 0,
                idleTime: 0,
                cpuUtil: 0,
                throughput: 0,
                contextSwitches: 0,
                voluntary: 0,
                nonvoluntary: 0,
            };
        }

        const totalTime = g[g.length - 1].end;
        let idleTime = 0;
        let voluntary = 0;
        let nonvoluntary = 0;
        let prev = null;

        for (const b of g) {
            if (b.pid === null) {
                idleTime += (b.end - b.start);
                prev = null;
                continue;
            }

            if (prev && prev.pid !== b.pid && prev.end === b.start) {
                const prevRes = result.results[prev.pid];
                if (prevRes && prevRes.finish === prev.end) {
                    voluntary++;
                } else {
                    nonvoluntary++;
                }
            }
            prev = b;
        }

        return {
            totalTime,
            idleTime,
            cpuUtil: totalTime > 0 ? ((totalTime - idleTime) / totalTime) * 100 : 0,
            throughput: totalTime > 0 ? n / totalTime : 0,
            contextSwitches: voluntary + nonvoluntary,
            voluntary,
            nonvoluntary,
        };
    }

    /**
     * Compute average metrics: waiting, turnaround, response
     */
    function averages(result) {
        const vals = Object.values(result.results);
        const n = vals.length || 1;
        return {
            avgWaiting: vals.reduce((s, v) => s + v.waiting, 0) / n,
            avgTurnaround: vals.reduce((s, v) => s + v.turnaround, 0) / n,
            avgResponse: vals.reduce((s, v) => s + v.response, 0) / n,
        };
    }

    /**
     * Comparator for ready queue sorting in animation view
     */
    function readyComparator(algo, rem) {
        const fifo = (a, b) => a.arrival - b.arrival || a.id - b.id;
        switch (algo) {
            case 'sjf':
                return (a, b) => a.burst - b.burst || fifo(a, b);
            case 'sjf_preemptive':
                return (a, b) => (rem.get(a.id) ?? a.burst) - (rem.get(b.id) ?? b.burst) || fifo(a, b);
            case 'priority':
            case 'priority_preemptive':
            case 'priority_rr':
                return (a, b) => a.priority - b.priority || fifo(a, b);
            default:
                return fifo;
        }
    }

    /**
     * Build Step-by-Step animation timeline with Decision Reasoning
     */
    function buildAnimTimeline(result, procs, algo) {
        const g = result.gantt;
        if (!g || !g.length) return [];
        const totalTime = g[g.length - 1].end;
        const byId = new Map(procs.map(p => [p.id, p]));
        const finish = new Map(procs.map(p => [p.id, result.results[p.id]?.finish ?? 0]));
        const rem = new Map(procs.map(p => [p.id, p.burst]));
        const cmp = readyComparator(algo, rem);
        const chip = (p) => ({
            pid: p.id,
            name: p.name,
            color: p.color,
            arrival: p.arrival,
            burst: p.burst,
            priority: p.priority,
            rem: rem.get(p.id),
            finish: finish.get(p.id),
        });

        const timeline = [];
        let bi = 0;
        let prevRunningId = null;

        for (let t = 0; t <= totalTime; t++) {
            while (bi < g.length && g[bi].end <= t) bi++;
            const runningId = (bi < g.length && g[bi].start <= t && g[bi].pid !== null) ? g[bi].pid : null;

            const completed = procs
                .filter(p => finish.get(p.id) <= t)
                .sort((a, b) => finish.get(a.id) - finish.get(b.id) || a.id - b.id);

            const ready = procs.filter(p => p.arrival <= t && finish.get(p.id) > t && p.id !== runningId);
            const trace = result.queueTrace && result.queueTrace[t];
            if (trace) {
                const pos = new Map(trace.map((id, i) => [id, i]));
                const at = (p) => (pos.has(p.id) ? pos.get(p.id) : Infinity);
                ready.sort((a, b) => (at(a) - at(b)) || cmp(a, b));
            } else {
                ready.sort(cmp);
            }

            // Scheduling Decision Reason logic
            let reason = { key: 'pipe.reason.idle', vars: { t } };
            if (runningId !== null) {
                const rp = byId.get(runningId);
                const currentRem = rem.get(runningId);
                const isSwitch = (prevRunningId !== runningId);

                if (isSwitch) {
                    if (algo === 'sjf_preemptive' && prevRunningId !== null && (finish.get(prevRunningId) || 0) > t) {
                        const prevP = byId.get(prevRunningId);
                        reason = {
                            key: 'pipe.reason.preempt_srtf',
                            vars: {
                                name: rp.name,
                                rem: currentRem,
                                prev: prevP.name,
                                prevRem: rem.get(prevRunningId)
                            }
                        };
                    } else if (algo === 'priority_preemptive' && prevRunningId !== null && (finish.get(prevRunningId) || 0) > t) {
                        const prevP = byId.get(prevRunningId);
                        reason = {
                            key: 'pipe.reason.preempt_pri',
                            vars: {
                                name: rp.name,
                                pri: rp.priority,
                                prev: prevP.name,
                                prevPri: prevP.priority
                            }
                        };
                    } else if (algo === 'rr') {
                        reason = {
                            key: 'pipe.reason.rr_slice',
                            vars: { name: rp.name, q: (result.quantum || 4) }
                        };
                    } else if (algo === 'sjf') {
                        reason = {
                            key: 'pipe.reason.start',
                            vars: { name: rp.name, detail: 'Shortest burst: ' + rp.burst + ' ms' }
                        };
                    } else if (algo === 'priority') {
                        reason = {
                            key: 'pipe.reason.start',
                            vars: { name: rp.name, detail: 'Highest priority: ' + rp.priority }
                        };
                    } else if (algo === 'fcfs') {
                        reason = {
                            key: 'pipe.reason.start',
                            vars: { name: rp.name, detail: 'Arrival FIFO order' }
                        };
                    } else {
                        reason = {
                            key: 'pipe.reason.start',
                            vars: { name: rp.name, detail: 'Priority ' + rp.priority }
                        };
                    }
                } else {
                    reason = {
                        key: 'pipe.reason.running',
                        vars: { name: rp.name, rem: currentRem }
                    };
                }
            }

            timeline.push({
                time: t,
                running: runningId !== null ? chip(byId.get(runningId)) : null,
                readyQueue: ready.map(chip),
                completed: completed.map(chip),
                reason,
                ganttUpTo: g.filter(b => b.start < t).map(b => ({ ...b, end: Math.min(b.end, t) })),
            });

            prevRunningId = runningId;

            if (runningId !== null) {
                rem.set(runningId, Math.max(0, (rem.get(runningId) || 0) - 1));
            }
        }

        return timeline;
    }

    return {
        ALGO_LABELS,
        ALL_ALGO_KEYS,
        QUANTUM_ALGOS,
        PRIORITY_ALGOS,
        buildResult,
        emitIdle,
        scheduleFCFS,
        scheduleSJF,
        schedulePreemptiveByKey,
        scheduleSRTF,
        scheduleRR,
        schedulePriority,
        schedulePriorityPre,
        schedulePriorityRR,
        computeStats,
        averages,
        readyComparator,
        buildAnimTimeline,
        dispatch,
    };
}));
