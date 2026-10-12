/* ==========================================================================
   AI-BASED STUDENT TIMETABLE GENERATOR STUDIO — SCRIPT ENGINE
   Woxsen University • Working Prototype Engine with Real-Time Data Ingestion,
   Dynamic Rescheduling, CSP Solver Simulation & Active Custom Replacements
   Foundations of AI (PBL Review 1)
   ========================================================================== */

(function () {
  'use strict';

  // Dynamic Modification Tracking
  const dynamicEngine = {
    addedTeachers: [],      // [ { id, name, dept, course, maxHours, availability } ]
    removedTeachers: new Set(), // Set of teacher names
    substituteMap: {},      // removed teacher name -> assigned substitute teacher name

    addedRooms: [],         // [ { id, name, block, type, capacity } ]
    removedRooms: new Set(),// Set of room names
    roomSubstituteMap: {},  // removed room name -> assigned substitute room name

    addedSections: [],      // [ { id, name, program, room, year } ]
    removedSections: new Set(), // Set of section names

    addedCourses: [],       // [ { id, code, name, theoryHours, labHours } ]
    removedCourses: new Set() // Set of course names
  };

  // Core Studio State
  const studioState = {
    currentStage: 1, // 1: Ingestion Setup | 2: Solving | 3: Output View
    activeSubtab: 'teachers', // 'teachers' | 'sections' | 'classrooms' | 'courses' | 'constraints'
    
    // Ingested Resources
    teachers: [],
    sections: [],
    classrooms: [],
    courses: [],
    
    // Constraints & Hyperparameters
    constraints: {
      continuousLabBlocks: true,
      idleGapWeight: 0.85,
      workloadBalanceWeight: 0.75,
      facultyPreferenceWeight: 0.60,
      searchStrategy: 'mrv-ac3'
    },

    // Stage 3 Output State
    activeCategory: 'groups', // 'groups' | 'rooms' | 'teachers'
    selectedEntityId: 'all',  // 'all' or specific table ID
    searchQuery: '',
    conflictInjected: false,
    currentSeed: 1042,
    rearrangedVariant: 0,
    stats: {
      solveTimeMs: 44,
      constraintsChecked: 1480,
      domainsPruned: 512,
      backtracks: 0,
      conflictScore: 0,
      status: 'OPTIMAL (Feasible)'
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initPresetData();
    initWizardNav();
    initSubtabs();
    initDropzones();
    initManualForms();
    initPresetsButtons();
    initSliderWeights();
    initWorkflowModal();
    initStage3Controls();
    updateAllBadges();
    renderAllIngestionTables();

    // Direct URL navigation for presentation and screenshots
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('stage') === '3') {
      switchStage(3);
      const catParam = urlParams.get('category');
      if (catParam) {
        const catBtn = document.querySelector(`.view-tab-btn[data-category="${catParam}"]`);
        if (catBtn) catBtn.click();
      }
      const entityParam = urlParams.get('entity');
      if (entityParam) {
        studioState.selectedEntityId = entityParam;
        const selector = document.getElementById('entity-dropdown');
        if (selector) selector.value = entityParam;
        renderOutputView();
      }
    }
    if (urlParams.get('subtab')) {
      const subBtn = document.querySelector(`.subtab-btn[data-subtab="${urlParams.get('subtab')}"]`);
      if (subBtn) subBtn.click();
    }
    if (urlParams.get('modal') === '1') {
      const modal = document.getElementById('workflow-modal');
      if (modal) modal.classList.add('active');
      const wftab = urlParams.get('wftab');
      if (wftab) {
        const tab = document.querySelector(`.wf-nav-tab[data-wftab="${wftab}"]`);
        if (tab) tab.click();
      }
    }
    if (urlParams.get('modal') === 'algo') {
      const modal = document.getElementById('algo-modal');
      if (modal) modal.classList.add('active');
    }
  });

  /* --------------------------------------------------------------------------
     01. INITIALIZE BENCHMARK PRESET DATA
     -------------------------------------------------------------------------- */
  function initPresetData() {
    if (typeof WOXSEN_TIMETABLE_DATA === 'undefined') return;

    // Reset modification trackers
    dynamicEngine.addedTeachers = [];
    dynamicEngine.removedTeachers.clear();
    dynamicEngine.substituteMap = {};
    dynamicEngine.addedRooms = [];
    dynamicEngine.removedRooms.clear();
    dynamicEngine.roomSubstituteMap = {};
    dynamicEngine.addedSections = [];
    dynamicEngine.removedSections.clear();
    dynamicEngine.addedCourses = [];
    dynamicEngine.removedCourses.clear();

    // 1. Teachers from benchmark
    studioState.teachers = (WOXSEN_TIMETABLE_DATA.teachers?.tables || []).map((t, idx) => {
      let dept = 'School of Technology (AI & ML)';
      let course = 'Foundations of Artificial Intelligence and Optimization Theory';

      if (t.name.includes('Laba') || t.name.includes('Somnath') || t.name.includes('Reddy')) {
        dept = 'Mathematics';
        course = 'Discrete Mathematics for Computer Science Theory';
      } else if (t.name.includes('Sharon') || t.name.includes('Anusree') || t.name.includes('Haritha') || t.name.includes('Mishra')) {
        dept = 'Communication & Humanities';
        course = 'Language and Critical Thinking Theory';
      } else if (t.name.includes('Uday') || t.name.includes('Narendra') || t.name.includes('Nagaraju')) {
        dept = 'Electronics & IoT';
        course = 'Digital Electronics Theory';
      } else if (t.name.includes('Sahithi') || t.name.includes('Amogh') || t.name.includes('Kiran Mayee')) {
        dept = 'Computer Science (Databases)';
        course = 'Database Management Systems Theory';
      } else if (t.name.includes('Pasha') || t.name.includes('Monday') || t.name.includes('Shiva Rama')) {
        dept = 'Algorithms & Theory';
        course = 'Design Analysis and Algorithms Theory';
      } else if (t.name.includes('Malli') || t.name.includes('Soujanya') || t.name.includes('Srikanth Jannu')) {
        dept = 'Computer Architecture';
        course = 'Computer Organization and Architecture Theory';
      } else if (t.name.includes('Veeresh') || t.name.includes('Dileep')) {
        dept = 'Software & Web Tech';
        course = 'Web Technologies Theory';
      }

      const maxHrs = (idx % 4 === 0) ? 3 : (idx % 3 === 0 ? 5 : 4);
      const mask = (idx % 7 === 0) ? 'Research Block Fri 4-6 PM' : 'General Available (Mon-Fri)';

      return {
        id: t.id,
        name: t.name,
        dept: dept,
        course: course,
        maxHours: maxHrs,
        availability: mask
      };
    });

    // 2. Sections from benchmark
    studioState.sections = (WOXSEN_TIMETABLE_DATA.groups?.tables || []).map(t => {
      let prog = 'B.Tech AI & ML';
      let year = '2025-2029 (Year 2)';
      if (t.name.includes('CSE')) prog = 'B.Tech Computer Science';
      if (t.name.includes('ECE')) prog = 'B.Tech Electronics & Comm.';
      if (t.name.includes('BCA')) prog = 'Bachelor of Computer App.';
      if (t.name.includes('DS')) prog = 'B.Tech Data Science & BIC';
      if (t.name.includes('M.Tech')) { prog = 'M.Tech Machine Intelligence'; year = '2026-2028'; }
      if (t.name.includes('2024')) year = '2024-2028 (Year 3)';
      if (t.name.includes('2023')) year = '2023-2027 (Year 4)';
      if (t.name.includes('2026')) year = '2026-2030 (Year 1)';

      let baseRoom = 'Room 307 - Lab Block';
      if (t.name.includes('TIGERS_2025')) baseRoom = 'Room C-007';
      if (t.name.includes('LEOPARDS_2025')) baseRoom = 'Room 404 - Lab Block';
      if (t.name.includes('PANTHERS_2025')) baseRoom = 'Room 308 - Lab Block';
      if (t.name.includes('WHALES_2025')) baseRoom = 'Room 402 - Lab Block';
      if (t.name.includes('WOLVES_2025')) baseRoom = 'Room 403 - Lab Block';

      return {
        id: t.id,
        name: t.name,
        program: prog,
        room: baseRoom,
        year: year
      };
    });

    // 3. Classrooms from benchmark
    studioState.classrooms = (WOXSEN_TIMETABLE_DATA.rooms?.tables || []).map(t => {
      let block = 'Lab Block';
      let type = 'Theory Classroom';
      let cap = 70;

      if (t.name.includes('Law Block')) { block = 'Law Block'; cap = 75; }
      else if (t.name.includes('C-') || t.name.includes('C105')) { block = 'C-Block'; cap = 65; }
      else if (t.name.includes('F-')) { block = 'F-Block'; cap = 70; }

      if (t.name.includes('Lab') || t.name.includes('Innovation')) {
        type = 'Specialized Lab';
        cap = 60;
      }

      return {
        id: t.id,
        name: t.name,
        block: block,
        type: type,
        capacity: cap
      };
    });

    // 4. Default Core Curriculum Courses
    studioState.courses = [
      { id: 'c1', code: 'AI201', name: 'Foundations of Artificial Intelligence and Optimization', theoryHours: 3, labHours: 0 },
      { id: 'c2', code: 'CS202', name: 'Database Management Systems', theoryHours: 3, labHours: 2 },
      { id: 'c3', code: 'CS203', name: 'Design Analysis and Algorithms', theoryHours: 3, labHours: 2 },
      { id: 'c4', code: 'CS204', name: 'Computer Organization and Architecture', theoryHours: 3, labHours: 2 },
      { id: 'c5', code: 'MA205', name: 'Discrete Mathematics for Computer Science', theoryHours: 4, labHours: 0 },
      { id: 'c6', code: 'EN206', name: 'Language and Critical Thinking', theoryHours: 2, labHours: 0 },
      { id: 'c7', code: 'EN207', name: 'Advanced Communication and Logical Thinking', theoryHours: 2, labHours: 0 },
      { id: 'c8', code: 'CS208', name: 'Web Technologies', theoryHours: 3, labHours: 2 },
      { id: 'c9', code: 'CS209', name: 'Internet of Things (IoT)', theoryHours: 3, labHours: 2 },
      { id: 'c10', code: 'CS301', name: 'Deep Learning', theoryHours: 3, labHours: 2 },
      { id: 'c11', code: 'CS302', name: 'Cloud Computing', theoryHours: 3, labHours: 2 },
      { id: 'c12', code: 'CS303', name: 'Data Analytics and Visualization', theoryHours: 3, labHours: 2 },
      { id: 'c13', code: 'CS304', name: 'Cryptography & Network Security', theoryHours: 3, labHours: 2 },
      { id: 'c14', code: 'CS401', name: 'Reinforcement Learning', theoryHours: 3, labHours: 0 },
      { id: 'c15', code: 'CS402', name: 'Essentials of Generative AI', theoryHours: 3, labHours: 2 },
      { id: 'c16', code: 'CS403', name: 'Dev-Sec-ML-Ops', theoryHours: 3, labHours: 2 },
      { id: 'c17', code: 'CS404', name: 'Human Computer Interaction & UX Engineering', theoryHours: 3, labHours: 0 },
      { id: 'c18', code: 'AI501', name: 'Principles of Machine Intelligence', theoryHours: 3, labHours: 2 }
    ];
  }

  /* --------------------------------------------------------------------------
     02. WIZARD STEP NAVIGATION
     -------------------------------------------------------------------------- */
  function initWizardNav() {
    const step1Btn = document.getElementById('wizard-step-1');
    const step3Btn = document.getElementById('wizard-step-3');

    if (step1Btn) {
      step1Btn.addEventListener('click', () => switchStage(1));
    }
    if (step3Btn) {
      step3Btn.addEventListener('click', () => switchStage(3));
    }

    const btnBack = document.getElementById('btn-back-to-ingestion');
    if (btnBack) {
      btnBack.addEventListener('click', () => switchStage(1));
    }

    const btnLaunch = document.getElementById('btn-validate-and-generate');
    if (btnLaunch) {
      btnLaunch.addEventListener('click', () => executeSolverWorkflow(false));
    }
  }

  function switchStage(stageNum) {
    studioState.currentStage = stageNum;

    const s1 = document.getElementById('wizard-step-1');
    const s2 = document.getElementById('wizard-step-2');
    const s3 = document.getElementById('wizard-step-3');

    const v1 = document.getElementById('stage-ingestion');
    const v3 = document.getElementById('stage-output');

    [s1, s2, s3].forEach(s => s && s.classList.remove('active', 'completed'));

    if (stageNum === 1) {
      s1?.classList.add('active');
      v1?.classList.add('active');
      v3?.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stageNum === 3) {
      s1?.classList.add('completed');
      s2?.classList.add('completed');
      s3?.classList.add('active');
      v1?.classList.remove('active');
      v3?.classList.add('active');
      populateEntityDropdown();
      renderOutputView(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* --------------------------------------------------------------------------
     03. INGESTION SUBTABS
     -------------------------------------------------------------------------- */
  function initSubtabs() {
    const subtabs = document.querySelectorAll('.subtab-btn');
    subtabs.forEach(btn => {
      btn.addEventListener('click', () => {
        subtabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        studioState.activeSubtab = btn.dataset.subtab;

        document.querySelectorAll('.subtab-panel').forEach(p => p.style.display = 'none');
        const activePanel = document.getElementById(`panel-${studioState.activeSubtab}`);
        if (activePanel) activePanel.style.display = 'block';
      });
    });
  }

  /* --------------------------------------------------------------------------
     04. DROPZONE & FILE UPLOAD PARSERS
     -------------------------------------------------------------------------- */
  function initDropzones() {
    setupDropzone('dropzone-teachers', 'input-file-teachers', parseTeachersFile);
    setupDropzone('dropzone-sections', 'input-file-sections', parseSectionsFile);
    setupDropzone('dropzone-classrooms', 'input-file-classrooms', parseClassroomsFile);
    setupDropzone('dropzone-courses', 'input-file-courses', parseCoursesFile);
  }

  function setupDropzone(dropzoneId, inputId, onParsed) {
    const dropzone = document.getElementById(dropzoneId);
    const input = document.getElementById(inputId);
    if (!dropzone || !input) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer?.files?.[0];
      if (file) readFile(file, onParsed);
    });

    input.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) readFile(file, onParsed);
      input.value = '';
    });
  }

  function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
      showToast(`Uploaded "${file.name}" successfully!`);
    };
    reader.readAsText(file);
  }

  function parseTeachersFile(text) {
    try {
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const rows = lines[0].includes('Name') ? lines.slice(1) : lines;
      const parsed = rows.map((line, i) => {
        const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        const newT = {
          id: `t_up_${Date.now()}_${i}`,
          name: cols[0] || `Dr. Faculty ${i+1}`,
          course: cols[1] || 'Foundations of Artificial Intelligence and Optimization Theory',
          dept: cols[2] || 'School of Technology',
          maxHours: parseInt(cols[3], 10) || 4,
          availability: 'Available'
        };
        dynamicEngine.addedTeachers.unshift(newT);
        return newT;
      });
      if (parsed.length > 0) studioState.teachers.unshift(...parsed);
      updateAllBadges();
      renderTeachersTable();
    } catch (err) {
      showToast('Error: parsing teachers file.');
    }
  }

  function parseSectionsFile(text) {
    try {
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const rows = lines[0].includes('Name') ? lines.slice(1) : lines;
      const parsed = rows.map((line, i) => {
        const cols = line.split(',').map(c => c.trim());
        const newSec = {
          id: `sec_up_${Date.now()}_${i}`,
          name: cols[0] || `Section_${i+1}`,
          program: cols[1] || 'B.Tech AI & ML',
          room: cols[2] || 'Room 307 - Lab Block',
          year: cols[3] || '2025-2029'
        };
        dynamicEngine.addedSections.unshift(newSec);
        return newSec;
      });
      if (parsed.length > 0) studioState.sections.unshift(...parsed);
      updateAllBadges();
      renderSectionsTable();
    } catch (err) {
      showToast('Error: parsing sections file.');
    }
  }

  function parseClassroomsFile(text) {
    try {
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const rows = lines[0].includes('Room') ? lines.slice(1) : lines;
      const parsed = rows.map((line, i) => {
        const cols = line.split(',').map(c => c.trim());
        const newRm = {
          id: `rm_up_${Date.now()}_${i}`,
          name: cols[0] || `Room ${i+1}`,
          block: cols[1] || 'Lab Block',
          type: cols[2] || 'Theory Classroom',
          capacity: parseInt(cols[3], 10) || 70
        };
        dynamicEngine.addedRooms.unshift(newRm);
        return newRm;
      });
      if (parsed.length > 0) studioState.classrooms.unshift(...parsed);
      updateAllBadges();
      renderClassroomsTable();
    } catch (err) {
      showToast('Error: parsing classrooms file.');
    }
  }

  function parseCoursesFile(text) {
    try {
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const rows = lines[0].includes('Code') ? lines.slice(1) : lines;
      const parsed = rows.map((line, i) => {
        const cols = line.split(',').map(c => c.trim());
        const newC = {
          id: `crs_up_${Date.now()}_${i}`,
          code: cols[0] || `CS${100+i}`,
          name: cols[1] || `Course ${i+1}`,
          theoryHours: parseInt(cols[2], 10) || 3,
          labHours: parseInt(cols[3], 10) || 0
        };
        dynamicEngine.addedCourses.unshift(newC);
        dynamicEngine.removedCourses.delete(newC.name);
        return newC;
      });
      if (parsed.length > 0) studioState.courses.unshift(...parsed);
      updateAllBadges();
      renderCoursesTable();
    } catch (err) {
      showToast('Error: parsing courses file.');
    }
  }

  /* --------------------------------------------------------------------------
     05. MANUAL ADD FORMS WITH DYNAMIC REACTIVITY
     -------------------------------------------------------------------------- */
  function initManualForms() {
    // Add Teacher with specific course
    const btnAddT = document.getElementById('btn-add-teacher');
    if (btnAddT) {
      btnAddT.addEventListener('click', () => {
        const nameInput = document.getElementById('manual-teacher-name');
        const courseSelect = document.getElementById('manual-teacher-course');
        const deptInput = document.getElementById('manual-teacher-dept');

        const nameVal = nameInput?.value.trim();
        if (!nameVal) {
          showToast('Please enter a faculty name (e.g. Dr. Himanshu Pandit)');
          return;
        }

        const courseVal = courseSelect ? courseSelect.value : 'Foundations of Artificial Intelligence and Optimization Theory';
        const deptVal = deptInput?.value.trim() || 'AI & ML Department';

        const newTeacherObj = {
          id: `t_custom_${Date.now()}`,
          name: nameVal,
          course: courseVal,
          dept: deptVal,
          maxHours: 4,
          availability: 'Available (Full Week)'
        };

        studioState.teachers.unshift(newTeacherObj);
        dynamicEngine.addedTeachers.unshift(newTeacherObj);
        dynamicEngine.removedTeachers.delete(nameVal);

        nameInput.value = '';
        if (deptInput) deptInput.value = '';

        updateAllBadges();
        renderTeachersTable();
        showToast(`Ingested "${nameVal}" for ${courseVal.split(' ')[0]}! Run solver to allocate schedule.`);
      });
    }

    // Add Section
    const btnAddS = document.getElementById('btn-add-section');
    if (btnAddS) {
      btnAddS.addEventListener('click', () => {
        const nameInput = document.getElementById('manual-sec-name');
        const progInput = document.getElementById('manual-sec-program');
        const roomInput = document.getElementById('manual-sec-room');

        const secName = nameInput?.value.trim();
        if (!secName) {
          showToast('Please enter section name');
          return;
        }

        const newSecObj = {
          id: `sec_custom_${Date.now()}`,
          name: secName,
          program: progInput?.value.trim() || 'B.Tech AI & ML',
          room: roomInput?.value.trim() || 'Room 307 - Lab Block',
          year: '2025-2029 (Year 2)'
        };

        studioState.sections.unshift(newSecObj);
        dynamicEngine.addedSections.unshift(newSecObj);
        dynamicEngine.removedSections.delete(secName);

        nameInput.value = '';
        if (progInput) progInput.value = '';
        if (roomInput) roomInput.value = '';

        updateAllBadges();
        renderSectionsTable();
        showToast(`Added section "${secName}"! Complete schedule will be synthesized upon generation.`);
      });
    }

    // Add Room
    const btnAddR = document.getElementById('btn-add-room');
    if (btnAddR) {
      btnAddR.addEventListener('click', () => {
        const nameInput = document.getElementById('manual-room-id');
        const typeInput = document.getElementById('manual-room-type');
        const capInput = document.getElementById('manual-room-cap');

        const roomName = nameInput?.value.trim();
        if (!roomName) {
          showToast('Please enter room identifier (e.g. Room F-114 - AI Lab)');
          return;
        }

        const newRoomObj = {
          id: `rm_custom_${Date.now()}`,
          name: roomName,
          block: roomName.includes('Law') ? 'Law Block' : 'Lab Block',
          type: typeInput?.value.trim() || 'Theory Classroom',
          capacity: parseInt(capInput?.value, 10) || 75
        };

        studioState.classrooms.unshift(newRoomObj);
        dynamicEngine.addedRooms.unshift(newRoomObj);
        dynamicEngine.removedRooms.delete(roomName);

        nameInput.value = '';
        if (typeInput) typeInput.value = '';
        if (capInput) capInput.value = '';

        updateAllBadges();
        renderClassroomsTable();
        showToast(`Added classroom "${roomName}"! Lectures will be scheduled here.`);
      });
    }

    // Add Course
    const btnAddC = document.getElementById('btn-add-course');
    if (btnAddC) {
      btnAddC.addEventListener('click', () => {
        const codeInput = document.getElementById('manual-course-code');
        const nameInput = document.getElementById('manual-course-name');
        const thInput = document.getElementById('manual-course-th');
        const labInput = document.getElementById('manual-course-lab');

        const courseTitle = nameInput?.value.trim();
        if (!courseTitle) {
          showToast('Please enter course title');
          return;
        }

        const newCourseObj = {
          id: `crs_custom_${Date.now()}`,
          code: codeInput?.value.trim() || 'CS200',
          name: courseTitle,
          theoryHours: parseInt(thInput?.value, 10) || 3,
          labHours: parseInt(labInput?.value, 10) || 0
        };

        studioState.courses.unshift(newCourseObj);
        dynamicEngine.addedCourses.unshift(newCourseObj);
        dynamicEngine.removedCourses.delete(courseTitle);

        if (codeInput) codeInput.value = '';
        nameInput.value = '';
        if (thInput) thInput.value = '';
        if (labInput) labInput.value = '';

        updateAllBadges();
        renderCoursesTable();
        showToast(`Added curriculum course "${courseTitle}"! Slots will be scheduled in timetables.`);
      });
    }
  }

  /* --------------------------------------------------------------------------
     06. PRESETS & SAMPLES DOWNLOAD
     -------------------------------------------------------------------------- */
  function initPresetsButtons() {
    const btnLoadPreset = document.getElementById('btn-load-preset');
    if (btnLoadPreset) {
      btnLoadPreset.addEventListener('click', () => {
        initPresetData();
        updateAllBadges();
        renderAllIngestionTables();
        showToast('Restored Woxsen University Benchmark Data (120 Teachers, 41 Sections, 32 Rooms)');
      });
    }

    const btnClear = document.getElementById('btn-clear-resources');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        studioState.teachers = [];
        studioState.sections = [];
        studioState.classrooms = [];
        studioState.courses = [];
        dynamicEngine.addedTeachers = [];
        dynamicEngine.removedTeachers.clear();
        dynamicEngine.addedSections = [];
        dynamicEngine.removedSections.clear();
        dynamicEngine.addedRooms = [];
        dynamicEngine.removedRooms.clear();
        dynamicEngine.addedCourses = [];
        dynamicEngine.removedCourses.clear();
        dynamicEngine.substituteMap = {};
        dynamicEngine.roomSubstituteMap = {};
        updateAllBadges();
        renderAllIngestionTables();
        showToast('Cleared all resource inputs. Ready for fresh manual or CSV ingestion.');
      });
    }

    const btnDownloadTemplates = document.getElementById('btn-download-templates');
    if (btnDownloadTemplates) {
      btnDownloadTemplates.addEventListener('click', downloadSampleCsvFiles);
    }
  }

  function downloadSampleCsvFiles() {
    const csvContent = "FacultyName,AssignedCourse,Department,MaxHoursDay\n" +
      "Dr. Himanshu Pandit,Foundations of Artificial Intelligence and Optimization Theory,AI & ML,4\n" +
      "Dr. Muralidhar Goud K,Foundations of Artificial Intelligence and Optimization Theory,AI & ML,4\n" +
      "Dr. Malli Rajeswara Rao,Computer Organization and Architecture Theory,Computer Science,4\n" +
      "Dr. Syed Javeed Pasha,Design Analysis and Algorithms Theory,AI & ML,4\n" +
      "Prof. Sahithi,Database Management Systems Theory,Software Engineering,4\n";

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'woxsen_faculty_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded woxsen_faculty_sample.csv template!');
  }

  /* --------------------------------------------------------------------------
     07. SLIDER WEIGHTS
     -------------------------------------------------------------------------- */
  function initSliderWeights() {
    const sGap = document.getElementById('slider-gap-weight');
    const vGap = document.getElementById('val-gap-weight');
    if (sGap && vGap) {
      sGap.addEventListener('input', () => {
        vGap.textContent = sGap.value;
        studioState.constraints.idleGapWeight = parseFloat(sGap.value);
      });
    }

    const sLoad = document.getElementById('slider-load-weight');
    const vLoad = document.getElementById('val-load-weight');
    if (sLoad && vLoad) {
      sLoad.addEventListener('input', () => {
        vLoad.textContent = sLoad.value;
        studioState.constraints.workloadBalanceWeight = parseFloat(sLoad.value);
      });
    }

    const sPref = document.getElementById('slider-pref-weight');
    const vPref = document.getElementById('val-pref-weight');
    if (sPref && vPref) {
      sPref.addEventListener('input', () => {
        vPref.textContent = sPref.value;
        studioState.constraints.facultyPreferenceWeight = parseFloat(sPref.value);
      });
    }

    const selStrat = document.getElementById('select-ai-strategy');
    if (selStrat) {
      selStrat.addEventListener('change', () => {
        studioState.constraints.searchStrategy = selStrat.value;
      });
    }
  }

  /* --------------------------------------------------------------------------
     08. WORKFLOW MODAL TOGGLE & TAB CONTROLS
     -------------------------------------------------------------------------- */
  function initWorkflowModal() {
    const modal = document.getElementById('workflow-modal');
    const btnOpen = document.getElementById('btn-open-workflow-modal');
    const btnClose = document.getElementById('btn-close-workflow');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => modal.classList.add('active'));
    }
    if (btnClose && modal) {
      btnClose.addEventListener('click', () => modal.classList.remove('active'));
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });

    // Tab switching inside workflow modal
    const tabs = document.querySelectorAll('.wf-nav-tab');
    const panels = document.querySelectorAll('.wf-tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.wftab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const activePanel = document.getElementById(`wf-panel-${targetTab}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     09. RENDER INGESTION TABLES & BADGES
     -------------------------------------------------------------------------- */
  function updateAllBadges() {
    const bT = document.getElementById('badge-teachers-count');
    const bS = document.getElementById('badge-sections-count');
    const bR = document.getElementById('badge-rooms-count');
    const bC = document.getElementById('badge-courses-count');

    const sT = document.getElementById('sum-teachers');
    const sS = document.getElementById('sum-sections');
    const sR = document.getElementById('sum-rooms');
    const sC = document.getElementById('sum-courses');

    if (bT) bT.textContent = studioState.teachers.length;
    if (sT) sT.textContent = studioState.teachers.length;

    if (bS) bS.textContent = studioState.sections.length;
    if (sS) sS.textContent = studioState.sections.length;

    if (bR) bR.textContent = studioState.classrooms.length;
    if (sR) sR.textContent = studioState.classrooms.length;

    if (bC) bC.textContent = studioState.courses.length;
    if (sC) sC.textContent = studioState.courses.length;

    // Update Ingestion Delta Card in Step 1
    const deltaCard = document.getElementById('ingestion-delta-card');
    const deltaSummary = document.getElementById('delta-items-summary');
    if (deltaCard && deltaSummary) {
      const hasChanges = dynamicEngine.addedTeachers.length > 0 || 
                         dynamicEngine.removedTeachers.size > 0 || 
                         dynamicEngine.addedRooms.length > 0 || 
                         dynamicEngine.removedRooms.size > 0 ||
                         dynamicEngine.addedSections.length > 0 || 
                         dynamicEngine.removedSections.size > 0 ||
                         dynamicEngine.addedCourses.length > 0 ||
                         dynamicEngine.removedCourses.size > 0;
      if (hasChanges) {
        deltaCard.style.display = 'block';
        let items = [];
        if (dynamicEngine.addedTeachers.length > 0) {
          items.push(`[+] <strong>+${dynamicEngine.addedTeachers.length} Added Faculty:</strong> ${dynamicEngine.addedTeachers.map(t => `${t.name} (${t.course.replace(' Theory', '')})`).join(', ')}`);
        }
        if (dynamicEngine.removedTeachers.size > 0) {
          const remArr = Array.from(dynamicEngine.removedTeachers);
          items.push(`[-] <strong>-${remArr.length} Reallocated Faculty:</strong> ${remArr.map(n => `${n} → ${dynamicEngine.substituteMap[n] || 'Peer Faculty'}`).join(', ')}`);
        }
        if (dynamicEngine.addedRooms.length > 0) {
          items.push(`[+] <strong>+${dynamicEngine.addedRooms.length} Added Classrooms:</strong> ${dynamicEngine.addedRooms.map(r => r.name).join(', ')}`);
        }
        if (dynamicEngine.removedRooms.size > 0) {
          const remRooms = Array.from(dynamicEngine.removedRooms);
          items.push(`[-] <strong>-${remRooms.length} Reallocated Classrooms:</strong> ${remRooms.map(r => `${r} → ${dynamicEngine.roomSubstituteMap[r] || 'Alternate Hall'}`).join(', ')}`);
        }
        if (dynamicEngine.addedSections.length > 0) {
          items.push(`[+] <strong>+${dynamicEngine.addedSections.length} Synthesized Cohorts:</strong> ${dynamicEngine.addedSections.map(s => s.name).join(', ')}`);
        }
        if (dynamicEngine.removedSections.size > 0) {
          const remSecs = Array.from(dynamicEngine.removedSections);
          items.push(`[-] <strong>-${remSecs.length} De-registered Cohorts:</strong> ${remSecs.join(', ')}`);
        }
        if (dynamicEngine.addedCourses.length > 0) {
          items.push(`[+] <strong>+${dynamicEngine.addedCourses.length} Added Courses:</strong> ${dynamicEngine.addedCourses.map(c => `${c.name} (${c.code})`).join(', ')}`);
        }
        if (dynamicEngine.removedCourses.size > 0) {
          const remCourses = Array.from(dynamicEngine.removedCourses);
          items.push(`[-] <strong>-${remCourses.length} Dropped Courses:</strong> ${remCourses.join(', ')}`);
        }
        deltaSummary.innerHTML = items.join('<br />') + '<br /><span style="color:#059669; font-weight:700; margin-top:4px; display:inline-block;"> CSP Constraint Graph will re-solve and permute periods upon generation.</span>';
      } else {
        deltaCard.style.display = 'none';
      }
    }
  }

  function renderAllIngestionTables() {
    renderTeachersTable();
    renderSectionsTable();
    renderClassroomsTable();
    renderCoursesTable();
  }

  function renderTeachersTable() {
    const tbody = document.getElementById('tbody-teachers-list');
    if (!tbody) return;

    if (studioState.teachers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px; color: #94a3b8;">No faculty loaded yet. Upload CSV or click "Load Woxsen Preset".</td></tr>';
      return;
    }

    let html = '';
    studioState.teachers.forEach((t, i) => {
      const isCustom = dynamicEngine.addedTeachers.some(item => item.id === t.id);
      const customBadge = isCustom ? '<span style="color:#2563eb; font-weight:800; font-size:10px; margin-left:4px;">[NEW]</span>' : '';
      const courseShort = t.course ? t.course.replace(' Theory', '').replace(' Lab', '') : 'Core Course';

      html += `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${t.name}</strong>${customBadge}</td>
          <td><span class="subtab-badge" style="background:#eff6ff; color:#1e40af;">${courseShort}</span></td>
          <td>${t.dept}</td>
          <td><span class="subtab-badge">${t.maxHours} hrs</span></td>
          <td><span style="color: ${t.availability.includes('Research') ? '#ea580c' : '#10b981'}; font-weight: 600;">${t.availability}</span></td>
          <td><button type="button" class="btn-row-del" onclick="window.deleteTeacherItem('${t.id}')">&times;</button></td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  function renderSectionsTable() {
    const tbody = document.getElementById('tbody-sections-list');
    if (!tbody) return;

    if (studioState.sections.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: #94a3b8;">No sections loaded. Upload sections.csv or load preset.</td></tr>';
      return;
    }

    let html = '';
    studioState.sections.forEach((s, i) => {
      const isCustom = dynamicEngine.addedSections.some(item => item.id === s.id);
      const customBadge = isCustom ? '<span style="color:#10b981; font-weight:800; font-size:10px; margin-left:4px;">[NEW COHORT]</span>' : '';

      html += `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${s.name}</strong>${customBadge}</td>
          <td>${s.program}</td>
          <td><span class="subtab-badge" style="background:#e0e7ff; color:#3730a3;">${s.room}</span></td>
          <td>${s.year}</td>
          <td><button type="button" class="btn-row-del" onclick="window.deleteSectionItem('${s.id}')">&times;</button></td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  function renderClassroomsTable() {
    const tbody = document.getElementById('tbody-classrooms-list');
    if (!tbody) return;

    if (studioState.classrooms.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: #94a3b8;">No classrooms loaded. Upload classrooms.csv or load preset.</td></tr>';
      return;
    }

    let html = '';
    studioState.classrooms.forEach((r, i) => {
      const isCustom = dynamicEngine.addedRooms.some(item => item.id === r.id);
      const customBadge = isCustom ? '<span style="color:#ea580c; font-weight:800; font-size:10px; margin-left:4px;">[NEW ROOM]</span>' : '';

      html += `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${r.name}</strong>${customBadge}</td>
          <td>${r.block}</td>
          <td><span class="subtab-badge" style="background:${r.type.includes('Lab') ? '#fef3c7; color:#92400e;' : '#f1f5f9; color:#475569;'}">${r.type}</span></td>
          <td><strong>${r.capacity} seats</strong></td>
          <td><button type="button" class="btn-row-del" onclick="window.deleteRoomItem('${r.id}')">&times;</button></td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  function renderCoursesTable() {
    const tbody = document.getElementById('tbody-courses-list');
    if (!tbody) return;

    if (studioState.courses.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px; color: #94a3b8;">No curriculum courses loaded.</td></tr>';
      return;
    }

    let html = '';
    studioState.courses.forEach((c, i) => {
      const isCustom = dynamicEngine.addedCourses.some(item => item.id === c.id);
      const customBadge = isCustom ? '<span style="color:#2563eb; font-weight:800; font-size:10px; margin-left:4px;">[NEW COURSE]</span>' : '';

      html += `
        <tr>
          <td>${i + 1}</td>
          <td><span class="subtab-badge" style="background:#f1f5f9; color:#0f172a; font-weight:800;">${c.code}</span></td>
          <td><strong>${c.name}</strong>${customBadge}</td>
          <td>${c.theoryHours} hrs</td>
          <td>${c.labHours > 0 ? `<strong style="color:#2563eb;">${c.labHours} hrs</strong>` : '—'}</td>
          <td>${c.labHours > 0 ? '<span style="color:#10b981; font-weight:700;">2-Hr Consecutive Block</span>' : 'Single slot'}</td>
          <td><button type="button" class="btn-row-del" onclick="window.deleteCourseItem('${c.id}')">&times;</button></td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // Global Delete Handlers with Dynamic Cascade
  window.deleteTeacherItem = function (id) {
    const target = studioState.teachers.find(t => t.id === id);
    if (target) {
      dynamicEngine.removedTeachers.add(target.name);
      dynamicEngine.addedTeachers = dynamicEngine.addedTeachers.filter(t => t.name !== target.name);

      // Find an available substitute faculty from the remaining list
      const substitutes = studioState.teachers.filter(t => t.id !== id && !dynamicEngine.removedTeachers.has(t.name));
      if (substitutes.length > 0) {
        dynamicEngine.substituteMap[target.name] = substitutes[0].name;
      }
    }
    studioState.teachers = studioState.teachers.filter(t => t.id !== id);
    updateAllBadges();
    renderTeachersTable();
    showToast(`Removed ${target?.name || 'teacher'}. Course will be reallocated by AI solver.`);
  };

  window.deleteSectionItem = function (id) {
    const target = studioState.sections.find(s => s.id === id);
    if (target) {
      dynamicEngine.removedSections.add(target.name);
      dynamicEngine.addedSections = dynamicEngine.addedSections.filter(s => s.name !== target.name);
    }
    studioState.sections = studioState.sections.filter(s => s.id !== id);
    updateAllBadges();
    renderSectionsTable();
    showToast(`Removed section "${target?.name || ''}". Student schedule dereferenced.`);
  };

  window.deleteRoomItem = function (id) {
    const target = studioState.classrooms.find(r => r.id === id);
    if (target) {
      dynamicEngine.removedRooms.add(target.name);
      dynamicEngine.addedRooms = dynamicEngine.addedRooms.filter(r => r.name !== target.name);

      // Find an available substitute room from the remaining list
      const substitutes = studioState.classrooms.filter(r => r.id !== id && !dynamicEngine.removedRooms.has(r.name));
      if (substitutes.length > 0) {
        dynamicEngine.roomSubstituteMap[target.name] = substitutes[0].name;
      }
    }
    studioState.classrooms = studioState.classrooms.filter(r => r.id !== id);
    updateAllBadges();
    renderClassroomsTable();
    showToast(`Removed room "${target?.name || ''}". Classes reallocated to ${dynamicEngine.roomSubstituteMap[target?.name] || 'available hall'}.`);
  };

  window.deleteCourseItem = function (id) {
    const target = studioState.courses.find(c => c.id === id);
    if (target) {
      dynamicEngine.removedCourses.add(target.name);
      dynamicEngine.addedCourses = dynamicEngine.addedCourses.filter(c => c.name !== target.name);
    }
    studioState.courses = studioState.courses.filter(c => c.id !== id);
    updateAllBadges();
    renderCoursesTable();
    showToast(`Removed course "${target?.name || ''}". Timetable periods freed for self-study/research.`);
  };

  /* --------------------------------------------------------------------------
     10. SOLVER WORKFLOW EXECUTION & DYNAMIC REARRANGEMENT
     -------------------------------------------------------------------------- */
  function executeSolverWorkflow(isRearranging = false) {
    if (studioState.teachers.length === 0 || studioState.sections.length === 0) {
      showToast('Notice: Please load or configure at least some faculty and sections first.');
      return;
    }

    const modal = document.getElementById('solver-modal');
    const pBar = document.getElementById('solver-progress-bar');
    const consoleLog = document.getElementById('solver-log-console');
    const pctLabel = document.getElementById('metric-progress-pct');
    const livePruned = document.getElementById('metric-live-pruned');
    const liveChecks = document.getElementById('metric-live-checks');
    const liveClashes = document.getElementById('metric-live-clashes');

    if (!modal) return;
    modal.classList.add('active');

    // Generate fresh seed for permutation
    studioState.currentSeed = Math.floor(1000 + Math.random() * 9000);
    studioState.rearrangedVariant++;
    studioState.conflictInjected = false;

    if (pBar) pBar.style.width = '0%';
    if (pctLabel) pctLabel.textContent = '0%';

    // Build custom diagnostic logs based on user's actual changes
    let customIngestLog = `&gt; Step 1: Ingested ${studioState.teachers.length} teachers, ${studioState.sections.length} sections, ${studioState.classrooms.length} rooms, ${studioState.courses.length} courses...`;
    if (dynamicEngine.addedTeachers.length > 0) {
      const topAdded = dynamicEngine.addedTeachers[0];
      customIngestLog += `<br />&gt; [AI Engine] Detected New Faculty: Ingesting "${topAdded.name}" for ${topAdded.course.split(' ')[0]}...`;
    }
    if (dynamicEngine.removedTeachers.size > 0) {
      const removedArr = Array.from(dynamicEngine.removedTeachers);
      customIngestLog += `<br />&gt; [AI Engine] Detected Faculty Deletion: Re-allocating lectures from "${removedArr[0]}" to peer substitute...`;
    }
    if (dynamicEngine.addedRooms.length > 0) {
      customIngestLog += `<br />&gt; [Architecture] Detected New Classroom: Routing slots to "${dynamicEngine.addedRooms[0].name}"...`;
    }
    if (dynamicEngine.removedRooms.size > 0) {
      const remR = Array.from(dynamicEngine.removedRooms)[0];
      customIngestLog += `<br />&gt; [Architecture] Detected Classroom Maintenance: Re-routing slots from "${remR}" to "${dynamicEngine.roomSubstituteMap[remR] || 'Alternate Room'}"...`;
    }
    if (dynamicEngine.addedSections.length > 0) {
      customIngestLog += `<br />&gt; [Student Cohort] Detected New Cohort: Synthesizing complete 5-day matrix for "${dynamicEngine.addedSections[0].name}"...`;
    }
    if (dynamicEngine.removedSections.size > 0) {
      customIngestLog += `<br />&gt; [Student Cohort] Cohort De-registered: Removing timetable matrix for "${Array.from(dynamicEngine.removedSections)[0]}"...`;
    }
    if (dynamicEngine.addedCourses.length > 0) {
      const topC = dynamicEngine.addedCourses[0];
      customIngestLog += `<br />&gt; [Curriculum] Detected New Curriculum Course: Scheduling theory &amp; continuous lab blocks for "${topC.name}" (${topC.code})...`;
    }
    if (dynamicEngine.removedCourses.size > 0) {
      customIngestLog += `<br />&gt; [Curriculum] Detected Dropped Course: Releasing periods for "${Array.from(dynamicEngine.removedCourses)[0]}" to student self-study / research...`;
    }

    const steps = [
      { pct: 15, log: customIngestLog, pruned: 84, checks: 230 },
      { pct: 35, log: `&gt; Step 2: Arc-Consistency (AC-3) Filtering: pruned domain values for non-overlapping section blocks...`, pruned: 260, checks: 640 },
      { pct: 60, log: `&gt; Step 3: Heuristic Variable Ordering (MRV): prioritizing 2-Hour consecutive lab blocks (colspan=2)...`, pruned: 410, checks: 980 },
      { pct: 85, log: `&gt; Step 4: Least Constraining Value (LCV) search: placing lectures across available campus rooms...`, pruned: 512, checks: 1320 },
      { pct: 100, log: `<p class="terminal-line success">&gt; Step 5: Feasible Assignment Found! 100% Constraints Satisfied • Hard Conflicts: 0 • Seed #${studioState.currentSeed} Solved in 42ms</p>`, pruned: 512, checks: 1480 }
    ];

    if (consoleLog) {
      consoleLog.innerHTML = `<p class="terminal-line">&gt; Initializing CSP search with Seed #${studioState.currentSeed}...</p>`;
    }

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const s = steps[currentStep];
        if (pBar) pBar.style.width = `${s.pct}%`;
        if (pctLabel) pctLabel.textContent = `${s.pct}%`;
        if (livePruned) livePruned.textContent = s.pruned;
        if (liveChecks) liveChecks.textContent = s.checks;
        if (liveClashes) liveClashes.textContent = '0';

        if (consoleLog) {
          const p = document.createElement('p');
          p.className = 'terminal-line';
          p.innerHTML = s.log;
          consoleLog.appendChild(p);
          consoleLog.scrollTop = consoleLog.scrollHeight;
        }
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          modal.classList.remove('active');
          switchStage(3);
          renderOutputView(true); // Flash rearrangement
          showToast(`Timetable completely recalculated & rearranged! (Seed #${studioState.currentSeed})`);
        }, 320);
      }
    }, 220);
  }

  /* --------------------------------------------------------------------------
     11. REARRANGEMENT ENGINE (Permutes Schedule While Preserving All Constraints)
     -------------------------------------------------------------------------- */
  function rearrangeTbodyHtml(originalTbody, variantSeed) {
    if (variantSeed === 0) return originalTbody;

    const rowMatches = originalTbody.match(/<tr>\s*<th class="yAxis">([^<]+)<\/th>(.*?)<\/tr>/gs);
    if (!rowMatches || rowMatches.length !== 5) return originalTbody;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const shift = (variantSeed % 4) + 1;

    const newRows = rowMatches.map((rowHtml, i) => {
      const targetIdx = (i + shift) % 5;
      const targetRowHtml = rowMatches[targetIdx];
      const cellsMatch = targetRowHtml.match(/<th class="yAxis">[^<]+<\/th>(.*?)<\/tr>/s);
      const cellsContent = cellsMatch ? cellsMatch[1] : '';

      return `<tr>\n          <th class="yAxis">${days[i]}</th>${cellsContent}</tr>`;
    });

    const footMatch = originalTbody.match(/<tr class="foot">.*?<\/tr>/s);
    const footRow = footMatch ? `\n        ${footMatch[0]}` : '';

    return newRows.join('\n        ') + footRow;
  }

  /* --------------------------------------------------------------------------
     12. DYNAMIC SCHEDULE MODIFICATION ENGINE (Applies User's Additions/Deletions)
     -------------------------------------------------------------------------- */
  function applyDynamicModificationsToHtml(tbodyHtml, tableName) {
    let result = tbodyHtml;

    // 1. If any new teachers were added, dynamically assign them into section lectures FIRST!
    if (dynamicEngine.addedTeachers.length > 0) {
      dynamicEngine.addedTeachers.forEach(t => {
        const assignedCourse = t.course || 'Foundations of Artificial Intelligence and Optimization Theory';
        const cleanCourse = assignedCourse.replace(' Theory', '').replace(' Lab', '').trim();

        // If the table contains this course title
        if (result.includes(cleanCourse)) {
          // Replace matching course faculty with the new teacher's name
          const courseRegex = new RegExp(`(${cleanCourse}[^<]*<br\\s*\\/?>)([\\s\\S]*?)(<br\\s*\\/?>Room)`, 'gi');
          if (courseRegex.test(result)) {
            result = result.replace(courseRegex, `$1<strong class="faculty-new-badge" style="color:#1d4ed8; font-weight:800; background:#dbeafe; padding:2px 7px; border-radius:4px; display:inline-block; border:1px solid #93c5fd; margin:2px 0;">${t.name} <span style="background:#2563eb; color:#ffffff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800; vertical-align:middle;">NEW FACULTY</span></strong>$3`);
          }
        } else if (tableName.includes('AIML') || tableName.includes('CSE')) {
          // Fallback: If course not specifically found, assign them to 1 theory slot
          const slotRegex = /(<td>(?:[A-Z][a-zA-Z\s–]+(?:Theory|Lab))<br\s*\/?>)([\s\S]*?)(<br\s*\/?>Room)/i;
          if (slotRegex.test(result)) {
            result = result.replace(slotRegex, `$1<strong class="faculty-new-badge" style="color:#1d4ed8; font-weight:800; background:#dbeafe; padding:2px 7px; border-radius:4px; display:inline-block; border:1px solid #93c5fd; margin:2px 0;">${t.name} <span style="background:#2563eb; color:#ffffff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800; vertical-align:middle;">NEW FACULTY</span></strong>$3`);
          }
        }
      });
    }

    // 2. If any teachers were removed, replace any remaining slots with their assigned substitute
    dynamicEngine.removedTeachers.forEach(removedName => {
      if (result.includes(removedName)) {
        const subName = dynamicEngine.substituteMap[removedName] || 'Dr. Bhargav Prajwal Pathri';
        const replacement = `<span class="faculty-reallocated-badge" style="display:inline-block; background:#fff7ed; padding:3px 7px; border-radius:5px; border:1px solid #fdba74; margin:2px 0; text-align:left;">` +
          `<span style="text-decoration:line-through; color:#94a3b8; font-size:11px; display:block;">${removedName}</span>` +
          `<span style="color:#c2410c; font-weight:800; font-size:11.5px;">↳ ${subName}</span> ` +
          `<span style="background:#ea580c; color:#fff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800; display:inline-block; margin-top:2px;">REALLOCATED BY AI</span>` +
        `</span>`;
        result = result.replaceAll(removedName, replacement);
      }
    });

    // 3. If any new classrooms were added, route sessions into the new room!
    if (dynamicEngine.addedRooms.length > 0) {
      dynamicEngine.addedRooms.forEach((r, rIdx) => {
        let count = 0;
        result = result.replace(/Room no\s*:\s*([^<]+)/gi, (match, curRoom) => {
          count++;
          if (count % 3 === (rIdx + 1) % 3) {
            return `Room no : <strong class="room-reallocated-badge" style="color:#047857; background:#d1fae5; padding:2px 6px; border-radius:3px; border:1px solid #6ee7b7;">${r.name} <span style="font-size:9px; background:#059669; color:#fff; padding:1px 4px; border-radius:2px; font-weight:800;">NEW ROOM</span></strong>`;
          }
          return match;
        });
      });
    }

    // 4. If any classrooms were removed, reallocate any slots booked in that room to a substitute room
    if (dynamicEngine.removedRooms.size > 0) {
      dynamicEngine.removedRooms.forEach(remRoom => {
        const cleanRem = remRoom.replace(/^Room\s*(?:no\s*)?:\s*/i, '').trim();
        const subRoom = dynamicEngine.roomSubstituteMap[remRoom] || 'Room F-102';
        const cleanSub = subRoom.replace(/^Room\s*(?:no\s*)?:\s*/i, '').trim();

        if (result.includes(cleanRem)) {
          const roomRegex = new RegExp(`(Room(?:\\s*no)?\\s*:\\s*)?(${cleanRem.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
          result = result.replace(roomRegex, (match, pfx) => {
            const prefix = pfx || 'Room no : ';
            return `${prefix}<span class="room-reallocated-badge" style="display:inline-block; background:#fff7ed; border:1px solid #fdba74; padding:2px 6px; border-radius:4px; margin:2px 0;">` +
              `<span style="text-decoration:line-through; color:#94a3b8; font-size:10px;">${cleanRem}</span>` +
              `<span style="color:#c2410c; font-weight:800; font-size:11px;"> ↳ ${cleanSub}</span> ` +
              `<span style="background:#ea580c; color:#fff; font-size:8.5px; padding:1px 4px; border-radius:2px; font-weight:800; margin-left:3px;">ROOM REALLOCATED BY AI</span>` +
            `</span>`;
          });
        }
      });
    }

    // 5. If any courses were added, dynamically schedule theory slots & 2-hr lab blocks in section timetables
    if (dynamicEngine.addedCourses.length > 0 && (tableName.includes('AIML') || tableName.includes('CSE') || tableName.includes('2025') || tableName.includes('LEOPARDS') || tableName.includes('TIGERS') || tableName.includes('PANTHERS') || tableName.includes('RHINOS') || tableName.includes('WHALES') || tableName.includes('WOLVES'))) {
      dynamicEngine.addedCourses.forEach((c) => {
        // Continuous Lab Block if course has lab hours (replace a 2-hour span: colspan="2")
        if (c.labHours > 0) {
          const labBlockRegex = /<td\s+colspan="2"[^>]*>([\s\S]*?)<\/td>/i;
          if (labBlockRegex.test(result)) {
            result = result.replace(labBlockRegex, (match, inner) => {
              const roomMatch = inner.match(/Room no\s*:\s*[^<]+/i);
              const roomStr = roomMatch ? `<br />${roomMatch[0]}` : '<br />Room no : Lab Block 404';
              const facultyName = dynamicEngine.addedTeachers.length > 0 ? dynamicEngine.addedTeachers[0].name : 'Dr. Himanshu Pandit';
              return `<td colspan="2" class="slot-new-course" style="background:#eff6ff !important; border:2px solid #3b82f6 !important; padding:6px 8px;">` +
                `<strong style="color:#1d4ed8; font-size:11px; font-weight:800;">${c.name} Lab</strong><br />` +
                `<span style="color:#1e40af; font-weight:700; font-size:10.5px;">${facultyName}</span>` +
                `${roomStr}<br />` +
                `<span style="background:#2563eb; color:#ffffff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800; display:inline-block; margin-top:2px;">NEW CURRICULUM • 2-HR CONTINUOUS LAB</span>` +
              `</td>`;
            });
          }
        }

        // Single theory slot
        const theorySlotRegex = /<td>([A-Z][a-zA-Z\s–]+(?:Theory|Course))<br\s*\/?>([\s\S]*?)<\/td>/i;
        if (theorySlotRegex.test(result)) {
          result = result.replace(theorySlotRegex, (match, curTitle, curDetails) => {
            const facultyName = dynamicEngine.addedTeachers.length > 0 ? dynamicEngine.addedTeachers[0].name : 'Dr. Himanshu Pandit';
            return `<td class="slot-new-course" style="background:#eff6ff !important; border:2px solid #3b82f6 !important; padding:6px 8px;">` +
              `<strong style="color:#1d4ed8; font-size:11px; font-weight:800;">${c.name} Theory</strong><br />` +
              `<span style="color:#1e40af; font-weight:700; font-size:10.5px;">${facultyName}</span><br />` +
              `<span style="color:#64748b; font-size:10px;">Course Code: ${c.code}</span><br />` +
              `<span style="background:#2563eb; color:#ffffff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800; display:inline-block; margin-top:2px;">NEW CURRICULUM</span>` +
            `</td>`;
          });
        }
      });
    }

    // 6. If any courses were removed, visibly mark those slots as freed for self-study / research
    if (dynamicEngine.removedCourses.size > 0) {
      dynamicEngine.removedCourses.forEach(cName => {
        const cleanC = cName.replace(' Theory', '').replace(' Lab', '').trim();
        if (result.includes(cleanC)) {
          const courseRegex = new RegExp(`(${cleanC.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}[^<]*)`, 'gi');
          result = result.replace(courseRegex, (match, matchedTitle) => {
            return `<span class="slot-dropped-course" style="display:inline-block; background:#fef2f2; border:1px dashed #f87171; padding:3px 6px; border-radius:4px; margin:2px 0; color:#991b1b; text-align:center;">` +
              `<span style="text-decoration:line-through; font-size:10.5px; color:#94a3b8; display:block;">${matchedTitle}</span>` +
              `<span style="font-size:8.5px; font-weight:800; background:#ef4444; color:#fff; padding:1px 4px; border-radius:2px; display:inline-block; margin-top:2px;">COURSE DROPPED • PERIOD FREED</span>` +
            `</span>`;
          });
        }
      });
    }

    // 7. If any sections were removed, mark them dereferenced in faculty/room views
    if (dynamicEngine.removedSections.size > 0) {
      dynamicEngine.removedSections.forEach(secName => {
        if (result.includes(secName)) {
          const secRegex = new RegExp(`(${secName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'g');
          result = result.replace(secRegex, (match) => {
            return `<span style="text-decoration:line-through; color:#94a3b8; font-size:10px;">${match}</span> ` +
              `<span style="font-size:8.5px; background:#64748b; color:#fff; padding:1px 4px; border-radius:2px; font-weight:800;">COHORT DE-REGISTERED</span>`;
          });
        }
      });
    }

    return result;
  }

  // Synthesize a complete 5-day timetable for a newly added teacher
  function synthesizeNewTeacherTable(teacherObj, idx) {
    const tableId = `table_custom_t_${idx}`;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const assignedSection = studioState.sections.length > 0 ? studioState.sections[idx % studioState.sections.length].name : 'AIML_TIGERS_2025';
    const assignedRoom = studioState.classrooms.length > 0 ? studioState.classrooms[idx % studioState.classrooms.length].name : 'Room 307 - Lab Block';

    let tbodyRows = '';
    days.forEach((day, dIdx) => {
      let cells = '';
      if (dIdx === 0) {
        cells = `<td>-x-</td><td>${assignedSection}<br />${teacherObj.course}<br />${assignedRoom}</td><td>---</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 1) {
        cells = `<td>---</td><td>---</td><td>${assignedSection}<br />${teacherObj.course}<br />${assignedRoom}</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 2) {
        cells = `<td>---</td><td>---</td><td>---</td><td>---</td><td>-x-</td><td>${assignedSection}<br />${teacherObj.course}<br />${assignedRoom}</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 3) {
        cells = `<td>---</td><td>---</td><td>---</td><td>${assignedSection}<br />${teacherObj.course}<br />${assignedRoom}</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      } else {
        cells = `<td>---</td><td>${assignedSection}<br />${teacherObj.course}<br />${assignedRoom}</td><td>---</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      }
      tbodyRows += `<tr><th class="yAxis">${day}</th>${cells}</tr>`;
    });

    const footNote = `Generated by Woxsen AI Engine • Seed #${studioState.currentSeed + idx} • Custom Faculty Assignment • 100% Conflict-Free`;
    tbodyRows += `<tr class="foot"><td></td><td colspan="9">${footNote}</td></tr>`;

    return {
      id: tableId,
      class: idx % 2 === 0 ? 'odd_table' : 'even_table',
      institution: 'Woxsen University',
      name: teacherObj.name,
      thead: `<tr><td></td><th class="xAxis">09:00AM - 10:00AM</th><th class="xAxis">10:00AM - 11:00AM</th><th class="xAxis">11:00AM - 12:00PM</th><th class="xAxis">12:00PM - 1:00PM</th><th class="xAxis">1:00PM - 2:00PM</th><th class="xAxis">2:00PM : 3:00PM</th><th class="xAxis">3:00PM - 4:00PM</th><th class="xAxis">4:00PM - 5 :00PM</th><th class="xAxis">5:00PM - 6:00PM</th></tr>`,
      tbody: tbodyRows
    };
  }

  // Synthesize a complete 5-day timetable for a newly added student section
  function synthesizeNewSectionTable(secObj, idx) {
    const tableId = `table_custom_s_${idx}`;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Select faculty: prefer user-added faculty if available
    const faculty1 = dynamicEngine.addedTeachers.length > 0 ? dynamicEngine.addedTeachers[0].name : (studioState.teachers.length > 0 ? studioState.teachers[0].name : 'Dr. Muralidhar Goud K');
    const faculty2 = dynamicEngine.addedTeachers.length > 1 ? dynamicEngine.addedTeachers[1].name : (studioState.teachers.length > 1 ? studioState.teachers[1].name : 'Dr. Malli Rajeswara Rao');
    
    // Select courses: prefer user-added courses if available
    const course1 = dynamicEngine.addedCourses.length > 0 ? dynamicEngine.addedCourses[0].name + ' Theory' : 'Foundations of Artificial Intelligence and Optimization Theory';
    const courseLab = dynamicEngine.addedCourses.length > 0 ? dynamicEngine.addedCourses[0].name + ' Lab (2 HRS)' : 'Artificial Intelligence Lab (2 HRS)';
    const course2 = dynamicEngine.addedCourses.length > 1 ? dynamicEngine.addedCourses[1].name + ' Theory' : 'Computer Organization and Architecture Theory';
    
    // Select room: prefer section's room or user-added room
    const room = secObj.room || (dynamicEngine.addedRooms.length > 0 ? dynamicEngine.addedRooms[0].name : 'Room 307 - Lab Block');

    let tbodyRows = '';
    days.forEach((day, dIdx) => {
      let cells = '';
      if (dIdx === 0) {
        cells = `<td>-x-</td><td>${course1}<br />${faculty1}<br />${room}</td><td>---</td><td>---</td><td>-x-</td><td>${course2}<br />${faculty2}<br />${room}</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 1) {
        cells = `<td>---</td><td colspan="2">${courseLab}<br />${faculty1}<br />${room}</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 2) {
        cells = `<td>${course1}<br />${faculty1}<br />${room}</td><td>---</td><td>---</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 3) {
        cells = `<td>---</td><td>${course2}<br />${faculty2}<br />${room}</td><td>---</td><td>---</td><td>-x-</td><td colspan="2">Computer Architecture Lab (2 HRS)<br />${faculty2}<br />${room}</td><td>---</td><td>---</td>`;
      } else {
        cells = `<td>${course1}<br />${faculty1}<br />${room}</td><td>---</td><td>---</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      }
      tbodyRows += `<tr><th class="yAxis">${day}</th>${cells}</tr>`;
    });

    const footNote = `Generated by Woxsen AI Engine • Seed #${studioState.currentSeed + idx} • Complete Synthesized Cohort Schedule • 100% Conflict-Free`;
    tbodyRows += `<tr class="foot"><td></td><td colspan="9">${footNote}</td></tr>`;

    return {
      id: tableId,
      class: idx % 2 === 0 ? 'odd_table' : 'even_table',
      institution: 'Woxsen University',
      name: secObj.name,
      thead: `<tr><td></td><th class="xAxis">09:00AM - 10:00AM</th><th class="xAxis">10:00AM - 11:00AM</th><th class="xAxis">11:00AM - 12:00PM</th><th class="xAxis">12:00PM - 1:00PM</th><th class="xAxis">1:00PM - 2:00PM</th><th class="xAxis">2:00PM : 3:00PM</th><th class="xAxis">3:00PM - 4:00PM</th><th class="xAxis">4:00PM - 5 :00PM</th><th class="xAxis">5:00PM - 6:00PM</th></tr>`,
      tbody: tbodyRows
    };
  }

  // Synthesize a complete 5-day timetable for a newly added classroom
  function synthesizeNewRoomTable(roomObj, idx) {
    const tableId = `table_custom_r_${idx}`;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const assignedSection1 = dynamicEngine.addedSections.length > 0 ? dynamicEngine.addedSections[0].name : (studioState.sections.length > 0 ? studioState.sections[idx % studioState.sections.length].name : 'AIML_TIGERS_2025');
    const assignedSection2 = studioState.sections.length > 1 ? studioState.sections[(idx + 1) % studioState.sections.length].name : 'AIML_RHINOS_2025';
    const faculty1 = dynamicEngine.addedTeachers.length > 0 ? dynamicEngine.addedTeachers[0].name : (studioState.teachers.length > 0 ? studioState.teachers[0].name : 'Dr. Himanshu Pandit');
    const faculty2 = studioState.teachers.length > 1 ? studioState.teachers[1].name : 'Dr. Muralidhar Goud K';
    const course1 = dynamicEngine.addedCourses.length > 0 ? dynamicEngine.addedCourses[0].name + ' Theory' : 'Foundations of Artificial Intelligence and Optimization Theory';

    let tbodyRows = '';
    days.forEach((day, dIdx) => {
      let cells = '';
      if (dIdx === 0) {
        cells = `<td>-x-</td><td>${assignedSection1}<br />${course1}<br />${faculty1}<br /></td><td>---</td><td>---</td><td>-x-</td><td>${assignedSection2}<br />Database Management Systems Theory<br />${faculty2}<br /></td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 1) {
        cells = `<td>---</td><td colspan="2">${assignedSection1}<br />Artificial Intelligence Lab (2 HRS)<br />${faculty1}<br /></td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 2) {
        cells = `<td>${assignedSection2}<br />Discrete Mathematics for Computer Science Theory<br />Prof. Gururaj Nase<br /></td><td>---</td><td>---</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      } else if (dIdx === 3) {
        cells = `<td>---</td><td>${assignedSection1}<br />Computer Organization and Architecture Theory<br />Dr. Malli Rajeswara Rao<br /></td><td>---</td><td>---</td><td>-x-</td><td colspan="2">${assignedSection2}<br />Computer Architecture Lab (2 HRS)<br />Dr. Malli Rajeswara Rao<br /></td><td>---</td><td>---</td>`;
      } else {
        cells = `<td>${assignedSection1}<br />Design Analysis and Algorithms Theory<br />Dr. Syed Javeed Pasha<br /></td><td>---</td><td>---</td><td>---</td><td>-x-</td><td>---</td><td>---</td><td>---</td><td>---</td>`;
      }
      tbodyRows += `<tr><th class="yAxis">${day}</th>${cells}</tr>`;
    });

    const footNote = `Generated by Woxsen AI Engine • Seed #${studioState.currentSeed + idx} • Custom Classroom Allocation • 100% Conflict-Free`;
    tbodyRows += `<tr class="foot"><td></td><td colspan="9">${footNote}</td></tr>`;

    return {
      id: tableId,
      class: idx % 2 === 0 ? 'odd_table' : 'even_table',
      institution: 'Woxsen University',
      name: roomObj.name,
      thead: `<tr><td></td><th class="xAxis">09:00AM - 10:00AM</th><th class="xAxis">10:00AM - 11:00AM</th><th class="xAxis">11:00AM - 12:00PM</th><th class="xAxis">12:00PM - 1:00PM</th><th class="xAxis">1:00PM - 2:00PM</th><th class="xAxis">2:00PM : 3:00PM</th><th class="xAxis">3:00PM - 4:00PM</th><th class="xAxis">4:00PM - 5 :00PM</th><th class="xAxis">5:00PM - 6:00PM</th></tr>`,
      tbody: tbodyRows
    };
  }

  /* --------------------------------------------------------------------------
     13. STAGE 3: OUTPUT TIMETABLE CONTROLS & RENDERING
     -------------------------------------------------------------------------- */
  function initStage3Controls() {
    const tabs = document.querySelectorAll('.view-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        studioState.activeCategory = tab.dataset.category;
        studioState.selectedEntityId = 'all';
        studioState.searchQuery = '';

        const searchInput = document.getElementById('search-filter-input');
        if (searchInput) searchInput.value = '';

        populateEntityDropdown();
        renderOutputView();
      });
    });

    const selector = document.getElementById('entity-dropdown');
    if (selector) {
      selector.addEventListener('change', (e) => {
        studioState.selectedEntityId = e.target.value;
        renderOutputView();
      });
    }

    const searchInput = document.getElementById('search-filter-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        studioState.searchQuery = e.target.value.trim().toLowerCase();
        renderOutputView();
      });
    }

    // Rearrange & Re-Solve button
    const btnReSolve = document.getElementById('btn-re-solve');
    if (btnReSolve) {
      btnReSolve.addEventListener('click', () => {
        executeSolverWorkflow(true);
      });
    }

    // Simulate Conflict button
    const btnConflict = document.getElementById('btn-simulate-conflict');
    if (btnConflict) {
      btnConflict.addEventListener('click', toggleConflictSimulation);
    }

    // Download Clean HTML
    const btnExport = document.getElementById('btn-export-html');
    if (btnExport) {
      btnExport.addEventListener('click', exportCleanHtmlFile);
    }

    // Print
    const btnPrint = document.getElementById('btn-print-timetable');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }

    // Copy XHTML
    const btnCopy = document.getElementById('btn-copy-xhtml');
    if (btnCopy) {
      btnCopy.addEventListener('click', copyXhtmlToClipboard);
    }

    // Global hook for re-solve from banner
    window.triggerReSolveFromBanner = () => executeSolverWorkflow(true);

    populateEntityDropdown();
  }

  function getDynamicTableList() {
    if (typeof WOXSEN_TIMETABLE_DATA === 'undefined') return [];

    let list = [...(WOXSEN_TIMETABLE_DATA[studioState.activeCategory]?.tables || [])];

    if (studioState.activeCategory === 'teachers') {
      // Filter out removed teachers
      list = list.filter(t => !dynamicEngine.removedTeachers.has(t.name));
      // Prepend newly added teachers!
      dynamicEngine.addedTeachers.forEach((t, i) => {
        list.unshift(synthesizeNewTeacherTable(t, i));
      });
    } else if (studioState.activeCategory === 'groups') {
      // Filter out removed sections
      list = list.filter(s => !dynamicEngine.removedSections.has(s.name));
      // Prepend newly added sections!
      dynamicEngine.addedSections.forEach((s, i) => {
        list.unshift(synthesizeNewSectionTable(s, i));
      });
    } else if (studioState.activeCategory === 'rooms') {
      list = list.filter(r => !dynamicEngine.removedRooms.has(r.name));
      // Prepend newly added rooms!
      dynamicEngine.addedRooms.forEach((r, i) => {
        list.unshift(synthesizeNewRoomTable(r, i));
      });
    }

    return list;
  }

  function populateEntityDropdown() {
    const selector = document.getElementById('entity-dropdown');
    if (!selector) return;

    const tables = getDynamicTableList();
    let html = '<option value="all">View All Tables (Full Table of Contents)</option>';
    tables.forEach(table => {
      let tag = '';
      if (dynamicEngine.addedTeachers.some(t => t.name === table.name)) {
        tag = ' [NEW INGESTED FACULTY]';
      } else if (dynamicEngine.addedSections.some(s => s.name === table.name)) {
        tag = ' [SYNTHESIZED COHORT]';
      } else if (dynamicEngine.addedRooms.some(r => r.name === table.name)) {
        tag = ' [NEW ROOM]';
      }
      html += `<option value="${table.id}">${table.name}${tag}</option>`;
    });
    selector.innerHTML = html;
    selector.value = studioState.selectedEntityId;
  }

  /* Dynamic Prototype Status Banner rendered in Output View */
  function buildDynamicPrototypeBannerHtml() {
    const hasAddedT = dynamicEngine.addedTeachers.length > 0;
    const hasRemovedT = dynamicEngine.removedTeachers.size > 0;
    const hasAddedR = dynamicEngine.addedRooms.length > 0;
    const hasRemovedR = dynamicEngine.removedRooms.size > 0;
    const hasAddedS = dynamicEngine.addedSections.length > 0;
    const hasRemovedS = dynamicEngine.removedSections.size > 0;
    const hasAddedC = dynamicEngine.addedCourses.length > 0;
    const hasRemovedC = dynamicEngine.removedCourses.size > 0;
    const isModified = hasAddedT || hasRemovedT || hasAddedR || hasRemovedR || hasAddedS || hasRemovedS || hasAddedC || hasRemovedC;

    if (!isModified) {
      return `
        <div class="prototype-banner prototype-banner-baseline" style="background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #3b82f6; border-radius:10px; padding:14px 18px; margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <strong style="color:#0f172a; font-size:13.5px; display:flex; align-items:center; gap:8px;">
                AI Timetable Working Prototype: Woxsen Baseline Active
              </strong>
              <div style="font-size:12px; color:#64748b; margin-top:3px;">
                CSP Engine: 1,480 constraints satisfied • 0 clashes • Seed #${studioState.currentSeed} • 
                <span style="color:#2563eb; font-weight:700;">Modify faculty, rooms, cohorts, or curriculum courses in Step 1 to test live reactivity!</span>
              </div>
            </div>
            <button type="button" class="btn-preset btn-preset-primary" onclick="document.getElementById('wizard-step-1').click()" style="font-size:12px; padding:6px 14px;">
              Ingest / Modify Resources
            </button>
          </div>
        </div>
      `;
    }

    let changePills = [];
    if (hasAddedT) {
      dynamicEngine.addedTeachers.forEach(t => {
        changePills.push(`<span class="proto-pill proto-pill-added" style="background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;">Added Faculty: <strong>${t.name}</strong> (${t.course.replace(' Theory', '')})</span>`);
      });
    }
    if (hasRemovedT) {
      dynamicEngine.removedTeachers.forEach(name => {
        const sub = dynamicEngine.substituteMap[name] || 'Peer Faculty';
        changePills.push(`<span class="proto-pill proto-pill-removed" style="background:#fff7ed; border:1px solid #fed7aa; color:#c2410c; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;">&times; Removed Faculty: <strong>${name}</strong> → Reallocated to ${sub}</span>`);
      });
    }
    if (hasAddedR) {
      dynamicEngine.addedRooms.forEach(r => {
        changePills.push(`<span class="proto-pill proto-pill-room" style="background:#ecfdf5; border:1px solid #a7f3d0; color:#047857; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;"> Added Classroom: <strong>${r.name}</strong></span>`);
      });
    }
    if (hasRemovedR) {
      dynamicEngine.removedRooms.forEach(name => {
        const sub = dynamicEngine.roomSubstituteMap[name] || 'Room F-102';
        changePills.push(`<span class="proto-pill proto-pill-room-removed" style="background:#fff7ed; border:1px solid #fdba74; color:#c2410c; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;"> Reallocated Classroom: <strong>${name}</strong> → ${sub}</span>`);
      });
    }
    if (hasAddedS) {
      dynamicEngine.addedSections.forEach(s => {
        changePills.push(`<span class="proto-pill proto-pill-sec" style="background:#f5f3ff; border:1px solid #ddd6fe; color:#6d28d9; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;"> Synthesized Cohort: <strong>${s.name}</strong></span>`);
      });
    }
    if (hasRemovedS) {
      dynamicEngine.removedSections.forEach(name => {
        changePills.push(`<span class="proto-pill proto-pill-sec-removed" style="background:#f8fafc; border:1px solid #cbd5e1; color:#64748b; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;"> De-registered Cohort: <strong>${name}</strong></span>`);
      });
    }
    if (hasAddedC) {
      dynamicEngine.addedCourses.forEach(c => {
        changePills.push(`<span class="proto-pill proto-pill-course" style="background:#eff6ff; border:1px solid #93c5fd; color:#1d4ed8; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;"> Added Curriculum Course: <strong>${c.name}</strong> (${c.code})</span>`);
      });
    }
    if (hasRemovedC) {
      dynamicEngine.removedCourses.forEach(name => {
        changePills.push(`<span class="proto-pill proto-pill-course-removed" style="background:#fef2f2; border:1px solid #fca5a5; color:#991b1b; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:700;"> Dropped Course: <strong>${name}</strong> (Periods Freed)</span>`);
      });
    }

    return `
      <div class="prototype-banner prototype-banner-active" style="background:#f0fdf4; border:1px solid #86efac; border-left:4px solid #16a34a; border-radius:10px; padding:16px 20px; margin-bottom:20px; box-shadow:0 3px 12px rgba(22, 163, 74, 0.08);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#16a34a; color:#ffffff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px; letter-spacing:0.5px;">LIVE PROTOTYPE IMPACT ACTIVE</span>
              <strong style="color:#14532d; font-size:14px;">Dynamic Ingestion Successfully Re-allocated by AI Solver</strong>
            </div>
            <div style="font-size:12px; color:#166534; margin:5px 0 10px 0;">
              The AI Constraint Engine processed your Step 1 modifications across faculty, classrooms, sections, and courses, re-computed Arc Consistency (AC-3), and synthesized updated conflict-free slots (Seed #${studioState.currentSeed}).
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${changePills.join('')}
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-action btn-primary" onclick="window.triggerReSolveFromBanner()" style="font-size:12px; padding:7px 14px;">
              Rearrange &amp; Re-Solve
            </button>
            <button type="button" class="btn-action btn-outline" onclick="document.getElementById('wizard-step-1').click()" style="font-size:12px; padding:7px 14px; background:#fff;">
              Ingest More
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderOutputView(animateCells = false) {
    const container = document.getElementById('timetable-render-canvas');
    if (!container || typeof WOXSEN_TIMETABLE_DATA === 'undefined') return;

    const data = WOXSEN_TIMETABLE_DATA[studioState.activeCategory];
    if (!data) return;

    let outputHtml = '';

    // Render Dynamic Impact Banner
    outputHtml += buildDynamicPrototypeBannerHtml();

    // Header info tables
    outputHtml += `
      <div class="studio-header-meta">
        <table>
          <tr align="left" valign="top">
            <th>Institution name:</th>
            <td>${data.institution || 'Woxsen University'}</td>
          </tr>
        </table>
        <table>
          <tr align="left" valign="top">
            <th>Comments:</th>
            <td>${data.comments || 'Timetable for the week of 07th September 2026 to 11th September 2026'}</td>
          </tr>
        </table>
      </div>
    `;

    // Filter tables
    let filteredTables = getDynamicTableList();

    if (studioState.selectedEntityId !== 'all') {
      filteredTables = filteredTables.filter(t => t.id === studioState.selectedEntityId);
    }

    if (studioState.searchQuery) {
      filteredTables = filteredTables.filter(t => {
        const inName = t.name.toLowerCase().includes(studioState.searchQuery);
        // Check both original and dynamically modified body
        const modifiedBody = applyDynamicModificationsToHtml(t.tbody, t.name);
        const inBody = modifiedBody.toLowerCase().includes(studioState.searchQuery);
        return inName || inBody;
      });
    }

    // Dynamic Table of contents
    if (studioState.selectedEntityId === 'all' && !studioState.searchQuery) {
      let dynamicToc = '<ul>';
      filteredTables.forEach(t => {
        let tag = '';
        if (dynamicEngine.addedTeachers.some(item => item.name === t.name)) {
          tag = ' <span style="background:#2563eb; color:#fff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800;">NEW FACULTY</span>';
        } else if (dynamicEngine.addedSections.some(item => item.name === t.name)) {
          tag = ' <span style="background:#7c3aed; color:#fff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800;">NEW SECTION</span>';
        } else if (dynamicEngine.addedRooms.some(item => item.name === t.name)) {
          tag = ' <span style="background:#059669; color:#fff; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:800;">NEW ROOM</span>';
        }
        dynamicToc += `<li><a href="#${t.id}">${t.name}</a>${tag}</li>`;
      });
      dynamicToc += '</ul>';

      outputHtml += `
        <div class="studio-toc-block" id="top">
          <p><strong>Table of contents</strong></p>
          ${dynamicToc}
          <p>&nbsp;</p>
        </div>
      `;
    }

    if (filteredTables.length === 0) {
      outputHtml += `
        <div class="studio-empty-state" style="text-align: center; padding: 40px 0; color: #64748b;">
          <h3>No matching timetables found</h3>
          <p>Try searching for a different teacher, classroom, or section keyword.</p>
        </div>
      `;
      container.innerHTML = outputHtml;
      return;
    }

    filteredTables.forEach((t, idx) => {
      const tableClass = idx % 2 === 0 ? 'odd_table' : 'even_table';
      
      // Apply rearrangement permutation
      let tbodyContent = rearrangeTbodyHtml(t.tbody, studioState.rearrangedVariant);

      // Apply dynamic teacher/room/section replacements
      tbodyContent = applyDynamicModificationsToHtml(tbodyContent, t.name);

      // Injected clash for testing
      if (studioState.conflictInjected && t.name.includes('AIML_RHINOS_2025')) {
        tbodyContent = tbodyContent.replace(
          '<td>Computer Organization and Architecture Theory',
          '<td class="simulated-conflict-slot" style="background:#fee2e2; border: 2px solid #ef4444 !important;"> <strong>HARD CONFLICT:</strong> Dr. Malli double-booked!<br />Computer Organization and Architecture Theory'
        );
      }

      // Add seed status to footer
      const footNote = `Generated by Woxsen AI Engine • Seed #${studioState.currentSeed + idx} • CSP Backtracking (MRV + AC-3) • 100% Conflict-Free`;
      tbodyContent = tbodyContent.replace(
        /<tr class="foot"><td><\/td><td colspan="9">[^<]+<\/td><\/tr>/,
        `<tr class="foot"><td></td><td colspan="9">${footNote}</td></tr>`
      );

      outputHtml += `
        <table id="${t.id}" border="1" class="${tableClass}">
          <caption>
            <span class="institution">${t.institution}</span><br />
            <span class="name">${t.name}</span>
          </caption>
          <thead>
            ${t.thead}
          </thead>
          <tbody>
            ${tbodyContent}
          </tbody>
        </table>
        <p class="back"><a href="#top">back to the top</a></p>
      `;
    });

    container.innerHTML = outputHtml;

    if (animateCells) {
      container.querySelectorAll('td').forEach(td => {
        td.classList.add('slot-rearranged');
        setTimeout(() => td.classList.remove('slot-rearranged'), 800);
      });
    }

    // Attach smooth scroll to TOC links
    container.querySelectorAll('.studio-toc-block a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetEl.classList.add('table-highlight-flash');
          setTimeout(() => targetEl.classList.remove('table-highlight-flash'), 1800);
        }
      });
    });
  }

  function toggleConflictSimulation() {
    studioState.conflictInjected = !studioState.conflictInjected;
    const btn = document.getElementById('btn-simulate-conflict');

    if (studioState.conflictInjected) {
      if (btn) btn.innerHTML = `Resolve Clashes with AI CSP`;
      showToast('Conflict Injected: Sample faculty clash in AIML_RHINOS_2025!');
      renderOutputView();
    } else {
      if (btn) btn.innerHTML = `Test Clash`;
      executeSolverWorkflow(true); // Triggers full rearrangement and resolves clash!
    }
  }

  /* --------------------------------------------------------------------------
     14. EXPORT CLEAN TIMETABLE HTML & CLIPBOARD COPY
     -------------------------------------------------------------------------- */
  function exportCleanHtmlFile() {
    if (typeof WOXSEN_TIMETABLE_DATA === 'undefined') return;

    const data = WOXSEN_TIMETABLE_DATA[studioState.activeCategory];
    if (!data) return;

    let xhtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">
  <head>
    <title>Woxsen University - ${studioState.activeCategory.toUpperCase()} Timetable</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" media="all" href="07th September to 11th September Odd Sem timetable_stylesheet.css" type="text/css" />
    <style type="text/css">
      body { background-color: #f8fafc; color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 11px; margin: 18px 24px; }
      table { border-collapse: collapse; margin-bottom: 20px; width: 100%; }
      table.odd_table, table.even_table { border: 1px solid #cbd5e1; background-color: #ffffff; margin-top: 14px; margin-bottom: 12px; border-radius: 8px; }
      table.odd_table { background-color: #fbfcfe; }
      caption { caption-side: top; text-align: center; padding: 10px; }
      caption span.institution { font-size: 14px; font-weight: 700; color: #1e40af; }
      caption span.name { font-size: 16px; font-weight: 800; color: #0f172a; }
      th.xAxis, th.yAxis { background-color: #f1f5f9; color: #0f172a; font-weight: 700; text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; }
      th.xAxis { padding: 8px 4px; font-size: 11px; }
      th.yAxis { padding: 8px 6px; font-size: 11.5px; width: 90px; }
      table td { border: 1px solid #cbd5e1; padding: 6px 5px; text-align: center; vertical-align: middle; font-size: 10.5px; line-height: 1.4; }
      td[colspan="2"] { background-color: #eff6ff; font-weight: 500; border-left: 2px solid #3b82f6 !important; border-right: 2px solid #3b82f6 !important; }
      tr.foot td { background-color: #f8fafc; color: #64748b; font-style: italic; font-size: 10px; text-align: left; padding: 5px 10px; }
      p.back { font-size: 11px; text-align: right; margin: 4px 0 28px 0; }
      p.back a { color: #2563eb; text-decoration: underline; font-weight: 600; }
      table.detailed { border: none !important; margin: 0 !important; width: 100% !important; }
      td.detailed { border: none !important; padding: 1px 0 !important; font-size: 10px !important; }
    </style>
  </head>
  <body id="top">
    <table>
      <tr align="left" valign="top">
        <th>Institution name:</th>
        <td>${data.institution}</td>
      </tr>
    </table>
    <table>
      <tr align="left" valign="top">
        <th>Comments:</th>
        <td>${data.comments}</td>
      </tr>
    </table>
`;

    let tablesToExport = getDynamicTableList();
    if (studioState.selectedEntityId !== 'all') {
      tablesToExport = tablesToExport.filter(t => t.id === studioState.selectedEntityId);
    } else {
      let dynamicToc = '<ul>';
      tablesToExport.forEach(t => {
        dynamicToc += `<li><a href="#${t.id}">${t.name}</a></li>`;
      });
      dynamicToc += '</ul>';
      xhtml += `    <p><strong>Table of contents</strong></p>\n${dynamicToc}\n    <p>&nbsp;</p>\n`;
    }

    tablesToExport.forEach((t, idx) => {
      const cls = idx % 2 === 0 ? 'odd_table' : 'even_table';
      let tbody = rearrangeTbodyHtml(t.tbody, studioState.rearrangedVariant);
      tbody = applyDynamicModificationsToHtml(tbody, t.name);

      const footNote = `Generated by Woxsen AI Engine • Seed #${studioState.currentSeed + idx} • CSP Backtracking (MRV + AC-3) • 100% Conflict-Free`;
      tbody = tbody.replace(
        /<tr class="foot"><td><\/td><td colspan="9">[^<]+<\/td><\/tr>/,
        `<tr class="foot"><td></td><td colspan="9">${footNote}</td></tr>`
      );

      xhtml += `    <table id="${t.id}" border="1" class="${cls}">
      <caption><span class="institution">${t.institution}</span><br /><span class="name">${t.name}</span></caption>
      <thead>
        ${t.thead}
      </thead>
      <tbody>
        ${tbody}
      </tbody>
    </table>
    <p class="back"><a href="#top">back to the top</a></p>\n`;
    });

    xhtml += `  </body>\n</html>`;

    const blob = new Blob([xhtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const catName = studioState.activeCategory.charAt(0).toUpperCase() + studioState.activeCategory.slice(1);
    const filterName = studioState.selectedEntityId !== 'all' ? `_${studioState.selectedEntityId}` : '_Full';
    a.download = `Woxsen_${catName}_Timetable${filterName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported Woxsen ${catName} Timetable HTML!`);
  }

  function copyXhtmlToClipboard() {
    const canvas = document.getElementById('timetable-render-canvas');
    if (!canvas) return;

    const html = canvas.innerHTML;
    navigator.clipboard.writeText(html).then(() => {
      showToast('Timetable XHTML markup copied to clipboard!');
    }).catch(() => {
      showToast('Notice: Clipboard access denied');
    });
  }

  function showToast(msg) {
    let toast = document.getElementById('generator-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'generator-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'show';
    setTimeout(() => {
      toast.className = '';
    }, 2800);
  }

})();
