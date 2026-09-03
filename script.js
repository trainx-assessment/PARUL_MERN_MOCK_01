const form = document.querySelector('#studentForm');
const studentContainer = document.querySelector('#studentContainer');
const studentCountEl = document.querySelector('#studentCount');
const emptyState = document.querySelector('#emptyState');

const nameInput = document.querySelector('#studentName');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const dobInput = document.querySelector('#dob');
const courseInput = document.querySelector('#course');
const aboutInput = document.querySelector('#about');
const photoInput = document.querySelector('#photo');

const students = [];
let nextId = 1;

const NAME_REGEX = /^[A-Za-z\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\d{10}$/;

function setError(fieldKey, message) {
  const errorEl = document.querySelector(`#err-${fieldKey}`);
  if (errorEl) errorEl.textContent = message;

  const input = document.querySelector(`#${fieldKey}`) ||
    document.querySelector(`[name="${fieldKey}"]`);
  const fieldWrap = input ? input.closest('.field') : errorEl?.closest('.field');
  if (fieldWrap) fieldWrap.classList.toggle('has-error', Boolean(message));
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('.field.has-error').forEach(el => el.classList.remove('has-error'));
}

function validateForm() {
  let isValid = true;

  const name = nameInput.value.trim();
  if (name === '') {
    setError('studentName', 'Student name is required.');
    isValid = false;
  } else if (name.length < 3) {
    setError('studentName', 'Name must be at least 3 characters long.');
    isValid = false;
  } else if (!NAME_REGEX.test(name)) {
    setError('studentName', 'Only letters and spaces are allowed.');
    isValid = false;
  }

  const email = emailInput.value.trim();
  if (email === '') {
    setError('email', 'Email is required.');
    isValid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    setError('email', 'Enter a valid email address.');
    isValid = false;
  }

  const phone = phoneInput.value.trim();
  if (phone === '') {
    setError('phone', 'Phone number is required.');
    isValid = false;
  } else if (!PHONE_REGEX.test(phone)) {
    setError('phone', 'Phone number must be exactly 10 digits.');
    isValid = false;
  }

  const dobValue = dobInput.value;
  if (dobValue === '') {
    setError('dob', 'Date of birth is required.');
    isValid = false;
  } else {
    const dobDate = new Date(dobValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate > today) {
      setError('dob', 'Date of birth cannot be in the future.');
      isValid = false;
    }
  }

  const genderChecked = document.querySelector('input[name="gender"]:checked');
  if (!genderChecked) {
    setError('gender', 'Please select a gender.');
    isValid = false;
  }

  if (courseInput.value === '') {
    setError('course', 'Please select a course.');
    isValid = false;
  }

  const skillsChecked = document.querySelectorAll('input[name="skills"]:checked');
  if (skillsChecked.length === 0) {
    setError('skills', 'Select at least one skill.');
    isValid = false;
  }

  const about = aboutInput.value.trim();
  if (about === '') {
    setError('about', 'Please write a short note about the student.');
    isValid = false;
  }

  if (!photoInput.files || photoInput.files.length === 0) {
    setError('photo', 'Please choose a profile photo.');
    isValid = false;
  }

  return isValid;
}

function initials(name) {
  return name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
}

function createStudentCard(student) {
  const card = document.createElement('div');
  card.classList.add('student-card');
  card.setAttribute('data-id', student.id);

  const top = document.createElement('div');
  top.classList.add('card-top');

  if (student.photo) {
    const img = document.createElement('img');
    img.classList.add('avatar');
    img.src = student.photo;
    img.alt = student.name;
    top.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.classList.add('avatar-fallback');
    fallback.textContent = initials(student.name);
    top.appendChild(fallback);
  }

  const nameWrap = document.createElement('div');
  const nameEl = document.createElement('div');
  nameEl.classList.add('name');
  nameEl.textContent = student.name;

  const coursePill = document.createElement('span');
  coursePill.classList.add('course-pill');
  coursePill.textContent = student.course;

  nameWrap.appendChild(nameEl);
  nameWrap.appendChild(coursePill);
  top.appendChild(nameWrap);
  card.appendChild(top);

  const infoRows = [
    ['Email', student.email],
    ['Phone', student.phone],
    ['DOB', student.dob],
    ['Gender', student.gender],
  ];
  infoRows.forEach(([label, value]) => {
    const line = document.createElement('div');
    line.classList.add('info-line');

    const k = document.createElement('span');
    k.classList.add('k');
    k.textContent = `${label}:`;

    const v = document.createElement('span');
    v.textContent = value;

    line.appendChild(k);
    line.appendChild(v);
    card.appendChild(line);
  });

  const skillsWrap = document.createElement('div');
  skillsWrap.classList.add('skills');
  student.skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.classList.add('skill-tag');
    tag.textContent = skill;
    skillsWrap.appendChild(tag);
  });
  card.appendChild(skillsWrap);

  const about = document.createElement('p');
  about.classList.add('about-text');
  about.textContent = student.about;
  card.appendChild(about);

  const footer = document.createElement('div');
  footer.classList.add('card-footer');

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Delete';

  footer.appendChild(deleteBtn);
  card.appendChild(footer);

  return card;
}

function updateStudentCount() {
  studentCountEl.textContent = students.length;
  if (emptyState) emptyState.style.display = students.length === 0 ? 'block' : 'none';
}

function resetForm() {
  form.reset();
  clearAllErrors();
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
    .map(input => input.value);
  const gender = document.querySelector('input[name="gender"]:checked').value;

  const baseStudent = {
    id: nextId++,
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    dob: dobInput.value,
    gender: gender,
    course: courseInput.value,
    skills: skills,
    about: aboutInput.value.trim(),
  };

  const file = photoInput.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const student = { ...baseStudent, photo: reader.result };
    students.push(student);

    const card = createStudentCard(student);
    studentContainer.appendChild(card);

    updateStudentCount();
    resetForm();
  };

  reader.readAsDataURL(file);
});

studentContainer.addEventListener('click', function (event) {
  const deleteBtn = event.target.closest('.delete-btn');
  if (!deleteBtn) return;

  const card = deleteBtn.closest('.student-card');
  if (!card) return;

  const id = Number(card.getAttribute('data-id'));

  const index = students.findIndex(student => student.id === id);
  if (index !== -1) students.splice(index, 1);

  card.remove();
  updateStudentCount();
});

updateStudentCount();