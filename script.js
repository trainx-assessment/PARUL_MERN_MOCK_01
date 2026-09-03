document.addEventListener('DOMContentLoaded', function () {
  const studentForm = document.getElementById('studentForm');
  const studentContainer = document.getElementById('studentContainer');
  const about = document.getElementById('about');
  const aboutCounter = document.getElementById('aboutCounter');
  const totalStudentsEl = document.getElementById('totalStudents');
  const registerBtn = document.getElementById('registerBtn');
  const searchInput = document.getElementById('searchInput');
  const courseFilter = document.getElementById('courseFilter');

  const students = [];
  let editingId = null;
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  function updateStatistics() {
    const courseNames = [
      'Web Development',
      'UI/UX',
      'Python',
      'Data Analytics',
      'MERN Stack',
      'Cloud Computing'
    ];

    if (totalStudentsEl) {
      totalStudentsEl.textContent = String(students.length);
    }

    courseNames.forEach(courseName => {
      const countEl = document.querySelector(`[data-course="${courseName}"]`);
      if (!countEl) return;
      const count = students.filter(student => student.course === courseName).length;
      countEl.textContent = String(count);
    });
  }

  function getNextStudentId() {
    if (!students.length) return 1;
    return Math.max(...students.map(student => student.id)) + 1;
  }

  function showError(el, message) {
    clearError(el);
    const msg = document.createElement('div');
    msg.className = 'error';
    msg.setAttribute('role', 'alert');
    msg.textContent = message;
  
    if (el instanceof HTMLFieldSetElement || el.tagName === 'FIELDSET') {
      el.appendChild(msg);
    } else if (el.parentNode) {
      el.parentNode.appendChild(msg);
    }
  }

  function clearError(el) {
    if (!el) return;
    const parent = el.parentNode || el;
    const existing = parent.querySelectorAll('.error');
    existing.forEach(n => n.remove());
  }

  function clearAllErrors() {
    document.querySelectorAll('.error').forEach(n => n.remove());
  }

  function validateName(val) {
    if (!val) return 'Student name is required.';
    const trimmed = val.trim();
    if (trimmed.length < 3) return 'Name must be at least 3 characters.';
    if (trimmed.length > 40) return 'Name must be at most 40 characters.';
    if (!/^[A-Za-z ]+$/.test(trimmed)) return 'Name can contain only letters and spaces.';
    return '';
  }

  function validateEmail(val) {
    if (!val) return 'Email is required.';
  
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) return 'Enter a valid email address.';
    return '';
  }

  function validatePhone(val) {
    if (!val) return 'Phone number is required.';
    if (!/^\d{10}$/.test(val)) return 'Phone must be exactly 10 digits.';
    return '';
  }

  function validateDOB(val) {
    if (!val) return 'Date of birth is required.';
    const dob = new Date(val);
    const now = new Date();
    if (dob > now) return 'Date of birth cannot be in the future.';

    const ageDifMs = now - dob;
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 15) return 'Student must be at least 15 years old.';
    return '';
  }

  function validateGender() {
    const sel = document.querySelector('input[name="gender"]:checked');
    if (!sel) return 'Please select a gender.';
    return '';
  }

  function validateCourse(val) {
    if (!val) return 'Please select a course.';
    return '';
  }

  function validateSkills() {
    const checked = document.querySelectorAll('input[name="skills"]:checked');
    if (!checked || checked.length === 0) return 'Select at least one skill.';
    return '';
  }

  function validateAbout(val) {
    if (!val) return 'About is required.';
    if (!val.trim()) return 'About cannot be spaces only.';
    if (val.trim().length < 20) return 'About must be at least 20 characters.';
    if (val.trim().length > 200) return 'About must be at most 200 characters.';
    return '';
  }

  function validatePhoto(input) {
    const file = input.files && input.files[0];
    if (!file) return 'Profile photo is required.';
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) return 'Only JPG / JPEG / PNG images are allowed.';
    return '';
  }

  function updateCounter() {
    if (!about || !aboutCounter) return;
    const len = about.value.length;
    aboutCounter.textContent = `${len} / 200`;
  }


  document.addEventListener('input', function (e) {
    const target = e.target;
    if (!target) return;
    if (target.id === 'about') updateCounter();

    if (target.name === 'skills' || target.name === 'gender') {

      const fs = target.closest('fieldset');
      if (fs) clearError(fs);
    } else {
      clearError(target);
    }
  });

  if (about) {
    updateCounter();
  }

  if (studentForm) {
    studentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors();

      const name = document.getElementById('studentName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const dob = document.getElementById('dob').value;
      const genderField = document.querySelector('input[name="gender"]:checked');
      const genderVal = genderField ? genderField.value : '';
      const course = document.getElementById('course').value;
      const aboutVal = about ? about.value : '';
      const skillsNodes = Array.from(document.querySelectorAll('input[name="skills"]:checked'));
      const skills = skillsNodes.map(n => n.value);
      const photoInput = document.getElementById('profilePhoto');

      let valid = true;

      const nameErr = validateName(name);
      if (nameErr) { showError(document.getElementById('studentName'), nameErr); valid = false; }

      const emailErr = validateEmail(email);
      if (emailErr) { showError(document.getElementById('email'), emailErr); valid = false; }

      const phoneErr = validatePhone(phone);
      if (phoneErr) { showError(document.getElementById('phone'), phoneErr); valid = false; }

      const dobErr = validateDOB(dob);
      if (dobErr) { showError(document.getElementById('dob'), dobErr); valid = false; }

      const genderErr = validateGender();
      if (genderErr) { const fs = document.querySelector('fieldset'); showError(fs, genderErr); valid = false; }

      const courseErr = validateCourse(course);
      if (courseErr) { showError(document.getElementById('course'), courseErr); valid = false; }

      const skillsErr = validateSkills();
      if (skillsErr) { const fs = Array.from(document.querySelectorAll('fieldset')).find(f => f.querySelector('input[name="skills"]')); showError(fs, skillsErr); valid = false; }

      const aboutErr = validateAbout(aboutVal);
      if (aboutErr) { showError(document.getElementById('about'), aboutErr); valid = false; }

    
      if (!editingId) {
        const photoErr = validatePhoto(photoInput);
        if (photoErr) { showError(photoInput, photoErr); valid = false; }
      }

      if (!valid) {
    
        return;
      }
  
      const file = photoInput.files && photoInput.files[0];

      function finishCreateOrUpdate(photoData) {
        if (!editingId) {
          const student = {
            id: getNextStudentId(),
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            dob: dob,
            gender: genderVal,
            course: course,
            skills: skills,
            about: aboutVal.trim(),
            photo: photoData || ''
          };
          students.push(student);
          renderStudentCard(student);
        } else {
          const student = students.find(s => s.id === editingId);
          if (!student) return;
          student.name = name.trim();
          student.email = email.trim();
          student.phone = phone.trim();
          student.dob = dob;
          student.gender = genderVal;
          student.course = course;
          student.skills = skills;
          student.about = aboutVal.trim();
          if (photoData) student.photo = photoData;
          updateStudentCard(student);
          editingId = null;
          if (registerBtn) registerBtn.textContent = 'Register Student';
        }

        updateStatistics();
          studentForm.reset();
          updateCounter();
          clearAllErrors();
        
          const photoInputEl = document.getElementById('profilePhoto');
          if (photoInputEl) photoInputEl.value = '';
          editingId = null;
          if (registerBtn) registerBtn.textContent = 'Register Student';
      }

      if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          finishCreateOrUpdate(ev.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        
        finishCreateOrUpdate(null);
      }
    });
  }

  
  if (studentForm) {
    studentForm.addEventListener('reset', function () {
      editingId = null;
      if (registerBtn) registerBtn.textContent = 'Register Student';
      updateCounter();
      
      clearAllErrors();
      
      const photoInputEl = document.getElementById('profilePhoto');
      if (photoInputEl) photoInputEl.value = '';
    });
  }

  function createStudentCardElement(student) {
    const card = document.createElement('article');
    card.className = 'student-card';
    card.dataset.id = String(student.id);

    const photoWrap = document.createElement('div');
    photoWrap.className = 'student-photo-wrap';

    const img = document.createElement('img');
    img.src = student.photo;
    img.alt = `${student.name} photo`;

    const heading = document.createElement('h3');
    heading.textContent = student.name;

    photoWrap.appendChild(img);
    photoWrap.appendChild(heading);

    const info = document.createElement('div');
    info.className = 'student-info';

    const email = document.createElement('p');
    email.innerHTML = `<strong>Email:</strong> ${student.email}`;

    const phone = document.createElement('p');
    phone.innerHTML = `<strong>Phone:</strong> ${student.phone}`;

    const dob = document.createElement('p');
    const dobDate = new Date(student.dob);
    const formattedDob = !isNaN(dobDate.getTime())
      ? dobDate.toLocaleDateString('en-GB')
      : student.dob;
    dob.innerHTML = `<strong>DOB:</strong> ${formattedDob}`;

    const gender = document.createElement('p');
    gender.innerHTML = `<strong>Gender:</strong> ${student.gender}`;

    const course = document.createElement('p');
    course.innerHTML = `<strong>Course:</strong> ${student.course}`;

    const skillsWrap = document.createElement('p');
    skillsWrap.innerHTML = `<strong>Skills:</strong> ${student.skills.join(', ')}`;

    const about = document.createElement('p');
    about.innerHTML = `<strong>About:</strong> ${student.about}`;

    info.appendChild(email);
    info.appendChild(phone);
    info.appendChild(dob);
    info.appendChild(gender);
    info.appendChild(course);
    info.appendChild(skillsWrap);
    info.appendChild(about);

    const actions = document.createElement('div');
    actions.className = 'student-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(photoWrap);
    card.appendChild(info);
    card.appendChild(actions);

    return card;
  }

  function renderStudentCard(student) {
    if (!studentContainer) return;
    const card = createStudentCardElement(student);
    studentContainer.prepend(card);
    
    applySearchFilter();
  }

  function updateStudentCard(student) {
    if (!studentContainer) return;
    const existing = studentContainer.querySelector(`.student-card[data-id="${student.id}"]`);
    const newCard = createStudentCardElement(student);
    if (existing && existing.parentNode) {
      existing.parentNode.replaceChild(newCard, existing);
      applySearchFilter();
    }
  }

  function applySearchFilter() {
    if (!studentContainer) return;
    const q = searchInput && searchInput.value ? searchInput.value.trim().toLowerCase() : '';
    const selectedCourse = courseFilter && courseFilter.value ? courseFilter.value.trim().toLowerCase() : 'all';
    const cards = Array.from(studentContainer.querySelectorAll('.student-card'));
    let visible = 0;
    cards.forEach(card => {
      const nameEl = card.querySelector('h3');
      const name = nameEl ? nameEl.textContent.trim().toLowerCase() : '';
      const id = parseInt(card.dataset.id, 10);
      const student = Number.isNaN(id) ? null : students.find(s => s.id === id);
      const course = student && student.course ? student.course.trim().toLowerCase() : '';

      const matchesName = !q || name.includes(q);
      const matchesCourse = !selectedCourse || selectedCourse === 'all' || course === selectedCourse;

      if (matchesName && matchesCourse) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    const noClass = 'no-students-found';
    let noEl = studentContainer.querySelector('.' + noClass);
    if (visible === 0) {
      if (!noEl) {
        noEl = document.createElement('div');
        noEl.className = noClass;
        noEl.textContent = 'No students found';
        studentContainer.appendChild(noEl);
      }
    } else {
      if (noEl) noEl.remove();
    }
  }

  function fillFormWithStudent(student) {
    const nameEl = document.getElementById('studentName');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const dobEl = document.getElementById('dob');
    const courseEl = document.getElementById('course');
    const aboutEl = document.getElementById('about');
    const photoInput = document.getElementById('profilePhoto');

    if (nameEl) nameEl.value = student.name || '';
    if (emailEl) emailEl.value = student.email || '';
    if (phoneEl) phoneEl.value = student.phone || '';
    if (dobEl) dobEl.value = student.dob || '';
    if (courseEl) courseEl.value = student.course || '';
    if (aboutEl) aboutEl.value = student.about || '';
    updateCounter();


    const genderInput = document.querySelector(`input[name="gender"][value="${student.gender}"]`);
    if (genderInput) genderInput.checked = true;


    document.querySelectorAll('input[name="skills"]').forEach(n => {
      n.checked = student.skills && student.skills.includes(n.value);
    });


    if (photoInput) photoInput.value = '';

    editingId = student.id;
    if (registerBtn) registerBtn.textContent = 'Update Student';
  }


  if (studentContainer) {
    studentContainer.addEventListener('click', function (e) {
      const editBtn = e.target.closest('.edit-btn');
      if (editBtn) {
        const card = editBtn.closest('.student-card');
        if (!card) return;
        const id = parseInt(card.dataset.id, 10);
        if (Number.isNaN(id)) return;
        const student = students.find(s => s.id === id);
        if (!student) return;
        fillFormWithStudent(student);
      
        const nameEl = document.getElementById('studentName');
        if (nameEl) nameEl.focus();
        return;
      }

      const delBtn = e.target.closest('.delete-btn');
      if (!delBtn) return;


      const ok = confirm('Are you sure you want to delete this student?');
      if (!ok) return;

      const card = delBtn.closest('.student-card');
      if (!card) return;

      const id = parseInt(card.dataset.id, 10);
      if (Number.isNaN(id)) return;

      const idx = students.findIndex(s => s.id === id);
      if (idx === -1) return;


      students.splice(idx, 1);
      card.remove();
      updateStatistics();
      applySearchFilter();
    });
  }

  
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      applySearchFilter();
    });
  }


  if (courseFilter) {
    courseFilter.addEventListener('change', function () {
      applySearchFilter();
    });
  }


  function updateThemeToggleText() {
    if (!themeToggleBtn) return;
    themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  }

  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
  } catch (e) {

  }

  updateThemeToggleText();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
      updateThemeToggleText();
    });
  }
});
