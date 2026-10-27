# Chapter 4: CPU Scheduling

**Course:** 03603332 Operating Systems  
**Instructor:** Prasitthichai Naronglerdrit  
**Department:** Department of Computer Engineering, Faculty of Engineering at Sriracha  
**University:** Kasetsart University Sriracha Campus, THAILAND  
**Email:** prasitthichai@eng.src.ku.ac.th  

---

## 1. Basic Concepts

### Page 2
* In a system with a single CPU core, only one process can run at a time.
* Others must wait until the CPU's core is free and can be rescheduled.
* The objective of multiprogramming is to have some process running at all times, to maximize CPU utilization.
* The idea is relatively simple.
* A process is executed until it must wait, typically for the completion of some I/O request.
* In a simple computer system, the CPU then just sits idle.
* All this waiting time is wasted; no useful work is accomplished.
* With multiprogramming, we try to use this time productively.

### Page 3
* Several processes are kept in memory at one time.
* When one process has to wait, the operating system takes the CPU away from that process and gives the CPU to another process.
* This pattern continues.
* Every time one process has to wait, another process can take over use of the CPU.
* On a multicore system, this concept of keeping the CPU busy is extended to all processing cores on the system.
* Scheduling of this kind is a fundamental operating-system function.
* Almost all computer resources are scheduled before use.
* The CPU is, of course, one of the primary computer resources.
* Thus, its scheduling is central to operating-system design.

---

## 2. CPU-I/O Burst Cycle

### Page 4
* The success of CPU scheduling depends on an observed property of processes: process execution consists of a cycle of CPU execution and I/O wait.
* Processes alternate between these two states.
* Process execution begins with a CPU burst.
* That is followed by an I/O burst, which is followed by another CPU burst, then another I/O burst, and so on.
* Eventually, the final CPU burst ends with a system request to terminate execution.

#### Diagram: Alternating Sequence of CPU and I/O Bursts
```text
           :
           :
+----------------------+
| load store           | \
| add store            |  } CPU burst
| read from file       | /
+----------------------+
|     wait for I/O     |  } I/O burst
+----------------------+
| store increment      | \
| index                |  } CPU burst
| write to file        | /
+----------------------+
|     wait for I/O     |  } I/O burst
+----------------------+
| load store           | \
| add store            |  } CPU burst
| read from file       | /
+----------------------+
|     wait for I/O     |  } I/O burst
+----------------------+
           :
           :
```

### Page 5
* The durations of CPU bursts have been measured extensively.
* Although they vary greatly from process to process and from computer to computer, they tend to have a frequency curve similar to that shown in Figure.
* The curve is generally characterized as exponential or hyperexponential, with a large number of short CPU bursts and a small number of long CPU bursts.
* An I/O-bound program typically has many short CPU bursts.
* A CPU-bound program might have a few long CPU bursts. This distribution can be important when implementing a CPU-scheduling algorithm.

#### Figure: Histogram of CPU-burst Durations
```text
  ^
  |      ****
f |    **    **
r |   *        *
e |  *          *
q |  *           *
u | *             *
e | *              *
n |*                **
c |*                  ***************************
y +----------------------------------------------------->
                       burst duration
```

---

## 3. CPU Scheduler

### Page 6
* Whenever the CPU becomes idle, the operating system must select one of the processes in the ready queue to be executed.
* The selection process is carried out by the CPU scheduler, which selects a process from the processes in memory that are ready to execute and allocates the CPU to that process.
* Note that the ready queue is not necessarily a first-in, first-out (FIFO) queue.
* As we shall see when we consider the various scheduling algorithms, a ready queue can be implemented as a FIFO queue, a priority queue, a tree, or simply an unordered linked list.
* Conceptually, however, all the processes in the ready queue are lined up waiting for a chance to run on the CPU.
* The records in the queues are generally process control blocks (PCBs) of the processes.

---

## 4. Preemptive and Nonpreemptive Scheduling

### Page 7
* CPU-scheduling decisions may take place under the following four circumstances:
  1. When a process switches from the running state to the waiting state (for example, as the result of an I/O request or an invocation of `wait()` for the termination of a child process)
  2. When a process switches from the running state to the ready state (for example, when an interrupt occurs)
  3. When a process switches from the waiting state to the ready state (for example, at completion of I/O)
  4. When a process terminates
* For situations $1$ and $4$, there is no choice in terms of scheduling.
* A new process (if one exists in the ready queue) must be selected for execution.
* There is a choice, however, for situations $2$ and $3$.

### Page 8
* When scheduling takes place only under circumstances $1$ and $4$, we say that the scheduling scheme is **nonpreemptive** or **cooperative**.
* Otherwise, it is **preemptive**.
* Under nonpreemptive scheduling, once the CPU has been allocated to a process, the process keeps the CPU until it releases it either by terminating or by switching to the waiting state.
* Virtually all modern operating systems including Windows, macOS, Linux, and UNIX use preemptive scheduling algorithms.

### Page 9
* Unfortunately, preemptive scheduling can result in race conditions when data are shared among several processes.
* Consider the case of two processes that share data.
* While one process is updating the data, it is preempted so that the second process can run.
* The second process then tries to read the data, which are in an inconsistent state.
* This issue will be explored in detail in Chapter Synchronization.

### Page 10
* Preemption also affects the design of the operating-system kernel.
* During the processing of a system call, the kernel may be busy with an activity on behalf of a process.
* Such activities may involve changing important kernel data (for instance, I/O queues).
* What happens if the process is preempted in the middle of these changes and the kernel (or the device driver) needs to read or modify the same structure? Chaos ensues.
* As will be discussed in Section Critical-Section (Synchronization), operating-system kernels can be designed as either nonpreemptive or preemptive.
* A nonpreemptive kernel will wait for a system call to complete or for a process to block while waiting for I/O to complete to take place before doing a context switch.

### Page 11
* This scheme ensures that the kernel structure is simple, since the kernel will not preempt a process while the kernel data structures are in an inconsistent state.
* Unfortunately, this kernel-execution model is a poor one for supporting real-time computing, where tasks must complete execution within a given time frame.
* A preemptive kernel requires mechanisms such as mutex locks to prevent race conditions when accessing shared kernel data structures.
* Most modern operating systems are now fully preemptive when running in kernel mode.

### Page 12
* Because interrupts can, by definition, occur at any time, and because they cannot always be ignored by the kernel, the sections of code affected by interrupts must be guarded from simultaneous use.
* The operating system needs to accept interrupts at almost all times.
* Otherwise, input might be lost or output overwritten.
* So that these sections of code are not accessed concurrently by several processes, they disable interrupts at entry and reenable interrupts at exit.
* It is important to note that sections of code that disable interrupts do not occur very often and typically contain few instructions.

---

## 5. Dispatcher

### Page 13
* Another component involved in the CPU-scheduling function is the **dispatcher**.
* The dispatcher is the module that gives control of the CPU's core to the process selected by the CPU scheduler.
* This function involves the following:
  * Switching context from one process to another
  * Switching to user mode
  * Jumping to the proper location in the user program to resume that program

### Page 14
* The dispatcher should be as fast as possible, since it is invoked during every context switch.
* The time it takes for the dispatcher to stop one process and start another running is known as the **dispatch latency** and is illustrated in Figure.

#### Figure: Dispatch Latency
```text
+-----------------------+
|      P_0 executing    |
+-----------------------+
            |              ---
            v               |
+-----------------------+   |
|  save state into PCB_0|   |
+-----------------------+   |  dispatch
            |               |  latency
            v               |
+-----------------------+   |
| restore state from    |   |
|         PCB_1         |   |
+-----------------------+   |
            |              ---
            v
+-----------------------+
|      P_1 executing    |
+-----------------------+
```

### Page 15
* An interesting question to consider is, how often do context switches occur?
* On a system-wide level, the number of context switches can be obtained by using the `vmstat` command that is available on Linux systems.
* Below is the output (which has been trimmed) from the command:
  ```bash
  vmstat 1 3
  ```
* This command provides $3$ lines of output over a $1\text{-second}$ delay:
  ```text
  cpu
  cs
  24
  225
  339
  ```
* The first line gives the average number of context switches over $1\text{ second}$ since the system booted, and the next two lines give the number of context switches over two $1\text{-second}$ intervals.
* Since this machine booted, it has averaged $24$ context switches per second.
* And in the past second, $225$ context switches were made, with $339$ context switches in the second prior to that.

### Page 16
* We can also use the `/proc` file system to determine the number of context switches for a given process.
* For example, the contents of the file `/proc/2166/status` will list various statistics for the process with $\text{pid} = 2166$.
* The command `cat /proc/2166/status` provides the following trimmed output:
  ```text
  voluntary_ctxt_switches:        150
  nonvoluntary_ctxt_switches:     8
  ```
* This output shows the number of context switches over the lifetime of the process.
* Notice the distinction between voluntary and nonvoluntary context switches.
* A **voluntary context switch** occurs when a process has given up control of the CPU because it requires a resource that is currently unavailable (such as blocking for I/O).
* A **nonvoluntary context switch** occurs when the CPU has been taken away from a process, such as when its time slice has expired or it has been preempted by a higher-priority process.

---

## 6. Scheduling Criteria

### Page 17
* Different CPU-scheduling algorithms have different properties, and the choice of a particular algorithm may favor one class of processes over another.
* In choosing which algorithm to use in a particular situation, we must consider the properties of the various algorithms.
* Many criteria have been suggested for comparing CPU-scheduling algorithms.
* Which characteristics are used for comparison can make a substantial difference in which algorithm is judged to be best.

### Page 18
* **CPU utilization:**
  * We want to keep the CPU as busy as possible.
  * Conceptually, CPU utilization can range from $0$ to $100$ percent.
  * In a real system, it should range from $40$ percent (for a lightly loaded system) to $90$ percent (for a heavily loaded system).
  * (CPU utilization can be obtained by using the `top` command on Linux, macOS, and UNIX systems.)
* **Throughput:**
  * If the CPU is busy executing processes, then work is being done.
  * One measure of work is the number of processes that are completed per time unit, called **throughput**.
  * For long processes, this rate may be one process over several seconds; for short transactions, it may be tens of processes per second.

### Page 19
* **Turnaround time:**
  * From the point of view of a particular process, the important criterion is how long it takes to execute that process.
  * The interval from the time of submission of a process to the time of completion is the **turnaround time**.
  * Turnaround time is the sum of the periods spent waiting in the ready queue, executing on the CPU, and doing I/O.
* **Waiting time:**
  * The CPU-scheduling algorithm does not affect the amount of time during which a process executes or does I/O.
  * It affects only the amount of time that a process spends waiting in the ready queue.
  * **Waiting time** is the sum of the periods spent waiting in the ready queue.

### Page 20
* **Response time:**
  * In an interactive system, turnaround time may not be the best criterion.
  * Often, a process can produce some output fairly early and can continue computing new results while previous results are being output to the user.
  * Thus, another measure is the time from the submission of a request until the first response is produced.
  * This measure, called **response time**, is the time it takes to start responding, not the time it takes to output the response.

### Page 21
* It is desirable to **maximize** CPU utilization and throughput and to **minimize** turnaround time, waiting time, and response time.
* In most cases, we optimize the average measure.
* However, under some circumstances, we prefer to optimize the minimum or maximum values rather than the average.
* For example, to guarantee that all users get good service, we may want to minimize the maximum response time.
* Investigators have suggested that, for interactive systems (such as a PC desktop or laptop system), it is more important to minimize the variance in the response time than to minimize the average response time.
* A system with reasonable and predictable response time may be considered more desirable than a system that is faster on the average but is highly variable.

---

## 7. Scheduling Algorithms

### Page 22
* CPU scheduling deals with the problem of deciding which of the processes in the ready queue is to be allocated the CPU's core.
* There are many different CPU-scheduling algorithms.
* Although most modern CPU architectures have multiple processing cores, we describe these scheduling algorithms in the context of only one processing core available.
* That is, a single CPU that has a single processing core, thus the system is capable of only running one process at a time.
* We will discuss CPU-scheduling in the context of multiprocessor systems later.

---

### 7.1 First-Come, First-Served (FCFS) Scheduling

#### Page 23
* By far the simplest CPU-scheduling algorithm is the **first-come, first-served (FCFS)** scheduling algorithm.
* With this scheme, the process that requests the CPU first is allocated the CPU first.
* The implementation of the FCFS policy is easily managed with a FIFO queue.
* When a process enters the ready queue, its PCB is linked onto the tail of the queue.
* When the CPU is free, it is allocated to the process at the head of the queue.
* The running process is then removed from the queue.
* The code for FCFS scheduling is simple to write and understand.

#### Page 24
* On the negative side, the average waiting time under the FCFS policy is often quite long.
* Consider the following set of processes that arrive at time $0$, with the length of the CPU burst given in milliseconds:

| Process | Burst Time |
| :--- | :--- |
| $P_1$ | $24$ |
| $P_2$ | $3$ |
| $P_3$ | $3$ |

#### Page 25
* If the processes arrive in the order $P_1, P_2, P_3$, and are served in FCFS order, we get the result shown in the following Gantt chart, which is a bar chart that illustrates a particular schedule, including the start and finish times of each of the participating processes:

```text
+------------------------+-----+-----+
|          P_1           | P_2 | P_3 |
+------------------------+-----+-----+
0                        24    27    30
```

* The waiting time is $0$ milliseconds for process $P_1$, $24$ milliseconds for process $P_2$, and $27$ milliseconds for process $P_3$.
* Thus, the average waiting time is $(0 + 24 + 27) / 3 = 17$ milliseconds.

#### Page 26
* If the processes arrive in the order $P_2, P_3, P_1$, however, the results will be as shown in the following Gantt chart:

```text
+-----+-----+------------------------+
| P_2 | P_3 |          P_1           |
+-----+-----+------------------------+
0     3     6                        30
```

* The average waiting time is now $(6 + 0 + 3) / 3 = 3$ milliseconds.
* This reduction is substantial.
* Thus, the average waiting time under an FCFS policy is generally not minimal and may vary substantially if the processes' CPU burst times vary greatly.

#### Page 27
* In addition, consider the performance of FCFS scheduling in a dynamic situation.
* Assume we have one CPU-bound process and many I/O-bound processes.
* As the processes flow around the system, the following scenario may result:
  * The CPU-bound process will get and hold the CPU.
  * During this time, all the other processes will finish their I/O and will move into the ready queue, waiting for the CPU.
  * While the processes wait in the ready queue, the I/O devices are idle.
  * Eventually, the CPU-bound process finishes its CPU burst and moves to an I/O device.
  * All the I/O-bound processes, which have short CPU bursts, execute quickly and move back to the I/O queues.
  * At this point, the CPU sits idle.
  * The CPU-bound process will then move back to the ready queue and be allocated the CPU.
  * Again, all the I/O processes end up waiting in the ready queue until the CPU-bound process is done.
* There is a **convoy effect** as all the other processes wait for the one big process to get off the CPU.
* This effect results in lower CPU and device utilization than might be possible if the shorter processes were allowed to go first.

#### Page 28
* Note also that the FCFS scheduling algorithm is **nonpreemptive**.
* Once the CPU has been allocated to a process, that process keeps the CPU until it releases the CPU, either by terminating or by requesting I/O.
* The FCFS algorithm is thus particularly troublesome for interactive systems, where it is important that each process get a share of the CPU at regular intervals.
* It would be disastrous to allow one process to keep the CPU for an extended period.

---

### 7.2 Shortest-Job-First (SJF) Scheduling

#### Page 29
* A different approach to CPU scheduling is the **shortest-job-first (SJF)** scheduling algorithm.
* This algorithm associates with each process the length of the process's next CPU burst.
* When the CPU is available, it is assigned to the process that has the smallest next CPU burst.
* If the next CPU bursts of two processes are the same, FCFS scheduling is used to break the tie.
* Note that a more appropriate term for this scheduling method would be the **shortest-next-CPU-burst** algorithm, because scheduling depends on the length of the next CPU burst of a process, rather than its total length.
* We use the term SJF because most people and textbooks use this term to refer to this type of scheduling.

#### Page 30
* As an example of SJF scheduling, consider the following set of processes, with the length of the CPU burst given in milliseconds:

| Process | Burst Time |
| :--- | :--- |
| $P_1$ | $6$ |
| $P_2$ | $8$ |
| $P_3$ | $7$ |
| $P_4$ | $3$ |

* Using SJF scheduling, we would schedule these processes according to the following Gantt chart:

```text
+-----+--------+---------+----------+
| P_4 |  P_1   |   P_3   |   P_2    |
+-----+--------+---------+----------+
0     3        9         16         24
```

#### Page 31
* The waiting time is $3$ milliseconds for process $P_1$, $16$ milliseconds for process $P_2$, $9$ milliseconds for process $P_3$, and $0$ milliseconds for process $P_4$.
* Thus, the average waiting time is $(3 + 16 + 9 + 0) / 4 = 7$ milliseconds.
* By comparison, if we were using the FCFS scheduling scheme, the average waiting time would be $10.25$ milliseconds.
* The SJF scheduling algorithm is provably optimal, in that it gives the minimum average waiting time for a given set of processes.
* Moving a short process before a long one decreases the waiting time of the short process more than it increases the waiting time of the long process.
* Consequently, the average waiting time decreases.

#### Page 32
* Although the SJF algorithm is optimal, it cannot be implemented at the level of CPU scheduling, as there is no way to know the length of the next CPU burst.
* One approach to this problem is to try to approximate SJF scheduling.
* We may not know the length of the next CPU burst, but we may be able to predict its value.
* We expect that the next CPU burst will be similar in length to the previous ones.
* By computing an approximation of the length of the next CPU burst, we can pick the process with the shortest predicted CPU burst.

#### Page 33
* The next CPU burst is generally predicted as an **exponential average** of the measured lengths of previous CPU bursts.
* We can define the exponential average with the following formula:
* Let $t_n$ be the length of the $n^{\text{th}}$ CPU burst, and let $\tau_{n+1}$ be our predicted value for the next CPU burst.
* Then, for $\alpha$, $0 \le \alpha \le 1$, define:
  $$\tau_{n+1} = \alpha t_n + (1 - \alpha)\tau_n$$
* The value of $t_n$ contains our most recent information, while $\tau_n$ stores the past history.
* The parameter $\alpha$ controls the relative weight of recent and past history in our prediction.
* If $\alpha = 0$, then $\tau_{n+1} = \tau_n$, and recent history has no effect (current conditions are assumed to be transient).
* If $\alpha = 1$, then $\tau_{n+1} = t_n$, and only the most recent CPU burst matters (history is assumed to be old and irrelevant).
* More commonly, $\alpha = 1/2$, so recent history and past history are equally weighted.
* The initial $\tau_0$ can be defined as a constant or as an overall system average.

#### Page 34
* Figure shows an exponential average with $\alpha = 1/2$ and $\tau_0 = 10$:

| Parameter | Initial | Step 1 | Step 2 | Step 3 | Step 4 | Step 5 | Step 6 | Step 7 | ... |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CPU burst ($t_i$)** | - | $6$ | $4$ | $6$ | $4$ | $13$ | $13$ | $13$ | ... |
| **"guess" ($\tau_i$)** | $10$ | $8$ | $6$ | $6$ | $5$ | $9$ | $11$ | $12$ | ... |

#### Page 35
* The SJF algorithm can be either **preemptive** or **nonpreemptive**.
* The choice arises when a new process arrives at the ready queue while a previous process is still executing.
* The next CPU burst of the newly arrived process may be shorter than what is left of the currently executing process.
* A preemptive SJF algorithm will preempt the currently executing process, whereas a nonpreemptive SJF algorithm will allow the currently running process to finish its CPU burst.
* Preemptive SJF scheduling is sometimes called **shortest-remaining-time-first** scheduling.

#### Page 36
* As an example, consider the following four processes, with the length of the CPU burst given in milliseconds:

| Process | Arrival Time | Burst Time |
| :--- | :--- | :--- |
| $P_1$ | $0$ | $8$ |
| $P_2$ | $1$ | $4$ |
| $P_3$ | $2$ | $9$ |
| $P_4$ | $3$ | $5$ |

* If the processes arrive at the ready queue at the times shown and need the indicated burst times, then the resulting preemptive SJF schedule is as depicted in the following Gantt chart:

```text
+-----+------+-------+---------+-----------+
| P_1 | P_2  |  P_4  |   P_1   |    P_3    |
+-----+------+-------+---------+-----------+
0     1      5       10        17          26
```

#### Page 37
* Process $P_1$ is started at time $0$, since it is the only process in the queue.
* Process $P_2$ arrives at time $1$.
* The remaining time for process $P_1$ ($7$ milliseconds) is larger than the time required by process $P_2$ ($4$ milliseconds), so process $P_1$ is preempted, and process $P_2$ is scheduled.
* The average waiting time for this example is:
  $$\frac{(10 - 1) + (1 - 1) + (17 - 2) + (5 - 3)}{4} = \frac{26}{4} = 6.5 \text{ milliseconds}$$
* Nonpreemptive SJF scheduling would result in an average waiting time of $7.75$ milliseconds.

---

### 7.3 Round-Robin (RR) Scheduling

#### Page 38
* The **round-robin (RR)** scheduling algorithm is similar to FCFS scheduling, but preemption is added to enable the system to switch between processes.
* A small unit of time, called a **time quantum** or **time slice**, is defined.
* A time quantum is generally from $10$ to $100$ milliseconds in length.
* The ready queue is treated as a circular queue.
* The CPU scheduler goes around the ready queue, allocating the CPU to each process for a time interval of up to $1$ time quantum.
* To implement RR scheduling, we again treat the ready queue as a FIFO queue of processes.
* New processes are added to the tail of the ready queue.
* The CPU scheduler picks the first process from the ready queue, sets a timer to interrupt after $1$ time quantum, and dispatches the process.

#### Page 39
* One of two things will then happen:
  1. The process may have a CPU burst of less than $1$ time quantum.
     * In this case, the process itself will release the CPU voluntarily.
     * The scheduler will then proceed to the next process in the ready queue.
  2. If the CPU burst of the currently running process is longer than $1$ time quantum, the timer will go off and will cause an interrupt to the operating system.
     * A context switch will be executed, and the process will be put at the tail of the ready queue.
     * The CPU scheduler will then select the next process in the ready queue.

#### Page 40
* The average waiting time under the RR policy is often long.
* Consider the following set of processes that arrive at time $0$, with the length of the CPU burst given in milliseconds:

| Process | Burst Time |
| :--- | :--- |
| $P_1$ | $24$ |
| $P_2$ | $3$ |
| $P_3$ | $3$ |

* If we use a time quantum of $4$ milliseconds, then process $P_1$ gets the first $4$ milliseconds.
* Since it requires another $20$ milliseconds, it is preempted after the first time quantum, and the CPU is given to the next process in the queue, process $P_2$.
* Process $P_2$ does not need $4$ milliseconds, so it quits before its time quantum expires.
* The CPU is then given to the next process, process $P_3$.
* Once each process has received $1$ time quantum, the CPU is returned to process $P_1$ for an additional time quantum.
* The resulting RR schedule is as follows:

```text
+-----+-----+-----+-----+-----+-----+-----+-----+
| P_1 | P_2 | P_3 | P_1 | P_1 | P_1 | P_1 | P_1 |
+-----+-----+-----+-----+-----+-----+-----+-----+
0     4     7     10    14    18    22    26    30
```

#### Page 41
* Let's calculate the average waiting time for this schedule:
  * $P_1$ waits for $6$ milliseconds $(10 - 4)$
  * $P_2$ waits for $4$ milliseconds
  * $P_3$ waits for $7$ milliseconds
* Thus, the average waiting time is $17 / 3 = 5.66$ milliseconds.
* In the RR scheduling algorithm, no process is allocated the CPU for more than $1$ time quantum in a row (unless it is the only runnable process).
* If a process's CPU burst exceeds $1$ time quantum, that process is preempted and is put back in the ready queue.
* The RR scheduling algorithm is thus **preemptive**.

#### Page 42
* If there are $n$ processes in the ready queue and the time quantum is $q$, then each process gets $1/n$ of the CPU time in chunks of at most $q$ time units.
* Each process must wait no longer than $(n - 1) \times q$ time units until its next time quantum.
* For example, with five processes and a time quantum of $20$ milliseconds, each process will get up to $20$ milliseconds every $100$ milliseconds.

#### Page 43
* The performance of the RR algorithm depends heavily on the size of the time quantum.
* At one extreme, if the time quantum is extremely large, the RR policy is the same as the FCFS policy.
* In contrast, if the time quantum is extremely small (say, $1$ millisecond), the RR approach can result in a large number of context switches.

#### Figure: How a Smaller Time Quantum Increases Context Switches ($\text{process time} = 10$)

| Quantum | Context Switches | Timeline Representation |
| :--- | :--- | :--- |
| $12$ | $0$ | `[0 ======================== 10]` |
| $6$ | $1$ | `[0 ============== 6 ======= 10]` |
| $1$ | $9$ | `[0|1|2|3|4|5|6|7|8|9|10]` |

#### Page 44
* Thus, we want the time quantum to be large with respect to the context switch time.
* If the context-switch time is approximately $10$ percent of the time quantum, then about $10$ percent of the CPU time will be spent in context switching.
* In practice, most modern systems have time quanta ranging from $10$ to $100$ milliseconds.
* The time required for a context switch is typically less than $10$ microseconds; thus, the context-switch time is a small fraction of the time quantum.

#### Page 45
* Turnaround time also depends on the size of the time quantum.
* As we can see from Figure, the average turnaround time of a set of processes does not necessarily improve as the time-quantum size increases.
* In general, the average turnaround time can be improved if most processes finish their next CPU burst in a single time quantum.
* For example, given three processes of $10$ time units each and a quantum of $1$ time unit, the average turnaround time is $29$.
* If the time quantum is $10$, however, the average turnaround time drops to $20$.
* If context-switch time is added in, the average turnaround time increases even more for a smaller time quantum, since more context switches are required.

#### Figure Data: How Turnaround Time Varies with the Time Quantum

**Processes:**
| Process | Time |
| :--- | :--- |
| $P_1$ | $6$ |
| $P_2$ | $3$ |
| $P_3$ | $1$ |
| $P_4$ | $7$ |

**Graph Values (Time Quantum vs. Average Turnaround Time):**
| Time Quantum | Average Turnaround Time |
| :--- | :--- |
| $1$ | $11.0$ |
| $2$ | $11.5$ |
| $3$ | $10.8$ |
| $4$ | $11.5$ |
| $5$ | $12.25$ |
| $6$ | $10.5$ |
| $7$ | $10.5$ |

#### Page 46
* Although the time quantum should be large compared with the context switch time, it should not be too large.
* As we pointed out earlier, if the time quantum is too large, RR scheduling degenerates to an FCFS policy.
* A rule of thumb is that $80$ percent of the CPU bursts should be shorter than the time quantum.

---

### 7.4 Priority Scheduling

#### Page 47
* The SJF algorithm is a special case of the general **priority-scheduling** algorithm.
* A priority is associated with each process, and the CPU is allocated to the process with the highest priority.
* Equal-priority processes are scheduled in FCFS order.
* An SJF algorithm is simply a priority algorithm where the priority ($p$) is the inverse of the (predicted) next CPU burst.
* The larger the CPU burst, the lower the priority, and vice versa.
* Note that we discuss scheduling in terms of high priority and low priority.
* Priorities are generally indicated by some fixed range of numbers, such as $0$ to $7$ or $0$ to $4,095$.
* However, there is no general agreement on whether $0$ is the highest or lowest priority.
* Some systems use low numbers to represent low priority; others use low numbers for high priority.
* This difference can lead to confusion.
* In this text, we assume that **low numbers represent high priority**.

#### Page 48
* As an example, consider the following set of processes, assumed to have arrived at time $0$ in the order $P_1, P_2, \dots, P_5$, with the length of the CPU burst given in milliseconds:

| Process | Burst Time | Priority |
| :--- | :--- | :--- |
| $P_1$ | $10$ | $3$ |
| $P_2$ | $1$ | $1$ |
| $P_3$ | $2$ | $4$ |
| $P_4$ | $1$ | $5$ |
| $P_5$ | $5$ | $2$ |

* Using priority scheduling, we would schedule these processes according to the following Gantt chart:

```text
+-----+-------+------------+-----+-----+
| P_2 |  P_5  |    P_1     | P_3 | P_4 |
+-----+-------+------------+-----+-----+
0     1       6            16    18    19
```

* The average waiting time is $8.2$ milliseconds.

#### Page 49
* Priorities can be defined either **internally** or **externally**.
* **Internally defined priorities** use some measurable quantity or quantities to compute the priority of a process.
  * For example, time limits, memory requirements, the number of open files, and the ratio of average I/O burst to average CPU burst have been used in computing priorities.
* **External priorities** are set by criteria outside the operating system, such as the importance of the process, the type and amount of funds being paid for computer use, the department sponsoring the work, and other, often political, factors.

#### Page 50
* Priority scheduling can be either **preemptive** or **nonpreemptive**.
* When a process arrives at the ready queue, its priority is compared with the priority of the currently running process.
* A **preemptive** priority scheduling algorithm will preempt the CPU if the priority of the newly arrived process is higher than the priority of the currently running process.
* A **nonpreemptive** priority scheduling algorithm will simply put the new process at the head of the ready queue.

#### Page 51
* A major problem with priority scheduling algorithms is **indefinite blocking**, or **starvation**.
* A process that is ready to run but waiting for the CPU can be considered blocked.
* A priority scheduling algorithm can leave some low-priority processes waiting indefinitely.
* In a heavily loaded computer system, a steady stream of higher-priority processes can prevent a low-priority process from ever getting the CPU.
* Generally, one of two things will happen:
  * Either the process will eventually be run (at 2 A.M. Sunday, when the system is finally lightly loaded), or
  * The computer system will eventually crash and lose all unfinished low-priority processes.
* (Rumor has it that when they shut down the IBM 7094 at MIT in 1973, they found a low-priority process that had been submitted in 1967 and had not yet been run.)

#### Page 52
* A solution to the problem of indefinite blockage of low-priority processes is **aging**.
* Aging involves gradually increasing the priority of processes that wait in the system for a long time.
* For example, if priorities range from $127$ (low) to $0$ (high), we could periodically (say, every second) increase the priority of a waiting process by $1$.
* Eventually, even a process with an initial priority of $127$ would have the highest priority in the system and would be executed.
* In fact, it would take a little over $2$ minutes for a priority-$127$ process to age to a priority-$0$ process.

#### Page 53
* Another option is to combine round-robin and priority scheduling in such a way that the system executes the highest-priority process and runs processes with the same priority using round-robin scheduling.
* Let's illustrate with an example using the following set of processes, with the burst time in milliseconds:

| Process | Burst Time | Priority |
| :--- | :--- | :--- |
| $P_1$ | $4$ | $3$ |
| $P_2$ | $5$ | $2$ |
| $P_3$ | $8$ | $2$ |
| $P_4$ | $7$ | $1$ |
| $P_5$ | $3$ | $3$ |

* Using priority scheduling with round-robin for processes with equal priority, we would schedule these processes according to the following Gantt chart using a time quantum of $2$ milliseconds:

```text
+-------+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|  P_4  | P_2 | P_3 | P_2 | P_3 | P_2 | P_3 | P_1 | P_5 | P_1 | P_5 |
+-------+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
0       7     9     11    13    15    16    20    22    24    26    27
```

#### Page 54
* In this example, process $P_4$ has the highest priority, so it will run to completion.
* Processes $P_2$ and $P_3$ have the next-highest priority, and they will execute in a round-robin fashion.
* Notice that when process $P_2$ finishes at time $16$, process $P_3$ is the highest-priority process, so it will run until it completes execution.
* Now, only processes $P_1$ and $P_5$ remain, and as they have equal priority, they will execute in round-robin order until they complete.

---

### 7.5 Multilevel Queue Scheduling

#### Page 55
* With both priority and round-robin scheduling, all processes may be placed in a single queue, and the scheduler then selects the process with the highest priority to run.
* Depending on how the queues are managed, an $O(n)$ search may be necessary to determine the highest-priority process.
* In practice, it is often easier to have separate queues for each distinct priority, and priority scheduling simply schedules the process in the highest-priority queue.
* This is illustrated in Figure:

```text
priority = 0  --> [ T_0 | T_1 | T_2 | T_3 | T_4 ]
priority = 1  --> [ T_5 | T_6 | T_7 ]
priority = 2  --> [ T_8 | T_9 | T_10 | T_11 ]
   ...
priority = n  --> [ T_x | ... | T_z ]
```

#### Page 56
* This approach—known as **multilevel queue**—also works well when priority scheduling is combined with round-robin: if there are multiple processes in the highest-priority queue, they are executed in round-robin order.
* In the most generalized form of this approach, a priority is assigned statically to each process, and a process remains in the same queue for the duration of its runtime.

#### Page 57
* A multilevel queue scheduling algorithm can also be used to partition processes into several separate queues based on the process type (Figure).
* For example, a common division is made between **foreground (interactive)** processes and **background (batch)** processes.
* These two types of processes have different response-time requirements and so may have different scheduling needs.

#### Figure: Multilevel Queue Scheduling by Process Type
```text
highest priority
       |
       +---> [  real-time processes  ] --->
       |
       +---> [    system processes   ] --->
       |
       +---> [ interactive processes ] --->
       |
       +---> [    batch processes    ] --->
       |
lowest priority
```

#### Page 58
* In addition, foreground processes may have priority (externally defined) over background processes.
* Separate queues might be used for foreground and background processes, and each queue might have its own scheduling algorithm.
* The foreground queue might be scheduled by an RR algorithm, for example, while the background queue is scheduled by an FCFS algorithm.
* In addition, there must be scheduling among the queues, which is commonly implemented as **fixed-priority preemptive scheduling**.
* For example, the real-time queue may have absolute priority over the interactive queue.

#### Page 59
* Let's look at an example of a multilevel queue scheduling algorithm with four queues, listed below in order of priority:
  1. Real-time processes
  2. System processes
  3. Interactive processes
  4. Batch processes
* Each queue has absolute priority over lower-priority queues.
* No process in the batch queue, for example, could run unless the queues for real-time processes, system processes, and interactive processes were all empty.
* If an interactive process entered the ready queue while a batch process was running, the batch process would be preempted.

#### Page 60
* Another possibility is to **time-slice** among the queues.
* Here, each queue gets a certain portion of the CPU time, which it can then schedule among its various processes.
* For instance, in the foreground-background queue example, the foreground queue can be given $80$ percent of the CPU time for RR scheduling among its processes, while the background queue receives $20$ percent of the CPU to give to its processes on an FCFS basis.

---

### 7.6 Multilevel Feedback Queue Scheduling

#### Page 61
* Normally, when the multilevel queue scheduling algorithm is used, processes are permanently assigned to a queue when they enter the system.
* If there are separate queues for foreground and background processes, for example, processes do not move from one queue to the other, since processes do not change their foreground or background nature.
* This setup has the advantage of low scheduling overhead, but it is inflexible.
* The **multilevel feedback queue** scheduling algorithm, in contrast, allows a process to move between queues.
* The idea is to separate processes according to the characteristics of their CPU bursts.
* If a process uses too much CPU time, it will be moved to a lower-priority queue.
* This scheme leaves I/O-bound and interactive processes—which are typically characterized by short CPU bursts—in the higher-priority queues.
* In addition, a process that waits too long in a lower-priority queue may be moved to a higher-priority queue.
* This form of **aging** prevents starvation.

#### Page 62
* For example, consider a multilevel feedback queue scheduler with three queues, numbered from $0$ to $2$ (Figure).
* The scheduler first executes all processes in queue $0$.
* Only when queue $0$ is empty will it execute processes in queue $1$.
* Similarly, processes in queue $2$ will be executed only if queues $0$ and $1$ are empty.
* A process that arrives for queue $1$ will preempt a process in queue $2$.
* A process in queue $1$ will in turn be preempted by a process arriving for queue $0$.

#### Figure: Multilevel Feedback Queues
```text
        +--------------------+
------> |    quantum = 8     | ------> (Finish)
        +--------------------+
                   | (If not finished)
                   v
        +--------------------+
        |    quantum = 16    | ------> (Finish)
        +--------------------+
                   | (If not finished)
                   v
        +--------------------+
        |        FCFS        | ------> (Finish)
        +--------------------+
```

#### Page 63
* An entering process is put in queue $0$.
* A process in queue $0$ is given a time quantum of $8$ milliseconds.
* If it does not finish within this time, it is moved to the tail of queue $1$.
* If queue $0$ is empty, the process at the head of queue $1$ is given a quantum of $16$ milliseconds.
* If it does not complete, it is preempted and is put into queue $2$.
* Processes in queue $2$ are run on an FCFS basis but are run only when queues $0$ and $1$ are empty.
* To prevent starvation, a process that waits too long in a lower-priority queue may gradually be moved to a higher-priority queue.

#### Page 64
* This scheduling algorithm gives highest priority to any process with a CPU burst of $8$ milliseconds or less.
* Such a process will quickly get the CPU, finish its CPU burst, and go off to its next I/O burst.
* Processes that need more than $8$ but less than $24$ milliseconds are also served quickly, although with lower priority than shorter processes.
* Long processes automatically sink to queue $2$ and are served in FCFS order with any CPU cycles left over from queues $0$ and $1$.

#### Page 65
* In general, a multilevel feedback queue scheduler is defined by the following parameters:
  * The number of queues
  * The scheduling algorithm for each queue
  * The method used to determine when to upgrade a process to a higher-priority queue
  * The method used to determine when to demote a process to a lower-priority queue
  * The method used to determine which queue a process will enter when that process needs service
* The definition of a multilevel feedback queue scheduler makes it the most general CPU-scheduling algorithm.
* It can be configured to match a specific system under design.
* Unfortunately, it is also the most complex algorithm, since defining the best scheduler requires some means by which to select values for all the parameters.

---

## 8. References

### Page 66
* Chapter 5.1–5.3
* Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). *Operating system concepts essentials*. Wiley Publishing.