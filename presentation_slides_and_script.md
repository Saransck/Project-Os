# ⚡ CPU Scheduling Simulator — 10-Minute Presentation Script
### บทพูดและลำดับคิวการนำเสนอสด (5 ผู้บรรยาย · คนละ 2 นาทีพอดี)

> **วิชา:** 03603332 Operating Systems (บทที่ 4: CPU Scheduling)  
> **ภาควิชา:** วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา  
> **เวลารวม:** 10:00 นาที (แบ่ง 5 คน คนละ ~2 นาที)  
> **รูปแบบ:** สไลด์บรรยาย (12 สไลด์ตาม PDF) + สลับหน้าจอ Live Interactive Web Demo  

---

## 👥 ตารางแบ่งเวลาและหน้าที่ (Time Breakdown)

| ผู้บรรยาย | เวลา | ช่วงสไลด์ / หน้าจอ | หัวข้อหลัก | คิวการเดโมบนหน้าเว็บ (Live Action) |
| :--- | :---: | :---: | :--- | :--- |
| **Speaker 1** | 0:00 – 2:00 | สไลด์ 1 & 2 | เกริ่นนำกลุ่ม 16, วัตถุประสงค์ & วงจร CPU-I/O Burst | แนะนำระบบ, ชี้วงจร Burst Cycle (01–04) |
| **Speaker 2** | 2:00 – 4:00 | สไลด์ 3 & 4 | 7 อัลกอริทึม & แถบ 6 Presets + ระบบสุ่ม | ชี้แถบ 6 Test Presets, ระบบสุ่ม Uniform/Exp |
| **Speaker 3** | 4:00 – 6:00 | **Live Demo 1** | สไลด์ 5 & 6 (Pipeline, Timeline & Results Table) | **คลิก Preset SRTF (p.36) กด Run, ก้าว $t=0 \rightarrow 1 \rightarrow 5$** |
| **Speaker 4** | 6:00 – 8:00 | **Live Demo 2** | สไลด์ 7 & 8 (สูตรวัดผล & ตารางเปรียบเทียบ) | **คลิก Compare All, ชี้ 4 ตัวชี้วัด & Best Value $\bigstar$** |
| **Speaker 5** | 8:00 – 10:00 | สไลด์ 9 – 12 | 3 ข้อแลกเปลี่ยนทางวิศวกรรม, สรุป & จบการนำเสนอ | สรุปบทเรียน OS, ขอบคุณและเปิดสไลด์ทีมกลุ่ม 16 |

---

## 👤 SPEAKER 1 (0:00 – 2:00): เกริ่นนำและที่มาของปัญหา

### 📌 สไลด์ 1: หน้าแรกและแนะนำทีม (Title & Overview)
* **🎬 Action Cue:** `[เปิดสไลด์หน้าแรก สบตากรรมการและผู้ฟัง ยืนประจำตำแหน่งด้านซ้ายของจอ]`

* **🗣️ English Script:**
  > *"Good morning, Professor and everyone.*  
  > *We are **Group 16**, presenting the **CPU Scheduling Simulator**.*  
  > *In any computer system, the CPU is the most critical resource.*  
  > *In a single-core system, only one process can execute at a time.*  
  > *Our tool makes abstract operating system concepts visual and interactive."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"สวัสดีอาจารย์และเพื่อนๆ ทุกคนครับ พวกเรา**กลุ่มที่ 16** ยินดีอย่างยิ่งที่จะมานำเสนอ **CPU Scheduling Simulator** ครับ*  
  > *ในระบบคอมพิวเตอร์ CPU ถือเป็นทรัพยากรหลัก แต่ระบบแบบ single-core จะมี process รันได้เพียงตัวเดียวในแต่ละขณะเท่านั้น*  
  > *เป้าหมายของพวกเราคือการสร้างเครื่องมือจำลองที่เปลี่ยนทฤษฎีการจัดคิว ให้เห็นเป็นภาพเคลื่อนไหวจริงและคำนวณเปรียบเทียบได้ทันทีครับ"*

---

### 📌 สไลด์ 2: ทำไมต้องจัดตารางเวลา CPU? (Why CPU Scheduling Matters: 01–04)
* **🎬 Action Cue:** `[สลับไปสไลด์ 2 ชี้ภาพวงจร CPU burst สลับกับ I/O burst และ 4 ขั้นตอนบนสไลด์]`

* **🗣️ English Script:**
  > *"Why do we need CPU scheduling?*  
  > *Real programs alternate between CPU calculation and waiting for I/O devices.*  
  > *This is known as the **CPU-I/O burst cycle**.*  
  > *Without scheduling, the CPU sits idle while waiting for I/O, wasting processing power.*  
  > *Through **multiprogramming**, the OS picks another ready process immediately.*  
  > *Next, Speaker 2 will introduce our algorithms and test presets."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ทำไมระบบปฏิบัติการถึงต้องมี CPU Scheduling?*  
  > *เพราะในความเป็นจริง โปรแกรมไม่ได้รันงานคำนวณตลอดเวลา แต่จะสลับระหว่างการคำนวณบน CPU กับการรออุปกรณ์ I/O ซึ่งเรียกว่า **CPU-I/O burst cycle** ครับ*  
  > *ถ้าไม่มีการจัดคิว เมื่อโปรแกรมรอ I/O ตัว CPU ก็จะว่างเปล่าและเสียเวลาไปโดยเปล่าประโยชน์*  
  > *ด้วยเทคนิค **Multiprogramming** ระบบจะสลับเอา process อื่นที่พร้อมขึ้นมารันแทนทันที*  
  > *ในลำดับถัดไป ผู้พูดคนที่ 2 จะมาแนะนำอัลกอริทึมและชุดทดสอบครับ"*

---

## 👤 SPEAKER 2 (2:00 – 4:00): อัลกอริทึมและชุดข้อมูลทดสอบ

### 📌 สไลด์ 3: 7 อัลกอริทึมที่ระบบรองรับ (Supported Scheduling Algorithms)
* **🎬 Action Cue:** `[สลับไปสไลด์ 3 ชี้แบ่งกล่อง Non-Preemptive ทางซ้าย กับ Preemptive ทางขวา]`

* **🗣️ English Script:**
  > *"Thank you, Speaker 1.*  
  > *Our simulator supports **seven** CPU scheduling algorithms.*  
  > *There are two main types: **Non-preemptive** and **Preemptive**.*  
  > *Non-preemptive means a process uses the CPU until it finishes, like **FCFS** and **SJF**.*  
  > *Preemptive means the system can stop a process and switch to another one, like **SRTF** and **Round Robin**.*  
  > *We also support **Priority Scheduling** and a combination of **Priority and Round Robin**."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ขอบคุณผู้พูดคนที่ 1 ครับ โปรแกรมของเราจำลอง **7 อัลกอริทึม** โดยแบ่งเป็น 2 กลุ่มหลักครับ:*  
  > *กลุ่มแรกคือ **Non-preemptive** โปรเซสจะรันจนกว่าจะจบงาน เช่น **FCFS** และ **SJF***  
  > *กลุ่มที่สองคือ **Preemptive** ระบบสามารถหยุดงานเดิมและสลับไปรันงานอื่นได้ทันที เช่น **SRTF** และ **Round Robin***  
  > *นอกจากนี้ยังรองรับ **Priority Scheduling** และรูปแบบผสมผสาน **Priority + Round Robin** ด้วยครับ"*

---

### 📌 สไลด์ 4: แถบ Test Presets และการป้อนข้อมูล (Process Setup & Presets)
* **🎬 Action Cue:** `[สลับหน้าจอไปที่หน้า Web App ชี้แถบปุ่ม Test Presets 6 ปุ่มด้านบน และแผงสุ่มข้อมูล]`

* **🗣️ English Script:**
  > *"For testing, we provide ready-to-use examples from the textbook.*  
  > *Users can also add their own processes or generate random processes.*  
  > *We support two types of random distributions: **Uniform** and **Exponential**.*  
  > *Exponential is useful because real CPU bursts are often short.*  
  > *Now, let's move on to Speaker 3, who will show you how the simulator works using the **SRTF preset**."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"สำหรับการทดสอบ เรามีชุดตัวอย่างโจทย์จริงจากตำราให้คลิกใช้งานได้ทันทีครับ*  
  > *ผู้ใช้สามารถเพิ่มโปรเซสเอง หรือใช้ระบบสุ่มข้อมูลก็ได้*  
  > *โดยระบบสุ่มรองรับ 2 รูปแบบ คือ **Uniform** และ **Exponential***  
  > *ซึ่งแบบ Exponential มีประโยชน์มาก เพราะจำลองพฤติกรรมจริงที่งาน CPU burst มักจะสั้นครับ*  
  > *ลำดับถัดไป ขอส่งต่อให้ผู้พูดคนที่ 3 สาธิตการทำงานจริงบนชุดทดสอบ **SRTF** ครับ"*

---

## 👤 SPEAKER 3 (4:00 – 6:00): Live Demo (Part 1) — ไปป์ไลน์และเหตุผลการจัดคิว

### 📌 สไลด์ 5 / หน้าเว็บ: CPU Pipeline & Step-by-Step Playback
* **🎬 Action Cue:** `[กด Preset SRTF แล้วกด "🚀 จำลองการทำงาน" (t=0) -> คลิก "⏭ ถัดไป" (t=1) ชี้กล่องเหตุผล -> คลิกต่อเนื่องไปที่ t=5 -> กด ▶ Play ให้รันจนจบที่ t=26]`

* **🗣️ English Script:**
  > *`[Action: Load SRTF and click "🚀 Run Simulation" (t = 0)]`*  
  > *"Thank you, Speaker 2. Here is our live pipeline demo using **SRTF**.*  
  > *At $t = 0$, P1 arrives and starts running on the CPU.*  
  > *`[Action: Step to t = 1]`*  
  > *At $t = 1$, P2 arrives with burst 4, which is less than P1's remaining 7.*  
  > *P2 preempts P1 into the Ready Queue, explained live in our **Decision Reason Box**.*  
  > *`[Action: Step to t = 5]`*  
  > *By $t = 5$, P2 finishes and moves to Completed, passing the CPU to P4.*  
  > *`[Action: Click ▶ Play to let animation run to completion]`*  
  > *From there, we can press **Play** to let the simulation run automatically until all processes finish at **$t = 26$**."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *`[ท่าทาง: โหลด Preset SRTF แล้วกด "🚀 จำลองการทำงาน" (t = 0)]`*  
  > *"ขอบคุณผู้พูดคนที่ 2 ครับ มาดูการทำงานจริงของไปป์ไลน์บนชุดทดสอบ **SRTF** ครับ*  
  > *ที่ $t = 0$: P1 มาถึงตัวแรก จึงได้ครอง CPU ไปก่อน*  
  > *`[ท่าทาง: คลิก "⏭ ถัดไป" ไปที่ t = 1]`*  
  > *ที่ $t = 1$: P2 มาถึงด้วย burst 4 ซึ่งสั้นกว่า 7 ms ของ P1*  
  > *P2 จึงชิง CPU ไปรันทันที ส่วน P1 ถูกเตะกลับไปรอใน Ready Queue โดยมี **กล่องเหตุผล** อธิบายชัดเจนครับ*  
  > *`[ท่าทาง: คลิกต่อเนื่องไปที่ t = 5]`*  
  > *เมื่อถึง $t = 5$: P2 รันเสร็จย้ายไปช่อง Completed และส่งต่อ CPU ให้ P4*  
  > *`[ท่าทาง: คลิกปุ่ม ▶ Play ให้แอนิเมชันวิ่งต่อเองจนจบ]`*  
  > *และเราสามารถกดปุ่ม **เล่น (Play)** เพื่อให้ระบบรันต่ออัตโนมัติจนกระทั่งทุกโปรเซสทำงานเสร็จสิ้นที่เวลา **$t = 26$** ครับ"*

---

### 📌 สไลด์ 6 / หน้าเว็บ: Visualizing Process States & Results Table
* **🎬 Action Cue:** `[ชี้ Gantt Chart ด้านบน ชี้ Per-Process Timeline ตรงกลาง (Hover โชว์ Tooltip) -> เลื่อนลงมาชี้ Results Table ด้านล่าง]`

* **🗣️ English Script:**
  > *"Below, the system provides three complementary views:*  
  > *1. **Gantt Chart:** Macro view of CPU allocation over time.*  
  > *2. **Per-Process Timeline:** Micro timeline tracking Running (**'R'**) and Waiting (**'W'**) states with interactive tooltips.*  
  > *3. **Results Table:** Exact numerical breakdown of completion, turnaround, and waiting times for each process.*  
  > *Next, Speaker 4 will present performance formulas and the Compare All showdown."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *`[ท่าทาง: ชี้ Gantt Chart ด้านบน ชี้ Timeline ตรงกลาง (Hover โชว์ Tooltip) -> เลื่อนลงมาชี้ Results Table ด้านล่าง]`*  
  > *"ด้านล่างระบบแสดงผล 3 มุมมองที่เติมเต็มซึ่งกันและกันครับ:*  
  > *1. **Gantt Chart:** ภาพรวมการจัดสรร CPU ตลอดช่วงเวลา*  
  > *2. **Per-Process Timeline:** ไทม์ไลน์เจาะลึกสถานะ Running (**'R'**) และ Waiting (**'W'**) พร้อม Tooltip เมื่อชี้เมาส์*  
  > *3. **ตารางผลลัพธ์ (Results Table):** แจกแจงตัวเลขเวลาจบงาน, Turnaround และเวลารอคอยของทุก Process อย่างละเอียด*  
  > *ต่อไป ขอส่งต่อให้ผู้พูดคนที่ 4 สรุปสูตรการวัดผลและตารางเปรียบเทียบครับ"*

---

## 👤 SPEAKER 4 (6:00 – 8:00): Live Demo (Part 2) — ตัวชี้วัดและการเปรียบเทียบ

### 📌 สไลด์ 7 / หน้าเว็บ: การคำนวณตัวชี้วัด (How We Measure Scheduler Performance)
* **🎬 Action Cue:** `[เลื่อนหน้าจอลงมาชี้ที่กล่องสรุปสถิติด้านบน และตารางผลลัพธ์ราย Process ด้านล่าง]`

* **🗣️ English Script:**
  > *"Thank you, Speaker 3.*  
  > *Our application computes exact textbook formulas with 100% precision:*  
  > *1. **Turnaround Time ($TAT = CT - AT$):** Total elapsed time from arrival to completion.*  
  > *2. **Waiting Time ($WT = TAT - BT$):** Total duration spent waiting inside the Ready Queue.*  
  > *3. **Response Time ($RT = \text{First Run} - AT$):** Time until the first CPU allocation, vital for interactive systems.*  
  > *We also track **CPU Utilization (%)**, **Throughput**, and separate **Voluntary switches** from **Nonvoluntary preemptions**."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ขอบคุณผู้พูดคนที่ 3 ครับ ในการประเมินคุณภาพของอัลกอริทึม โปรแกรมของเราคำนวณตามสูตรมาตรฐานอย่างแม่นยำครับ:*  
  > *1. **Turnaround Time ($CT - AT$):** เวลารวมตั้งแต่เข้าสู่ระบบจนทำงานเสร็จ*  
  > *2. **Waiting Time ($TAT - BT$):** เวลาที่ต้องนั่งรออยู่ใน Ready Queue*  
  > *3. **Response Time ($\text{First Run} - AT$):** เวลาตั้งแต่มาถึงจนได้แตะ CPU แวบแรก ซึ่งสำคัญมากสำหรับความรู้สึกของผู้ใช้งาน*  
  > *นอกจากนี้ยังคำนวณ **CPU Utilization (%)**, **Throughput**, และนับจำนวน **Context Switch** โดยแยกทั้ง **Voluntary** คืองานเสร็จเอง และ **Nonvoluntary** ที่โดนแย่ง CPU ครับ"*

---

### 📌 สไลด์ 8 / หน้าเว็บ: ปุ่ม "Compare All" (Side-by-Side Algorithm Showdown)
* **🎬 Action Cue:** `[คลิกปุ่ม "📊 Compare All Algorithms" สีม่วง -> เลื่อนหน้าจอลงมาที่ตารางเปรียบเทียบ ชี้แถว SRTF ที่มีดาวเขียว ★]`

* **🗣️ English Script:**
  > *`[Action: Click "📊 Compare All Algorithms" and scroll down]`*  
  > *"Here is our most powerful feature: **Compare All**.*  
  > *With one click, it runs the exact same workload through all algorithms simultaneously.*  
  > *The benchmark table highlights the best score in each category with a green star ($\bigstar$).*  
  > *For this workload, **SRTF** wins with the lowest average waiting time of **6.50 ms**.*  
  > *In comparison, SJF takes **7.75 ms**, and FCFS takes **8.75 ms**.*  
  > *Directly below, all Gantt charts line up side-by-side, exposing structural differences instantly.*  
  > *Now, Speaker 5 will conclude with real-world engineering insights."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *`[ท่าทาง: คลิกปุ่ม "📊 เปรียบเทียบทุกอัลกอริทึม" เลื่อนลงมาที่ตารางเปรียบเทียบ]`*  
  > *"นี่คือฟีเจอร์เด่นที่สุดของเว็บเราครับ นั่นคือปุ่ม **Compare All***  
  > *เพียงคลิกเดียว ระบบจะนำข้อมูลชุดเดียวกันไปรันบนทุกอัลกอริทึมพร้อมกันทันทีครับ*  
  > *ในตารางเปรียบเทียบ ค่าที่ดีที่สุดในแต่ละด้านจะถูกไฮไลต์ด้วยสีเขียวพร้อมสัญลักษณ์ดาว ($\bigstar$)*  
  > *จะเห็นชัดเจนว่า **SRTF** ชนะเลิศด้วยเวลารอคอยเฉลี่ยต่ำที่สุดเพียง **6.50 ms** เทียบกับ SJF ที่ได้ **7.75 ms** และ FCFS ที่ได้ **8.75 ms** ครับ*  
  > *และด้านล่างมี Gantt Chart ของทุกอัลกอริทึมวางเรียงซ้อนกันให้เห็นความแตกต่างของจังหวะการสลับงานทันทีครับ*  
  > *ต่อไป ขอเชิญผู้พูดคนที่ 5 สรุปข้อคิดทางวิศวกรรมและปิดการนำเสนอครับ"*

---

## 👤 SPEAKER 5 (8:00 – 10:00): ข้อแลกเปลี่ยนทางวิศวกรรมและสรุป

### 📌 สไลด์ 9: 3 ข้อแลกเปลี่ยนสำคัญในระบบปฏิบัติการ (Key Insights & Engineering Trade-Offs)
* **🎬 Action Cue:** `[สลับไปสไลด์ 9 สรุป 3 ประเด็นหลักบนจอ]`

* **🗣️ English Script:**
  > *"Thank you, Speaker 4.*  
  > *From our interactive experiments, we draw three critical OS engineering trade-offs:*  
  > *1. **The Convoy Effect in FCFS:** A single CPU-bound job makes short I/O jobs wait, killing system responsiveness.*  
  > *2. **Time Quantum Dilemma in Round Robin:** If $q$ is too large, it degrades into FCFS; if too small, context switch overhead dominates. As a rule of thumb, **80% of CPU bursts should be shorter than $q$**.*  
  > *3. **Starvation vs. Aging:** Priority and SJF can starve long processes indefinitely. Real OS resolve this using **Aging**—gradually increasing the priority of waiting jobs."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ขอบคุณผู้พูดคนที่ 4 ครับ จากการทดลองบนโปรแกรมจำลองนี้ เราสรุปข้อแลกเปลี่ยนทางวิศวกรรมจริงได้ 3 ข้อครับ:*  
  > *ข้อแรก **Convoy Effect ใน FCFS:** งานคำนวณยาวตัวเดียว สามารถฉุดรั้งงาน I/O สั้น ๆ ให้ค้างทั้งระบบ*  
  > *ข้อสอง **การเลือก Time Quantum ใน Round Robin:** ถ้า $q$ ใหญ่เกินไปจะถอยหลังกลายเป็น FCFS แต่ถ้าเล็กเกินไป CPU จะเสียเวลาไปกับ Context Switch ฟรี ๆ ซึ่งตามหลักแล้ว **80% ของงานคำนวณควรต้องสั้นกว่าค่า $q$** ครับ*  
  > *ข้อสาม **Starvation ใน Priority:** งานสำคัญน้อยอาจไม่ได้รันเลย ซึ่ง OS ยุคใหม่แก้ด้วยเทคนิค **Aging** หรือการค่อย ๆ เพิ่ม Priority ให้งานที่รอนานครับ"*

---

### 📌 สไลด์ 10, 11 & 12: สรุปสถาปัตยกรรม, ขอบคุณ และจบการนำเสนอ (Conclusion & Wrap-up)
* **🎬 Action Cue:** `[เปิดสไลด์ 10 พูดสรุป 3 หัวข้อ -> พูดขอบคุณพร้อมสลับไปสไลด์ 11 Thank You และจบที่สไลด์ 12 รายชื่อสมาชิกกลุ่ม 16 ค้างไว้ที่จอ สบตากรรมการและผู้ฟังอย่างมั่นใจ]`

* **🗣️ English Script:**
  > *"To conclude, our simulator delivers on three key pillars:*  
  > *1. **Clean Architecture:** Built purely with HTML5, CSS3, and Vanilla JavaScript, backed by 13 unit tests.*  
  > *2. **UX Features:** Smooth animations, bilingual support, responsive layout, and Light/Dark themes.*  
  > *3. **Pedagogical Value:** A direct interactive companion for mastering Operating System Chapter 4.*  
  > *On behalf of Group 16, thank you very much for your time and attention."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"สรุปส่งท้ายนะครับ เว็บแอปพลิเคชันของเราตอบโจทย์สำคัญ 3 ด้านครับ:*  
  > *ข้อแรก **Clean Architecture:** พัฒนาด้วย Pure HTML5, CSS3 และ Vanilla JavaScript 100% ไร้ dependency ภายนอก พร้อม 13 Unit Tests รับประกันความถูกต้อง*  
  > *ข้อสอง **UX Features:** มีแอนิเมชันที่ลื่นไหล รองรับทั้งภาษาไทยและอังกฤษ ปรับตามหน้าจอ และมีโหมด Light/Dark Theme*  
  > *ข้อสาม **Pedagogical Value:** เป็นสื่อการเรียนรู้แบบโต้ตอบ ที่ช่วยให้เข้าใจทฤษฎีบทที่ 4 ได้อย่างเห็นภาพจริงครับ*  
  > *ในนามของกลุ่มที่ 16 ขอขอบพระคุณอาจารย์และเพื่อนๆ ทุกท่านเป็นอย่างยิ่งครับ ขอบคุณครับ"*
