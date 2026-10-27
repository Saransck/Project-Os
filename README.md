# ⚡ Interactive CPU Scheduling Simulator (OS Chapter 4)

[![Deploy to GitHub Pages](https://github.com/Saransck/Project-Os/actions/workflows/deploy.yml/badge.svg)](https://github.com/Saransck/Project-Os/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-0ea5e9?style=flat&logo=github)](https://saransck.github.io/Project-Os/)
[![Course](https://img.shields.io/badge/Course-03603332_Operating_Systems-0284c7)](https://cpe.src.ku.ac.th/)
[![Textbook](https://img.shields.io/badge/Ref-Silberschatz_Chapter_4-38bdf8)](chapter_4_cpu_scheduling.md)

ระบบจำลองและวิเคราะห์การจัดตารางเวลาของซีพียู (CPU Scheduling Algorithms) แบบอินเทอร์แอคทีฟ พัฒนาขึ้นตามหลักสูตรวิชา **03603332 ระบบปฏิบัติการ (Operating Systems)** ภาควิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา อ้างอิงเนื้อหาและตัวอย่างคำนวณตามตำรามาตรฐานระดับโลก **Operating System Concepts (Silberschatz et al., Chapter 4)**

🔗 **ทดลองใช้งานออนไลน์ได้ทันที (Live Demo):** **[https://saransck.github.io/Project-Os/](https://saransck.github.io/Project-Os/)**

---

## 📸 ภาพรวมระบบ (Screenshots)

### 1. หน้าหลัก & การตั้งค่าโปรเซส (Overview & Process Setup)
![Overview](slides_assets/slide1_overview.png)

### 2. สเตจฮาร์ดแวร์ซีพียู & แอนิเมชันแบบ Real-Time (CPU Hardware Pipeline)
![CPU Pipeline](slides_assets/slide3_pipeline_simulation.png)

### 3. แผนภูมิแกนต์ & ไทม์ไลน์รายโปรเซส (Interactive Gantt Chart & Per-Process Timeline)
![Gantt Chart](slides_assets/slide4_gantt_results.png)

### 4. โหมดประเมินและเปรียบเทียบทุกอัลกอริทึม (Compare All Algorithms Showdown)
![Compare All Algorithms](slides_assets/slide5_compare_all.png)

---

## 🌟 ฟีเจอร์เด่นของระบบ (Key Features)

### 1. ครอบคลุม 6 รูปแบบอัลกอริทึมหลัก (Full Algorithm Support)
- **First-Come, First-Served (FCFS):** ลำดับคิวแบบ FIFO บริสุทธิ์ พร้อมแสดงการเกิด **Convoy Effect** เมื่อมีงานประมวลผลขนาดยาวขวางหน้า
- **Shortest-Job-First (SJF) — Non-preemptive:** การจัดลำดับตามเวลา Burst Time สั้นที่สุด ซึ่งพิสูจน์แล้วว่าให้เวลารอคอยเฉลี่ยต่ำที่สุด (Provably Optimal)
- **Shortest Remaining Time First (SRTF / Preemptive SJF):** สลับการทำงานทันทีเมื่องานใหม่ที่เพิ่งมาถึงมี Burst Time ที่เหลือน้อยกว่างานที่กำลังทำงานอยู่
- **Round Robin (RR):** สลับช่วงเวลาประมวลผลตาม Time Quantum ($q$) พร้อมกฎการจัดคิวมาตรฐานสากล
- **Priority Scheduling (Non-preemptive & Preemptive):** กำหนดระดับความสำคัญ (เลขน้อย = สำคัญสูง) พร้อมระบบแจ้งเตือนปัญหา **Starvation** และแนวทางแก้ไขด้วย **Aging**
- **Priority + Round Robin:** รูปแบบผสมผสานระดับสูง หากมีโปรเซสที่มี Priority สูงสุดเท่ากัน ระบบจะแชร์สิทธิ์ CPU ด้วย Time Slice แบบ Round Robin

### 2. ฮาร์ดแวร์ไปป์ไลน์ & การควบคุมแอนิเมชัน (Hardware Pipeline & Animation)
- **3-Stage Pipeline Display:** แสดงรายการโปรเซสในสถานะ **Ready Queue (FIFO Order)**, **Running (CPU Core)**, และ **Completed** แบบสดๆ ตามเวลาจำลอง $t$
- **Step-by-Step VCR Controls:** ปุ่มเล่น (Play/Pause), ก้าวหน้าทีละสเต็ป (Next), ถอยหลัง (Back), และรีเซ็ตเวลา (Reset)
- **Speed Multiplier:** ปรับความเร็วแอนิเมชันได้ตั้งแต่ 0.25x จนถึง 4.0x

### 3. แผนภูมิแสดงผลคู่ขนาน 2 ระดับ (Dual Visualization)
- **Interactive Gantt Chart:** ปรับขนาดอัตโนมัติ 100% Responsive แสดงสีแยกตามแต่ละโปรเซส (P1–P8) พร้อมแถบ Context Switch (CS) และ Idle Time
- **Per-Process Timeline:** แสดงสถานะ Running (R), Waiting ใน Ready Queue (W) แบบแถบลายทแยงสีทอง และ Not arrived/Completed ตลอดแกนเวลาแบบแม่นยำ

### 4. เมทริกซ์สรุปผลและเปรียบเทียบ (Metrics & Comparison Showdown)
- คำนวณค่าทางสถิติครบถ้วน:
  - **Turnaround Time ($TAT = CT - AT$)**
  - **Waiting Time ($WT = TAT - BT$)**
  - **Response Time ($RT = ST_{\text{first}} - AT$)**
  - **CPU Utilization (%)**
  - **Throughput (processes / ms)**
  - **Context Switch Count** (แยกแบบ Voluntary และ Preemptive)
- **Compare All Table:** คลิกเดียวประมวลผลทุกอัลกอริทึมบนชุดข้อมูลเดียวกัน พร้อมไฮไลต์ค่าที่ดีที่สุด (Best Values) ด้วยสีเขียว

### 5. ชุดข้อมูลตัวอย่างตามหนังสือ & ระบบสุ่ม Workload
- **Textbook Presets:** บรรจุตัวอย่างจริงจากตำรา Silberschatz:
  - FCFS Convoy Effect (p.25)
  - SJF Batch (p.30)
  - SRTF Preemptive Arrivals (p.36)
  - Round Robin $q=4$ (p.40)
  - Priority Scheduling (p.48)
  - Priority + RR $q=2$ (p.53)
- **Random Workload Generator:** รองรับการสร้างชุดข้อมูลแบบ **Uniform** และ **Exponential Distribution** (จำลองพฤติกรรมจริงของระบบที่มีงาน Burst สั้นจำนวนมาก)

### 6. ความสวยงามและประสบการณ์ใช้งานระดับพรีเมียม (UI/UX)
- **Sky & Ocean Blue Theme:** โทนสีฟ้าโมเดิร์นไฮเทค ออกแบบระบบแสงเงา Glassmorphism คมชัด สบายตา
- **Dark / Light Mode:** สลับโหมดมืดและสว่างได้ในคลิกเดียว พร้อมจดจำค่าผ่าน LocalStorage
- **Dual-Language:** รองรับภาษาอังกฤษ (English) และภาษาไทย (Thai) สมบูรณ์แบบ 100%
- **Zero Dependencies:** รันได้ทันทีโดยไม่ต้องติดตั้ง Node.js หรือคอมไพเลอร์ใดๆ

---

## 📁 โครงสร้างโปรเจกต์ (Repository Structure)

```text
Project-Os/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions อัตโนมัติสำหรับ Deploy ขึ้น GitHub Pages
├── .gitignore                  # กรองไฟล์ชั่วคราวและระบบปฏิบัติการ (.DS_Store, logs)
├── index.html                  # ตัวแอปพลิเคชันหลัก (Standalone Single-File Web App)
├── README.md                   # เอกสารแนะนำและคู่มือการใช้งานระบบ
├── chapter_4_cpu_scheduling.md # สรุปเนื้อหาทางทฤษฎีตาม Silberschatz Chapter 4 ฉบับสมบูรณ์
├── presentation_slides_and_script.md # สคริปต์พรีเซนต์ 10 นาที / 5 คน พร้อมบทพูดสองภาษา (EN/TH)
└── slides_assets/              # ภาพแคปเจอร์สไลด์ความละเอียดสูงสำหรับประกอบการนำเสนอ
    ├── slide1_overview.png
    ├── slide2_input_random.png
    ├── slide3_pipeline_simulation.png
    ├── slide4_gantt_results.png
    └── slide5_compare_all.png
```

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

## 👥 เอกสารสำหรับการนำเสนอ (Presentation Deck)

สำหรับทีมผู้จัดทำ สามารถศึกษาแนวทางการนำเสนอ 10 นาที (แบ่ง 5 บทบาท พร้อมช่วงสาธิต Live Demo) ได้ที่:
👉 **[presentation_slides_and_script.md](presentation_slides_and_script.md)**

---

## 📚 แหล่งข้อมูลอ้างอิง (References)
- Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). *Operating System Concepts* (10th ed.). Wiley.
- คณะผู้พัฒนา: นิสิตภาควิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
