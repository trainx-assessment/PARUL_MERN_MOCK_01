const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const studentEmailInput = document.getElementById('studentEmail');
const studentPhoneInput = document.getElementById('studentPhone');
const studentDobInput = document.getElementById('studentDob');
const studentCourseSelect = document.getElementById('studentCourse');
const aboutStudentInput = document.getElementById('aboutStudent');
const profilePhotoInput = document.getElementById('profilePhoto');
const studentContainer = document.getElementById('studentContainer');
const searchInput = document.getElementById('searchInput');
const courseFilter = document.getElementById('courseFilter');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const themeToggle = document.getElementById('themeToggle');
const totalStudentsEl = document.getElementById('totalStudents');
const charCounter = document.getElementById('aboutCounter');

const students = JSON.parse(localStorage.getItem('students')) || [];
let editingStudentId = null;

const courseOptions = [
  'Web Development',
  'UI/UX',
  'Python',
  'Data Analytics',
  'MERN Stack',
  'Cloud Computing',
];

function setError(id, message) {
  const errorElement = document.getElementById(id);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(id) {
  setError(id, '');
}

function clearAllErrors() {
  const errorIds = [
    'studentNameError',
    'studentEmailError',
    'studentPhoneError',
    'studentDobError',
    'genderError',
    'courseError',
    'skillsError',
    'aboutError',
    'photoError',
  ];

  errorIds.forEach(clearError);
}

function getSelectedSkills() {
  return [...document.querySelectorAll('input[name="skills"]:checked')].map((checkbox) => checkbox.value);
}

function validateName(name) {
  return /^[A-Za-z ]{3,40}$/.test(name.trim()) && name.trim().length >= 3 && name.trim().length <= 40;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePhone(phone) {
  return /^\d{10}$/.test(phone.trim());
}

function validateDob(dateString) {
  if (!dateString) return false;

  const selectedDate = new Date(dateString);
  const today = new Date();

  if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) {
    return false;
  }

  const ageInMilliseconds = today.getTime() - selectedDate.getTime();
  const fifteenYearsInMilliseconds = 15 * 365.25 * 24 * 60 * 60 * 1000;

  return ageInMilliseconds >= fifteenYearsInMilliseconds;
}

function validateGender() {
  return [...document.querySelectorAll('input[name="gender"]:checked')].length > 0;
}

function validateCourse() {
  return studentCourseSelect.value && studentCourseSelect.value !== 'Select Course';
}

function validateSkills() {
  return getSelectedSkills().length > 0;
}

function validateAbout(content) {
  const trimmed = content.trim();
  return trimmed.length >= 20 && trimmed.length <= 200;
}

function validatePhoto(photoInput) {
  if (editingStudentId !== null && !photoInput.files[0] && photoInput.dataset.existingPhoto) {
    return true;
  }

  if (!photoInput.files[0]) {
    return false;
  }

  const file = photoInput.files[0];
  const acceptedTypes = ['image/jpeg', 'image/png'];
  const fileName = file.name.toLowerCase();
  const isAccepted = acceptedTypes.includes(file.type) || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');

  return isAccepted;
}

function updateCounter() {
  const length = aboutStudentInput.value.length;
  charCounter.textContent = `${length} / 200`;
}

function persistStudents() {
  localStorage.setItem('students', JSON.stringify(students));
}

function updateStatistics() {
  totalStudentsEl.textContent = String(students.length);

  courseOptions.forEach((course) => {
    const count = students.filter((student) => student.course === course).length;
    const element = document.getElementById(`course-${course}`);
    if (element) {
      element.textContent = String(count);
    }
  });
}

function renderStudents() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  const filteredStudents = students.filter((student) => {
    const matchesSearch = !searchText || student.name.toLowerCase().includes(searchText);
    const matchesCourse = selectedCourse === 'All Courses' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  studentContainer.innerHTML = '';

  if (filteredStudents.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No students found';
    studentContainer.appendChild(emptyState);
    return;
  }

  filteredStudents.forEach((student) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.dataset.id = String(student.id);

    const photo = document.createElement('img');
    photo.className = 'student-photo';
    photo.alt = `${student.name} profile`;
    photo.src = student.photo || 'https://via.placeholder.com/250x180?text=No+Photo';

    const name = document.createElement('h3');
    name.textContent = student.name;

    const email = document.createElement('p');
    email.innerHTML = `<strong>Email:</strong> ${student.email}`;

    const phone = document.createElement('p');
    phone.innerHTML = `<strong>Phone:</strong> ${student.phone}`;

    const dob = document.createElement('p');
    dob.innerHTML = `<strong>DOB:</strong> ${new Date(student.dob).toLocaleDateString()}`;

    const gender = document.createElement('p');
    gender.innerHTML = `<strong>Gender:</strong> ${student.gender}`;

    const course = document.createElement('p');
    course.innerHTML = `<strong>Course:</strong> ${student.course}`;

    const skillsWrap = document.createElement('div');
    skillsWrap.className = 'skills-list';
    student.skills.forEach((skill) => {
      const pill = document.createElement('span');
      pill.className = 'skill-pill';
      pill.textContent = skill;
      skillsWrap.appendChild(pill);
    });

    const about = document.createElement('p');
    about.innerHTML = `<strong>About:</strong> ${student.about}`;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

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

    card.appendChild(photo);
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(dob);
    card.appendChild(gender);
    card.appendChild(course);
    card.appendChild(skillsWrap);
    card.appendChild(about);
    card.appendChild(actions);

    studentContainer.appendChild(card);
  });
}

function resetFormState() {
  studentForm.reset();
  editingStudentId = null;
  submitBtn.textContent = 'Register Student';
  clearAllErrors();
  updateCounter();
  const fileInput = document.getElementById('profilePhoto');
  fileInput.dataset.existingPhoto = '';
}

function fillFormForEdit(student) {
  studentNameInput.value = student.name;
  studentEmailInput.value = student.email;
  studentPhoneInput.value = student.phone;
  studentDobInput.value = student.dob;

  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.checked = radio.value === student.gender;
  });

  studentCourseSelect.value = student.course;

  document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
    checkbox.checked = student.skills.includes(checkbox.value);
  });

  aboutStudentInput.value = student.about;
  updateCounter();

  if (student.photo) {
    profilePhotoInput.dataset.existingPhoto = student.photo;
  } else {
    profilePhotoInput.dataset.existingPhoto = '';
  }

  submitBtn.textContent = 'Update Student';
}

function getNextStudentId() {
  if (!students.length) {
    return 1;
  }

  return Math.max(...students.map((student) => student.id)) + 1;
}

function readPhotoAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

async function validateAndSubmit(event) {
  event.preventDefault();
  clearAllErrors();

  const name = studentNameInput.value;
  const email = studentEmailInput.value;
  const phone = studentPhoneInput.value;
  const dob = studentDobInput.value;
  const course = studentCourseSelect.value;
  const about = aboutStudentInput.value;
  const selectedSkills = getSelectedSkills();

  let isValid = true;

  if (!validateName(name)) {
    setError('studentNameError', 'Student name is required and must be 3-40 letters and spaces only.');
    isValid = false;
  }

  if (!validateEmail(email)) {
    setError('studentEmailError', 'Enter a valid email address.');
    isValid = false;
  }

  if (!validatePhone(phone)) {
    setError('studentPhoneError', 'Phone number must contain exactly 10 digits.');
    isValid = false;
  }

  if (!validateDob(dob)) {
    setError('studentDobError', 'Date of birth is required and must be at least 15 years old.');
    isValid = false;
  }

  if (!validateGender()) {
    setError('genderError', 'Please select a gender.');
    isValid = false;
  }

  if (!validateCourse()) {
    setError('courseError', 'Please select a course.');
    isValid = false;
  }

  if (!validateSkills()) {
    setError('skillsError', 'Please select at least one skill.');
    isValid = false;
  }

  if (!validateAbout(about)) {
    setError('aboutError', 'About student is required and must be between 20 and 200 characters.');
    isValid = false;
  }

  if (!validatePhoto(profilePhotoInput)) {
    setError('photoError', 'Profile photo is required and must be a .jpg, .jpeg, or .png image.');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    const photo = await readPhotoAsDataUrl(profilePhotoInput.files[0] || null);

    const studentData = {
      id: editingStudentId ?? getNextStudentId(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob,
      gender: document.querySelector('input[name="gender"]:checked').value,
      course,
      skills: selectedSkills,
      about: about.trim(),
      photo: photo || profilePhotoInput.dataset.existingPhoto || '',
    };

    if (editingStudentId !== null) {
      const index = students.findIndex((student) => student.id === editingStudentId);
      if (index !== -1) {
        students[index] = studentData;
      }
    } else {
      students.push(studentData);
    }

    persistStudents();
    renderStudents();
    updateStatistics();
    resetFormState();
  } catch (error) {
    setError('photoError', 'Unable to process the selected photo.');
  }
}

function handleDelete(event) {
  const deleteButton = event.target.closest('.delete-btn');
  if (!deleteButton) {
    return;
  }

  const card = deleteButton.closest('.student-card');
  if (!card) {
    return;
  }

  const confirmed = window.confirm('Are you sure you want to delete this student?');
  if (!confirmed) {
    return;
  }

  const studentId = Number(card.dataset.id);
  const index = students.findIndex((student) => student.id === studentId);

  if (index !== -1) {
    students.splice(index, 1);
    persistStudents();
    renderStudents();
    updateStatistics();
  }

  if (editingStudentId === studentId) {
    resetFormState();
  }
}

function handleEdit(event) {
  const editButton = event.target.closest('.edit-btn');
  if (!editButton) {
    return;
  }

  const card = editButton.closest('.student-card');
  if (!card) {
    return;
  }

  const studentId = Number(card.dataset.id);
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return;
  }

  editingStudentId = studentId;
  fillFormForEdit(student);
  studentNameInput.focus();
}

studentForm.addEventListener('submit', validateAndSubmit);
studentContainer.addEventListener('click', (event) => {
  handleDelete(event);
  handleEdit(event);
});

searchInput.addEventListener('input', renderStudents);
courseFilter.addEventListener('change', renderStudents);
resetBtn.addEventListener('click', resetFormState);
themeToggle.addEventListener('click', toggleTheme);
aboutStudentInput.addEventListener('input', updateCounter);

updateCounter();
updateStatistics();
renderStudents();
