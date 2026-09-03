const form = document.querySelector("form");

const nameInput = form.querySelector('input[type="text"]');
const emailInput = form.querySelector('input[type="email"]');
const phoneInput = form.querySelectorAll('input[type="text"]')[1];
const dobInput = form.querySelector('input[type="date"]');
const genderInputs = form.querySelectorAll('input[name="gender"]');
const courseInput = form.querySelector('select[name="course"]');
const skillInputs = form.querySelectorAll('input[name="skills"]');
const photoInput = form.querySelector('input[type="file"]');
const aboutInput = form.querySelector("textarea");

const counter = document.createElement("small");
counter.textContent = "0 / 200";
aboutInput.parentElement.appendChild(counter);

aboutInput.addEventListener("input", () => {
  counter.textContent = `${aboutInput.value.length} / 200`;
});
function createError(input, message) {
  removeError(input);

  const error = document.createElement("small");
  error.className = "error";
  error.style.color = "red";
  error.textContent = message;

  input.parentElement.appendChild(error);
}

function removeError(input) {
  const old = input.parentElement.querySelector(".error");
  if (old) old.remove();
}

function validateName() {
  const value = nameInput.value.trim();
  const regex = /^[A-Za-z ]+$/;

  if (value === "") {
    createError(nameInput, "Name is required");
    return false;
  }

  if (value.length < 3 || value.length > 40) {
    createError(nameInput, "Name must be 3-40 characters");
    return false;
  }

  if (!regex.test(value)) {
    createError(nameInput, "Only letters and spaces allowed");
    return false;
  }

  removeError(nameInput);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    createError(emailInput, "Email is required");
    return false;
  }

  if (!regex.test(value)) {
    createError(emailInput, "Enter a valid email");
    return false;
  }

  removeError(emailInput);
  return true;
}

// Phone
function validatePhone() {
  const value = phoneInput.value.trim();

  if (!/^\d{10}$/.test(value)) {
    createError(phoneInput, "Phone must contain exactly 10 digits");
    return false;
  }

  removeError(phoneInput);
  return true;
}

function validateDOB() {
  if (!dobInput.value) {
    createError(dobInput, "Date of Birth is required");
    return false;
  }

  const dob = new Date(dobInput.value);
  const today = new Date();

  if (dob > today) {
    createError(dobInput, "Future date is not allowed");
    return false;
  }

  let age = today.getFullYear() - dob.getFullYear();

  const month = today.getMonth() - dob.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 15) {
    createError(dobInput, "Student must be at least 15 years old");
    return false;
  }

  removeError(dobInput);
  return true;
}

function validateGender() {
  const selected = [...genderInputs].some((r) => r.checked);

  removeError(genderInputs[2]);

  if (!selected) {
    createError(genderInputs[2], "Select a gender");
    return false;
  }

  return true;
}

function validateCourse() {
  if (courseInput.selectedIndex === 0) {
    createError(courseInput, "Select a course");
    return false;
  }

  removeError(courseInput);
  return true;
}

function validateSkills() {
  const selected = [...skillInputs].filter((c) => c.checked);

  removeError(skillInputs[5]);

  if (selected.length === 0) {
    createError(skillInputs[5], "Select at least one skill");
    return false;
  }

  return true;
}

// About
function validateAbout() {
  const value = aboutInput.value.trim();

  if (value === "") {
    createError(aboutInput, "About Student is required");
    return false;
  }

  if (value.length < 20) {
    createError(aboutInput, "Minimum 20 characters required");
    return false;
  }

  if (value.length > 200) {
    createError(aboutInput, "Maximum 200 characters allowed");
    return false;
  }

  removeError(aboutInput);
  return true;
}

// Photo
function validatePhoto() {
  const file = photoInput.files[0];

  if (!file) {
    createError(photoInput, "Profile photo is required");
    return false;
  }

  if (!file.type.startsWith("image/")) {
    createError(photoInput, "Only image files are allowed");
    return false;
  }

  removeError(photoInput);
  return true;
}

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
dobInput.addEventListener("change", validateDOB);
courseInput.addEventListener("change", validateCourse);
aboutInput.addEventListener("input", validateAbout);
photoInput.addEventListener("change", validatePhoto);

genderInputs.forEach((radio) =>
  radio.addEventListener("change", validateGender),
);
skillInputs.forEach((box) => box.addEventListener("change", validateSkills));

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const valid =
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateDOB() &&
    validateGender() &&
    validateCourse() &&
    validateSkills() &&
    validateAbout() &&
    validatePhoto();

  if (valid) {
    alert("Student registered successfully! (Task 4 completed)");
    form.reset();
    counter.textContent = "0 / 200";
    document.querySelectorAll(".error").forEach((err) => err.remove());
  }
});
