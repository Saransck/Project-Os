# ⚡ Interactive CPU Scheduling Simulator (OS Chapter 4)

[![Deploy to GitHub Pages](https://github.com/Saransck/Project-Os/actions/workflows/deploy.yml/badge.svg)](https://github.com/Saransck/Project-Os/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-0ea5e9?style=flat&logo=github)](https://saransck.github.io/Project-Os/)
[![Unit Tests](https://img.shields.io/badge/Unit_Tests-13%2F13_Passing-22c55e?style=flat&logo=node.js)](tests/scheduler.test.js)
[![Course](https://img.shields.io/badge/Course-03603332_Operating_Systems-0284c7)](https://cpe.src.ku.ac.th/)
[![Textbook](https://img.shields.io/badge/Ref-Silberschatz_Chapter_4-38bdf8)](chapter_4_cpu_scheduling.md)

ระบบจำลองและวิเคราะห์การจัดตารางเวลาของซีพียู (CPU Scheduling Simulator) แบบอินเทอร์แอคทีฟ พัฒนาขึ้นตามหลักสูตรวิชา **03603332 ระบบปฏิบัติการ (Operating Systems)** ภาควิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา อ้างอิงเนื้อหา ทฤษฎี และตัวอย่างคำนวณตามตำรามาตรฐานระดับโลก **Operating System Concepts (Silberschatz et al., Chapter 4)**

🔗 **ทดลองใช้งานออนไลน์ได้ทันที (Live Demo):** **[https://saransck.github.io/Project-Os/](https://saransck.github.io/Project-Os/)**

---

## 📸 ภาพรวมระบบ (Screenshots)

### 1. หน้าหลัก & การตั้งค่าโปรเซส (Overview & Process Setup)
![Overview](slides_assets/slide1_overview.png)

### 2. สเตจฮาร์ดแวร์ซีพียู & แอนิเมชันแบบ Real-Time (CPU Hardware Pipeline & Decision Reason)
![CPU Pipeline](slides_assets/slide3_pipeline_simulation.png)

### 3. แผนภูมิแกนต์ & ไทม์ไลน์รายโปรเซส (Interactive Gantt Chart & Per-Process Timeline)
![Gantt Chart](slides_assets/slide4_gantt_results.png)

### 4. โหมดประเมินและเปรียบเทียบทุกอัลกอริทึม (Side-by-Side Algorithm Showdown)
![Compare All Algorithms](slides_assets/slide5_compare_all.png)

---

## 🌟 ฟีเจอร์เด่นของระบบ (Key Features)

### 1. ครอบคลุม 7 อัลกอริทึมหลัก (Full Algorithm Support)
- **First-Come, First-Served (FCFS):** ลำดับคิวแบบ FIFO บริสุทธิ์ พร้อมแสดงการเกิด **Convoy Effect** เมื่องานคำนวณขนาดยาวขวางหน้าระบบ
- **Shortest-Job-First (SJF) — Non-preemptive:** การจัดลำดับตามเวลา Burst Time สั้นที่สุด ให้เวลารอคอยเฉลี่ยต่ำที่สุด (Provably Optimal)
- **Shortest Remaining Time First (SRTF / Preemptive SJF):** ชิงสิทธิ์ CPU ทันทีเมื่องานใหม่ที่เพิ่งมาถึงมีเวลาที่เหลือน้อยกว่างานที่กำลังทำงานอยู่
- **Round Robin (RR):** สลับช่วงเวลาประมวลผลตาม Time Quantum ($q$) พร้อมกฎการจัดคิวมาตรฐานสากล (งานเข้าใหม่ที่รอยต่อจะเข้าคิวก่อนงานที่ถูก Preempt)
- **Priority Scheduling (Non-preemptive):** ทำงานตามระดับความสำคัญ (เลขน้อย = ความสำคัญสูง)
- **Priority Preemptive:** สลับ CPU ทันทีเมื่องานที่มี Priority สูงกว่ามาถึง พร้อมเตือนปัญหา **Starvation** และแก้ไขด้วย **Aging**
- **Priority + Round Robin:** สถาปัตยกรรมผสมผสาน หากมีโปรเซสที่มี Priority สูงสุดเท่ากัน ระบบจะแชร์สิทธิ์ CPU ด้วย Time Quantum แบบ Round Robin

### 2. ฮาร์ดแวร์ไปป์ไลน์ & กล่องบอกเหตุผล (Hardware Pipeline & Real-Time Decision Box)
- **3-Stage Pipeline Display:** แสดงรายการโปรเซสในสถานะ **Ready Queue (จัดเรียงตามอัลกอริทึม)**, **Running (CPU Core)**, และ **Completed** แบบสดๆ ตามเวลาจำลอง $t$
- **💡 Real-Time Scheduling Decision Reasons:** กล่องวิเคราะห์เหตุผลการจัดคิวอัจฉริยะ อธิบายทุกการตัดสินใจ เช่น ชิง CPU เพราะ $4 < 7\text{ ms}$, หมด Quantum Slice, หรือเลือกจากหัวคิว
- **Step-by-Step VCR Controls:** ปุ่มเล่น/หยุด (Play/Pause), ก้าวหน้า (Next), ย้อนกลับ (Back), และรีเซ็ตเวลา (Reset)
- **Speed Multiplier:** ปรับความเร็วแอนิเมชันได้ตั้งแต่ 0.5x, 1x, 2x จนถึง 5x

### 3. แผนภูมิแสดงผลคู่ขนาน 2 ระดับ (Dual Visualization & Floating Tooltips)
- **Gantt Chart (Macro View):** แสดงภาพรวมการครอง CPU ตลอดช่วงเวลา พร้อมคำนวณช่วงเวลาว่าง (Idle Gap)
- **Per-Process Timeline (Micro View):** แสดงสถานะของแต่ละ Process ตลอดทุกหน่วยเวลา:
  - แถบสีทึบพร้อมสัญลักษณ์ **'R'** $\rightarrow$ Running on CPU
  - แถบลายทแยงสีทองพร้อมสัญลักษณ์ **'W'** $\rightarrow$ Waiting in Ready Queue
  - ช่องว่าง $\rightarrow$ Not arrived หรือ Completed
- **Interactive Floating Tooltips:** ระบบ Tooltip ลอยติดตามเมาส์ทั้งบน Gantt Chart และ Per-Process Timeline โชว์ช่วงเวลาทำงาน เวลาเริ่ม เวลาจบ และ Burst Time สดๆ ทันทีที่ชี้

### 4. เมทริกซ์สรุปผลและเปรียบเทียบ (Metrics & Compare All Showdown)
- **สูตรคำนวณมาตรฐาน OS 100%:**
  - Turnaround Time ($TAT = CT - AT$)
  - Waiting Time ($WT = TAT - BT$)
  - Response Time ($RT = \text{First Run} - AT$)
  - Context Switch Count (แยกประเภท **Voluntary** และ **Nonvoluntary / Preemptive**)
  - CPU Utilization (%) และ Throughput
- **Compare All Table:** คลิกเดียวประมวลผลทั้ง 7 อัลกอริทึมพร้อมกันบน Workload เดียวกัน สรุป 4 ตัวชี้วัดสำคัญ (Avg WT, Avg TAT, Avg RT, Context Switches) พร้อมไฮไลต์ค่าที่ดีที่สุดด้วยสีเขียวและสัญลักษณ์ดาว ($\bigstar$) ตามมาตรฐาน WCAG AA

### 5. แถบ Test Presets 6 ปุ่มหลัก & ระบบสุ่ม Workload
- **6 One-Click Test Presets:** คลิกเดียวโหลดโจทย์มาตรฐานจากตำรา Silberschatz:
  1. `FCFS · 24,3,3 (p.25)`
  2. `FCFS · Convoy Effect (3,3,24)`
  3. `SJF · 6,8,7,3 (p.30)`
  4. `SRTF · 8,4,9,5 (p.36)`
  5. `RR · q=4 (p.40)`
  6. `Priority (p.48)`
- **Random Workload Generator:** รองรับการสร้างชุดข้อมูลสุ่มทั้งแบบ **Uniform** และ **Exponential Distribution** (จำลองพฤติกรรมจริงของงาน I/O สั้นใน OS)

### 6. เทคโนโลยีและสถาปัตยกรรม (Clean Architecture)
- **Zero Heavy Dependencies:** พัฒนาด้วย Pure HTML5, CSS Grid, และ Vanilla ES6 JavaScript แท้ 100% รันได้บนทุกเบราว์เซอร์โดยไม่ต้องลง npm packages
- **Modular Localization (i18n):** รองรับ 2 ภาษา ทั้งภาษาไทย (Thai) และภาษาอังกฤษ (English) เต็มรูปแบบ
- **Dark / Light Mode:** สลับโหมดมืด-สว่างได้ในคลิกเดียว พร้อมบันทึกค่าลงใน LocalStorage
- **Automated Unit Testing:** ชุดทดสอบอัตโนมัติ 13 Suite ครอบคลุม Edge Cases (Burst=0, CPU Idle Gap, Tie-breaking, Quantum Expiry) ผ่านการทดสอบ 100%

---

## 📁 โครงสร้างโปรเจกต์ (Repository Structure)

```text
Project-Os/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions อัตโนมัติสำหรับ Deploy ขึ้น GitHub Pages
├── .gitignore                  # กรองไฟล์ชั่วคราวและ log ต่างๆ
├── index.html                  # หน้าเว็บแอปพลิเคชันหลัก (Responsive Web App + UI Pipeline)
├── scheduler.js                # Core CPU Scheduling Engine (Pure ES6/UMD Module, 7 อัลกอริทึม)
├── i18n.js                     # Localization Dictionary (ไทย / English แปลคู่ขนานสมบูรณ์)
├── README.md                   # คู่มือและเอกสารแนะนำระบบฉบับสมบูรณ์
├── chapter_4_cpu_scheduling.md # สรุปเนื้อหาเชิงทฤษฎีตาม Silberschatz Chapter 4
├── presentation_slides_and_script.md # สคริปต์พรีเซนต์ 10 นาที / 5 ผู้บรรยาย เชื่อมกับสไลด์ PDF 12 หน้า
├── slides_assets/              # ภาพแคปเจอร์สไลด์ความละเอียดสูง 2880×1560
│   ├── slide1_overview.png
│   ├── slide2_input_random.png
│   ├── slide3_pipeline_simulation.png
│   ├── slide4_gantt_results.png
│   └── slide5_compare_all.png
└── tests/
    └── scheduler.test.js       # ชุดทดสอบ Unit Test 13 ชุด (ใช้ Node.js Test Runner ในตัว)
```

---

## 🧪 การรันชุดทดสอบอัตโนมัติ (Automated Unit Tests)

โปรเจกต์นี้มีชุดทดสอบแบบ Zero-Dependency โดยใช้ `node:test` ของ Node.js โดยตรง:

```bash
# รันชุดทดสอบ Engine ทั้งหมด 13 Test Suites
node --test tests/scheduler.test.js
```

**ผลลัพธ์การทดสอบ (13/13 Passed):**
- ✔ 1. FCFS Classic Preset (p.25)
- ✔ 2. FCFS Convoy Effect (Short jobs first)
- ✔ 3. SJF Non-preemptive Preset (p.30)
- ✔ 4. SRTF Preemptive SJF Preset (p.36)
- ✔ 5. Round Robin Preset (p.40, q=4)
- ✔ 6. Round Robin Quantum Variations
- ✔ 7. Priority Non-preemptive Preset (p.48)
- ✔ 8. Priority + Round Robin Hybrid (p.53, q=2)
- ✔ 9. CPU Idle Time (Arrival gaps)
- ✔ 10. RR Arrival at Quantum Expiry (New joins before Preempted)
- ✔ 11. SRTF Preemption Tie-breaking (Equal remaining does not preempt)
- ✔ 12. Edge Case: Burst Time = 0
- ✔ 13. Animation Timeline & Decision Reasons

---

## 🚀 วิธีเปิดใช้งาน (Getting Started)

### วิธีที่ 1: เข้าใช้งานผ่าน GitHub Pages (ง่ายที่สุด)
เข้าผ่านเว็บเบราว์เซอร์ได้ทันที: **[https://saransck.github.io/Project-Os/](https://saransck.github.io/Project-Os/)**

### วิธีที่ 2: เปิดไฟล์ในเครื่องโดยตรง (Offline Mode)
ดาวน์โหลดหรือโคลนโปรเจกต์ จากนั้นดับเบิลคลิกเปิดไฟล์ `index.html` บน Chrome, Edge, Safari หรือ Firefox

### วิธีที่ 3: เปิดผ่าน Local HTTP Server
```bash
# Clone repository
git clone https://github.com/Saransck/Project-Os.git
cd Project-Os

# Start local server (Python 3)
python3 -m http.server 8080
```
เปิดเบราว์เซอร์แล้วเข้าไปที่ `http://localhost:8080`

---

## 👥 ข้อมูลกลุ่มและคณะผู้จัดทำ (Group 16)

**วิชา:** 03603332 ระบบปฏิบัติการ (Operating Systems)  
**ภาควิชา:** วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา  

| รหัสนิสิต | ชื่อ - นามสกุล | บทบาทในการนำเสนอ |
| :---: | :--- | :--- |
| **6730300566** | นายศรัณย์ จูรุ่งเรืองกุล | **Speaker 1:** เกริ่นนำ, วัตถุประสงค์ & วงจร CPU-I/O Burst |
| **6730300485** | นายภูมิพัฒน์ อุ่นแสน | **Speaker 2:** อัลกอริทึม 7 แบบ & แถบ 6 Presets + ระบบสุ่ม |
| **6730300744** | นายธนบดี บุตกง | **Speaker 3:** Live Demo 1 (CPU Pipeline, กล่องบอกเหตุผล & Timeline) |
| **6630300441** | นางสาวนิธิกานต์ ตั้งจันทร์สุข | **Speaker 4:** Live Demo 2 (สูตรคำนวณตัวชี้วัด & Compare All Showdown) |
| **6630300611** | นางสาวพิมพ์ลภัส ขยันกิจ | **Speaker 5:** 3 ข้อคิดวิศวกรรม OS, สรุปสถาปัตยกรรม & ขอบคุณ |

---

## 📚 แหล่งข้อมูลอ้างอิง (References)
- Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). *Operating System Concepts* (10th ed.). Wiley.
- บทที่ 4: CPU Scheduling ทฤษฎีและตัวอย่างคำนวณ: **[chapter_4_cpu_scheduling.md](chapter_4_cpu_scheduling.md)**
- สคริปต์การนำเสนอและคิวการสาธิต 10 นาที: **[presentation_slides_and_script.md](presentation_slides_and_script.md)**
