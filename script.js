 
const form = document.getElementById("student-form");
const nameInput = document.getElementById("student-name");
const emailInput = document.getElementById("student-email");
const phoneInput = document.getElementById("student-phone");
const dobInput = document.getElementById("student-dob");
const courseSelect = document.getElementById("student-course");
const aboutTextarea = document.getElementById("student-about");
const photoInput = document.getElementById("student-photo");
const charCounter = document.getElementById("char-counter");

function showError(errorElementId, message) {
  const errorElement = document.getElementById(errorElementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(errorElementId) {
  const errorElement = document.getElementById(errorElementId);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

 
aboutTextarea.addEventListener("input", () => {
  const count = aboutTextarea.value.length;
  charCounter.textContent = `${count} / 200`;
  validateAbout();
});

 nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
dobInput.addEventListener("change", validateDob);
courseSelect.addEventListener("change", validateCourse);
photoInput.addEventListener("change", validatePhoto);

document.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("change", validateGender);
});

document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
  checkbox.addEventListener("change", validateSkills);
});

 function validateName() {
  const value = nameInput.value.trim();
  const nameRegex = /^[A-Za-z\s]+$/;

  if (value === "") {
    showError("name-error", "Student name is required.");
    return false;
  }
  if (value.length < 3 || value.length > 40) {
    showError("name-error", "Name must be between 3 and 40 characters.");
    return false;
  }
  if (!nameRegex.test(value)) {
    showError("name-error", "Name can only contain letters and spaces.");
    return false;
  }
  clearError("name-error");
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showError("email-error", "Email is required.");
    return false;
  }
  if (!emailRegex.test(value)) {
    showError("email-error", "Please enter a valid email address.");
    return false;
  }
  clearError("email-error");
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  const phoneRegex = /^\d{10}$/;

  if (value === "") {
    showError("phone-error", "Phone number is required.");
    return false;
  }
  if (!phoneRegex.test(value)) {
    showError("phone-error", "Phone number must be exactly 10 digits.");
    return false;
  }
  clearError("phone-error");
  return true;
}

function validateDob() {
  const value = dobInput.value;
  if (!value) {
    showError("dob-error", "Date of birth is required.");
    return false;
  }

  const birthDate = new Date(value);
  const today = new Date();

   today.setHours(0, 0, 0, 0);

  if (birthDate > today) {
    showError("dob-error", "Future dates are not allowed.");
    return false;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 15) {
    showError("dob-error", "Student must be at least 15 years old.");
    return false;
  }

  clearError("dob-error");
  return true;
}

function validateGender() {
  const selectedGender = document.querySelector('input[name="gender"]:checked');
  if (!selectedGender) {
    showError("gender-error", "Please select a gender.");
    return false;
  }
  clearError("gender-error");
  return true;
}

function validateCourse() {
  if (courseSelect.value === "") {
    showError("course-error", "Please select a valid course.");
    return false;
  }
  clearError("course-error");
  return true;
}

function validateSkills() {
  const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
  if (selectedSkills.length === 0) {
    showError("skills-error", "Please select at least one skill.");
    return false;
  }
  clearError("skills-error");
  return true;
}

function validateAbout() {
  const rawValue = aboutTextarea.value;
  const trimmedValue = rawValue.trim();

  if (trimmedValue === "") {
    showError("about-error", "About student cannot be empty or contain only spaces.");
    return false;
  }
  if (trimmedValue.length < 20) {
    showError("about-error", "About section must be at least 20 characters long.");
    return false;
  }
  if (rawValue.length > 200) {
    showError("about-error", "About section cannot exceed 200 characters.");
    return false;
  }
  clearError("about-error");
  return true;
}

function validatePhoto() {
  const file = photoInput.files[0];
  if (!file) {
    showError("photo-error", "Profile photo is required.");
    return false;
  }

  const allowedExtensions = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedExtensions.includes(file.type)) {
    showError("photo-error", "Only image files (.jpg, .jpeg, .png) are accepted.");
    return false;
  }

  clearError("photo-error");
  return true;
}

function validateForm() {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isDobValid = validateDob();
  const isGenderValid = validateGender();
  const isCourseValid = validateCourse();
  const isSkillsValid = validateSkills();
  const isAboutValid = validateAbout();
  const isPhotoValid = validatePhoto();

  return (
    isNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isDobValid &&
    isGenderValid &&
    isCourseValid &&
    isSkillsValid &&
    isAboutValid &&
    isPhotoValid
  );
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  const selectedGender = document.querySelector('input[name="gender"]:checked').value;
  const selectedSkills = Array.from(
    document.querySelectorAll('input[name="skills"]:checked')
  ).map((cb) => cb.value);

  const studentData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    dob: dobInput.value,
    gender: selectedGender,
    course: courseSelect.value,
    skills: selectedSkills,
    about: aboutTextarea.value.trim(),
    photo: photoInput.files[0],
  };

});



const students = [];
let nextStudentId = 1;

 
function handleStudentRegistration() {
  const photoFile = photoInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const photoBase64Url = event.target.result;

    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    const selectedSkills = Array.from(
      document.querySelectorAll('input[name="skills"]:checked')
    ).map((cb) => cb.value);

    const newStudent = {
      id: nextStudentId++,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender: selectedGender,
      course: courseSelect.value,
      skills: selectedSkills,
      about: aboutTextarea.value.trim(),
      photo: photoBase64Url  
    };

    students.push(newStudent);

    console.log("Student successfully added:", newStudent);
    console.log("Current students list:", students);
  };

  reader.readAsDataURL(photoFile);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

   handleStudentRegistration();
});