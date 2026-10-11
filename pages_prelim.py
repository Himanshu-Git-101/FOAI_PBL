# -*- coding: utf-8 -*-
"""Preliminary Pages 1 to 8"""

def get_prelim_pages():
    pages = []

    # PRELIMINARY PAGE 1: TITLE PAGE (Page 1)
    pages.append("""
<div class="page-wrapper">
<div class="report-page" style="justify-content: space-between; text-align: center; padding-top: 0.75in; padding-bottom: 0.75in;">
  <div>
    <div style="font-size: 20pt; font-weight: bold; letter-spacing: 0.03em; color: #000; margin-bottom: 4px;">Woxsen University</div>
    <div style="font-size: 13.5pt; font-weight: bold; color: #1f2937; margin-bottom: 14px;">School of Technology</div>
    
    <div style="margin: 10px 0 16px 0;">
      <img src="{logo_b64}" alt="Woxsen University Logo" style="height: 68px; object-fit: contain;">
    </div>
    
    <div style="font-size: 11pt; font-weight: 600; color: #374151; margin-bottom: 4px;">B.Tech – Computer Science and Engineering</div>
    <div style="font-size: 9.5pt; color: #4b5563; margin-bottom: 14px;">(Specialization in Artificial Intelligence and Machine Learning)</div>
    
    <div style="font-size: 12.5pt; font-weight: bold; letter-spacing: 0.06em; color: #000; text-transform: uppercase; border-top: 1.5pt solid #000; border-bottom: 1.5pt solid #000; padding: 6px 0; display: inline-block; width: 85%; margin-bottom: 16px;">
      PROJECT BASED LEARNING REPORT
    </div>

    <div style="font-size: 10.5pt; color: #374151; margin-bottom: 6px;">Title of the Project</div>
    <div style="font-size: 12.5pt; font-weight: bold; line-height: 1.4; color: #0f172a; max-width: 90%; margin: 0 auto 16px auto;">
      (Design, Implementation and Performance Analysis of an AI-Based University Timetable Generator Using Constraint Satisfaction and Heuristic Search Algorithms)
    </div>

    <table style="margin: 0 auto 14px auto; font-size: 10.5pt; border-collapse: collapse; text-align: left; width: 75%;">
      <tr><td style="padding: 2px 6px; font-weight: bold; width: 38%;">Course Code:</td><td style="padding: 2px 6px;">23TU03MJM2</td></tr>
      <tr><td style="padding: 2px 6px; font-weight: bold;">Course Name:</td><td style="padding: 2px 6px;">Foundations of Artificial Intelligence</td></tr>
      <tr><td style="padding: 2px 6px; font-weight: bold;">Semester:</td><td style="padding: 2px 6px;">Odd Semester (Semester III)</td></tr>
      <tr><td style="padding: 2px 6px; font-weight: bold;">Academic Year:</td><td style="padding: 2px 6px;">2025-2029</td></tr>
    </table>
  </div>

  <div style="margin-top: 6px;">
    <div style="font-size: 10.5pt; font-weight: bold; margin-bottom: 6px; text-decoration: underline;">Submitted by:</div>
    <table style="margin: 0 auto 12px auto; font-size: 10pt; border-collapse: collapse; width: 80%; text-align: left;">
      <tr style="border-bottom: 0.5pt solid #999;">
        <th style="padding: 2px 6px; font-weight: bold;">S.No.</th>
        <th style="padding: 2px 6px; font-weight: bold;">Candidate Name</th>
        <th style="padding: 2px 6px; font-weight: bold;">Register Number</th>
      </tr>
      <tr><td style="padding: 2px 6px;">1.</td><td style="padding: 2px 6px;">Himanshu Pandit</td><td style="padding: 2px 6px;">25WU0102098</td></tr>
      <tr><td style="padding: 2px 6px;">2.</td><td style="padding: 2px 6px;">Heman</td><td style="padding: 2px 6px;">25WU0102097</td></tr>
      <tr><td style="padding: 2px 6px;">3.</td><td style="padding: 2px 6px;">Rimika Jain</td><td style="padding: 2px 6px;">25WU0101111</td></tr>
      <tr><td style="padding: 2px 6px;">4.</td><td style="padding: 2px 6px;">Anirudh Pratap Singh</td><td style="padding: 2px 6px;">25WU0102111</td></tr>
      <tr><td style="padding: 2px 6px;">5.</td><td style="padding: 2px 6px;">Raghav Malpani</td><td style="padding: 2px 6px;">25WU0101103</td></tr>
    </table>
    <div style="font-size: 10pt; font-weight: bold; margin-bottom: 14px;">Section: AIML Rhinos</div>

    <div style="font-size: 10.5pt; font-weight: bold; margin-bottom: 4px; text-decoration: underline;">Under the Guidance of:</div>
    <div style="font-size: 11pt; font-weight: bold; color: #000;">Dr. Muralidhar Goud K</div>
    <div style="font-size: 10pt; color: #374151;">Assistant Professor</div>
    <div style="font-size: 10pt; color: #374151;">Department of Computer Science and Engineering</div>
    <div style="font-size: 10pt; font-weight: bold; margin-top: 8px;">October, 2026</div>
  </div>
</div>
</div>
""")

    # PRELIMINARY PAGE 2: DECLARATION (Page ii)
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content" style="padding-top: 20px;">
    <h1 class="chapter-title" style="margin-bottom: 30px;">DECLARATION</h1>
    <p>I hereby declare that the Project Title <strong>“Design, Implementation and Performance Analysis of an AI-Based University Timetable Generator Using Constraint Satisfaction and Heuristic Search Algorithms”</strong> submitted by me is an original work carried out under the guidance of the faculty mentioned above.</p>
    <p>I confirm that this work has not been submitted in part or full for the award of any degree, diploma, or other academic qualification in this or any other institution.</p>
    <p>All sources of information used in this case study have been properly acknowledged and cited as per university referencing standards.</p>
    <p>I further declare that the plagiarism percentage is within the permissible limit prescribed by the institution.</p>
    
    <div style="margin-top: 35px; font-size: 11.5pt;">
      <div><strong>Place:</strong> Hyderabad, Telangana</div>
      <div style="margin-top: 6px;"><strong>Date:</strong> 05-10-2026</div>
    </div>

    <div style="margin-top: 50px;">
      <div style="font-weight: bold; margin-bottom: 25px; text-decoration: underline;">Signatures of the Candidates:</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 11pt;">
        <tr style="height: 55px;">
          <td style="width: 50%; vertical-align: top;">
            ___________________________<br>
            <strong>1. Himanshu Pandit</strong><br>
            Register Number: 25WU0102098
          </td>
          <td style="width: 50%; vertical-align: top;">
            ___________________________<br>
            <strong>2. Heman</strong><br>
            Register Number: 25WU0102097
          </td>
        </tr>
        <tr style="height: 55px;">
          <td style="width: 50%; vertical-align: top;">
            ___________________________<br>
            <strong>3. Rimika Jain</strong><br>
            Register Number: 25WU0101111
          </td>
          <td style="width: 50%; vertical-align: top;">
            ___________________________<br>
            <strong>4. Anirudh Pratap Singh</strong><br>
            Register Number: 25WU0102111
          </td>
        </tr>
        <tr style="height: 55px;">
          <td style="width: 50%; vertical-align: top;">
            ___________________________<br>
            <strong>5. Raghav Malpani</strong><br>
            Register Number: 25WU0101103
          </td>
          <td style="width: 50%; vertical-align: top;"></td>
        </tr>
      </table>
    </div>
  </div>
</div>
</div>
""")

    # PRELIMINARY PAGE 3: CERTIFICATE (Page iii)
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content" style="padding-top: 20px;">
    <h1 class="chapter-title" style="margin-bottom: 30px;">CERTIFICATE</h1>
    <p>This is to certify that the project entitled <strong>“Design, Implementation and Performance Analysis of an AI-Based University Timetable Generator Using Constraint Satisfaction and Heuristic Search Algorithms”</strong> is a bonafide work carried out by:</p>
    
    <table style="margin: 20px auto; font-size: 11pt; border-collapse: collapse; width: 90%;">
      <tr style="border-bottom: 1pt solid #000; font-weight: bold;">
        <th style="padding: 4px 8px; text-align: left;">S.No.</th>
        <th style="padding: 4px 8px; text-align: left;">Student Name</th>
        <th style="padding: 4px 8px; text-align: left;">Register Number</th>
      </tr>
      <tr><td style="padding: 4px 8px;">1.</td><td style="padding: 4px 8px;">Himanshu Pandit</td><td style="padding: 4px 8px;">25WU0102098</td></tr>
      <tr><td style="padding: 4px 8px;">2.</td><td style="padding: 4px 8px;">Heman</td><td style="padding: 4px 8px;">25WU0102097</td></tr>
      <tr><td style="padding: 4px 8px;">3.</td><td style="padding: 4px 8px;">Rimika Jain</td><td style="padding: 4px 8px;">25WU0101111</td></tr>
      <tr><td style="padding: 4px 8px;">4.</td><td style="padding: 4px 8px;">Anirudh Pratap Singh</td><td style="padding: 4px 8px;">25WU0102111</td></tr>
      <tr><td style="padding: 4px 8px;">5.</td><td style="padding: 4px 8px;">Raghav Malpani</td><td style="padding: 4px 8px;">25WU0101103</td></tr>
    </table>

    <p style="margin-top: 15px;">in partial fulfillment of the requirements for the award of the degree of <strong>Bachelor of Technology in Computer Science and Engineering (Artificial Intelligence and Machine Learning)</strong>, during the Academic Year 2025-2029 under my supervision.</p>

    <div style="margin-top: 100px; text-align: right; font-size: 11pt; padding-right: 20px;">
      <div style="display: inline-block; text-align: center;">
        _________________________________<br>
        <strong>Dr. Muralidhar Goud K</strong><br>
        Project Guide &amp; Assistant Professor<br>
        Department of CSE, School of Technology<br>
        Woxsen University
      </div>
    </div>
  </div>
</div>
</div>
""")

    # PRELIMINARY PAGE 4: ACKNOWLEDGEMENT (Page iv)
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content" style="padding-top: 20px;">
    <h1 class="chapter-title" style="margin-bottom: 25px;">ACKNOWLEDGEMENT</h1>
    <p>We take this opportunity to express our profound gratitude and deep regards to our project guide, <strong>Dr. Muralidhar Goud K</strong>, Assistant Professor, Department of Computer Science and Engineering, School of Technology, Woxsen University, for his invaluable guidance, continuous encouragement, and constant technical critique throughout the formulation and implementation of this research project.</p>
    <p>We are deeply thankful to the <strong>Head of the Department, Computer Science and Engineering</strong>, and the academic leadership of the <strong>School of Technology, Woxsen University</strong>, for providing state-of-the-art computational facilities, high-performance infrastructure, and an inspiring academic environment that nurtured this Project-Based Learning (PBL) endeavor.</p>
    <p>Our sincere appreciation extends to the administrative scheduling committee of Woxsen University for providing authentic operational scheduling parameters, room capacity constraints, and curriculum structures across Campus Blocks C and F that formed the benchmark dataset for empirical evaluation.</p>
    <p>Finally, we are immensely grateful to our parents, family members, and fellow students of the B.Tech CSE (AIML) cohort for their unwavering moral support, constructive feedback, and endurance throughout the completion of this project.</p>

    <div style="margin-top: 40px; text-align: right; font-size: 11pt;">
      <strong>Project Team (AIML Rhinos):</strong><br>
      Himanshu Pandit (25WU0102098)<br>
      Heman (25WU0102097)<br>
      Rimika Jain (25WU0101111)<br>
      Anirudh Pratap Singh (25WU0102111)<br>
      Raghav Malpani (25WU0101103)
    </div>
  </div>
</div>
</div>
""")

    # PRELIMINARY PAGE 5: ABSTRACT (Page v)
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content" style="padding-top: 20px;">
    <h1 class="chapter-title" style="margin-bottom: 25px;">ABSTRACT</h1>
    <p>University academic timetable scheduling is a canonical combinatorial optimization challenge characterized as NP-complete. In collegiate institutions with shared multi-cohort infrastructure, manual or spreadsheet-based scheduling incurs extensive administrative delays (typically spanning two to three weeks), high vulnerability to human oversights such as faculty double-booking and room over-allocation, and structural failure to optimize soft pedagogical preferences. This project presents the design, mathematical formulation, and end-to-end implementation of an automated, AI-driven university timetable generation engine tailored to institutional operations at Woxsen University.</p>
    <p>The system models academic scheduling as a rigorous Constraint Satisfaction Problem (CSP). Hard physical constraints—including faculty collision-freedom, single-occupancy room guarantees, student cohort non-overlap, continuous multi-hour laboratory span integrity, and venue seating capacity compliance—are enforced via Mackworth's Arc Consistency Algorithm (AC-3) integrated with a forward-checking backtracking solver. To navigate the search space of over 1.5 &times; 10<sup>5</sup> combinatorial states, the engine implements the Minimum Remaining Values (MRV) heuristic for fail-first variable ordering and the Least Constraining Value (LCV) heuristic for value selection, complemented by a multi-objective soft constraint evaluation function that minimizes student idle gaps and balances faculty teaching loads.</p>
    <p>Empirical evaluation conducted on institutional data spanning 120 faculty members, 41 distinct cohorts (including AIML Rhinos, Leopards, and Panthers), and 32 instructional venues across Campus Blocks C and F demonstrated that the engine achieves 100% hard constraint satisfaction within 44 milliseconds. The system features a responsive Web-based management studio providing multi-perspective timetable projections (student cohorts, faculty rosters, and room occupancy) alongside dynamic real-time conflict re-resolution upon resource modification.</p>

    <div style="margin-top: 25px; font-size: 11pt; line-height: 1.6;">
      <strong>Keywords:</strong> Constraint Satisfaction Problem (CSP), Arc Consistency (AC-3), Minimum Remaining Values (MRV), Heuristic Search, Academic Timetabling, Multi-Objective Optimization.
    </div>
  </div>
</div>
</div>
""")

    # PRELIMINARY PAGE 6: TABLE OF CONTENTS (Page vi)
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content" style="padding-top: 20px;">
    <h1 class="chapter-title" style="margin-bottom: 20px;">TABLE OF CONTENTS</h1>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 10pt; line-height: 1.5;">
      <tr style="border-bottom: 1pt solid #000; font-weight: bold;">
        <td style="padding: 3px 0;">Title</td>
        <td style="text-align: right; padding: 3px 0; width: 65px;">Page No.</td>
      </tr>
      <tr><td style="padding: 1px 0;">Declaration</td><td style="text-align: right;">ii</td></tr>
      <tr><td style="padding: 1px 0;">Certificate</td><td style="text-align: right;">iii</td></tr>
      <tr><td style="padding: 1px 0;">Acknowledgement</td><td style="text-align: right;">iv</td></tr>
      <tr><td style="padding: 1px 0;">Abstract</td><td style="text-align: right;">v</td></tr>
      <tr><td style="padding: 1px 0;">List of Figures</td><td style="text-align: right;">vii</td></tr>
      <tr><td style="padding: 1px 0; border-bottom: 0.5pt solid #cbd5e1;">List of Tables</td><td style="text-align: right; border-bottom: 0.5pt solid #cbd5e1;">viii</td></tr>
      
      <tr style="font-weight: bold;"><td style="padding: 3px 0 1px 0;">CHAPTER 1: INTRODUCTION</td><td style="text-align: right; padding: 3px 0 1px 0;">1</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">1.1 Background</td><td style="text-align: right;">1</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">1.2 Motivation &amp; Relevance to Real-World Problem</td><td style="text-align: right;">2</td></tr>
      <tr><td style="padding: 1px 0 2px 18px;">1.3 Scope &amp; Organization of Report</td><td style="text-align: right;">3</td></tr>

      <tr style="font-weight: bold;"><td style="padding: 3px 0 1px 0;">CHAPTER 2: PROBLEM STATEMENT &amp; OBJECTIVES</td><td style="text-align: right; padding: 3px 0 1px 0;">4</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">2.1 Problem Definition</td><td style="text-align: right;">4</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">2.2 Objectives</td><td style="text-align: right;">5</td></tr>
      <tr><td style="padding: 1px 0 2px 18px;">2.3 Constraints &amp; Operational Assumptions</td><td style="text-align: right;">5</td></tr>

      <tr style="font-weight: bold;"><td style="padding: 3px 0 1px 0;">CHAPTER 3: LITERATURE REVIEW / BACKGROUND</td><td style="text-align: right; padding: 3px 0 1px 0;">6</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">3.1 Survey of Classical Timetabling Approaches</td><td style="text-align: right;">6</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">3.2 Constraint Satisfaction &amp; Consistency Algorithms</td><td style="text-align: right;">7</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">3.3 Heuristic Search &amp; Metaheuristics in Scheduling</td><td style="text-align: right;">8</td></tr>
      <tr><td style="padding: 1px 0 2px 18px;">3.4 Comparative Matrix &amp; Identified Research Gap</td><td style="text-align: right;">9</td></tr>

      <tr style="font-weight: bold;"><td style="padding: 3px 0 1px 0;">CHAPTER 4: METHODOLOGY &amp; SYSTEM DESIGN</td><td style="text-align: right; padding: 3px 0 1px 0;">10</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">4.1 Overall System Architecture</td><td style="text-align: right;">10</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">4.2 Process Flowchart &amp; Execution Pipeline</td><td style="text-align: right;">11</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">4.3 Algorithm Formulation &amp; Mathematical Modeling</td><td style="text-align: right;">12</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">4.4 Tools &amp; Technologies Stack</td><td style="text-align: right;">14</td></tr>
      <tr><td style="padding: 1px 0 2px 18px;">4.5 Use-Case &amp; Data Flow Diagrams (DFD)</td><td style="text-align: right;">15</td></tr>

      <tr style="font-weight: bold;"><td style="padding: 3px 0 1px 0;">CHAPTER 5: IMPLEMENTATION</td><td style="text-align: right; padding: 3px 0 1px 0;">16</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">5.1 Module-Wise Implementation</td><td style="text-align: right;">16</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">5.2 Multi-Perspective Output Visualizations &amp; Timetable Projections</td><td style="text-align: right;">20</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">5.3 Interactive AI Workflow &amp; Algorithmic Transparency Interface</td><td style="text-align: right;">22</td></tr>
      <tr><td style="padding: 1px 0 2px 18px;">5.4 Dataset Description &amp; Core Algorithm Pseudo-Code</td><td style="text-align: right;">23</td></tr>

      <tr style="font-weight: bold;"><td style="padding: 3px 0 1px 0;">CHAPTER 6: RESULTS &amp; DISCUSSION</td><td style="text-align: right; padding: 3px 0 1px 0;">24</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">6.1 Generated Timetable Validation &amp; Constraint Compliance</td><td style="text-align: right;">24</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">6.2 Performance Benchmarking &amp; Metric Analysis</td><td style="text-align: right;">25</td></tr>
      <tr><td style="padding: 1px 0 2px 18px;">6.3 Result Interpretation &amp; Objective Fulfillment</td><td style="text-align: right;">26</td></tr>

      <tr style="font-weight: bold;"><td style="padding: 3px 0 1px 0;">CHAPTER 7: CONCLUSION &amp; FUTURE SCOPE</td><td style="text-align: right; padding: 3px 0 1px 0;">27</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">7.1 Summary of Findings</td><td style="text-align: right;">27</td></tr>
      <tr><td style="padding: 1px 0 1px 18px;">7.2 Learning Outcomes</td><td style="text-align: right;">27</td></tr>
      <tr><td style="padding: 1px 0 2px 18px;">7.3 Future Enhancements</td><td style="text-align: right;">28</td></tr>

      <tr style="font-weight: bold; border-top: 0.5pt solid #cbd5e1;"><td style="padding: 3px 0;">REFERENCES</td><td style="text-align: right; padding: 3px 0;">29</td></tr>
    </table>
  </div>
</div>
</div>
""")

    # PRELIMINARY PAGE 7: LIST OF FIGURES (Page vii)
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content" style="padding-top: 20px;">
    <h1 class="chapter-title" style="margin-bottom: 25px;">LIST OF FIGURES</h1>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt; line-height: 1.55;">
      <tr style="border-bottom: 1pt solid #000; font-weight: bold;">
        <td style="width: 75px; padding: 3px 0;">Figure No.</td>
        <td style="padding: 3px 0;">Figure Caption</td>
        <td style="text-align: right; width: 60px; padding: 3px 0;">Page No.</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 2.1</td>
        <td style="padding: 2px 0;">Conceptual Input-Process-Output Transformation of the AI Timetable Engine</td>
        <td style="text-align: right;">4</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 4.1</td>
        <td style="padding: 2px 0;">Four-Tier Layered System Architecture of AI Timetable Engine</td>
        <td style="text-align: right;">10</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 4.2</td>
        <td style="padding: 2px 0;">End-to-End CSP Formulation, AC-3 Pruning, and Backtracking Flowchart</td>
        <td style="text-align: right;">11</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 4.3</td>
        <td style="padding: 2px 0;">UML Use-Case Diagram for Academic Administrator, Faculty, and Student Roles</td>
        <td style="text-align: right;">15</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 4.4</td>
        <td style="padding: 2px 0;">Data Flow Diagram (Level 0 Context Diagram and Level 1 Processing Pipeline)</td>
        <td style="text-align: right;">15</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.1</td>
        <td style="padding: 2px 0;">Timetable Studio Faculty Resource Ingestion Interface (120 Faculty Records)</td>
        <td style="text-align: right;">16</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.2</td>
        <td style="padding: 2px 0;">Classroom &amp; Computational Laboratory Venue Ingestion View (32 Venues)</td>
        <td style="text-align: right;">17</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.3</td>
        <td style="padding: 2px 0;">Curriculum Course Credit Structure &amp; Lab Span Ingestion View (18 Modules)</td>
        <td style="text-align: right;">17</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.4</td>
        <td style="padding: 2px 0;">Generated Conflict-Free Timetable Grid for Cohort (AIML Rhinos - Room F307)</td>
        <td style="text-align: right;">20</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.5</td>
        <td style="padding: 2px 0;">Faculty Workload Allocation &amp; Daily Schedule Distribution View (Dr. Muralidhar Goud K)</td>
        <td style="text-align: right;">20</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.6</td>
        <td style="padding: 2px 0;">Classroom Venue Utilization &amp; Building Occupancy Heatmap (Lab Room F307)</td>
        <td style="text-align: right;">21</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.7</td>
        <td style="padding: 2px 0;">Web Presentation Portal &amp; Interactive Schedule Explorer Dashboard</td>
        <td style="text-align: right;">21</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.8</td>
        <td style="padding: 2px 0;">Full AI Timetable Workflow Modal (6-Stage Plain-English Pipeline)</td>
        <td style="text-align: right;">22</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 5.9</td>
        <td style="padding: 2px 0;">Core AI Algorithms Transparency Interface (Plain-English Analogies for CSP &amp; AC-3)</td>
        <td style="text-align: right;">22</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 6.1</td>
        <td style="padding: 2px 0;">Search Space Domain Reduction Ratio: AC-3 Pruning vs. Pure Backtracking</td>
        <td style="text-align: right;">25</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 6.2</td>
        <td style="padding: 2px 0;">Algorithm Execution Latency (ms) Scaling Against Number of Scheduled Courses</td>
        <td style="text-align: right;">25</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Figure 6.3</td>
        <td style="padding: 2px 0;">Soft Constraint Penalty Objective Convergence Curve Over Search Iterations</td>
        <td style="text-align: right;">25</td>
      </tr>
    </table>
  </div>
</div>
</div>
""")

    # PRELIMINARY PAGE 8: LIST OF TABLES (Page viii)
    pages.append("""
<div class="page-wrapper">
<div class="report-page">
  <div class="page-content" style="padding-top: 20px;">
    <h1 class="chapter-title" style="margin-bottom: 25px;">LIST OF TABLES</h1>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 10.5pt; line-height: 1.7;">
      <tr style="border-bottom: 1pt solid #000; font-weight: bold;">
        <td style="width: 80px; padding: 4px 0;">Table No.</td>
        <td style="padding: 4px 0;">Table Caption</td>
        <td style="text-align: right; width: 65px; padding: 4px 0;">Page No.</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;">Table 3.1</td>
        <td style="padding: 4px 0;">Comparative Evaluation Matrix of Classical and Modern Timetabling Paradigms</td>
        <td style="text-align: right;">9</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;">Table 4.1</td>
        <td style="padding: 4px 0;">Comprehensive System Software, Algorithmic Libraries, and Technology Stack</td>
        <td style="text-align: right;">14</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;">Table 6.1</td>
        <td style="padding: 4px 0;">Hard Constraint Verification Audit and Collision Elimination Benchmark</td>
        <td style="text-align: right;">24</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;">Table 6.2</td>
        <td style="padding: 4px 0;">Comparative Operational Evaluation: Manual Scheduling vs. Heuristic CSP Engine</td>
        <td style="text-align: right;">26</td>
      </tr>
    </table>
  </div>
</div>
</div>
""")

    return pages
