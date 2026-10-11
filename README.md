# AI-Based University Timetable Generator Studio

> **Project-Based Learning (PBL) Final Submission**  
> **Course:** Foundations of Artificial Intelligence (**Course Code: 23TU03MJM2**)  
> **Institution:** Woxsen University, School of Technology, Department of Computer Science & Engineering  
> **Specialization:** Artificial Intelligence and Machine Learning (AI & ML)  
> **Academic Year:** 2025–2029 | **Section:** AIML Rhinos  

---

## 👥 Project Team (AIML Rhinos)
| S.No. | Candidate Name | Register Number |
|:---:|:---|:---:|
| 1. | **Himanshu Pandit** | 25WU0102098 |
| 2. | **Heman** | 25WU0102097 |
| 3. | **Rimika Jain** | 25WU0101111 |
| 4. | **Anirudh Pratap Singh** | 25WU0102111 |
| 5. | **Raghav Malpani** | 25WU0101103 |

**Project Guide:**  
**Dr. Muralidhar Goud K**, Assistant Professor, Department of CSE, School of Technology, Woxsen University

---

## 📌 Project Overview
University academic timetable scheduling is a canonical combinatorial optimization challenge characterized as **NP-complete**. In complex multi-cohort collegiate environments, manual or spreadsheet-based scheduling incurs extensive administrative overhead, vulnerability to faculty double-booking, room capacity collisions, and an inability to balance teacher workload or minimize student schedule fragmentation.

This project delivers an automated, high-performance **AI-Driven University Timetable Generator Studio** customized for Woxsen University. Tested on institutional operational benchmarks spanning **120 faculty members, 41 distinct student cohorts (such as AIML Rhinos), and 32 instructional venues across Campus Blocks C and F**, the system achieves **100% hard constraint satisfaction within ~44 milliseconds**.

---

## 🧠 Core AI Algorithms & Mathematical Formulation
The scheduling challenge is formulated as a formal **Constraint Satisfaction Problem (CSP)**:
$$\mathcal{P} = \langle X, D, C \rangle$$

1. **Variables ($X$):** Course lecture and laboratory sessions required by each cohort.
2. **Domains ($D$):** Feasible 3D tuples $\langle \text{Day}, \text{Timeslot}, \text{Classroom/Lab} \rangle$.
3. **Hard Constraints ($C_{\text{hard}}$):**
   - **Faculty Single-Assignment:** A professor cannot teach two sections concurrently.
   - **Room Single-Occupancy:** A physical venue cannot host multiple simultaneous classes.
   - **Cohort Non-Overlap:** Students in a cohort cannot have overlapping lectures.
   - **Laboratory Block Continuity:** 2-hour practical labs must occupy unbroken consecutive slots in designated laboratory venues (e.g., F307).
   - **Room Seating & Equipment Compatibility:** Theory classes assigned to lecture rooms, labs assigned to computing facilities.
4. **Search & Pruning Pipeline:**
   - **Mackworth's Arc Consistency Algorithm (AC-3):** Prunes domain values that violate binary constraints before and during search.
   - **Minimum Remaining Values (MRV):** "Fail-first" heuristic that schedules the most constrained session first.
   - **Least Constraining Value (LCV):** Selects timeslots and rooms that leave the maximum number of legal choices for remaining variables.
   - **Forward Checking:** Immediately removes invalid domain choices for unassigned neighbors upon each assignment.
5. **Soft Constraint Optimization:** Multi-objective scoring function optimizing faculty daily teaching equilibrium (maximum 4 hours/day) and student schedule compactness (eliminating idle window gaps).

---

## 🚀 Key Prototype Features
- **Dynamic Live Reactivity:** Modifying, adding, or deleting faculty, classrooms, student sections, or curriculum courses in Step 1 dynamically updates the schedule generation in real-time.
- **Multi-Perspective Timetable Projections:**
  - **Cohort View:** Synchronized weekly timetable grids (e.g., *AIML Rhinos*).
  - **Faculty Roster View:** Individual instructor teaching schedules and workload distribution.
  - **Room Occupancy View:** Spatial utilization heatmaps for facilities management.
- **Interactive Conflict Simulation & Auto-Resolution:** Test intentional clashes (e.g., professor or room overlap) and observe the engine resolve and re-order slots instantly.
- **Transparent AI Workflow & Algorithm Explainer:** Integrated interactive modals detailing the 6-stage scheduling pipeline and CSP algorithm mechanics in plain language.
- **Direct Export Capabilities:** Print-ready formatting and XHTML/HTML schedule export.

---

## 📄 Academic Project Report
The complete 37-page academic report is included in the repository:
- **PDF Report:** [`AI_Based_Timetable_Generator_Final_Report.pdf`](./AI_Based_Timetable_Generator_Final_Report.pdf)
- **HTML Report Source:** [`final_report.html`](./final_report.html)
- **Python Report Generator:** [`make_report_html.py`](./make_report_html.py) & [`build_report.py`](./build_report.py)

---

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Himanshu-Git-101/FOAI_PBL.git
   cd FOAI_PBL
   ```

2. **Launch a local HTTP server:**
   ```bash
   python3 -m http.server 8765
   ```

3. **Open in your web browser:**
   - **Main Presentation Dashboard:** [http://localhost:8765/index.html](http://localhost:8765/index.html)
   - **Timetable Generator Studio:** [http://localhost:8765/generator.html](http://localhost:8765/generator.html)
   - **Full Project Report:** [http://localhost:8765/final_report.html](http://localhost:8765/final_report.html)

---

## 📂 Repository Structure
```text
FOAI_PBL/
├── index.html                                        # Main Interactive Prototype Dashboard
├── app.js                                            # Presentation logic & conflict demo
├── style.css                                         # Dashboard styling
├── generator.html                                    # AI Timetable Generator Studio interface
├── generator.js                                      # Reactive CSP solver & scheduling engine
├── timetable-data.js                                 # Woxsen University benchmark data (120 faculty, 41 cohorts)
├── 07th September to 11th September Odd Sem...css   # Timetable grid styling
├── AI_Based_Timetable_Generator_Final_Report.pdf     # Complete 37-page Academic Final Report (PDF)
├── final_report.html                                 # Complete 37-page Academic Final Report (HTML)
├── make_report_html.py                               # Report builder script
├── build_report.py                                   # Headless Chrome PDF compiler
├── pages_prelim.py                                   # Report Preliminary Pages (Title, Certificate, Abstract)
├── pages_chap1_3.py                                  # Report Chapters 1–3
├── pages_chap4.py                                    # Report Chapter 4 (Design & Algorithms)
├── pages_chap5_7.py                                  # Report Chapters 5–7 & References
├── woxsen_logo.png                                   # High-resolution Woxsen University logo
├── screenshot_*.png                                  # Prototype screenshots embedded in report
├── .gitignore                                        # Git ignore rules
└── README.md                                         # Project documentation
```

---
*Developed by the AIML Rhinos Project Team for Foundations of Artificial Intelligence (FOAI101 / 23TU03MJM2), Woxsen University.*
