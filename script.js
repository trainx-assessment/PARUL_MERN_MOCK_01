const students = [];
const form = document.getElementById("studentForm");
const fields = {
  name: document.getElementById("studentName"),
  email: document.getElementById("studentEmail"),
  phone: document.getElementById("studentPhone"),
  dob: document.getElementById("studentDob"),
  course: document.getElementById("studentCourse"),
  about: document.getElementById("studentAbout"),
  photo: document.getElementById("studentPhoto"),
};
const submitButton = document.getElementById("submitBtn");
const resetButton = document.getElementById("resetBtn");
const studentContainer = document.getElementById("studentContainer");
const counter = document.querySelector(".char-counter");

function showError(name, message) {
  document.querySelector(`[data-error-for="${name}"]`).textContent = message;
}

function gender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  return selected ? selected.value : "";
}

function skills() {
  return [...document.querySelectorAll('input[name="skills"]:checked')].map((item) => item.value);
}

function validate() {
  const name = fields.name.value.trim();
  const email = fields.email.value.trim();
  const phone = fields.phone.value.trim();
  const about = fields.about.value.trim();
  const file = fields.photo.files[0];
  const messages = {
    studentName: !name ? "Student name is required." : !/^[A-Za-z ]{3,40}$/.test(name) ? "Enter a valid name." : "",
    studentEmail: !email ? "Email is required." : !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email address." : "",
    studentPhone: !/^\d{10}$/.test(phone) ? "Phone number must be exactly 10 digits." : "",
    studentDob: !fields.dob.value ? "Date of birth is required." : "",
    gender: !gender() ? "Please select a gender." : "",
    studentCourse: !fields.course.value ? "Please select a course." : "",
    skills: !skills().length ? "Please select at least one skill." : "",
    studentAbout: !about ? "About student is required." : about.length < 20 ? "About should have at least 20 characters." : "",
    studentPhoto: "",
  };
  if (fields.dob.value) {
    const minimumDate = new Date();
    minimumDate.setFullYear(minimumDate.getFullYear() - 15);
    const birthDate = new Date(fields.dob.value);
    if (birthDate > new Date()) messages.studentDob = "Future dates are not allowed.";
    else if (birthDate > minimumDate) messages.studentDob = "Student must be at least 15 years old.";
  }
  if (file && !["image/jpeg", "image/png"].includes(file.type)) messages.studentPhoto = "Only JPG and PNG images are allowed.";
  if (!file && !(form.dataset.editingId && form.dataset.currentPhoto)) messages.studentPhoto = "Profile photo is required.";
  Object.keys(messages).forEach((name) => showError(name, messages[name]));
  return Object.values(messages).every((message) => !message);
}

function updateCounter() {
  counter.textContent = `${fields.about.value.trim().length} / 200`;
}

function clearForm() {
  form.reset();
  document.querySelectorAll(".error-message").forEach((item) => (item.textContent = ""));
  delete form.dataset.editingId;
  delete form.dataset.currentPhoto;
  submitButton.textContent = "Register Student";
  updateCounter();
}

function renderStudents() {
  if (!students.length) {
    studentContainer.innerHTML = '<p class="no-students">No students found</p>';
    return;
  }
  studentContainer.innerHTML = students.map((student) => `
    <div class="student-card" data-id="${student.id}">
      <img src="${student.photo}" alt="${student.name}">
      <h3>${student.name}</h3>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>Phone:</strong> ${student.phone}</p>
      <p><strong>DOB:</strong> ${student.dob}</p>
      <p><strong>Gender:</strong> ${student.gender}</p>
      <p><strong>Course:</strong> ${student.course}</p>
      <p class="skills"><strong>Skills:</strong> ${student.skills.join(", ")}</p>
      <p><strong>About:</strong> ${student.about}</p>
      <div class="card-actions"><button class="edit-btn">Edit</button><button class="delete-btn">Delete</button></div>
    </div>`).join("");
}

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fillForm(student) {
  fields.name.value = student.name;
  fields.email.value = student.email;
  fields.phone.value = student.phone;
  fields.dob.value = student.dob;
  fields.course.value = student.course;
  fields.about.value = student.about;
  document.querySelectorAll('input[name="gender"]').forEach((item) => (item.checked = item.value === student.gender));
  document.querySelectorAll('input[name="skills"]').forEach((item) => (item.checked = student.skills.includes(item.value)));
  form.dataset.editingId = student.id;
  form.dataset.currentPhoto = student.photo;
  submitButton.textContent = "Update Student";
  updateCounter();
}

async function submitStudent(event) {
  event.preventDefault();
  if (!validate()) return;
  let photo = form.dataset.currentPhoto || "";
  if (fields.photo.files[0]) {
    try {
      photo = await readPhoto(fields.photo.files[0]);
    } catch (error) {
      showError("studentPhoto", "Unable to read the selected image.");
      return;
    }
  }
  const data = {
    name: fields.name.value.trim(), email: fields.email.value.trim(), phone: fields.phone.value.trim(),
    dob: fields.dob.value, gender: gender(), course: fields.course.value, skills: skills(),
    about: fields.about.value.trim(), photo,
  };
  const index = students.findIndex((student) => student.id === Number(form.dataset.editingId));
  if (index >= 0) students[index] = { ...students[index], ...data };
  else students.push({ id: students.length + 1, ...data });
  renderStudents();
  clearForm();
}

form.addEventListener("submit", submitStudent);
form.addEventListener("input", updateCounter);
form.addEventListener("change", validate);
resetButton.addEventListener("click", () => { clearForm(); renderStudents(); });
studentContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".student-card");
  if (!card) return;
  const index = students.findIndex((student) => student.id === Number(card.dataset.id));
  if (event.target.classList.contains("edit-btn")) fillForm(students[index]);
  if (event.target.classList.contains("delete-btn") && confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    renderStudents();
  }
});

updateCounter();
renderStudents();
