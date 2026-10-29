/**
 * CPU Scheduling Simulator — Localization (i18n)
 * English (en) / Thai (th)
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.I18N = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const I18N = {
        en: {
            'sec.input': 'Process Setup',
            'presets.label': 'Test Presets',
            'preset.priorityPre': 'Priority Preemptive · with arrivals',
            'preset.convoy': 'FCFS · Convoy Effect (3,3,24)',
            'preset.idle': 'FCFS · CPU Idle Gap',
            'preset.tieSjf': 'SJF · Tie-breaking (Equal BT)',
            'preset.rrQ1': 'RR · Small Quantum (q=1)',
            'algo.label': 'Algorithm',
            'opt.fcfs': 'First-Come, First-Served (FCFS)',
            'opt.sjf': 'Shortest-Job-First (SJF) — Non-preemptive',
            'opt.sjf_preemptive': 'Shortest-Job-First — Preemptive (SRTF)',
            'opt.rr': 'Round Robin (RR)',
            'opt.priority': 'Priority Scheduling — Non-preemptive',
            'opt.priority_preemptive': 'Priority Scheduling — Preemptive',
            'opt.priority_rr': 'Priority + Round Robin',
            'quantum.label': 'Time Quantum',
            'arrival.label': 'Arrival Time',
            'burst.label': 'Burst Time',
            'burst.ph': 'e.g. 10',
            'priority.label': 'Priority',
            'hint.algo': 'Pick an algorithm, or load a preset above',
            'hint.quantum': 'q = 1 – 50 · used by RR, Priority + RR',
            'hint.arrival': '0 – 100',
            'hint.burst': '1 – 50',
            'hint.priority': '0 – 99 · lower number = higher priority',
            'hint.enter': 'or press Enter in any field',
            'hint.dist': 'Exponential = many short bursts (p.5)',
            'btn.add': '➕ Add Process',
            'btn.random': '🎲 Random Processes',
            'btn.clear': '🗑️ Clear All',
            'rand.title': '🎲 Random Process Generator',
            'rand.dist': 'Distribution',
            'rand.uniform': 'Uniform',
            'rand.exponential': 'Exponential (many short bursts)',
            'rand.go': '⚡ Generate',
            'rand.close': '✕ Close',
            'th.process': 'Process', 'th.arrival': 'Arrival', 'th.burst': 'Burst', 'th.priority': 'Priority',
            'th.start': 'First Run', 'th.finish': 'Finish', 'th.waiting': 'Waiting',
            'th.turnaround': 'Turnaround', 'th.response': 'Response',
            'th.algorithm': 'Algorithm', 'th.avgW': 'Avg Waiting', 'th.avgT': 'Avg Turnaround',
            'th.avgR': 'Avg Response', 'th.cs': 'Context Switches',
            'th.util': 'CPU Util', 'th.makespan': 'Makespan', 'th.throughput': 'Throughput',
            'tbl.empty': 'No processes yet — add a process or pick a preset above.',
            'btn.remove': 'Remove',
            'btn.run': '🚀 Run Simulation',
            'btn.compare': '📊 Compare All Algorithms',

            'f.arrival': 'Arrival Time', 'f.burst': 'Burst Time', 'f.priority': 'Priority',
            'f.quantum': 'Time Quantum', 'f.count': 'Number of processes', 'f.maxArr': 'Max Arrival',
            'f.minBurst': 'Min Burst', 'f.maxBurst': 'Max Burst', 'f.maxPri': 'Max Priority',
            'err.range': '{field} must be a whole number from {min} to {max}.',
            'err.noProc': 'Please add at least one process first.',
            'err.maxProcs': 'At most {n} processes are allowed.',
            'err.minMax': 'Min Burst must not be greater than Max Burst.',

            'result.title': 'Result — {algo}',
            'anim.back': '⏮ Back', 'anim.play': '▶ Play', 'anim.pause': '⏸ Pause',
            'anim.fwd': '⏭ Next', 'anim.reset': '↺ Reset', 'anim.speed': '⚡ Speed:',
            'pipe.title': '🔄 CPU Pipeline (at current time t)',
            'pipe.ready': 'Ready Queue', 'pipe.running': 'Running', 'pipe.completed': 'Completed',
            'pipe.empty': 'empty', 'pipe.idle': 'Idle (CPU free)',
            'pipe.arrival': 'Arrival', 'pipe.burst': 'Burst', 'pipe.priority': 'Priority',
            'pipe.rem': 'Remaining', 'pipe.finish': 'Finished at',
            'pipe.reason.title': '💡 Scheduling Decision at t = {t}:',
            'pipe.reason.idle': 'CPU is idle: no ready processes in memory.',
            'pipe.reason.running': '{name} is executing on CPU (remaining: {rem} ms).',
            'pipe.reason.preempt_srtf': '{name} preempted {prev} because remaining burst ({rem} ms) < {prevRem} ms.',
            'pipe.reason.preempt_pri': '{name} preempted {prev} because priority ({pri}) is higher than ({prevPri}).',
            'pipe.reason.start': '{name} selected from Ready Queue ({detail}).',
            'pipe.reason.rr_slice': '{name} dispatched from head of Ready Queue for quantum slice (q={q}).',
            'pipe.reason.rr_alone': '{name} is alone at this level; keeps executing without preemption.',

            'qorder.fifo': 'FIFO order (head first)',
            'qorder.burst': 'Ordered by burst time (shortest first)',
            'qorder.rem': 'Ordered by remaining time (shortest first)',
            'qorder.pri': 'Ordered by priority (lowest number first)',
            'qorder.prirr': 'By priority, then RR (FIFO) order within a level',
            'gantt.title': '📊 Gantt Chart',
            'gantt.empty': 'At t = 0 process is starting execution — press Next or Play to advance time.',
            'gantt.none': 'No data',
            'gantt.idle': 'idle',
            'ptl.title': '📐 Per-Process Timeline',
            'ptl.label': 'Process-level view (state of each process in each time unit)',
            'ptl.running': 'Running (R)', 'ptl.waiting': 'Waiting in Queue (W)', 'ptl.idle': 'Not arrived / Completed',
            'ptl.state.running': 'running', 'ptl.state.waiting': 'waiting', 'ptl.state.idle': 'completed', 'ptl.state.notarrived': 'not arrived',
            'res.title': '📋 Results Table',
            'res.avg': 'Average',
            'res.formula': 'Turnaround = Finish − Arrival · Waiting = Turnaround − Burst · Response = First Run − Arrival (Silberschatz Ch.4 p.19–20). Context switch = direct CPU handoff between different processes; continuing alone or resuming from idle is not counted.',

            'st.makespan': 'Total Time (makespan)',
            'st.util': 'CPU Utilization',
            'st.throughput': 'Throughput',
            'st.throughputSub': '{n} processes / {t} ms',
            'st.cs': 'Context Switches',
            'st.csSub': '{v} voluntary (finish) · {nv} nonvoluntary (preempt)',
            'st.idle': 'Idle Time',

            'sec.compare': 'Compare All Algorithms',
            'cmp.tableTitle': '📋 Side-by-Side Algorithm Benchmark',
            'cmp.note': '★ Green bold indicates optimal value in each column. All times in ms.',
            'cmp.ganttTitle': '📈 Synchronized Gantt Charts — All Algorithms',

            'assump.title': '⚙️ Simulation Assumptions:',
            'assump.text': 'Single-core CPU · Context switch latency = 0 ms · Pure CPU bursts (no I/O blocks) · Preemption is strictly better (ties do not preempt) · Lower priority number = higher urgency.',
            'kbd.tip': '⌨️ Keyboard shortcuts: Space (Play/Pause) · ← / → (Step Back/Fwd) · R (Reset) · Enter (Add Process)',

            'info.fcfs': `<h3>📌 First-Come, First-Served (FCFS)</h3>
        <span class="tag tag--nonpreemptive">Non-preemptive</span>
        <p style="margin-top:10px;">The process that requests the CPU first is allocated the CPU first — managed with a FIFO ready queue (p.23).</p>
        <ul>
            <li><strong>Pros:</strong> simple to write and understand.</li>
            <li><strong>Cons:</strong> average waiting time is often long; <strong>convoy effect</strong> — short processes wait behind one long process (p.27).</li>
            <li><strong>Not suited to:</strong> interactive systems — one process can keep the CPU for a long time (p.28).</li>
        </ul>`,
            'info.sjf': `<h3>📌 Shortest-Job-First (SJF) — Non-preemptive</h3>
        <span class="tag tag--nonpreemptive">Non-preemptive</span>
        <p style="margin-top:10px;">The CPU goes to the process with the <strong>smallest next CPU burst</strong>; ties are broken by FCFS (p.29).</p>
        <ul>
            <li><strong>Pros:</strong> provably optimal — minimum average waiting time for a given set of processes (p.31).</li>
            <li><strong>Cons:</strong> the length of the next CPU burst is not known, so it must be predicted (p.32).</li>
            <li><strong>Prediction:</strong> τ<sub>n+1</sub> = α·t<sub>n</sub> + (1−α)·τ<sub>n</sub> (exponential average, p.33).</li>
        </ul>`,
            'info.sjf_preemptive': `<h3>📌 Shortest-Job-First — Preemptive (SRTF)</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">If a newly arrived process needs less time than what is <strong>left</strong> of the running process, the running process is <strong>preempted</strong> (p.35).</p>
        <ul>
            <li><strong>Also called:</strong> Shortest-Remaining-Time-First (SRTF).</li>
            <li><strong>Tie rule:</strong> on equal remaining time the running process keeps the CPU (no extra context switch).</li>
            <li><strong>Pros:</strong> lower average waiting time than non-preemptive SJF (p.37: 6.5 vs 7.75 ms).</li>
            <li><strong>Cons:</strong> more context switches; long processes may wait a long time (SJF is a special case of priority scheduling, p.47).</li>
        </ul>`,
            'info.rr': `<h3>📌 Round Robin (RR)</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">Like FCFS, but each process runs for at most one <strong>time quantum q</strong>, then goes to the <strong>tail</strong> of the ready queue (p.38–39).</p>
        <ul>
            <li><strong>Each process gets:</strong> 1/n of the CPU time; it waits no longer than (n−1) × q (p.42).</li>
            <li><strong>Quantum size:</strong> too large → behaves like FCFS; too small → many context switches (p.43).</li>
            <li><strong>Rule of thumb:</strong> 80% of CPU bursts should be shorter than q (p.46).</li>
            <li><strong>Convention used here:</strong> a process arriving at the instant a quantum expires joins the queue before the preempted process.</li>
        </ul>`,
            'info.priority': `<h3>📌 Priority Scheduling — Non-preemptive</h3>
        <span class="tag tag--nonpreemptive">Non-preemptive</span>
        <p style="margin-top:10px;">The CPU goes to the highest-priority process — <strong>lower number = higher priority</strong>; equal priorities are served FCFS (p.47).</p>
        <ul>
            <li><strong>SJF is a special case:</strong> priority = inverse of the (predicted) next CPU burst (p.47).</li>
            <li><strong>Problem:</strong> <strong>starvation</strong> (indefinite blocking) of low-priority processes (p.51).</li>
            <li><strong>Solution:</strong> <strong>aging</strong> — gradually raise the priority of processes that wait a long time (p.52).</li>
        </ul>`,
            'info.priority_preemptive': `<h3>📌 Priority Scheduling — Preemptive</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">If a newly arrived process has a higher priority than the running process, the running process is <strong>preempted</strong> (p.50).</p>
        <ul>
            <li><strong>Pros:</strong> an important process gets the CPU immediately.</li>
            <li><strong>Cons:</strong> more context switches; low-priority processes can still starve (p.51) — solved by aging (p.52).</li>
            <li><strong>Try:</strong> preset “Priority Preemptive · with arrivals” and compare with the non-preemptive version.</li>
        </ul>`,
            'info.priority_rr': `<h3>📌 Priority + Round Robin</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">Run the highest-priority process; processes with the <strong>same priority</strong> share the CPU with <strong>round robin</strong> (quantum q) (p.53–54).</p>
        <ul>
            <li>A process that is alone at its priority level keeps running after its quantum (p.54: P3 runs 16–20).</li>
            <li>A newly arrived higher-priority process preempts the running one; the preempted process goes to the tail of its level.</li>
            <li><strong>Try:</strong> preset “Priority + RR · q=2 (p.53)” — it reproduces the textbook Gantt chart.</li>
        </ul>`,
        },

        th: {
            'sec.input': 'ตั้งค่า Process',
            'presets.label': 'ชุดทดสอบ (Test Presets)',
            'preset.priorityPre': 'Priority Preemptive · มาถึงไม่พร้อมกัน',
            'preset.convoy': 'FCFS · ปรากฏการณ์ Convoy (3,3,24)',
            'preset.idle': 'FCFS · มีช่วง CPU Idle',
            'preset.tieSjf': 'SJF · กรณี Tie เท่ากัน',
            'preset.rrQ1': 'RR · Quantum ขนาดเล็ก (q=1)',
            'algo.label': 'อัลกอริทึม',
            'opt.fcfs': 'First-Come, First-Served (FCFS)',
            'opt.sjf': 'Shortest-Job-First (SJF) — Non-preemptive',
            'opt.sjf_preemptive': 'Shortest-Job-First — Preemptive (SRTF)',
            'opt.rr': 'Round Robin (RR)',
            'opt.priority': 'Priority Scheduling — Non-preemptive',
            'opt.priority_preemptive': 'Priority Scheduling — Preemptive',
            'opt.priority_rr': 'Priority + Round Robin',
            'quantum.label': 'Time Quantum',
            'arrival.label': 'Arrival Time (เวลามาถึง)',
            'burst.label': 'Burst Time (เวลาใช้ CPU)',
            'burst.ph': 'เช่น 10',
            'priority.label': 'Priority',
            'hint.algo': 'เลือกอัลกอริทึม หรือกด preset ด้านบน',
            'hint.quantum': 'q = 1 – 50 · ใช้กับ RR, Priority + RR',
            'hint.arrival': '0 – 100',
            'hint.burst': '1 – 50',
            'hint.priority': '0 – 99 · เลขน้อย = สำคัญมาก',
            'hint.enter': 'หรือกด Enter ในช่องใดก็ได้',
            'hint.dist': 'Exponential = burst สั้นเยอะ (หน้า 5)',
            'btn.add': '➕ เพิ่ม Process',
            'btn.random': '🎲 สุ่ม Process',
            'btn.clear': '🗑️ ล้างทั้งหมด',
            'rand.title': '🎲 สุ่มสร้าง Process',
            'rand.dist': 'การกระจาย',
            'rand.uniform': 'Uniform (สม่ำเสมอ)',
            'rand.exponential': 'Exponential (burst สั้นเยอะ)',
            'rand.go': '⚡ สร้างเลย',
            'rand.close': '✕ ปิด',
            'th.process': 'Process', 'th.arrival': 'Arrival', 'th.burst': 'Burst', 'th.priority': 'Priority',
            'th.start': 'เริ่มรันครั้งแรก', 'th.finish': 'เสร็จ', 'th.waiting': 'Waiting',
            'th.turnaround': 'Turnaround', 'th.response': 'Response',
            'th.algorithm': 'อัลกอริทึม', 'th.avgW': 'Avg Waiting', 'th.avgT': 'Avg Turnaround',
            'th.avgR': 'Avg Response', 'th.cs': 'Context Switches',
            'th.util': 'CPU Util', 'th.makespan': 'Makespan', 'th.throughput': 'Throughput',
            'tbl.empty': 'ยังไม่มี process — เพิ่ม process หรือเลือก Preset ด้านบน',
            'btn.remove': 'ลบ',
            'btn.run': '🚀 จำลองการทำงาน',
            'btn.compare': '📊 เปรียบเทียบทุกอัลกอริทึม',

            'f.arrival': 'Arrival Time', 'f.burst': 'Burst Time', 'f.priority': 'Priority',
            'f.quantum': 'Time Quantum', 'f.count': 'จำนวน Process', 'f.maxArr': 'Arrival สูงสุด',
            'f.minBurst': 'Burst ต่ำสุด', 'f.maxBurst': 'Burst สูงสุด', 'f.maxPri': 'Priority สูงสุด',
            'err.range': '{field} ต้องเป็นจำนวนเต็มตั้งแต่ {min} ถึง {max}',
            'err.noProc': 'กรุณาเพิ่ม process อย่างน้อย 1 ตัวก่อน',
            'err.maxProcs': 'เพิ่มได้สูงสุด {n} process',
            'err.minMax': 'Burst ต่ำสุดต้องไม่มากกว่า Burst สูงสุด',

            'result.title': 'ผลลัพธ์ — {algo}',
            'anim.back': '⏮ ย้อน', 'anim.play': '▶ เล่น', 'anim.pause': '⏸ หยุด',
            'anim.fwd': '⏭ ถัดไป', 'anim.reset': '↺ รีเซ็ต', 'anim.speed': '⚡ ความเร็ว:',
            'pipe.title': '🔄 CPU Pipeline (ณ เวลา t ปัจจุบัน)',
            'pipe.ready': 'Ready Queue', 'pipe.running': 'Running', 'pipe.completed': 'Completed',
            'pipe.empty': 'ว่าง', 'pipe.idle': 'Idle (CPU ว่าง)',
            'pipe.arrival': 'Arrival', 'pipe.burst': 'Burst', 'pipe.priority': 'Priority',
            'pipe.rem': 'เหลือ', 'pipe.finish': 'เสร็จที่',
            'pipe.reason.title': '💡 เหตุผลการจัดคิว ณ เวลา t = {t}:',
            'pipe.reason.idle': 'CPU ว่าง (Idle): ยังไม่มี process ที่พร้อมทำงานในหน่วยความจำ',
            'pipe.reason.running': '{name} กำลังประมวลผลบน CPU (เหลือเวลาอีก {rem} ms)',
            'pipe.reason.preempt_srtf': '{name} ชิง CPU จาก {prev} เนื่องจากเวลาที่เหลือ ({rem} ms) น้อยกว่า ({prevRem} ms)',
            'pipe.reason.preempt_pri': '{name} ชิง CPU จาก {prev} เนื่องจาก Priority ({pri}) สูงกว่า ({prevPri})',
            'pipe.reason.start': '{name} ได้รับสิทธิ์รันจาก Ready Queue ({detail})',
            'pipe.reason.rr_slice': '{name} ได้รับสิทธิ์รันตาม Time Quantum (q={q}) จากหัวคิว',
            'pipe.reason.rr_alone': '{name} เป็นงานเดียวในระดับ Priority นี้ จึงรันต่อเนื่องโดยไม่ถูกขัดจังหวะ',

            'qorder.fifo': 'เรียงแบบ FIFO (หัวคิวอยู่บน)',
            'qorder.burst': 'เรียงตาม burst time (สั้นสุดอยู่บน)',
            'qorder.rem': 'เรียงตามเวลาที่เหลือ (น้อยสุดอยู่บน)',
            'qorder.pri': 'เรียงตาม priority (เลขน้อยอยู่บน)',
            'qorder.prirr': 'เรียงตาม priority แล้วตามลำดับ RR (FIFO) ในระดับเดียวกัน',
            'gantt.title': '📊 Gantt Chart',
            'gantt.empty': 'ที่ t = 0 โปรเซสเริ่มทำงาน — กด ถัดไป หรือ เล่น เพื่อดูการเดินหน้าของเวลา',
            'gantt.none': 'ไม่มีข้อมูล',
            'gantt.idle': 'idle',
            'ptl.title': '📐 Timeline ราย Process',
            'ptl.label': 'มุมมองราย process (สถานะของแต่ละ process ในแต่ละหน่วยเวลา)',
            'ptl.running': 'Running (กำลังรัน)', 'ptl.waiting': 'Waiting (รอในคิว)', 'ptl.idle': 'ยังไม่มา / เสร็จแล้ว',
            'ptl.state.running': 'กำลังรัน', 'ptl.state.waiting': 'รอ', 'ptl.state.idle': 'เสร็จแล้ว', 'ptl.state.notarrived': 'ยังไม่มา',
            'res.title': '📋 ตารางผลลัพธ์',
            'res.avg': 'ค่าเฉลี่ย',
            'res.formula': 'Turnaround = Finish − Arrival · Waiting = Turnaround − Burst · Response = เริ่มรันครั้งแรก − Arrival (บทที่ 4 หน้า 19–20) · Context switch = CPU สลับจาก process หนึ่งไปอีก process หนึ่งโดยตรง; ถ้า process ได้รันต่อเพราะเป็นตัวเดียวที่พร้อม หรือเริ่มจาก CPU ว่าง จะไม่นับ',

            'st.makespan': 'เวลารวม (makespan)',
            'st.util': 'CPU Utilization',
            'st.throughput': 'Throughput',
            'st.throughputSub': '{n} process / {t} ms',
            'st.cs': 'Context Switches',
            'st.csSub': 'เพราะจบงาน (voluntary) {v} · ถูก preempt (nonvoluntary) {nv}',
            'st.idle': 'เวลา CPU ว่าง',

            'sec.compare': 'เปรียบเทียบทุกอัลกอริทึม',
            'cmp.tableTitle': '📋 ตารางเปรียบเทียบประสิทธิภาพแบบเคียงข้าง (Side-by-Side)',
            'cmp.note': '★ ตัวเลขหนาสีเขียว = ค่าที่ดีที่สุดในแต่ละคอลัมน์ (ยิ่งน้อยยิ่งดี ยกเว้น Util และ Throughput) · หน่วยเวลาเป็น ms',
            'cmp.ganttTitle': '📈 Gantt Chart ทุกอัลกอริทึม (แกนเวลาเดียวกัน)',

            'assump.title': '⚙️ สมมติฐานของระบบจำลอง:',
            'assump.text': 'ระบบซีพียู 1 Core · ไม่คิดเวลา Context Switch (Overhead = 0 ms) · การประมวลผล CPU Burst ล้วน (ไม่มีการรอ I/O) · Preemption เกิดเมื่อเงื่อนไขดีกว่าชัดเจนเท่านั้น (เท่ากันไม่แย่ง) · Priority เลขน้อย = สำคัญมาก',
            'kbd.tip': '⌨️ คีย์ลัดบนคีย์บอร์ด: Space (เล่น/หยุด) · ← / → (ย้อน/ถัดไป) · R (รีเซ็ตเวลา) · Enter (เพิ่มโปรเซส)',

            'info.fcfs': `<h3>📌 First-Come, First-Served (FCFS)</h3>
        <span class="tag tag--nonpreemptive">Non-preemptive</span>
        <p style="margin-top:10px;">Process ที่ขอ CPU ก่อนได้ CPU ก่อน — ใช้ ready queue แบบ FIFO (หน้า 23)</p>
        <ul>
            <li><strong>ข้อดี:</strong> เขียนง่าย เข้าใจง่าย</li>
            <li><strong>ข้อเสีย:</strong> avg waiting time มักสูง; เกิด <strong>convoy effect</strong> — process สั้นต้องรอ process ยาวตัวเดียว (หน้า 27)</li>
            <li><strong>ไม่เหมาะกับ:</strong> ระบบ interactive เพราะ process เดียวอาจครอง CPU นาน (หน้า 28)</li>
        </ul>`,
            'info.sjf': `<h3>📌 Shortest-Job-First (SJF) — Non-preemptive</h3>
        <span class="tag tag--nonpreemptive">Non-preemptive</span>
        <p style="margin-top:10px;">ให้ CPU กับ process ที่มี <strong>CPU burst ถัดไปสั้นที่สุด</strong>; ถ้าเท่ากันใช้ FCFS (หน้า 29)</p>
        <ul>
            <li><strong>ข้อดี:</strong> optimal — ได้ avg waiting time ต่ำที่สุดสำหรับชุด process ที่กำหนด (หน้า 31)</li>
            <li><strong>ข้อเสีย:</strong> ไม่รู้ความยาว CPU burst ถัดไปจริง ต้องประมาณ (หน้า 32)</li>
            <li><strong>การประมาณ:</strong> τ<sub>n+1</sub> = α·t<sub>n</sub> + (1−α)·τ<sub>n</sub> (exponential average หน้า 33)</li>
        </ul>`,
            'info.sjf_preemptive': `<h3>📌 Shortest-Job-First — Preemptive (SRTF)</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">ถ้า process ที่เพิ่งมาต้องใช้เวลาน้อยกว่า<strong>เวลาที่เหลือ</strong>ของ process ที่กำลังรัน จะ <strong>preempt</strong> ทันที (หน้า 35)</p>
        <ul>
            <li><strong>ชื่อเต็ม:</strong> Shortest-Remaining-Time-First (SRTF)</li>
            <li><strong>กรณีเท่ากัน:</strong> process ที่กำลังรันได้รันต่อ (ไม่เกิด context switch เพิ่ม)</li>
            <li><strong>ข้อดี:</strong> avg waiting time ต่ำกว่า SJF แบบ non-preemptive (หน้า 37: 6.5 เทียบ 7.75 ms)</li>
            <li><strong>ข้อเสีย:</strong> context switch บ่อยขึ้น; process ยาวอาจรอนาน (SJF เป็นกรณีพิเศษของ priority scheduling หน้า 47)</li>
        </ul>`,
            'info.rr': `<h3>📌 Round Robin (RR)</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">เหมือน FCFS แต่แต่ละ process รันได้ไม่เกิน 1 <strong>time quantum (q)</strong> ถ้ายังไม่เสร็จจะไป<strong>ท้ายคิว</strong> (หน้า 38–39)</p>
        <ul>
            <li><strong>แต่ละ process ได้:</strong> 1/n ของเวลา CPU และรอไม่เกิน (n−1) × q (หน้า 42)</li>
            <li><strong>ขนาด quantum:</strong> ใหญ่เกิน → เหมือน FCFS; เล็กเกิน → context switch เยอะ (หน้า 43)</li>
            <li><strong>กฎ:</strong> 80% ของ CPU burst ควรสั้นกว่า q (หน้า 46)</li>
            <li><strong>ข้อตกลงในโปรแกรมนี้:</strong> process ที่มาถึงพอดีตอน quantum หมด จะเข้าคิวก่อน process ที่ถูก preempt</li>
        </ul>`,
            'info.priority': `<h3>📌 Priority Scheduling — Non-preemptive</h3>
        <span class="tag tag--nonpreemptive">Non-preemptive</span>
        <p style="margin-top:10px;">ให้ CPU กับ process ที่ priority สูงสุด — <strong>เลขน้อย = สำคัญมาก</strong>; priority เท่ากันใช้ FCFS (หน้า 47)</p>
        <ul>
            <li><strong>SJF เป็นกรณีพิเศษ:</strong> priority = ส่วนกลับของ CPU burst ถัดไป (หน้า 47)</li>
            <li><strong>ปัญหา:</strong> <strong>starvation</strong> (indefinite blocking) ของ process priority ต่ำ (หน้า 51)</li>
            <li><strong>ทางแก้:</strong> <strong>aging</strong> — ค่อย ๆ เพิ่ม priority ให้ process ที่รอนาน (หน้า 52)</li>
        </ul>`,
            'info.priority_preemptive': `<h3>📌 Priority Scheduling — Preemptive</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">ถ้า process ที่เพิ่งมามี priority สูงกว่า process ที่กำลังรัน จะ <strong>preempt</strong> (หน้า 50)</p>
        <ul>
            <li><strong>ข้อดี:</strong> process สำคัญได้ CPU ทันที</li>
            <li><strong>ข้อเสีย:</strong> context switch บ่อยขึ้น; process priority ต่ำยังเกิด starvation ได้ (หน้า 51) — แก้ด้วย aging (หน้า 52)</li>
            <li><strong>ลองดู:</strong> preset “Priority Preemptive · มาถึงไม่พร้อมกัน” แล้วเทียบกับแบบ non-preemptive</li>
        </ul>`,
            'info.priority_rr': `<h3>📌 Priority + Round Robin</h3>
        <span class="tag tag--preemptive">Preemptive</span>
        <p style="margin-top:10px;">รัน process ที่ priority สูงสุด; process ที่ <strong>priority เท่ากัน</strong> ผลัดกันใช้ CPU แบบ <strong>round robin</strong> (quantum q) (หน้า 53–54)</p>
        <ul>
            <li>ถ้าเหลือ process เดียวใน priority นั้น จะรันต่อได้เลยแม้ quantum หมด (หน้า 54: P3 รัน 16–20)</li>
            <li>ถ้ามี process priority สูงกว่ามาถึง จะ preempt; ตัวที่ถูก preempt ไปต่อท้ายคิวของระดับตัวเอง</li>
            <li><strong>ลองดู:</strong> preset “Priority + RR · q=2 (p.53)” — ได้ Gantt chart ตรงกับหนังสือ</li>
        </ul>`,
        }
    };

    return I18N;
}));

