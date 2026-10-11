# -*- coding: utf-8 -*-
"""Chapters 1, 2, and 3: Body Pages 1 to 9"""

def get_chap1_3_pages():
    pages = []

    # PAGE 1 (Page 9 total) - Chapter 1: Introduction
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <h1 class="chapter-title">CHAPTER 1<br>INTRODUCTION</h1>
    
    <h2 class="sec-heading">1.1 Background</h2>
    <p>Higher educational institutions operate within highly dynamic, resource-constrained logistical environments. The creation of a comprehensive university-wide academic timetable is one of the most critical, labor-intensive, and computationally demanding operational challenges faced by academic administrations. A valid timetable must map dozens of academic degree programs, hundreds of distinct course modules, and thousands of students to a finite set of physical classrooms, specialized computational laboratories, and qualified faculty instructors over a designated weekly planning horizon.</p>
    
    <p>At Woxsen University's School of Technology, the academic ecosystem features specialized Bachelor of Technology (B.Tech) programs spanning Computer Science &amp; Engineering with high-demand specializations in Artificial Intelligence &amp; Machine Learning (AIML), Data Science, and Cyber Security. Each cohort—distinguished by evocative institutional cohort identifiers such as <em>AIML Rhinos, Leopards, Panthers, Wolves, and Whales</em>—possesses a distinct curriculum requiring a synchronized blend of theoretical lectures, hands-on software development laboratories, and faculty-guided research seminars.</p>
    
    <p>The academic infrastructure across Campus Block F (housing lecture theaters F101–F113 and specialized computing labs F301–F308) and Campus Block C (rooms C001–C016) represents a high-value shared physical asset. The fundamental challenge lies in establishing conflict-free allocations while upholding pedagogical priorities, eliminating idle waiting periods for student cohorts, and ensuring equitable workload distributions for faculty members.</p>

    <h2 class="sec-heading">1.2 Motivation &amp; Relevance to Real-World Problem</h2>
    <p>Historically, academic timetabling across collegiate departments has been conducted manually by administrative committees utilizing static spreadsheets and paper rosters. In contemporary universities characterized by high elective flexibility, multi-cohort parallel streams, and specialized laboratory infrastructure, this legacy manual methodology exhibits critical systemic vulnerabilities.</p>
  </div>
</div>
</div>
""")

    # PAGE 2 (Page 10 total) - Chapter 1: Motivation & Scope
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <p>The primary administrative failure modes of traditional spreadsheet-based timetabling include:</p>
    <ul>
      <li><strong>Resource Allocation Clashes:</strong> Human scheduling oversight frequently leads to catastrophic instructor double-bookings (e.g., assigning a faculty member to teach simultaneously in Block F and Block C) or classroom conflicts where two cohorts are scheduled into the same laboratory.</li>
      <li><strong>Excessive Latency and Administrative Overhead:</strong> Manual schedule formulation typically consumes between two to three weeks of intensive committee effort at the beginning of each academic semester. When late faculty arrivals, course additions, or enrollment fluctuations occur, propagating manual revisions requires extensive, error-prone recalculations.</li>
      <li><strong>Suboptimal Soft Preference Fulfillment:</strong> Manual schedulers inevitably prioritize basic hard conflict avoidance at the expense of student well-being and faculty research productivity. This results in highly fragmented student schedules with disjointed 3-hour gaps between lectures, or conversely, exhausting 5-hour continuous lecture marathons that induce cognitive fatigue.</li>
    </ul>

    <h2 class="sec-heading">1.3 Scope &amp; Organization of Report</h2>
    <p>This project addresses these critical challenges by engineering an automated, artificial intelligence-driven university timetable generation system tailored to the operational scale of Woxsen University. The scope of this investigation encompasses:</p>
    <ul>
      <li><strong>Rigorous Mathematical Formalization:</strong> Formulating university scheduling as a discrete Constraint Satisfaction Problem (CSP) with multi-dimensional domains spanning time, physical space, instructor quotas, and cohort curricula.</li>
      <li><strong>Algorithmic Consistency Propagation:</strong> Implementing Mackworth's Arc Consistency Algorithm (AC-3) to mathematically prune infeasible domain values prior to combinatorial search.</li>
      <li><strong>Heuristic-Guided Search Optimization:</strong> Integrating the Minimum Remaining Values (MRV) and Least Constraining Value (LCV) heuristics into a backtracking search engine to guarantee conflict-free schedules in under 50 milliseconds.</li>
    </ul>
  </div>
</div>
</div>
""")

    # PAGE 3 (Page 11 total) - Chapter 1: Organization of Report
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <p>Furthermore, the scope includes the deployment of an interactive, responsive administrative web studio allowing academic administrators to dynamically ingest institutional resources, adjust faculty quotas, trigger real-time conflict-free timetable synthesis, and project synchronized multi-perspective schedule views across student cohorts, faculty rosters, and classroom occupancy sheets.</p>

    <h3 class="subsec-heading">Organization of the Report</h3>
    <p>The remainder of this report is structured systematically into seven comprehensive chapters:</p>
    <ul>
      <li><strong>Chapter 2 (Problem Statement &amp; Objectives):</strong> Formally defines the University Timetable Scheduling Problem, articulates the primary engineering goals, and delineates hard versus soft constraints.</li>
      <li><strong>Chapter 3 (Literature Review / Background):</strong> Evaluates historical timetabling paradigms—including graph coloring, integer linear programming, genetic algorithms, and metaheuristics—and establishes the computational superiority of CSP with consistency propagation.</li>
      <li><strong>Chapter 4 (Methodology &amp; System Design):</strong> Presents the four-tier architectural framework, process execution flowcharts, formal mathematical model, technology stack, and UML structural diagrams.</li>
      <li><strong>Chapter 5 (Implementation):</strong> Details the modular implementation across data ingestion, CSP solver logic, interactive UI synchronizer, system screenshots, and core algorithm pseudo-code.</li>
      <li><strong>Chapter 6 (Results &amp; Discussion):</strong> Presents empirical validation tables, performance benchmarks across scaling course volumes, and comparative analysis against manual scheduling workflows.</li>
      <li><strong>Chapter 7 (Conclusion &amp; Future Scope):</strong> Summarizes research achievements, articulates project-based learning competencies, and outlines future enhancements including bipartite elective matching and reinforcement learning.</li>
    </ul>
  </div>
</div>
</div>
""")

    # PAGE 4 (Page 12 total) - Chapter 2: Problem Statement & Objectives
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <h1 class="chapter-title">CHAPTER 2<br>PROBLEM STATEMENT &amp; OBJECTIVES</h1>
    
    <h2 class="sec-heading">2.1 Problem Definition</h2>
    <p>The University Timetable Scheduling Problem (UTSP) addressed in this project is formally defined as the non-conflicting temporal and spatial allocation of a finite set of academic instructional events across a fixed planning horizon (Monday through Friday, 09:00 AM to 06:00 PM), subject to a rigid set of physical, pedagogical, and logistical constraints.</p>
    <p>Formally, the system must schedule a set of <i>N</i> course events <b>E</b> = {<i>e</i><sub>1</sub>, <i>e</i><sub>2</sub>, ..., <i>e<sub>N</sub></i>}. Each event <i>e<sub>i</sub></i> is characterized by an assigned instructor <i>f</i>(<i>e<sub>i</sub></i>) &isin; <b>F</b>, a target student cohort <i>s</i>(<i>e<sub>i</sub></i>) &isin; <b>S</b>, an event duration <i>d</i>(<i>e<sub>i</sub></i>) &isin; {1, 2} hours, and specific pedagogical venue requirements (e.g., standard lecture theater vs. GPU-equipped computer laboratory). The target decision space requires assigning each event <i>e<sub>i</sub></i> to a valid tuple (<i>t</i>, <i>r</i>), where <i>t</i> &isin; <b>T</b> represents an allowable time-slot in the weekly academic grid, and <i>r</i> &isin; <b>R</b> represents an available classroom venue within Campus Block F (rooms F101–F113, F301–F308) or Block C (rooms C001–C016).</p>
    <p>The problem is dual-faceted: it requires strictly satisfying all <strong>Hard Constraints</strong> (ensuring physical and logistical feasibility) while simultaneously optimizing a weighted objective function over <strong>Soft Constraints</strong> (maximizing human convenience, pedagogical efficiency, and institutional resource utilization). Any schedule that violates a single hard constraint is considered mathematically infeasible and administratively unexecutable in the physical university.</p>
    
    <div class="fig-container" style="margin: 15px 0;">
      <svg width="480" height="150" viewBox="0 0 540 160" style="margin: 0 auto; display: block; background: #f8fafc; border: 1pt solid #cbd5e1; border-radius: 6px;">
        <rect x="20" y="25" width="130" height="110" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="85" y="50" font-family="Times New Roman" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">CAMPUS INPUTS</text>
        <text x="85" y="72" font-family="Times New Roman" font-size="9" fill="#1e3a8a" text-anchor="middle">Faculty Rosters (F)</text>
        <text x="85" y="90" font-family="Times New Roman" font-size="9" fill="#1e3a8a" text-anchor="middle">Venues F &amp; C (R)</text>
        <text x="85" y="108" font-family="Times New Roman" font-size="9" fill="#1e3a8a" text-anchor="middle">Cohorts (S)</text>
        <text x="85" y="124" font-family="Times New Roman" font-size="9" fill="#1e3a8a" text-anchor="middle">Time Slots (T)</text>

        <path d="M 150 80 L 190 80" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrowhead)"/>

        <rect x="190" y="20" width="160" height="120" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
        <text x="270" y="45" font-family="Times New Roman" font-size="11" font-weight="bold" fill="#14532d" text-anchor="middle">AI SCHEDULING ENGINE</text>
        <text x="270" y="68" font-family="Times New Roman" font-size="9" fill="#166534" text-anchor="middle">AC-3 Arc Consistency</text>
        <text x="270" y="86" font-family="Times New Roman" font-size="9" fill="#166534" text-anchor="middle">MRV Fail-First Ordering</text>
        <text x="270" y="104" font-family="Times New Roman" font-size="9" fill="#166534" text-anchor="middle">LCV Value Ordering</text>
        <text x="270" y="122" font-family="Times New Roman" font-size="9" fill="#166534" text-anchor="middle">Soft Objective Polishing</text>

        <path d="M 350 80 L 390 80" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrowhead)"/>

        <rect x="390" y="25" width="130" height="110" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.5"/>
        <text x="455" y="50" font-family="Times New Roman" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">VALID SCHEDULE</text>
        <text x="455" y="74" font-family="Times New Roman" font-size="9" fill="#78350f" text-anchor="middle">100% Clash-Free Grid</text>
        <text x="455" y="94" font-family="Times New Roman" font-size="9" fill="#78350f" text-anchor="middle">Synchronized Views</text>
        <text x="455" y="112" font-family="Times New Roman" font-size="9" fill="#78350f" text-anchor="middle">Balanced Workloads</text>
        
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#0f172a"/>
          </marker>
        </defs>
      </svg>
      <div class="caption-figure">Figure 2.1: Conceptual Input-Process-Output Transformation of the AI Timetable Engine</div>
    </div>
  </div>
</div>
</div>
""")

    # PAGE 5 (Page 13 total) - Chapter 2: Objectives & Constraints
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <h2 class="sec-heading">2.2 Objectives</h2>
    <p>The primary and secondary engineering objectives established for this system are:</p>
    <ul>
      <li><strong>Objective 1 (Mathematical Modeling):</strong> Formulate the university scheduling parameters into a formal Constraint Satisfaction Problem (CSP) comprising 140+ course variables, 40 weekly time periods, and 32 physical venues across campus.</li>
      <li><strong>Objective 2 (Algorithmic Constraint Propagation):</strong> Implement Mackworth's Arc Consistency (AC-3) algorithm to prune incompatible domain values a priori, reducing search space cardinality by greater than 60% before search initiation.</li>
      <li><strong>Objective 3 (Heuristic-Guided Search Optimization):</strong> Integrate the Minimum Remaining Values (MRV) heuristic and Least Constraining Value (LCV) heuristic with chronological backtracking, achieving zero hard collisions in under 100 milliseconds.</li>
      <li><strong>Objective 4 (Multi-Objective Soft Quality Maximization):</strong> Engineer a parameterized objective scoring function that minimizes student idle gaps between classes (&lt; 1 hr lunch), enforces daily faculty workload limits (3–4 hrs/day), and protects faculty research blocks.</li>
      <li><strong>Objective 5 (Interactive Reactive Studio):</strong> Develop an interactive Web GUI enabling dynamic resource management, multi-perspective timetable projections (student cohorts, faculty, classrooms), and instant 1-click schedule repair upon administrative parameter adjustments.</li>
    </ul>

    <h2 class="sec-heading">2.3 Constraints &amp; Operational Assumptions</h2>
    <p>The system enforces a strict dichotomy between mandatory physical laws and optimization criteria:</p>
    
    <h3 class="subsec-heading">Hard Constraints (Non-Negotiable):</h3>
    <ul>
      <li><em>H1 (Faculty Non-Overlap):</em> No instructor <i>f</i> &isin; <b>F</b> can be assigned to multiple venues or events at the identical time slot <i>t</i>.</li>
      <li><em>H2 (Classroom Exclusivity):</em> A physical venue <i>r</i> &isin; <b>R</b> can host at most one instructional event during any given slot <i>t</i>.</li>
      <li><em>H3 (Cohort Non-Overlap):</em> A student cohort <i>s</i> &isin; <b>S</b> cannot have overlapping course assignments.</li>
      <li><em>H4 (Laboratory Contiguity):</em> Practical laboratory courses requiring 2 contact hours must be allocated as continuous, consecutive blocks.</li>
      <li><em>H5 (Seating Capacity):</em> The student enrollment of cohort <i>s</i>(<i>e<sub>i</sub></i>) must not exceed the capacity limit of room <i>r</i>.</li>
    </ul>

    <h3 class="subsec-heading">Operational Assumptions:</h3>
    <ul>
      <li>The academic week consists strictly of five operating days: Monday through Friday.</li>
      <li>Daily operational hours span eight 1-hour slots from 09:00 AM to 06:00 PM, with a mandatory lunch pause at 01:00 PM.</li>
      <li>Instructors belong to the institutional faculty database with predefined curricular module competencies.</li>
    </ul>
  </div>
</div>
</div>
""")

    # PAGE 6 (Page 14 total) - Chapter 3: Literature Review
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <h1 class="chapter-title">CHAPTER 3<br>LITERATURE REVIEW / BACKGROUND</h1>
    
    <h2 class="sec-heading">3.1 Survey of Classical Timetabling Approaches</h2>
    <p>Automated academic timetabling has remained a vigorously investigated problem in artificial intelligence and operational research for over six decades. Early investigations trace back to Gotlieb (1963) [1], who pioneered the formalization of class-teacher scheduling as a bipartite matching problem. Gotlieb utilized matrix reduction techniques to assign teachers to classes under idealized conditions. While foundational, Gotlieb's model assumed infinite venue capacity and ignored complex physical classroom constraints, rendering it unscalable for multi-department collegiate campuses.</p>
    
    <p>During the 1970s and 1980s, graph coloring formulations dominated the literature, as synthesized in comprehensive surveys by de Werra (1985) [2]. In this paradigm, course events are mapped to vertices in an undirected graph <i>G</i> = (<i>V</i>, <i>E</i>), and conflicts (such as shared students or faculty) are represented as edges. Finding a conflict-free schedule corresponds to finding a proper <i>k</i>-coloring of the graph, where each color denotes a distinct time slot. Heuristic graph coloring algorithms—such as Largest Degree First (LDF) and Brelaz's DSATUR (Saturation Degree) algorithm [3]—demonstrated remarkable speed in ordering courses based on constraint severity. However, graph coloring models suffer from substantial rigidity: they handle hard binary conflict edges exceptionally well, but fundamentally struggle to incorporate multi-hour continuous lab constraints, asymmetric venue capabilities, and soft subjective preferences.</p>

    <p>To overcome graph coloring limitations, integer linear programming (ILP) and mixed-integer programming (MIP) formulations gained traction in the 1990s (Dinkel et al., 1989 [4]). ILP formulations express scheduling as the minimization of an objective cost function subject to a matrix of linear equality and inequality constraints. While ILP solvers guarantee mathematical optimality if a feasible solution exists, their worst-case computational complexity scales exponentially with campus size. In institutional configurations exceeding 100 courses and dozens of shared rooms, ILP solvers frequently encounter combinatorial explosion, requiring hours or days to converge, which severely limits their utility for real-time interactive administrative tools.</p>
  </div>
</div>
</div>
""")

    # PAGE 7 (Page 15 total) - Chapter 3: CSP & Consistency Algorithms
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <h2 class="sec-heading">3.2 Constraint Satisfaction &amp; Consistency Algorithms</h2>
    <p>The limitations of classical mathematical programming catalyzed the development of Constraint Satisfaction Problem (CSP) frameworks within artificial intelligence. In a landmark theoretical contribution, Mackworth (1977) [5] formalized the concepts of node, arc, and path consistency in networks of relations, introducing the foundational AC-1, AC-2, and AC-3 algorithms. Mackworth proved that local constraint consistency can be established in polynomial time prior to search, effectively pruning values from variable domains that cannot participate in any valid global solution.</p>

    <p>Waltz (1975) [6] and subsequent extensions by Dechter (2003) [7] established that interleaving constraint propagation with backtracking search dramatically curtails the search tree. By enforcing arc consistency dynamically via forward checking, whenever a variable <i>X</i> is assigned a value <i>v</i>, inconsistent values in adjacent unassigned variables are pruned immediately. If any domain is wiped out, the algorithm detects failure at depth <i>d</i> without fruitlessly exploring deep exponential subtrees (a flaw known as standard backtracking thrashing).</p>

    <p>Further algorithmic refinement was achieved through variable and value ordering heuristics. Haralick and Elliott (1980) [8] formalized the <em>Fail-First Principle</em>: "To succeed, try first where you are most likely to fail." This intuition led to the Minimum Remaining Values (MRV) heuristic, which selects the unassigned variable with the fewest allowable legal domain values. Concurrently, the Least Constraining Value (LCV) heuristic orders domain choices to maximize the remaining options for neighboring unassigned variables, thereby maximizing the likelihood of finding a path to the goal with minimal backtracking.</p>

    <p>Recent research by Rossi, van Beek, and Walsh (2006) [9] demonstrated that CSP architectures are uniquely suited for academic timetabling because they decouple the problem definition (variables, domains, constraints) from the search engine. This modularity enables institutions to cleanly introduce complex domain-specific rules (such as continuous lab requirements and building proximity) without redesigning the underlying solver core.</p>
  </div>
</div>
</div>
""")

    # PAGE 8 (Page 16 total) - Chapter 3: Metaheuristics in Scheduling
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <h2 class="sec-heading">3.3 Heuristic Search &amp; Metaheuristics in Scheduling</h2>
    <p>Alongside constraint programming, the late 1990s and 2000s witnessed extensive exploration of stochastic metaheuristics for university timetabling. Burke, Kingston, and de Werra (2004) [10] and Lewis (2008) [11] published exhaustive surveys classifying metaheuristic methodologies into three broad paradigms: Genetic Algorithms (GA), Simulated Annealing (SA), and Tabu Search (TS).</p>

    <p>Genetic Algorithms model timetables as artificial chromosomes, representing sequences of course allocations. A population of candidate timetables undergoes iterative selection, crossover, and mutation operations driven by a fitness function reflecting constraint penalties (Colorni et al., 1996 [12]). While GAs excel at exploring vast topological spaces and optimizing multi-objective soft preferences, they face severe challenges when enforcing strict hard physical constraints. Standard genetic crossover operators frequently generate invalid offspring containing severe room clashes and teacher overlaps, requiring computationally expensive penalty repair operators or discarding invalid solutions, which degrades algorithm efficiency.</p>

    <p>Simulated Annealing (Abramson, 1991 [13]) and Tabu Search (Hertz, 1991 [14]) operate as local neighborhood search techniques. Starting from a seed timetable, these algorithms iteratively propose small perturbations (such as swapping two lectures). Tabu Search utilizes explicit short-term memory structures (tabu lists) to prevent cycling back to recently visited local states, while Simulated Annealing probabilistically accepts worsening solutions governed by a decreasing temperature parameter <i>T</i>. While these local search metaheuristics achieve commendable soft constraint minimization, their convergence trajectories are highly sensitive to parameter tuning (cooling schedules, tabu tenure), and they offer no mathematical guarantee of finding a 100% collision-free hard schedule in finite time.</p>

    <p>Consequently, contemporary research has converged toward <em>Hybrid Systems</em> (Al-Sultany &amp; Sharif, 2018 [15]; Babaei et al., 2015 [16]), wherein an exact CSP consistency solver guarantees 100% hard constraint feasibility, followed by local heuristic optimization to elevate qualitative schedule comfort.</p>
  </div>
</div>
</div>
""")

    # PAGE 9 (Page 17 total) - Chapter 3: Comparative Matrix & Research Gap
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content">
    <h2 class="sec-heading">3.4 Comparative Matrix &amp; Identified Research Gap</h2>
    <p>To rigorously position the technological contribution of this project within the broader academic landscape, Table 3.1 synthesizes the operational trade-offs across classical and contemporary timetabling paradigms.</p>

    <div class="caption-table">Table 3.1: Comparative Evaluation Matrix of Classical and Modern Timetabling Paradigms</div>
    <table class="table-academic">
      <thead>
        <tr>
          <th style="width: 22%;">Paradigm</th>
          <th style="width: 25%;">Hard Constraint Guarantee</th>
          <th style="width: 26%;">Soft Optimization Flexibility</th>
          <th style="width: 27%;">Computational Scaling</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Manual / Spreadsheets</strong></td>
          <td>Very Poor (Prone to human double-booking)</td>
          <td>Poor (Subjective, ad-hoc adjustments)</td>
          <td>Unscalable (&gt;2 weeks administrative latency)</td>
        </tr>
        <tr>
          <td><strong>Graph Coloring (LDF/DSATUR)</strong></td>
          <td>High (For simple binary conflict edges)</td>
          <td>Inflexible (Cannot handle multi-hour labs)</td>
          <td>Fast polynomial time, but brittle modeling</td>
        </tr>
        <tr>
          <td><strong>Integer Linear Prog. (ILP/MIP)</strong></td>
          <td>Guaranteed (Mathematical exactness)</td>
          <td>Rigid (Requires linear cost formulations)</td>
          <td>Combinatorial explosion on &gt;100 courses</td>
        </tr>
        <tr>
          <td><strong>Genetic Algorithms (GA)</strong></td>
          <td>Stochastic (High rate of invalid offspring)</td>
          <td>Excellent (Arbitrary multi-objective fitness)</td>
          <td>Slow convergence; heavy penalty tuning</td>
        </tr>
        <tr>
          <td><strong>Simulated Annealing / Tabu</strong></td>
          <td>Probabilistic (May trap in local minima)</td>
          <td>High (Neighborhood local search)</td>
          <td>Highly dependent on cooling schedules</td>
        </tr>
        <tr>
          <td><strong>Heuristic CSP (Proposed)</strong></td>
          <td><strong>100% Guaranteed (AC-3 + Backtracking)</strong></td>
          <td><strong>High (MRV/LCV + Soft Evaluator)</strong></td>
          <td><strong>Deterministic sub-second (&lt;50 ms)</strong></td>
        </tr>
      </tbody>
    </table>

    <h3 class="subsec-heading">Identified Research Gap</h3>
    <p>While existing literature provides exhaustive theoretical treatments of CSP and metaheuristics in isolation, a pronounced gap persists in deploying integrated, production-grade solutions within modern collegiate environments. Most academic software prototypes operate as isolated command-line scripts decoupling algorithmic solvers from administrative user experience. Real-world university scheduling requires a unified system delivering: (1) instantaneous 100% collision-free feasibility, (2) synchronized multi-perspective projections across student cohorts, faculty rosters, and room schedules, and (3) dynamic reactive re-solving that recalculates schedules in real-time upon resource ingestion adjustments. This project directly bridges this critical gap.</p>
  </div>
</div>
</div>
""")

    return pages
