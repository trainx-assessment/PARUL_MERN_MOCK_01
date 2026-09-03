
let students = JSON.parse(localStorage.getItem('students_data')) || [];
let editingStudentId = null;

const studentForm = document.getElementById('studentForm');
const formHeaderTitle = document.getElementById('formHeaderTitle');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

const nameInput = document.getElementById('studentName');
const emailInput = document.getElementById('studentEmail');
const phoneInput = document.getElementById('studentPhone');
const dobInput = document.getElementById('studentDob');
const courseSelect = document.getElementById('studentCourse');
const aboutTextarea = document.getElementById('studentAbout');
const charCounter = document.getElementById('charCounter');
const photoInput = document.getElementById('studentPhoto');

document.addEventListener('DOMContentLoaded', () => {
  renderStudents();
  updateStatistics();


  aboutTextarea.addEventListener('input', () => {
    charCounter.textContent = `${aboutTextarea.value.length} / 200`;
  });

  searchInput.addEventListener('input', renderStudents);
  courseFilter.addEventListener('change', renderStudents);
  
  resetBtn.addEventListener('click', resetForm);


  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      themeToggleBtn.textContent = 'Light Mode';
    } else {
      themeToggleBtn.textContent = 'Dark Mode';
    }
  });


  studentContainer.addEventListener('click', handleCardActions);
});


studentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const selectedGender = document.querySelector('input[name="gender"]:checked')?.value;
  const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value);

  const processStudentData = (photoUrl) => {
    if (editingStudentId !== null) {
      const index = students.findIndex(s => s.id === editingStudentId);
      if (index !== -1) {
        students[index] = {
          ...students[index],
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          dob: dobInput.value,
          gender: selectedGender,
          course: courseSelect.value,
          skills: selectedSkills,
          about: aboutTextarea.value.trim(),
          photo: photoUrl || students[index].photo
        };
      }
    } else {
      const newStudent = {
        id: Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: selectedGender,
        course: courseSelect.value,
        skills: selectedSkills,
        about: aboutTextarea.value.trim(),
        photo: photoUrl
      };
      students.push(newStudent);
    }

    saveAndRefresh();
    resetForm();
  };

  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      processStudentData(event.target.result);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    processStudentData(null);
  }
});

function validateForm() {
  let isValid = true;
  clearErrors();
  const nameValue = nameInput.value.trim();
  const nameRegex = /^[A-Za-z\s]{3,40}$/;
  if (!nameValue) {
    showError('nameError', 'Student name is required');
    isValid = false;
  } else if (!nameRegex.test(nameValue)) {
    showError('nameError', 'Name must contain 3-40 letters and spaces only');
    isValid = false;
  }

  const emailValue = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValue) {
    showError('emailError', 'Email address is required');
    isValid = false;
  } else if (!emailRegex.test(emailValue)) {
    showError('emailError', 'Please enter a valid email address');
    isValid = false;
  }
  const phoneValue = phoneInput.value.trim();
  const phoneRegex = /^\d{10}$/;
  if (!phoneValue) {
    showError('phoneError', 'Phone number is required');
    isValid = false;
  } else if (!phoneRegex.test(phoneValue)) {
    showError('phoneError', 'Phone number must be exactly 10 digits');
    isValid = false;
  }
  const dobValue = dobInput.value;
  if (!dobValue) {
    showError('dobError', 'Date of birth is required');
    isValid = false;
  } else {
    const dobDate = new Date(dobValue);
    const today = new Date();
    if (dobDate > today) {
      showError('dobError', 'Future dates are not allowed');
      isValid = false;
    } else {
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 15) {
        showError('dobError', 'Student must be at least 15 years old');
        isValid = false;
      }
    }
  }
  const selectedGender = document.querySelector('input[name="gender"]:checked');
  if (!selectedGender) {
    showError('genderError', 'Please select a gender');
    isValid = false;
  }
  if (!courseSelect.value) {
    showError('courseError', 'Please select a course');
    isValid = false;
  }
  const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
  if (selectedSkills.length === 0) {
    showError('skillsError', 'Please select at least one skill');
    isValid = false;
  }
  const aboutValue = aboutTextarea.value.trim();
  if (!aboutValue) {
    showError('aboutError', 'About section is required');
    isValid = false;
  } else if (aboutValue.length < 20 || aboutValue.length > 200) {
    showError('aboutError', 'Must be between 20 and 200 characters');
    isValid = false;
  }

  if (editingStudentId === null && (!photoInput.files || photoInput.files.length === 0)) {
    showError('photoError', 'Profile photo is required');
    isValid = false;
  }

  return isValid;
}

function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}
function resetForm() {
  studentForm.reset();
  editingStudentId = null;
  formHeaderTitle.textContent = 'Register Student';
  submitBtn.textContent = 'Register Student';
  charCounter.textContent = '0 / 200';
  clearErrors();
}