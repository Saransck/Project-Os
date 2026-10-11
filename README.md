# CPU Scheduling Simulator (Chapter 4 Operating Systems)
**วิชา 03603332 Operating Systems | คณะวิศวกรรมศาสตร์ศรีราชา มหาวิทยาลัยเกษตรศาสตร์**  
*อ้างอิงเนื้อหาและตัวอย่างคำนวณจากสไลด์ อ.ประสิทธิชัย ณรงค์เลิศฤทธิ์ & Silberschatz Operating System Concepts*

---

## 🌟 จุดเด่นและฟีเจอร์หลัก (Features)

1. **ครบถ้วนทุกอัลกอริทึมในบทเรียน (Comprehensive Algorithms):**
   - **FCFS** (First-Come, First-Served) — จำลองปัญหา Convoy Effect
   - **SJF** (Shortest-Job-First Non-preemptive) — พิสูจน์ความ Optimal ของคิวงานสั้น
   - **SRTF** (Shortest Remaining Time First / Preemptive SJF) — แย่ง CPU ทันทีเมื่อมีงานที่เหลือเวลาน้อยกว่า
   - **Round-Robin (RR)** — พร้อมปรับ Time Quantum ($q$) ได้อิสระ
   - **Priority Scheduling** — รองรับทั้ง Non-preemptive, Preemptive และระบบป้องกัน Starvation ด้วย **Aging**
   - **Priority with Round-Robin** — อัลกอริทึมผสมผสานตามสไลด์หน้า 53-54 (งานที่มี Priority เท่ากันจะสลับคิวแบบ RR)
   - **Multilevel Queue (MLQ)** — จัดการหลายคิวแบบ Static แบ่งตามประเภทงาน (System, Interactive, Batch)
   - **Multilevel Feedback Queue (MLFQ)** — 3 ระดับคิว (Q0: RR $q=8$, Q1: RR $q=16$, Q2: FCFS) พร้อมการ Demote และ Promote (Aging) ตามสไลด์หน้า 61-65

2. **พรีเซ็ตโจทย์ตรงตามสไลด์อาจารย์ 100% (Slide Presets):**
   - 📌 **Slide 24:** FCFS Convoy Effect ($P_1=24, P_2=3, P_3=3 \rightarrow \text{Avg WT} = 17\text{ms}$)
   - 📌 **Slide 26:** FCFS Short First ($P_2=3, P_3=3, P_1=24 \rightarrow \text{Avg WT} = 3\text{ms}$)
   - 📌 **Slide 30:** SJF Non-preemptive ($P_1=6, P_2=8, P_3=7, P_4=3 \rightarrow \text{Avg WT} = 7\text{ms}$)
   - 📌 **Slide 36:** SRTF Preemptive ($P_1, P_2, P_3, P_4 \rightarrow \text{Avg WT} = 6.5\text{ms}$)
   - 📌 **Slide 40:** Round Robin $q=4\text{ms} \rightarrow \text{Avg WT} = 5.66\text{ms}$
   - 📌 **Slide 48:** Priority Non-preemptive ($P_1..P_5 \rightarrow \text{Avg WT} = 8.2\text{ms}$)
   - 📌 **Slide 53:** Priority + Round Robin ($q=2\text{ms}$)
   - 📌 **Slide 63:** MLFQ 3-Tier Execution

3. **Interactive Step-by-Step Simulation (แอนิเมชันระดับฮาร์ดแวร์):**
   - ปุ่ม **เล่น (Play)**, **หยุด (Pause)**, **ถอยหลัง (Step Backward)**, **ก้าวหน้า (Step Forward)** และ **รีเซ็ต (Reset)**
   - ปรับความเร็วได้ตั้งแต่ **0.2x ถึง 4.0x**
   - แสดงสถานะ **CPU Core** สด (IDLE, RUNNING, Context Switching)
   - แสดง **Live Ready Queue** (เห็นลำดับ Process รอคิวแบบ Real-time ตามหน่วยเวลา $t$)
   - แถบ **Playhead Cursor** วิ่งตามบน Gantt Chart

4. **Gantt Chart แบบโต้ตอบ (Interactive Gantt Chart):**
   - สีสันชัดเจนด้วยชุดสี Vibrant Neon แยกตาม Process ID
   - Tooltip แสดงรายละเอียดช่วงเวลา Start Time, End Time และ Duration เมื่อเอาเมาส์ชี้
   - คลิกที่แท่ง Gantt เพื่อกระโดดเวลาไปยังจุดนั้นได้ทันที

5. **เปรียบเทียบอัลกอริทึมพร้อมกันในหน้าเดียว (Comparison Mode):**
   - ประมวลผลทั้ง 8 อัลกอริทึมพร้อมกันบนตารางเดียว
   - ไฮไลต์ผู้ชนะ (Best Waiting Time 🏆, Best Turnaround Time ⚡)
   - แสดง Mini Gantt Chart วางเทียบเคียงกันให้เห็นความแตกต่างอย่างชัดเจน

6. **เกณฑ์วัดผลและสูตรคำนวณครบถ้วน (Scheduling Criteria):**
   - Turnaround Time ($TAT = CT - AT$)
   - Waiting Time ($WT = TAT - BT$)
   - Response Time ($RT = ST_{\text{first}} - AT$)
   - CPU Utilization ($\%$)
   - Throughput (งาน/ms)
   - รองรับการ Export เป็นไฟล์ **CSV** และ **JSON**

---

## 🚀 วิธีเปิดใช้งาน (How to Run)

### วิธีที่ 1: เปิดผ่าน Browser โดยตรง (Zero Install)
1. ดับเบิลคลิกเปิดไฟล์ `index.html` ใน Google Chrome, Safari, Edge หรือ Firefox
2. ใช้งานได้ทันที ไม่จำเป็นต้องติดตั้ง Dependency เพิ่มเติม

### วิธีที่ 2: รันผ่าน Local Web Server
```bash
# รันผ่าน Python
cd "/Users/hewkaow/6730300566/Project Os"
python3 -m http.server 4321
```
แล้วเปิดเบราว์เซอร์ไปที่: `http://localhost:4321`

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
Project Os/
├── index.html          # หน้าเว็บหลัก โครงสร้าง UI และส่วนควบคุม
├── styles.css          # สไตล์ Cyber-Glassmorphism, ธีมมืด และ Responsive Grid
├── README.md           # เอกสารคู่มือและการอ้างอิงสไลด์
└── js/
    ├── algorithms.js   # ฟังก์ชันคำนวณและจำลองอัลกอริทึมทั้ง 8 รูปแบบ
    ├── presets.js      # ชุดข้อมูลตัวอย่างตามสไลด์หน้า 24-64 และตัวสุ่มงาน
    ├── gantt.js        # เอนจินวาด Gantt Chart, Playhead และ Tooltip
    ├── simulation.js   # เอนจินควบคุมการเล่น (Play/Pause/Step/Speed)
    ├── ui.js           # จัดการ Event ตาราง และการเปรียบเทียบ (Comparison)
    └── app.js          # จุดเริ่มต้นและตัวประสานงานระบบ (Main Bootstrap)
```
