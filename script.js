const storageKey = 'studentApplicationData';
const students = JSON.parse(localStorage.getItem(storageKey)) || [];

const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const dobInput = document.getElementById('dob');
const courseInput = document.getElementById('course');
const aboutInput = document.getElementById('about');
const profilePhotoInput = document.getElementById('profilePhoto');
const charCounter = document.getElementById('charCounter');
const submitButton = document.getElementById('submitButton');
const resetButton = document.getElementById('resetButton');

function setError(fieldName, message) {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (!errorElement) return;
  errorElement.textContent = message;
}

function clearError(fieldName) {
  setError(fieldName, '');
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach((errorElement) => {
    errorElement.textContent = '';
  });
}

function updateCharacterCounter() {
  const length = aboutInput.value.trim().length;
  charCounter.textContent = `${length} / 200`;
}

function validateName(name) {
  return /^[A-Za-z ]{3,40}$/.test(name);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}

function validateDateOfBirth(dateString) {
  if (!dateString) return false;

  const selectedDate = new Date(dateString);
  const today = new Date();
  const minimumAgeDate = new Date();
  minimumAgeDate.setFullYear(today.getFullYear() - 15);

  if (selectedDate > today) return false;
  if (selectedDate > minimumAgeDate) return false;

  return !Number.isNaN(selectedDate.getTime());
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

function validateStudentForm() {
  let isValid = true;
  const name = studentNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const dob = dobInput.value;
  const selectedCourse = courseInput.value;
  const about = aboutInput.value.trim();
  const genderValue = document.querySelector('input[name="gender"]:checked')?.value || '';
  const selectedSkills = [...document.querySelectorAll('input[name="skills"]:checked')].map((checkbox) => checkbox.value);

  if (!name) {
    setError('studentName', 'Student name is required.');
    isValid = false;
  } else if (!validateName(name)) {
    setError('studentName', 'Name must be 3-40 letters and spaces only.');
    isValid = false;
  } else {
    clearError('studentName');
  }

  if (!email) {
    setError('email', 'Email is required.');
    isValid = false;
  } else if (!validateEmail(email)) {
    setError('email', 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError('email');
  }

  if (!phone) {
    setError('phone', 'Phone number is required.');
    isValid = false;
  } else if (!validatePhone(phone)) {
    setError('phone', 'Phone number must be exactly 10 digits.');
    isValid = false;
  } else {
    clearError('phone');
  }

  if (!dob) {
    setError('dob', 'Date of birth is required.');
    isValid = false;
  } else if (!validateDateOfBirth(dob)) {
    setError('dob', 'Date of birth is invalid or student must be at least 15 years old.');
    isValid = false;
  } else {
    clearError('dob');
  }

  if (!genderValue) {
    setError('gender', 'Please select a gender.');
    isValid = false;
  } else {
    clearError('gender');
  }

  if (!selectedCourse || selectedCourse === 'Select Course') {
    setError('course', 'Please select a valid course.');
    isValid = false;
  } else {
    clearError('course');
  }

  if (selectedSkills.length === 0) {
    setError('skills', 'Please select at least one skill.');
    isValid = false;
  } else {
    clearError('skills');
  }

  if (!about) {
    setError('about', 'About student is required.');
    isValid = false;
  } else if (/^\s+$/.test(about)) {
    setError('about', 'Spaces-only input is not allowed.');
    isValid = false;
  } else if (about.length < 20 || about.length > 200) {
    setError('about', 'About section must be between 20 and 200 characters.');
    isValid = false;
  } else {
    clearError('about');
  }

  const currentFile = profilePhotoInput.files[0];
  if (currentFile) {
    const validExt = ['jpg', 'jpeg', 'png'];
    const fileName = currentFile.name.toLowerCase();
    const isValidImage = validExt.some((ext) => fileName.endsWith(`.${ext}`));

    if (!isValidImage) {
      setError('profilePhoto', 'Only .jpg, .jpeg, and .png files are allowed.');
      isValid = false;
    } else {
      clearError('profilePhoto');
    }
  } else {
    setError('profilePhoto', 'Profile photo is required.');
    isValid = false;
  }

  return isValid;
}

function resetFormState() {
  studentForm.reset();
  clearAllErrors();
  updateCharacterCounter();
  profilePhotoInput.value = '';

  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.checked = false;
  });

  document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  submitButton.textContent = 'Register Student';
}

async function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateStudentForm()) {
    return;
  }

  const studentData = {
    id: students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1,
    name: studentNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    dob: dobInput.value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    course: courseInput.value,
    skills: [...document.querySelectorAll('input[name="skills"]:checked')].map((checkbox) => checkbox.value),
    about: aboutInput.value.trim()
  };

  const selectedFile = profilePhotoInput.files[0];
  if (selectedFile) {
    studentData.photo = await readFileAsDataUrl(selectedFile);
  } else {
    studentData.photo = '';
  }

  students.push(studentData);
  localStorage.setItem(storageKey, JSON.stringify(students));
  resetFormState();
}

function bindEvents() {
  studentForm.addEventListener('submit', handleFormSubmit);
  resetButton.addEventListener('click', resetFormState);

  aboutInput.addEventListener('input', () => {
    updateCharacterCounter();
    clearError('about');
  });

  [studentNameInput, emailInput, phoneInput, dobInput, courseInput, profilePhotoInput].forEach((field) => {
    field.addEventListener('input', () => {
      if (field === courseInput) clearError('course');
      if (field === profilePhotoInput) clearError('profilePhoto');
      if (field === studentNameInput) clearError('studentName');
      if (field === emailInput) clearError('email');
      if (field === phoneInput) clearError('phone');
    });
  });

  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener('change', () => clearError('gender'));
  });

  document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => clearError('skills'));
  });

  dobInput.addEventListener('change', () => clearError('dob'));
}

bindEvents();
updateCharacterCounter();
