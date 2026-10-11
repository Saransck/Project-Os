# CPU Scheduling Simulator & Visualizer
**Interactive Web-based Operating Systems Process Scheduling Simulator & Benchmark Tool**

A high-performance, interactive simulation tool designed to demonstrate, analyze, and benchmark classic and modern CPU scheduling algorithms with real-time Gantt charts, hardware state visualization, and comprehensive metrics calculation.

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **ครอบคลุมอัลกอริทึมมาตรฐานทั้งหมด (Supported Algorithms):**
   - **FCFS (First-Come, First-Served):** แสดงพฤติกรรม FIFO และจำลองปรากฏการณ์ Convoy Effect
   - **SJF (Shortest-Job-First Non-preemptive):** การจัดคิวงานสั้นก่อนแบบไม่แย่ง CPU เพื่อให้ได้เวลารอเฉลี่ยต่ำที่สุด
   - **SRTF (Shortest Remaining Time First / Preemptive SJF):** แย่งสิทธิ์ CPU ทันทีเมื่องานใหม่มีเวลาที่เหลือสั้นกว่า
   - **Round-Robin (RR):** สลับคิวด้วย Time Quantum ($q$) ที่ปรับค่าได้อย่างอิสระ
   - **Priority Scheduling (Non-preemptive & Preemptive):** กำหนดระดับความสำคัญ (ค่าน้อย = ความสำคัญสูง) พร้อมกลไก **Aging** ป้องกัน Starvation
   - **Priority with Round-Robin:** อัลกอริทึมผสมผสาน โดยงานที่มีระดับ Priority สูงสุดเท่ากันจะได้รับการประมวลผลแบบ Time-slice Round-Robin
   - **Multilevel Queue (MLQ):** จัดการแยกหลายคิวแบบตายตัว (Static Priority) สำหรับงานประเภท System, Interactive และ Batch
   - **Multilevel Feedback Queue (MLFQ):** ระบบเลื่อนระดับคิวอัตโนมัติ 3 ลำดับชั้น ($Q_0$: RR, $Q_1$: RR, $Q_2$: FCFS) พร้อมการ Demote ตามขนาด Burst Time และ Promote ด้วย Aging

2. **ชุดข้อมูลตัวอย่างที่หลากหลาย (Built-in Presets):**
   - **FCFS Convoy Effect:** ตัวอย่าง Process งานยาวอยู่หน้างานสั้น ($P_1=24, P_2=3, P_3=3$)
   - **FCFS Short Burst First:** การจัดเรียงให้งานสั้นขึ้นก่อนเพื่อลดเวลารอเฉลี่ย
   - **SJF Non-preemptive:** ตัวอย่างชุดงานแบบ Batch Job พิสูจน์ความได้เปรียบของงานสั้น
   - **SRTF Preemptive:** การสลับ CPU ทันทีเมื่องานสั้นกว่ามาถึงระหว่างการประมวลผล
   - **Round-Robin:** การแบ่งเวลา Time Slice อย่างเป็นธรรม
   - **Priority Scheduling:** การจำลองทั้งแบบแย่งและไม่แย่งสิทธิ์
   - **Priority + Round-Robin:** การทำงานร่วมกันระหว่าง Priority และ RR
   - **MLFQ 3-Level Feedback:** การจำลองการลดระดับคิวสำหรับงานที่มี Burst แตกต่างกัน

3. **การจำลองแบบก้าวต่อก้าว (Interactive Step-by-Step Simulation):**
   - ควบคุมการจำลอง: เล่น (Play), พัก (Pause), ถอยหลัง (Step Backward), ก้าวหน้า (Step Forward) และรีเซ็ต (Reset)
   - ปรับความเร็วการจำลองได้ตั้งแต่ 0.2x ถึง 4.0x
   - แสดงสถานะจำลองของ **CPU Core** สด (IDLE, RUNNING, Context Switching)
   - แสดงสถานะ **Live Ready Queue** แบบ Real-time ตามหน่วยเวลา $t$
   - แถบ **Playhead Cursor** วิ่งตามบน Gantt Chart พร้อมระบุตำแหน่งเวลาแบบแม่นยำ

4. **Interactive Gantt Chart:**
   - สีสันชัดเจนด้วยชุดสี Vibrant Neon แยกตาม Process ID
   - วางเมาส์ (Hover) เพื่อดู Tooltip รายละเอียดช่วงเวลา Start Time, End Time และ Duration
   - คลิกที่แท่ง Gantt เพื่อกระโดดเวลาไปยังจุดนั้นได้ทันที

5. **โหมดเปรียบเทียบประสิทธิภาพ (Algorithm Comparison Mode):**
   - ประมวลผลทั้ง 8 อัลกอริทึมพร้อมกันบนชุดข้อมูล Process เดียวกัน
   - ไฮไลต์ผู้ชนะ (Best Waiting Time 🏆, Best Turnaround Time ⚡)
   - แสดง Mini Gantt Chart วางเทียบเคียงกันเพื่อสังเกตความแตกต่างอย่างชัดเจน

6. **เกณฑ์วัดผลและสูตรคำนวณครบถ้วน (Scheduling Metrics):**
   - Turnaround Time ($TAT = CT - AT$)
   - Waiting Time ($WT = TAT - BT$)
   - Response Time ($RT = ST_{\text{first}} - AT$)
   - CPU Utilization ($\%$)
   - Throughput (งาน/ms)
   - ส่งออกข้อมูลเป็นไฟล์ **CSV** และ **JSON** ได้ทันที

---

## 🚀 วิธีเปิดใช้งาน (How to Run)

### วิธีที่ 1: เปิดผ่านเบราว์เซอร์โดยตรง (Zero Dependency)
ดับเบิลคลิกเปิดไฟล์ `index.html` บนเบราว์เซอร์ใดก็ได้ เช่น Google Chrome, Safari, Microsoft Edge หรือ Firefox

### วิธีที่ 2: รันผ่าน Local Web Server
```bash
python3 -m http.server 4321
```
แล้วเปิดเบราว์เซอร์ไปที่: `http://localhost:4321`

### วิธีที่ 3: เปิดผ่าน GitHub Pages
เข้าใช้งานออนไลน์ได้ทันทีที่: **https://saransck.github.io/Project-Os/**

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
Project Os/
├── index.html          # หน้าเว็บหลัก โครงสร้าง UI และส่วนควบคุม
├── styles.css          # ระบบสไตล์ Cyber-Glassmorphism และ Responsive Design
├── README.md           # เอกสารคู่มือและรายละเอียดของโปรแกรม
└── js/
    ├── algorithms.js   # โมดูลคำนวณอัลกอริทึมทั้ง 8 รูปแบบ
    ├── presets.js      # ชุดข้อมูลตัวอย่างและตัวสุ่ม Workload
    ├── gantt.js        # เอนจินวาด Gantt Chart, Playhead และ Tooltips
    ├── simulation.js   # เอนจินควบคุมการเล่น (Play, Pause, Step, Speed)
    ├── ui.js           # การจัดการ DOM ตารางผลลัพธ์ และโหมดเปรียบเทียบ
    └── app.js          # จุดเริ่มต้นและตัวประสานงานระบบ (Main Bootstrap)
```
