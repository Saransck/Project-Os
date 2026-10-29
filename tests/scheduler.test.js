const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
    scheduleFCFS,
    scheduleSJF,
    scheduleSRTF,
    scheduleRR,
    schedulePriority,
    schedulePriorityPre,
    schedulePriorityRR,
    computeStats,
    averages,
    buildAnimTimeline,
    dispatch,
} = require('../scheduler.js');

describe('CPU Scheduling Engine Unit Tests', () => {

    // Helper to generate processes
    const p = (id, name, arrival, burst, priority = 0) => ({
        id,
        name,
        arrival,
        burst,
        priority,
        color: '#60A5FA',
    });

    // ─────────────────────────────────────────────────────────────
    // 1. FCFS Classic (Silberschatz p.25)
    // ─────────────────────────────────────────────────────────────
    test('1. FCFS Classic Preset (p.25)', () => {
        const procs = [
            p(1, 'P1', 0, 24),
            p(2, 'P2', 0, 3),
            p(3, 'P3', 0, 3),
        ];
        const res = scheduleFCFS(procs);
        const stats = computeStats(res, procs.length);
        const avg = averages(res);

        // Verification of Gantt
        assert.deepEqual(
            res.gantt.map(b => ({ pid: b.pid, start: b.start, end: b.end })),
            [
                { pid: 1, start: 0, end: 24 },
                { pid: 2, start: 24, end: 27 },
                { pid: 3, start: 27, end: 30 },
            ]
        );

        // CT, TAT = CT - AT, WT = TAT - BT, RT = Start - AT
        assert.equal(res.results[1].finish, 24);
        assert.equal(res.results[1].turnaround, 24);
        assert.equal(res.results[1].waiting, 0);
        assert.equal(res.results[1].response, 0);

        assert.equal(res.results[2].finish, 27);
        assert.equal(res.results[2].turnaround, 27);
        assert.equal(res.results[2].waiting, 24);
        assert.equal(res.results[2].response, 24);

        assert.equal(res.results[3].finish, 30);
        assert.equal(res.results[3].turnaround, 30);
        assert.equal(res.results[3].waiting, 27);
        assert.equal(res.results[3].response, 27);

        assert.equal(avg.avgWaiting, 17.0);
        assert.equal(avg.avgTurnaround, 27.0);
        assert.equal(avg.avgResponse, 17.0);

        assert.equal(stats.totalTime, 30);
        assert.equal(stats.idleTime, 0);
        assert.equal(stats.cpuUtil, 100);
        assert.equal(stats.contextSwitches, 2);
        assert.equal(stats.voluntary, 2);
        assert.equal(stats.nonvoluntary, 0);
    });

    // ─────────────────────────────────────────────────────────────
    // 2. Convoy Effect in FCFS
    // ─────────────────────────────────────────────────────────────
    test('2. FCFS Convoy Effect (Short jobs first)', () => {
        const procs = [
            p(1, 'P1', 0, 3),
            p(2, 'P2', 0, 3),
            p(3, 'P3', 0, 24),
        ];
        const res = scheduleFCFS(procs);
        const avg = averages(res);
        const stats = computeStats(res, procs.length);

        assert.equal(res.results[1].waiting, 0);
        assert.equal(res.results[2].waiting, 3);
        assert.equal(res.results[3].waiting, 6);
        assert.equal(avg.avgWaiting, 3.0);
        assert.equal(avg.avgTurnaround, 13.0);
        assert.equal(stats.contextSwitches, 2);
    });

    // ─────────────────────────────────────────────────────────────
    // 3. SJF Non-preemptive (Silberschatz p.30)
    // ─────────────────────────────────────────────────────────────
    test('3. SJF Non-preemptive Preset (p.30)', () => {
        const procs = [
            p(1, 'P1', 0, 6),
            p(2, 'P2', 0, 8),
            p(3, 'P3', 0, 7),
            p(4, 'P4', 0, 3),
        ];
        const res = scheduleSJF(procs);
        const avg = averages(res);
        const stats = computeStats(res, procs.length);

        // Schedule: P4 (3) -> P1 (6) -> P3 (7) -> P2 (8)
        assert.deepEqual(
            res.gantt.map(b => b.pid),
            [4, 1, 3, 2]
        );

        assert.equal(res.results[4].waiting, 0);
        assert.equal(res.results[1].waiting, 3);
        assert.equal(res.results[3].waiting, 9);
        assert.equal(res.results[2].waiting, 16);

        assert.equal(avg.avgWaiting, 7.0);
        assert.equal(avg.avgTurnaround, 13.0);
        assert.equal(stats.contextSwitches, 3);
        assert.equal(stats.voluntary, 3);
    });

    // ─────────────────────────────────────────────────────────────
    // 4. SRTF Preemptive SJF (Silberschatz p.36)
    // ─────────────────────────────────────────────────────────────
    test('4. SRTF Preemptive SJF Preset (p.36)', () => {
        const procs = [
            p(1, 'P1', 0, 8),
            p(2, 'P2', 1, 4),
            p(3, 'P3', 2, 9),
            p(4, 'P4', 3, 5),
        ];
        const res = scheduleSRTF(procs);
        const avg = averages(res);
        const stats = computeStats(res, procs.length);

        // Gantt blocks: P1[0..1], P2[1..5], P4[5..10], P1[10..17], P3[17..26]
        assert.deepEqual(
            res.gantt.map(b => ({ pid: b.pid, start: b.start, end: b.end })),
            [
                { pid: 1, start: 0, end: 1 },
                { pid: 2, start: 1, end: 5 },
                { pid: 4, start: 5, end: 10 },
                { pid: 1, start: 10, end: 17 },
                { pid: 3, start: 17, end: 26 },
            ]
        );

        assert.equal(res.results[1].finish, 17);
        assert.equal(res.results[1].waiting, 9);
        assert.equal(res.results[1].response, 0);

        assert.equal(res.results[2].finish, 5);
        assert.equal(res.results[2].waiting, 0);
        assert.equal(res.results[2].response, 0);

        assert.equal(res.results[3].finish, 26);
        assert.equal(res.results[3].waiting, 15);
        assert.equal(res.results[3].response, 15);

        assert.equal(res.results[4].finish, 10);
        assert.equal(res.results[4].waiting, 2);
        assert.equal(res.results[4].response, 2);

        assert.equal(avg.avgWaiting, 6.5);
        assert.equal(avg.avgTurnaround, 13.0);
        assert.equal(avg.avgResponse, 4.25);

        assert.equal(stats.contextSwitches, 4);
        assert.equal(stats.voluntary, 3);
        assert.equal(stats.nonvoluntary, 1); // P1 preempted by P2 at t=1
    });

    // ─────────────────────────────────────────────────────────────
    // 5. Round Robin (Silberschatz p.40, q=4)
    // ─────────────────────────────────────────────────────────────
    test('5. Round Robin Preset (p.40, q=4)', () => {
        const procs = [
            p(1, 'P1', 0, 24),
            p(2, 'P2', 0, 3),
            p(3, 'P3', 0, 3),
        ];
        const res = scheduleRR(procs, 4);
        const avg = averages(res);
        const stats = computeStats(res, procs.length);

        assert.equal(res.results[1].finish, 30);
        assert.equal(res.results[1].waiting, 6);
        assert.equal(res.results[1].response, 0);

        assert.equal(res.results[2].finish, 7);
        assert.equal(res.results[2].waiting, 4);
        assert.equal(res.results[2].response, 4);

        assert.equal(res.results[3].finish, 10);
        assert.equal(res.results[3].waiting, 7);
        assert.equal(res.results[3].response, 7);

        assert.ok(Math.abs(avg.avgWaiting - (17 / 3)) < 1e-6);
        assert.ok(Math.abs(avg.avgTurnaround - (47 / 3)) < 1e-6);

        // Context switches: P1->P2(nonvol), P2->P3(vol), P3->P1(vol). P1 keeps CPU 10..30.
        assert.equal(stats.contextSwitches, 3);
        assert.equal(stats.voluntary, 2);
        assert.equal(stats.nonvoluntary, 1);
    });

    // ─────────────────────────────────────────────────────────────
    // 6. Round Robin Quantum Variations (q=1, q=3, q=10)
    // ─────────────────────────────────────────────────────────────
    test('6. Round Robin Quantum Variations', () => {
        const makeProcs = () => [p(1, 'P1', 0, 4), p(2, 'P2', 0, 3), p(3, 'P3', 0, 1)];

        // Case A: q = 1
        const resQ1 = scheduleRR(makeProcs(), 1);
        const statsQ1 = computeStats(resQ1, 3);
        const avgQ1 = averages(resQ1);
        assert.equal(resQ1.results[1].finish, 8);
        assert.equal(resQ1.results[2].finish, 7);
        assert.equal(resQ1.results[3].finish, 3);
        assert.ok(Math.abs(avgQ1.avgWaiting - (10 / 3)) < 1e-6);
        assert.equal(statsQ1.contextSwitches, 7);

        // Case B: q = 3
        const resQ3 = scheduleRR(makeProcs(), 3);
        const statsQ3 = computeStats(resQ3, 3);
        const avgQ3 = averages(resQ3);
        assert.equal(resQ3.results[1].finish, 8);
        assert.equal(resQ3.results[2].finish, 6);
        assert.equal(resQ3.results[3].finish, 7);
        assert.ok(Math.abs(avgQ3.avgWaiting - (13 / 3)) < 1e-6);
        assert.equal(statsQ3.contextSwitches, 3);

        // Case C: q = 10 (Large, degenerates to FCFS)
        const resQ10 = scheduleRR(makeProcs(), 10);
        const statsQ10 = computeStats(resQ10, 3);
        const avgQ10 = averages(resQ10);
        assert.equal(resQ10.results[1].finish, 4);
        assert.equal(resQ10.results[2].finish, 7);
        assert.equal(resQ10.results[3].finish, 8);
        assert.ok(Math.abs(avgQ10.avgWaiting - (11 / 3)) < 1e-6);
        assert.equal(statsQ10.contextSwitches, 2);
    });

    // ─────────────────────────────────────────────────────────────
    // 7. Priority Non-preemptive (Silberschatz p.48)
    // ─────────────────────────────────────────────────────────────
    test('7. Priority Non-preemptive Preset (p.48)', () => {
        const procs = [
            p(1, 'P1', 0, 10, 3),
            p(2, 'P2', 0, 1, 1),
            p(3, 'P3', 0, 2, 4),
            p(4, 'P4', 0, 1, 5),
            p(5, 'P5', 0, 5, 2),
        ];
        const res = schedulePriority(procs);
        const avg = averages(res);

        // Order: P2(1) -> P5(2) -> P1(3) -> P3(4) -> P4(5)
        assert.deepEqual(res.gantt.map(b => b.pid), [2, 5, 1, 3, 4]);
        assert.equal(avg.avgWaiting, 8.2);
    });

    // ─────────────────────────────────────────────────────────────
    // 8. Priority + Round Robin Hybrid (Silberschatz p.53, q=2)
    // ─────────────────────────────────────────────────────────────
    test('8. Priority + Round Robin Hybrid (p.53, q=2)', () => {
        const procs = [
            p(1, 'P1', 0, 4, 3),
            p(2, 'P2', 0, 5, 2),
            p(3, 'P3', 0, 8, 2),
            p(4, 'P4', 0, 7, 1),
            p(5, 'P5', 0, 3, 3),
        ];
        const res = schedulePriorityRR(procs, 2);

        // P4[0..7], P2[7..9], P3[9..11], P2[11..13], P3[13..15], P2[15..16],
        // P3[16..20], P1[20..22], P5[22..24], P1[24..26], P5[26..27]
        assert.deepEqual(
            res.gantt.map(b => ({ pid: b.pid, start: b.start, end: b.end })),
            [
                { pid: 4, start: 0, end: 7 },
                { pid: 2, start: 7, end: 9 },
                { pid: 3, start: 9, end: 11 },
                { pid: 2, start: 11, end: 13 },
                { pid: 3, start: 13, end: 15 },
                { pid: 2, start: 15, end: 16 },
                { pid: 3, start: 16, end: 20 },
                { pid: 1, start: 20, end: 22 },
                { pid: 5, start: 22, end: 24 },
                { pid: 1, start: 24, end: 26 },
                { pid: 5, start: 26, end: 27 },
            ]
        );

        assert.equal(res.results[4].finish, 7);
        assert.equal(res.results[2].finish, 16);
        assert.equal(res.results[3].finish, 20);
        assert.equal(res.results[1].finish, 26);
        assert.equal(res.results[5].finish, 27);
    });

    // ─────────────────────────────────────────────────────────────
    // 9. CPU Idle Time
    // ─────────────────────────────────────────────────────────────
    test('9. CPU Idle Time (Arrival gaps)', () => {
        const procs = [
            p(1, 'P1', 2, 3),
            p(2, 'P2', 7, 2),
        ];
        const res = scheduleFCFS(procs);
        const stats = computeStats(res, procs.length);

        assert.deepEqual(
            res.gantt.map(b => ({ pid: b.pid, start: b.start, end: b.end })),
            [
                { pid: null, start: 0, end: 2 },
                { pid: 1, start: 2, end: 5 },
                { pid: null, start: 5, end: 7 },
                { pid: 2, start: 7, end: 9 },
            ]
        );

        assert.equal(stats.totalTime, 9);
        assert.equal(stats.idleTime, 4);
        assert.ok(Math.abs(stats.cpuUtil - ((5 / 9) * 100)) < 1e-4);
        assert.equal(stats.contextSwitches, 0); // No process-to-process switch across idle
    });

    // ─────────────────────────────────────────────────────────────
    // 10. RR Arrival coinciding with Quantum Expiry
    // ─────────────────────────────────────────────────────────────
    test('10. RR Arrival at Quantum Expiry (New joins before Preempted)', () => {
        const procs = [
            p(1, 'P1', 0, 4),
            p(2, 'P2', 2, 3),
        ];
        // At t=2, P1 expires quantum (rem 2) and P2 arrives. P2 must run at t=2!
        const res = scheduleRR(procs, 2);

        assert.deepEqual(
            res.gantt.map(b => ({ pid: b.pid, start: b.start, end: b.end })),
            [
                { pid: 1, start: 0, end: 2 },
                { pid: 2, start: 2, end: 4 },
                { pid: 1, start: 4, end: 6 },
                { pid: 2, start: 6, end: 7 },
            ]
        );
        assert.equal(res.results[1].finish, 6);
        assert.equal(res.results[2].finish, 7);
    });

    // ─────────────────────────────────────────────────────────────
    // 11. Preemption Tie-breaking (Equal Rem does NOT preempt)
    // ─────────────────────────────────────────────────────────────
    test('11. SRTF Preemption Tie-breaking (Equal remaining does not preempt)', () => {
        const procs = [
            p(1, 'P1', 0, 6),
            p(2, 'P2', 2, 4), // At t=2, P1 has 4 remaining. P2 arrives with 4. P1 must keep running!
        ];
        const res = scheduleSRTF(procs);

        assert.deepEqual(
            res.gantt.map(b => ({ pid: b.pid, start: b.start, end: b.end })),
            [
                { pid: 1, start: 0, end: 6 },
                { pid: 2, start: 6, end: 10 },
            ]
        );
        assert.equal(res.results[1].finish, 6);
        assert.equal(res.results[2].finish, 10);
    });

    // ─────────────────────────────────────────────────────────────
    // 12. Edge Case: Burst Time = 0
    // ─────────────────────────────────────────────────────────────
    test('12. Edge Case: Burst Time = 0', () => {
        const procs = [
            p(1, 'P1', 0, 0),
            p(2, 'P2', 0, 4),
        ];

        // Test across all algorithms without hanging
        ['fcfs', 'sjf', 'sjf_preemptive', 'rr', 'priority', 'priority_preemptive', 'priority_rr'].forEach(algo => {
            const res = dispatch(algo, procs, 2);
            assert.ok(res.results[1], `${algo} should produce result for P1`);
            assert.equal(res.results[1].waiting, 0);
            assert.equal(res.results[1].turnaround, 0);
            assert.equal(res.results[2].finish, 4);
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 13. buildAnimTimeline & Decision Reasoning Verification
    // ─────────────────────────────────────────────────────────────
    test('13. Animation Timeline & Decision Reasons', () => {
        const procs = [
            p(1, 'P1', 0, 8),
            p(2, 'P2', 1, 4),
            p(3, 'P3', 2, 9),
            p(4, 'P4', 3, 5),
        ];
        const res = scheduleSRTF(procs);
        const timeline = buildAnimTimeline(res, procs, 'sjf_preemptive');

        assert.equal(timeline.length, 27); // t = 0 to 26
        // At t=0: P1 starts
        assert.equal(timeline[0].running.name, 'P1');
        assert.equal(timeline[0].reason.key, 'pipe.reason.start');
        // At t=1: P2 preempts P1
        assert.equal(timeline[1].running.name, 'P2');
        assert.equal(timeline[1].reason.key, 'pipe.reason.preempt_srtf');
        assert.equal(timeline[1].reason.vars.name, 'P2');
        assert.equal(timeline[1].reason.vars.prev, 'P1');
        // At t=2: P2 continues running
        assert.equal(timeline[2].reason.key, 'pipe.reason.running');
    });
});
