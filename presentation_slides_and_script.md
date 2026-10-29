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
| **Speaker 3** | 4:00 – 6:00 | **Live Demo 1** | สไลด์ 5 & 6 (Pipeline & Visualizing States) | **คลิก Preset SRTF (p.36) กด Run, ก้าว $t=0 \rightarrow 1 \rightarrow 5$** |
| **Speaker 4** | 6:00 – 8:00 | **Live Demo 2** | สไลด์ 7 & 8 (สูตรวัดผล & ตารางเปรียบเทียบ) | **คลิก Compare All, ชี้ 4 ตัวชี้วัด & Best Value $\bigstar$** |
| **Speaker 5** | 8:00 – 10:00 | สไลด์ 9 – 12 | 3 ข้อแลกเปลี่ยนทางวิศวกรรม, สรุป & Q&A | สรุปบทเรียน OS, เปิดสไลด์ทีมกลุ่ม 16 & รับคำถาม |

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
  > *Our simulator implements 7 scheduling algorithms across two core classes.*  
  > *First, **Non-preemptive algorithms**, including **FCFS**, **Shortest-Job-First (SJF)**, and **Priority**.*  
  > *Here, a running process keeps the CPU until completion.*  
  > *Second, **Preemptive algorithms**, including **SRTF**, **Round Robin**, **Priority Preemptive**, and the **Priority + RR hybrid**.*  
  > *The OS can interrupt the running task when a shorter job arrives, or when the **Time Quantum** expires."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ขอบคุณผู้พูดคนที่ 1 ครับ โปรแกรมของเราจำลอง 7 อัลกอริทึมตามตำราและแบบประยุกต์ โดยแบ่งเป็น 2 กลุ่มชัดเจนครับ:*  
  > *กลุ่มแรกคือ **Non-preemptive (ไม่แย่งชิง)** ได้แก่ **FCFS**, **SJF ปกติ**, และ **Priority** เมื่อ process ได้ CPU จะรันต่อเนื่องจนจบงาน*  
  > *กลุ่มที่สองคือ **Preemptive (แย่งชิงได้)** ได้แก่ **SRTF**, **Round Robin**, **Priority Preemptive**, และ **Priority + RR***  
  > *ซึ่ง OS สามารถดึง CPU คืนได้ทันทีเมื่องานที่สั้นกว่าหรือสำคัญกว่ามาถึง หรือเมื่อหมดเวลา Time Quantum ครับ"*

---

### 📌 สไลด์ 4: แถบ Test Presets และการป้อนข้อมูล (Process Setup & Presets)
* **🎬 Action Cue:** `[สลับหน้าจอไปที่หน้า Web App ชี้แถบปุ่ม Test Presets 6 ปุ่มด้านบน และแผงสุ่มข้อมูล]`

* **🗣️ English Script:**
  > *"To make testing effortless, we provide **6 one-click Test Presets** right at the top.*  
  > *These cover benchmarks like **FCFS**, **Convoy Effect**, **SJF**, **SRTF**, **Round Robin**, and **Priority**.*  
  > *Clicking any preset instantly loads all arrival times, bursts, and priorities.*  
  > *Users can also add custom processes or use our **Random Generator** with **Uniform or Exponential distributions** to model short I/O bursts.*  
  > *Now, Speaker 3 will demonstrate a live simulation using the SRTF preset."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"เพื่อให้การทดสอบในห้องเรียนสะดวกรวดเร็ว ด้านบนของเว็บจะมีแถบ **Test Presets ทั้งหมด 6 ปุ่มหลัก** ให้คลิกใช้งานทันทีครับ*  
  > *ครอบคลุมโจทย์มาตรฐานครบถ้วน ทั้ง FCFS, ปรากฏการณ์ Convoy Effect, SJF, SRTF, Round Robin, และ Priority ครับ*  
  > *เพียงคลิกปุ่มเดียว ระบบจะกรอกข้อมูลพร้อมจำลองทันที หรือจะป้อนข้อมูลเอง และใช้ระบบสุ่มทั้งแบบ **Uniform หรือ Exponential** เพื่อจำลองงาน I/O ในโลกจริงก็ได้ครับ*  
  > *ต่อไป ขอเชิญผู้พูดคนที่ 3 สาธิตการรันจริงบนชุดทดสอบ SRTF ครับ"*

---

## 👤 SPEAKER 3 (4:00 – 6:00): Live Demo (Part 1) — ไปป์ไลน์และเหตุผลการจัดคิว

### 📌 สไลด์ 5 / หน้าเว็บ: CPU Pipeline & Step-by-Step Playback
* **🎬 Action Cue:** `[คลิกปุ่ม Preset "SRTF · 8,4,9,5 (p.36)" แล้วกดปุ่ม "🚀 Run Simulation" -> หน้าจอเริ่มจำลองที่ t = 0 (P1 ครอง CPU) -> คลิกปุ่ม "⏭ Next" หรือกดลูกศรขวา (→) ไปที่ t = 1 ชี้กล่องเหตุผล -> คลิก "⏭ Next" ก้าวต่อไปที่ t = 5]`

* **🗣️ English Script:**
  > *`[Action: Click preset "SRTF · 8,4,9,5 (p.36)" and click "🚀 Run Simulation" — simulation starts at t = 0]`*  
  > *"Thank you. Let's see the simulator in action!*  
  > *We loaded the benchmark for **SRTF**.*  
  > *At time $t = 0$, only P1 has arrived, so P1 starts running on the CPU.*  
  > *`[Action: Click "⏭ Next" or press Arrow Right (→) to step to t = 1]`*  
  > *Now look at the screen at time $t = 1$: P2 arrives with a burst of 4, which is less than P1's remaining 7.*  
  > *As you can see, **P2 is now in the Running CPU**, while **P1 has been preempted and moved into the Ready Queue**!*  
  > *Our real-time **Decision Reason Box** immediately explains this preemption.*  
  > *`[Action: Click "⏭ Next" repeatedly to step to t = 5]`*  
  > *By time $t = 5$, P2 finishes its 4 ms burst and moves to Completed, allowing P4 to take the CPU as the next shortest job."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *`[ท่าทาง: คลิก Preset "SRTF · 8,4,9,5 (p.36)" แล้วกดปุ่ม "🚀 จำลองการทำงาน" — หน้าจอจะเริ่มจำลองที่ t = 0]`*  
  > *"ขอบคุณครับ ตอนนี้เรามาดูการทำงานจริงบนเว็บกันครับ!*  
  > *เรากดโหลดชุดทดสอบ **SRTF** แล้วกดปุ่มจำลองการทำงาน ที่เวลาเริ่มต้น $t = 0$ มีเพียง P1 มาถึงตัวแรก จึงได้ครอง CPU ไปก่อน*  
  > *`[ท่าทาง: คลิกปุ่ม "⏭ ถัดไป" หรือกดลูกศรขวา (→) เพื่อก้าวไปที่ t = 1]`*  
  > *คราวนี้ดูที่หน้าจอเวลา $t = 1$ นะครับ: P2 เพิ่งมาถึงด้วย burst 4 ซึ่งน้อยกว่าเวลาที่เหลือของ P1 (7 ms)*  
  > *จะเห็นชัดเจนเลยครับว่า **P2 เข้าไปอยู่ในช่อง Running แทนทันที** ส่วน **P1 ถูกเตะกลับไปรออยู่ใน Ready Queue** ทางซ้ายมือ!*  
  > *และสังเกตที่ **กล่อง 💡 เหตุผลการจัดคิว (Decision Reason)** นะครับ ระบบจะพิมพ์บอกเหตุผลการแย่ง CPU อย่างชัดเจนทันที*  
  > *`[ท่าทาง: คลิกปุ่ม "⏭ ถัดไป" ต่อเนื่องจนถึง t = 5]`*  
  > *เมื่อถึงเวลา $t = 5$, P2 ทำงานครบ 4 ms และย้ายไปช่อง Completed ทำให้ P4 ที่มีเวลาน้อยที่สุดขึ้นมารันต่อทันทีครับ"*

---

### 📌 สไลด์ 6 / หน้าเว็บ: Visualizing Process States (Gantt Chart vs. Timeline)
* **🎬 Action Cue:** `[ชี้ Gantt Chart ด้านบน แล้วชี้แถบ Per-Process Timeline ด้านล่าง -> Hover เมาส์บนแท่ง Timeline หรือ Gantt โชว์ Tooltip สดๆ บนจอ]`

* **🗣️ English Script:**
  > *"Below, we visualize execution through two synchronized views:*  
  > *1. **Gantt Chart (Macro):** Shows CPU allocation over time.*  
  > *2. **Per-Process Timeline (Micro):** Shows each individual process across all time units.*  
  > *Solid bars with **'R'** mean Running; striped bars with **'W'** mean Waiting.*  
  > *Hovering over any block reveals exact timing tooltips.*  
  > *Next, Speaker 4 will present performance metrics."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *`[ท่าทาง: ชี้ Gantt Chart แล้วชี้แถบ Per-Process Timeline ด้านล่าง -> เอาเมาส์ Hover บนแท่ง Timeline หรือ Gantt โชว์ Tooltip]`*  
  > *"ด้านล่างเราแสดงผล 2 มุมมองคู่ขนานกันครับ:*  
  > *1. **Gantt Chart (Macro):** แสดงการจัดสรร CPU ตลอดช่วงเวลา*  
  > *2. **Per-Process Timeline (Micro):** แสดงสถานะของแต่ละ Process ตลอดทุกหน่วยเวลา*  
  > *แถบสีทึบ **'R'** คือ Running และแถบลายทแยง **'W'** คือ Waiting ในคิว*  
  > *เมื่อเอาเมาส์ Hover บนแท่ง Gantt หรือ Timeline จะแสดง **Tooltip** บอกช่วงเวลาทำงานทันทีครับ*  
  > *ต่อไป ขอเชิญผู้พูดคนที่ 4 สรุปตัวชี้วัดและตารางเปรียบเทียบครับ"*

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

### 📌 สไลด์ 10, 11 & 12: สรุปสถาปัตยกรรม, ขอบคุณ และแนะนำสมาชิก (Conclusion & Q&A)
* **🎬 Action Cue:** `[สลับไปสไลด์ 10 สรุปเทคโนโลยี -> สลับไปสไลด์ 11 Thank You -> สลับไปสไลด์ 12 แสดงรายชื่อสมาชิกกลุ่ม 16 ทั้ง 5 คน ค้างไว้ที่จอ สบตากรรมการ เปิดเวทีรับคำถาม]`

* **🗣️ English Script:**
  > *"To conclude, our application is built with **Pure HTML5, CSS Grid, and Vanilla JavaScript**, with zero external heavy frameworks.*  
  > *It features an automated test suite of 13 unit tests, runs with zero build setup, and supports full English and Thai localization.*  
  > *`[Action: Transition to Slide 11 & 12 - Member List]`*  
  > *On behalf of Group 16, thank you very much for your time and attention.*  
  > *We are now ready to answer your questions and test any custom numbers live on screen!"*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"สรุปส่งท้ายนะครับ เว็บแอปพลิเคชันของเราพัฒนาด้วย **Pure HTML5, CSS Grid และ Vanilla JavaScript** 100% โดยไม่มีการพึ่งพา framework ภายนอก*  
  > *มีชุดทดสอบ Unit Test 13 ชุดรับประกันความถูกต้อง ไม่ต้องติดตั้งโปรแกรมเพิ่ม และรองรับทั้งภาษาไทยและอังกฤษอย่างสมบูรณ์ครับ*  
  > *`[ท่าทาง: เลื่อนไปสไลด์ 11 Thank You และสไลด์ 12 แสดงรายชื่อสมาชิกกลุ่ม 16 ทั้ง 5 คน]`*  
  > *ในนามของกลุ่มที่ 16 ขอขอบคุณอาจารย์และเพื่อน ๆ ทุกท่านครับ และตอนนี้พวกเราพร้อมตอบทุกคำถาม หรือทดลองกรอกตัวเลขท้าทายเพื่อรันสดให้ดูได้เลยครับ ขอบคุณครับ"*
