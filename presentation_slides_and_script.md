# ⚡ CPU Scheduling Simulator — 10-Minute Presentation Script
### บทพูดและลำดับคิวการนำเสนอสด (5 ผู้บรรยาย · คนละ 2 นาทีพอดี)

> **วิชา:** 03603332 Operating Systems (บทที่ 4: CPU Scheduling)  
> **ภาควิชา:** วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา  
> **เวลารวม:** 10:00 นาที (แบ่ง 5 คน คนละ ~2 นาที)  
> **รูปแบบ:** สไลด์บรรยาย + สลับหน้าจอ Live Interactive Web Demo  

---

## 👥 ตารางแบ่งเวลาและหน้าที่ (Time Breakdown)

| ผู้บรรยาย | เวลา | ช่วงสไลด์ / หน้าจอ | หัวข้อหลัก | คิวการเดโมบนหน้าเว็บ (Live Action) |
| :--- | :---: | :---: | :--- | :--- |
| **Speaker 1** | 0:00 – 2:00 | สไลด์ 1 & 2 | เกริ่นนำ, วัตถุประสงค์ & ปัญหา CPU-I/O Burst | แนะนำระบบ, ชี้วงจร Burst Cycle |
| **Speaker 2** | 2:00 – 4:00 | สไลด์ 3 & 4 | อัลกอริทึม 6 แบบ & แถบ Test Presets บนเว็บ | ชี้แถบ 6 Test Presets, ระบบสุ่ม |
| **Speaker 3** | 4:00 – 6:00 | **Live Demo 1** | CPU Pipeline, แอนิเมชัน & กล่องบอกเหตุผล | **คลิก Preset SRTF (p.36), กด Step $t=1, 5$** |
| **Speaker 4** | 6:00 – 8:00 | **Live Demo 2** | สูตรวัดผล ($TAT, WT, RT$) & ตารางเปรียบเทียบ | **คลิก Compare All, ชี้ตาราง Best Value** |
| **Speaker 5** | 8:00 – 10:00 | สไลด์ 9 & 10 | 3 ข้อแลกเปลี่ยนทางวิศวกรรม, สรุป & Q&A | สรุปบทเรียน OS, เปิดเวทีรับคำถามสด |

---

## 👤 SPEAKER 1 (0:00 – 2:00): เกริ่นนำและที่มาของปัญหา

### 📌 สไลด์ 1: หน้าแรกและแนะนำทีม (Title & Overview)
* **🎬 Action Cue:** `[เปิดสไลด์หน้าแรก สบตากรรมการและผู้ฟัง ยืนประจำตำแหน่งด้านซ้ายของจอ]`

* **🗣️ English Script:**
  > *"Good morning, Professor and everyone. Today, our team presents our web application: the **CPU Scheduling Simulator**.*  
  > *In any computer system, the CPU is the most critical resource. However, in a single-core system, only one process can execute at any given moment.*  
  > *Our goal is to create an interactive learning tool that makes abstract operating system concepts visual, tangible, and easy to understand."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"สวัสดีอาจารย์และเพื่อนๆ ทุกคนครับ วันนี้กลุ่มของพวกเรายินดีอย่างยิ่งที่จะมานำเสนอเว็บแอปพลิเคชัน **CPU Scheduling Simulator** ครับ*  
  > *ในระบบคอมพิวเตอร์ CPU ถือเป็นหัวใจหลัก แต่ในระบบ single-core จะมี process รันได้เพียงตัวเดียวในแต่ละขณะเท่านั้น*  
  > *เป้าหมายของพวกเราคือการสร้างเครื่องมือจำลองแบบโต้ตอบ ที่เปลี่ยนทฤษฎีการจัดคิวของ OS ให้เห็นเป็นภาพเคลื่อนไหวจริงและคำนวณเปรียบเทียบได้ทันทีครับ"*

---

### 📌 สไลด์ 2: ทำไมต้องจัดตารางเวลา CPU? (CPU-I/O Burst Cycle)
* **🎬 Action Cue:** `[สลับไปสไลด์ 2 ชี้ภาพวงจร CPU burst สลับกับ I/O burst]`

* **🗣️ English Script:**
  > *"Why do we need CPU scheduling? Real programs alternate between CPU calculation and waiting for I/O devices.*  
  > *This is known as the **CPU-I/O burst cycle**.*  
  > *Without scheduling, whenever a program waits for a file or network response, the CPU sits idle and wastes precious processing power.*  
  > *Through **multiprogramming**, the OS picks another ready process from memory, maximizing CPU utilization.*  
  > *Next, Speaker 2 will introduce the algorithms and test presets supported by our system."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ทำไมระบบปฏิบัติการถึงต้องมี CPU Scheduling? เพราะในความเป็นจริง โปรแกรมไม่ได้รันงานคำนวณตลอดเวลา แต่จะสลับระหว่างการคำนวณบน CPU กับการรออุปกรณ์ I/O ซึ่งเรียกว่า **CPU-I/O burst cycle** ครับ*  
  > *ถ้าไม่มีการจัดคิว เมื่อโปรแกรมรอไฟล์หรือรอเน็ตเวิร์ก CPU ก็จะว่างเปล่าและสูญเสียประสิทธิภาพไปโดยเปล่าประโยชน์*  
  > *ด้วยเทคนิค **Multiprogramming** ระบบจะสลับเอา process อื่นที่พร้อมในหน่วยความจำขึ้นมารันแทนทันที*  
  > *ในลำดับถัดไป ผู้พูดคนที่ 2 จะมาอธิบายถึงอัลกอริทึมและชุดทดสอบของโปรแกรมเราครับ"*

---

## 👤 SPEAKER 2 (2:00 – 4:00): อัลกอริทึมและชุดข้อมูลทดสอบ

### 📌 สไลด์ 3: 6 อัลกอริทึมที่ระบบรองรับ (Algorithm Taxonomy)
* **🎬 Action Cue:** `[สลับไปสไลด์ 3 ชี้แบ่งกลุ่ม Non-Preemptive กับ Preemptive บนตาราง]`

* **🗣️ English Script:**
  > *"Thank you, Speaker 1. Our simulator implements 6 primary scheduling algorithms categorized into two classes:*  
  > *First, **Non-preemptive algorithms**, including **FCFS** and **Shortest-Job-First (SJF)**. Once a process gets the CPU, it holds it until completion.*  
  > *Second, **Preemptive algorithms**, including **SRTF**, **Round Robin**, and **Priority Scheduling**.*  
  > *Here, the operating system can interrupt the running task whenever a shorter or more urgent process arrives, or when the **Time Quantum** expires."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ขอบคุณผู้พูดคนที่ 1 ครับ โปรแกรมของเราจำลอง 6 อัลกอริทึมหลักตามตำรา โดยแบ่งเป็น 2 กลุ่มชัดเจนครับ:*  
  > *กลุ่มแรกคือ **Non-preemptive (ไม่แย่งชิง)** ได้แก่ **FCFS** และ **SJF ปกติ** เมื่อ process ได้ CPU ไปแล้ว จะถือครองยาวจนกว่าจะจบงาน*  
  > *กลุ่มที่สองคือ **Preemptive (แย่งชิงได้)** ได้แก่ **SRTF**, **Round Robin**, และ **Priority Preemptive***  
  > *ซึ่ง OS มีอำนาจดึง CPU คืนทันทีเมื่องานที่สั้นกว่าเข้ามา หรือเมื่อหมดโควตาเวลา **Time Quantum** ครับ"*

---

### 📌 สไลด์ 4: แถบ Test Presets และการป้อนข้อมูล (Setup & Presets)
* **🎬 Action Cue:** `[สลับหน้าจอไปที่หน้า Web App ชี้แถบปุ่ม Test Presets 6 ปุ่มด้านบน]`

* **🗣️ English Script:**
  > *"To make demonstration effortless, we provide **6 one-click Test Presets** right at the top of the app:*  
  > *These include classical benchmarks: **FCFS**, **Convoy Effect**, **SJF**, **SRTF**, **Round Robin**, and **Priority**.*  
  > *Clicking any preset instantly loads arrival times, burst times, and priorities.*  
  > *Users can also add custom processes or use our **Random Generator** with uniform or exponential distributions.*  
  > *Now, Speaker 3 will run a live demonstration on the SRTF preset."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"เพื่อให้การทดสอบในห้องเรียนสะดวกรวดเร็วที่สุด ด้านบนของเว็บจะมีแถบ **Test Presets ทั้งหมด 6 ปุ่มหลัก** ให้กดใช้งานทันทีครับ*  
  > *ครอบคลุมโจทย์มาตรฐานครบถ้วน ทั้ง **FCFS**, ปรากฏการณ์ **Convoy Effect**, **SJF**, **SRTF**, **Round Robin**, และ **Priority** ครับ*  
  > *เพียงคลิกปุ่มเดียว ระบบจะกรอกตารางข้อมูลให้ครบถ้วนพร้อมจำลองทันที*  
  > *หรือจะกรอกข้อมูลเอง และสุ่มด้วย **Random Generator** ก็ได้ครับ*  
  > *ต่อไป ขอเชิญผู้พูดคนที่ 3 สาธิตการรันจริงแบบทีละสเต็ปบนชุดทดสอบ SRTF ครับ"*

---

## 👤 SPEAKER 3 (4:00 – 6:00): Live Demo (Part 1) — ไปป์ไลน์และเหตุผลการจัดคิว

### 📌 สไลด์ 5 / หน้าเว็บ: CPU Pipeline & Step-by-Step Playback
* **🎬 Action Cue:** `[คลิกปุ่ม Preset "SRTF · 8,4,9,5 (p.36)" บนเว็บ -> กดปุ่ม Next (หรือกดแป้นลูกศรขวา ->) ไปที่เวลา t = 1 และ t = 5]`

* **🗣️ English Script:**
  > *`[Action: Click preset "SRTF · 8,4,9,5 (p.36)", then step forward to t = 1]`*  
  > *"Thank you. Let's see the simulator in action!*  
  > *We just loaded the benchmark for **SRTF**. Watch what happens at time $t = 1$:*  
  > *P1 was running, but P2 arrived with a burst of only 4. Because 4 is less than P1's remaining 7, the CPU preempts P1 and switches to P2.*  
  > *Notice our real-time **Decision Reason Box**: it clearly explains *why* the scheduler made this choice.*  
  > *The **CPU Pipeline** shows Ready Queue on the left, running core in the middle, and completed jobs on the right."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *`[ท่าทาง: คลิก Preset "SRTF · 8,4,9,5 (p.36)" แล้วกดปุ่มลูกศรขวาเพื่อ Step ไปที่ t = 1]`*  
  > *"ขอบคุณครับ ตอนนี้เรามาดูการทำงานจริงบนเว็บกันครับ!*  
  > *เรากดโหลดชุดทดสอบ **SRTF** สังเกตที่เวลา $t = 1$ นะครับ:*  
  > *เดิม P1 กำลังรันอยู่ แต่ P2 เพิ่งมาถึงด้วย burst 4 ซึ่งน้อยกว่าเวลาที่เหลือของ P1 (7 ms) ระบบจึงทำการ Preempt ดึง CPU ให้ P2 ทันที*  
  > *ที่สำคัญ โปรแกรมของเรามี **กล่อง 💡 เหตุผลการจัดคิว (Decision Reason)** คอยอธิบายเบื้องหลังการตัดสินใจทุกจังหวะเวลาอย่างชัดเจน*  
  > *โดยแถบ Pipeline จะแสดง Ready Queue ทางซ้าย, CPU ตรงกลาง, และงานที่จบแล้วทางขวาแบบสด ๆ ครับ"*

---

### 📌 สไลด์ 6 / หน้าเว็บ: Gantt Chart vs. Per-Process Timeline
* **🎬 Action Cue:** `[เลื่อนหน้าจอลงมาที่แผนภูมิ Gantt Chart และแถบ Per-Process Timeline ด้านล่าง]`

* **🗣️ English Script:**
  > *"Directly below the pipeline, we provide two synchronized visual charts:*  
  > *First is the macro **Gantt Chart**, showing CPU ownership across time.*  
  > *Second is our unique **Per-Process Timeline**.*  
  > *While Gantt shows what the CPU is doing, the Timeline shows what **each individual process** is doing.*  
  > *Solid colors with the letter **'R'** indicate Running states, while striped bars with **'W'** indicate Waiting in queue.*  
  > *Now, Speaker 4 will demonstrate performance metrics and the Compare All showdown."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ถัดลงมาจาก Pipeline เรามีแผนภูมิแสดงผลคู่ขนาน 2 ระดับครับ:*  
  > *ด้านบนคือ **Gantt Chart** แสดงภาพรวมว่า CPU กำลังรันงานของใคร*  
  > *และด้านล่างคือ **Timeline ราย Process** ที่บอกว่าแต่ละตัวกำลังทำอะไรอยู่*  
  > *แถบสีทึบพร้อมตัวอักษร **'R'** คือช่วงที่ได้รันจริง และแถบลายทแยงพร้อมตัวอักษร **'W'** คือช่วงที่กำลังรอในคิว ทำให้เห็นเวลารอคอยได้อย่างชัดเจนครับ*  
  > *ต่อไป ขอส่งต่อให้ผู้พูดคนที่ 4 เจาะลึกตัวเลขและตารางเปรียบเทียบทุกอัลกอริทึมครับ"*

---

## 👤 SPEAKER 4 (6:00 – 8:00): Live Demo (Part 2) — ตัวชี้วัดและการเปรียบเทียบ

### 📌 สไลด์ 7 / หน้าเว็บ: การคำนวณตัวชี้วัด (Metrics & Formulas)
* **🎬 Action Cue:** `[ชี้ที่กล่องสรุปผลตัวเลขด้านขวาของตารางผลลัพธ์]`

* **🗣️ English Script:**
  > *"Thank you, Speaker 3. To evaluate scheduling quality, our application computes textbook formulas with 100% precision:*  
  > *1. **Turnaround Time ($TAT = CT - AT$):** Total elapsed time from arrival to completion.*  
  > *2. **Waiting Time ($WT = TAT - BT$):** Total duration spent waiting inside the Ready Queue.*  
  > *3. **Response Time ($RT = \text{First Run} - AT$):** Time until the first CPU allocation, vital for interactive systems.*  
  > *We also track **CPU Utilization (%)**, **Throughput**, and separate voluntary from preemptive **Context Switches**."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ขอบคุณผู้พูดคนที่ 3 ครับ ในการประเมินคุณภาพของอัลกอริทึม โปรแกรมของเราคำนวณตามสูตรมาตรฐานอย่างแม่นยำครับ:*  
  > *1. **Turnaround Time ($CT - AT$):** เวลารวมตั้งแต่เข้าสู่ระบบจนทำงานเสร็จ*  
  > *2. **Waiting Time ($TAT - BT$):** เวลาที่ต้องนั่งรออยู่ใน Ready Queue*  
  > *3. **Response Time ($\text{First Run} - AT$):** เวลาตั้งแต่มาถึงจนได้แตะ CPU แวบแรก ซึ่งสำคัญมากสำหรับความรู้สึกของผู้ใช้งาน*  
  > *นอกจากนี้ยังคำนวณ **CPU Utilization (%)**, **Throughput**, และนับจำนวน **Context Switch** ให้อีกด้วยครับ"*

---

### 📌 สไลด์ 8 / หน้าเว็บ: ปุ่ม "Compare All" เปรียบเทียบทุกอัลกอริทึม
* **🎬 Action Cue:** `[คลิกปุ่ม "📊 Compare All Algorithms" สีม่วง -> หน้าจอเลื่อนลงมาที่ตารางเปรียบเทียบด้านล่าง ชี้แถว SRTF ที่มีดาวเขียว ★]`

* **🗣️ English Script:**
  > *`[Action: Click "📊 Compare All Algorithms" and scroll down]`*  
  > *"Here is the most powerful feature of our simulator: **Compare All**.*  
  > *With one click, it runs the exact same workload through all algorithms simultaneously.*  
  > *Look at the benchmark table: the best scores are highlighted with a green star ($\bigstar$).*  
  > *For this workload, **SRTF** wins with the lowest average waiting time of **6.50 ms**, compared to **7.75 ms** for SJF, and **8.75 ms** for FCFS.*  
  > *Directly below, all Gantt charts line up side-by-side, exposing structural differences instantly.*  
  > *Now, Speaker 5 will conclude with real-world engineering insights."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *`[ท่าทาง: คลิกปุ่ม "📊 Compare All Algorithms" เลื่อนลงมาที่ตารางเปรียบเทียบ]`*  
  > *"นี่คือฟีเจอร์เด่นที่สุดของเว็บเราครับ นั่นคือปุ่ม **Compare All***  
  > *เพียงคลิกเดียว ระบบจะนำข้อมูลชุดเดียวกันไปรันบนทุกอัลกอริทึมพร้อมกันทันทีครับ*  
  > *ในตารางเปรียบเทียบ ค่าที่ดีที่สุดจะถูกไฮไลต์ด้วยสีเขียวพร้อมสัญลักษณ์ดาว ($\bigstar$)*  
  > *จะเห็นชัดเจนว่า **SRTF** ชนะเลิศด้วยเวลารอคอยเฉลี่ยต่ำที่สุดเพียง **6.50 ms** เทียบกับ SJF ที่ได้ **7.75 ms** และ FCFS ที่ได้ **8.75 ms** ครับ*  
  > *และด้านล่างมี Gantt Chart ของทุกอัลกอริทึมวางเรียงซ้อนกันให้เห็นความแตกต่างของจังหวะการสลับงานทันทีครับ*  
  > *ต่อไป ขอเชิญผู้พูดคนที่ 5 สรุปข้อคิดทางวิศวกรรมและปิดการนำเสนอครับ"*

---

## 👤 SPEAKER 5 (8:00 – 10:00): ข้อแลกเปลี่ยนทางวิศวกรรมและสรุป

### 📌 สไลด์ 9: 3 ข้อแลกเปลี่ยนสำคัญในระบบปฏิบัติการ (OS Trade-Offs)
* **🎬 Action Cue:** `[สลับไปสไลด์ 9 สรุป 3 ประเด็นหลักบนจอ]`

* **🗣️ English Script:**
  > *"Thank you, Speaker 4. From our interactive experiments, we draw three critical OS engineering trade-offs:*  
  > *1. **The Convoy Effect in FCFS:** A single CPU-bound job makes short I/O jobs wait, killing system responsiveness.*  
  > *2. **Time Quantum Selection in Round Robin:** If $q$ is too large, it degrades into FCFS; if $q$ is too small, context switch overhead eats up CPU time.*  
  > *3. **Starvation vs. Aging:** Priority and SJF can starve long processes indefinitely. Real OS resolve this using **Aging**—gradually increasing the priority of waiting jobs."*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"ขอบคุณผู้พูดคนที่ 4 ครับ จากการทดลองบนโปรแกรมจำลองนี้ เราสรุปข้อแลกเปลี่ยนทางวิศวกรรมจริงได้ 3 ข้อครับ:*  
  > *ข้อแรก **Convoy Effect ใน FCFS:** งานคำนวณยาวตัวเดียว สามารถฉุดรั้งงาน I/O สั้น ๆ ให้ค้างทั้งระบบ*  
  > *ข้อสอง **การเลือก Time Quantum ใน Round Robin:** ถ้า $q$ ใหญ่เกินไปจะถอยหลังกลายเป็น FCFS แต่ถ้าเล็กเกินไป CPU จะเสียเวลาไปกับ Context Switch ฟรี ๆ*  
  > *ข้อสาม **Starvation ใน Priority:** งานสำคัญน้อยอาจไม่ได้รันเลย ซึ่ง OS ยุคใหม่แก้ด้วยเทคนิค **Aging** หรือการค่อย ๆ เพิ่ม Priority ให้งานที่รอนานครับ"*

---

### 📌 สไลด์ 10: สรุปสถาปัตยกรรมระบบและเปิดรับคำถาม (Wrap-up & Q&A)
* **🎬 Action Cue:** `[สลับหน้าจอกลับมาที่ตัว Web App ค้างไว้ สบตากรรมการ เปิดเวทีรับคำถาม]`

* **🗣️ English Script:**
  > *"To conclude, our application is built with **Pure HTML5, CSS Grid, and Vanilla ES6 JavaScript**, with zero external heavy frameworks.*  
  > *It features an automated test suite of 13 unit tests, runs with zero build setup, and supports full English and Thai localization.*  
  > *Thank you very much for your time. We are now ready to answer your questions and test any custom numbers live on screen!"*

* **🇹🇭 คำพูดภาษาไทย:**
  > *"สรุปส่งท้ายนะครับ เว็บแอปพลิเคชันของเราพัฒนาด้วย **Pure HTML5, CSS Grid และ Vanilla ES6 JavaScript** 100% โดยไม่มีการพึ่งพา framework ภายนอก*  
  > *มีชุดทดสอบ Unit Test 13 ชุดรับประกันความถูกต้อง และรองรับทั้งภาษาไทยและอังกฤษอย่างสมบูรณ์ครับ*  
  > *กลุ่มของพวกเราขอขอบคุณอาจารย์และเพื่อน ๆ ทุกท่านครับ และตอนนี้พวกเราพร้อมตอบทุกคำถาม หรือทดลองกรอกตัวเลขท้าทายเพื่อรันสดให้ดูได้เลยครับ ขอบคุณครับ"*
