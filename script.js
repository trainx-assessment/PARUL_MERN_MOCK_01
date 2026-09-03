const students = [];

const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const profilePhoto = document.getElementById("profilePhoto");

const characterCounter = document.createElement("small");

characterCounter.id = "characterCounter";
characterCounter.textContent = "0 / 200";

about.parentElement.appendChild(characterCounter);

about.addEventListener("input", function () {
  characterCounter.textContent = `${about.value.length} / 200`;

  clearError(about);
});

function showError(input, message) {
  clearError(input);

  input.classList.add("input-error");

  const error = document.createElement("small");

  error.className = "error-message";
  error.textContent = message;

  input.parentElement.appendChild(error);
}

function clearError(input) {
  input.classList.remove("input-error");

  const oldError = input.parentElement.querySelector(".error-message");

  if (oldError) {
    oldError.remove();
  }
}

function validateStudentName() {
  const value = studentName.value.trim();

  if (value === "") {
    showError(studentName, "Student name is required.");
    return false;
  }

  if (value.length < 3) {
    showError(studentName, "Name must contain at least 3 characters.");
    return false;
  }

  if (value.length > 40) {
    showError(studentName, "Name cannot exceed 40 characters.");
    return false;
  }

  const nameRegex = /^[A-Za-z ]+$/;

  if (!nameRegex.test(value)) {
    showError(studentName, "Name can contain only letters and spaces.");
    return false;
  }

  clearError(studentName);
  return true;
}

function validateEmail() {
  const value = email.value.trim();

  if (value === "") {
    showError(email, "Email is required.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    showError(email, "Please enter a valid email address.");
    return false;
  }

  clearError(email);
  return true;
}

function validatePhone() {
  const value = phone.value.trim();

  if (value === "") {
    showError(phone, "Phone number is required.");
    return false;
  }

  const phoneRegex = /^\d{10}$/;

  if (!phoneRegex.test(value)) {
    showError(phone, "Phone number must contain exactly 10 digits.");
    return false;
  }

  clearError(phone);
  return true;
}

function validateDOB() {
  const value = dob.value;

  if (value === "") {
    showError(dob, "Date of birth is required.");
    return false;
  }

  const selectedDate = new Date(value);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    showError(dob, "Date of birth cannot be a future date.");

    return false;
  }

  let age = today.getFullYear() - selectedDate.getFullYear();

  const monthDifference = today.getMonth() - selectedDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < selectedDate.getDate())
  ) {
    age--;
  }

  if (age < 15) {
    showError(dob, "Student must be at least 15 years old.");

    return false;
  }

  clearError(dob);

  return true;
}

function validateGender() {
  const genderOptions = document.querySelectorAll('input[name="gender"]');

  const selectedGender = document.querySelector('input[name="gender"]:checked');

  const genderContainer = genderOptions[0].closest("div");

  const oldError = genderContainer.querySelector(".error-message");

  if (oldError) {
    oldError.remove();
  }

  if (!selectedGender) {
    const error = document.createElement("small");

    error.className = "error-message";

    error.textContent = "Please select a gender.";

    genderContainer.appendChild(error);

    return false;
  }

  return true;
}

function validateCourse() {
  if (course.value === "") {
    showError(course, "Please select a course.");

    return false;
  }

  clearError(course);

  return true;
}

function validateSkills() {
  const skills = document.querySelectorAll('input[name="skills"]');

  const selectedSkills = document.querySelectorAll(
    'input[name="skills"]:checked',
  );

  const skillsContainer = skills[0].closest("div");

  const oldError = skillsContainer.querySelector(".error-message");

  if (oldError) {
    oldError.remove();
  }

  if (selectedSkills.length === 0) {
    const error = document.createElement("small");

    error.className = "error-message";

    error.textContent = "Please select at least one skill.";

    skillsContainer.appendChild(error);

    return false;
  }

  return true;
}

function validateAbout() {
  const value = about.value.trim();

  if (value === "") {
    showError(about, "About student is required.");

    return false;
  }

  if (value.length < 20) {
    showError(about, "About student must contain at least 20 characters.");

    return false;
  }

  if (value.length > 200) {
    showError(about, "About student cannot exceed 200 characters.");

    return false;
  }

  clearError(about);

  return true;
}

function validateProfilePhoto() {
  const file = profilePhoto.files[0];

  if (!file) {
    showError(profilePhoto, "Profile photo is required.");

    return false;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    showError(profilePhoto, "Only JPG, JPEG and PNG images are allowed.");

    return false;
  }

  clearError(profilePhoto);

  return true;
}

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameValid = validateStudentName();

  const emailValid = validateEmail();

  const phoneValid = validatePhone();

  const dobValid = validateDOB();

  const genderValid = validateGender();

  const courseValid = validateCourse();

  const skillsValid = validateSkills();

  const aboutValid = validateAbout();

  const photoValid = validateProfilePhoto();

  if (
    !nameValid ||
    !emailValid ||
    !phoneValid ||
    !dobValid ||
    !genderValid ||
    !courseValid ||
    !skillsValid ||
    !aboutValid ||
    !photoValid
  ) {
    const firstError = document.querySelector(".input-error");

    if (firstError) {
      firstError.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return;
  }

  const selectedGender = document.querySelector('input[name="gender"]:checked');

  const selectedSkills = Array.from(
    document.querySelectorAll('input[name="skills"]:checked'),
  ).map(function (skill) {
    return skill.value;
  });

  const photoFile = profilePhoto.files[0];

  const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;

  const student = {
    id: newId,

    name: studentName.value.trim(),

    email: email.value.trim(),

    phone: phone.value.trim(),

    dob: dob.value,

    gender: selectedGender.value,

    course: course.value,

    skills: selectedSkills,

    about: about.value.trim(),

    photo: photoFile.name,
  };

  students.push(student);

  console.log("Student added:");

  console.log(student);

  console.log("All students:");

  console.log(students);

  alert("Student registered successfully!");

  studentForm.reset();

  characterCounter.textContent = "0 / 200";
});

studentName.addEventListener("input", validateStudentName);

email.addEventListener("input", validateEmail);

phone.addEventListener("input", validatePhone);

dob.addEventListener("change", validateDOB);

course.addEventListener("change", validateCourse);

profilePhoto.addEventListener("change", validateProfilePhoto);

document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
  radio.addEventListener("change", validateGender);
});

document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
  checkbox.addEventListener("change", validateSkills);
});

about.addEventListener("blur", validateAbout);

console.log("Student Application Management System loaded successfully!");
