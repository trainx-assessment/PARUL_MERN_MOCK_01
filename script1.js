const form = document.getElementById("studentForm");

const nameInput = document.getElementById("studentName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");

const charCount = document.getElementById("charCount");

aboutInput.addEventListener("input", () => {
  charCount.textContent = aboutInput.value.length;
});

function showError(input, message) {
  input.parentElement.querySelector(".error").textContent = message;
}

function clearError(input) {
  input.parentElement.querySelector(".error").textContent = "";
}

function validateName() {
  const value = nameInput.value.trim();
  const regex = /^[A-Za-z ]+$/;

  if (value === "") return (showError(nameInput, "Name is required"), false);

  if (value.length < 3)
    return (showError(nameInput, "Minimum 3 characters"), false);

  if (value.length > 40)
    return (showError(nameInput, "Maximum 40 characters"), false);

  if (!regex.test(value))
    return (showError(nameInput, "Only letters and spaces allowed"), false);

  clearError(nameInput);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") return (showError(emailInput, "Email is required"), false);

  if (!regex.test(value))
    return (showError(emailInput, "Invalid email"), false);

  clearError(emailInput);
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();

  if (!/^\d{10}$/.test(value))
    return (showError(phoneInput, "Enter exactly 10 digits"), false);

  clearError(phoneInput);
  return true;
}

function validateDOB() {
  const value = dobInput.value;

  if (!value) return (showError(dobInput, "Date of Birth required"), false);

  const dob = new Date(value);
  const today = new Date();

  if (dob > today)
    return (showError(dobInput, "Future date not allowed"), false);

  let age = today.getFullYear() - dob.getFullYear();

  const month = today.getMonth() - dob.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) age--;

  if (age < 15) return (showError(dobInput, "Minimum age is 15"), false);

  clearError(dobInput);
  return true;
}

function validateGender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  const error = document
    .querySelector(".radio-group")
    .parentElement.querySelector(".error");

  if (!selected) {
    error.textContent = "Select a gender";
    return false;
  }

  error.textContent = "";
  return true;
}

function validateCourse() {
  if (courseInput.value === "")
    return (showError(courseInput, "Select a course"), false);

  clearError(courseInput);
  return true;
}

function validateSkills() {
  const checked = document.querySelectorAll(".checkbox-group input:checked");

  const error = document
    .querySelector(".checkbox-group")
    .parentElement.querySelector(".error");

  if (checked.length === 0) {
    error.textContent = "Select at least one skill";
    return false;
  }

  error.textContent = "";
  return true;
}

function validateAbout() {
  const value = aboutInput.value.trim();

  if (value === "") return (showError(aboutInput, "About is required"), false);

  if (value.length < 20)
    return (showError(aboutInput, "Minimum 20 characters"), false);

  if (value.length > 200)
    return (showError(aboutInput, "Maximum 200 characters"), false);

  clearError(aboutInput);
  return true;
}

function validatePhoto() {
  const file = photoInput.files[0];

  if (!file) return (showError(photoInput, "Photo required"), false);

  if (!file.type.startsWith("image/"))
    return (showError(photoInput, "Only image files allowed"), false);

  clearError(photoInput);
  return true;
}

[
  nameInput,
  emailInput,
  phoneInput,
  dobInput,
  courseInput,
  aboutInput,
  photoInput,
].forEach((input) => {
  input.addEventListener("input", () => {
    switch (input.id) {
      case "studentName":
        validateName();
        break;

      case "email":
        validateEmail();
        break;

      case "phone":
        validatePhone();
        break;

      case "dob":
        validateDOB();
        break;

      case "course":
        validateCourse();
        break;

      case "about":
        validateAbout();
        break;

      case "photo":
        validatePhoto();
        break;
    }
  });
});

document
  .querySelectorAll('input[name="gender"]')
  .forEach((radio) => radio.addEventListener("change", validateGender));

document
  .querySelectorAll(".checkbox-group input")
  .forEach((box) => box.addEventListener("change", validateSkills));

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const valid =
    validateName() &
    validateEmail() &
    validatePhone() &
    validateDOB() &
    validateGender() &
    validateCourse() &
    validateSkills() &
    validateAbout() &
    validatePhoto();

  if (valid) {
    alert("Student added successfully");
  }
});
