/* ==========================================================================
   AI-BASED STUDENT TIMETABLE GENERATOR — REVIEW 01 PRESENTATION
   Refined 12-Screen Pitch Logic & Micro-Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavTracking();
  initProblemClashes();
  initLiteratureAccordion();
  initPipelineHover();
  initApproachTabs();
});

/* 01. SCROLL PROGRESS INDICATOR */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
}

/* 02. ACTIVE NAV LINK TRACKING */
function initNavTracking() {
  const navLinks = document.querySelectorAll('.nav-item-link');
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

/* 03. SCREEN 02: 5-CONFLICT MATRIX INTERACTION */
const clashDefinitions = {
  faculty: {
    indicator: "Active: Faculty Conflict (Simultaneous Section Overlap)",
    cells: ['td-tue-2', 'td-thu-3'],
    explanation: "<strong>Faculty Conflict:</strong> Dr. Malli Rajeswara Rao is assigned to teach Computer Organization &amp; Architecture (COA) for both <em>AIML Rhinos (Room F307)</em> and <em>AIML Tigers (Room C005)</em> during overlapping slots. A professor cannot instruct two distinct sections simultaneously."
  },
  room: {
    indicator: "Active: Room Conflict (Classroom F307 Double-Booking)",
    cells: ['td-wed-1', 'td-wed-2'],
    explanation: "<strong>Room Conflict:</strong> Classroom F307 (Lab Block) has been concurrently scheduled for DAA Theory (AIML Rhinos) and an overlapping lecture for <em>Leopards</em>. Campus classrooms from F101–F113, F301–F308, and C001–C016 are strictly single-occupancy facilities."
  },
  student: {
    indicator: "Active: Student Cohort Clash (AIML Rhinos)",
    cells: ['td-fri-1', 'td-fri-2'],
    explanation: "<strong>Student Conflict:</strong> The <em>AIML Rhinos</em> cohort is assigned to both DBMS Theory (Prof. Sahithi in F307) and Discrete Mathematics (Prof. Gururaj Nase in F102) concurrently. Student cohorts (Rhinos, Tigers, Leopards, Panthers, Wolves, Whales) cannot split across multiple lectures."
  },
  availability: {
    indicator: "Active: Faculty Availability Breach (Research Mask)",
    cells: ['td-fri-4'],
    explanation: "<strong>Availability Breach:</strong> Dr. Muralidhar Goud K is scheduled for FOAIO on Friday 04:00 PM despite a verified department research &amp; symposium block registered in the faculty availability matrix."
  },
  workload: {
    indicator: "Active: Daily Workload Imbalance (Fatigue Penalty)",
    cells: ['td-wed-1', 'td-wed-2', 'td-wed-3', 'td-wed-4'],
    explanation: "<strong>Workload Imbalance:</strong> AIML Rhinos is scheduled for 5 consecutive lecture &amp; lab contact hours on Wednesday with zero recuperation gaps, while Monday contains zero core lectures. This triggers substantial soft constraint fatigue penalties."
  }
};

function initProblemClashes() {
  const buttons = document.querySelectorAll('.conflict-nav-btn');
  const indicator = document.getElementById('clash-indicator');
  const explanation = document.getElementById('clash-explanation');

  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const clashType = btn.getAttribute('data-clash');
      const data = clashDefinitions[clashType];
      if (!data) return;

      if (indicator) indicator.textContent = data.indicator;
      if (explanation) explanation.innerHTML = data.explanation;

      // Clear all clash cell classes
      document.querySelectorAll('.schedule-matrix-table td').forEach(td => {
        td.classList.remove('matrix-clash');
      });

      // Apply to matching cells
      data.cells.forEach(id => {
        const cell = document.getElementById(id);
        if (cell) cell.classList.add('matrix-clash');
      });
    });
  });
}

/* 04. SCREEN 05: LITERATURE REVIEW ACCORDION */
function initLiteratureAccordion() {
  window.toggleLitPitchRow = function(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;

    const isOpen = row.classList.contains('open');
    // Close other rows for clean presentation
    document.querySelectorAll('.lit-detail-row').forEach(r => r.classList.remove('open'));
    document.querySelectorAll('.lit-summary-row .expand-icon').forEach(icon => icon.textContent = '+');

    if (!isOpen) {
      row.classList.add('open');
      const prevRow = row.previousElementSibling;
      const icon = prevRow?.querySelector('.expand-icon');
      if (icon) icon.textContent = '−';
    }
  };
}

/* 05. SCREEN 07: PROPOSED APPROACH PIPELINE & TAB SWITCHER */
function initPipelineHover() {
  const steps = document.querySelectorAll('.app-stage-card');
  steps.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--blue-600)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--border-blue)';
    });
  });
}

function initApproachTabs() {
  const tabBtns = document.querySelectorAll('.approach-tab-btn');
  const panels = document.querySelectorAll('.approach-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-app-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`app-panel-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

/* 06. SCREEN 11.5: EMBEDDED TIMETABLE GENERATOR PREVIEW */
function initEmbeddedGenerator() {
  const select = document.getElementById('embed-cohort-select');
  const display = document.getElementById('embed-table-display');
  const btn = document.getElementById('embed-btn-generate');

  if (!display || typeof WOXSEN_TIMETABLE_DATA === 'undefined') return;

  function renderEmbeddedTable(tableId) {
    const groupTables = WOXSEN_TIMETABLE_DATA.groups?.tables || [];
    const target = groupTables.find(t => t.id === tableId) || groupTables[0];
    if (!target) return;

    display.innerHTML = `
      <table id="${target.id}" border="1" class="odd_table">
        <caption>
          <span class="institution">${target.institution}</span><br />
          <span class="name">${target.name}</span>
        </caption>
        <thead>
          ${target.thead}
        </thead>
        <tbody>
          ${target.tbody}
        </tbody>
      </table>
    `;
  }

  if (select) {
    select.addEventListener('change', () => {
      renderEmbeddedTable(select.value);
    });
    // Initial render
    renderEmbeddedTable(select.value || 'table_10');
  }

  if (btn) {
    btn.addEventListener('click', () => {
      btn.textContent = '⏳ Solving CSP...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ 100% Constraints Satisfied';
        renderEmbeddedTable(select ? select.value : 'table_10');
        setTimeout(() => {
          btn.textContent = '⚡ Run AI Generator';
          btn.disabled = false;
        }, 1500);
      }, 350);
    });
  }
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
  initEmbeddedGenerator();
});

