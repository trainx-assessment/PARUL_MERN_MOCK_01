let students = [];
let editingId = null;
let nextId = 1;

const $ = (id) => document.getElementById(id);

const form = $("stForm");
const nameInput = $("stName");
const emailInput = $("email");
const phoneInput = $("phone");
const dobInput = $("dob");
const courseInput = $("course");
const aboutInput = $("about");
const photoInput = $("photo");
const submitBtn = $("submitBtn");
const searchInput = $("searchInput");
const courseFilter = $("courseFilter");
const container = $("studentContainer");
const noMsg = $("noStudentsMsg");
const charCount = $("charCount");

const errors = {
  name: $("nameError"), email: $("emailError"), phone: $("phoneError"),
  dob: $("dobError"), gender: $("genderError"), course: $("courseError"),
  skills: $("skillsError"), about: $("aboutError"), photo: $("photoError")
};

const nameRe = /^[A-Za-z\s]{3,40}$/;
const phoneRe = /^\d{10}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clearErrors() {
  Object.values(errors).forEach((el) => (el.textContent = ""));
}

function getGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  return checked ? checked.value : "";
}

function getSkills() {
  return Array.from(document.querySelectorAll('input[name="skills"]:checked'))
    .map((cb) => cb.value);
}

function resetForm() {
  form.reset();
  clearErrors();
  charCount.textContent = "0";
  editingId = null;
  submitBtn.textContent = "Register Student";
}

function validate() {
  clearErrors();
  let ok = true;

  const name = nameInput.value.trim();
  if (!name) { errors.name.textContent = "Name is required."; ok = false; }
  else if (!nameRe.test(name)) { errors.name.textContent = "Name: 3-40 letters/spaces only."; ok = false; }

  const email = emailInput.value.trim();
  if (!email) { errors.email.textContent = "Email is required."; ok = false; }
  else if (!emailRe.test(email)) { errors.email.textContent = "Enter a valid email."; ok = false; }

  const phone = phoneInput.value.trim();
  if (!phone) { errors.phone.textContent = "Phone is required."; ok = false; }
  else if (!phoneRe.test(phone)) { errors.phone.textContent = "Phone must be 10 digits."; ok = false; }

  const dob = dobInput.value;
  if (!dob) { errors.dob.textContent = "DOB is required."; ok = false; }
  else {
    const dobDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate >= today) { errors.dob.textContent = "DOB cannot be in the future."; ok = false; }
    else {
      let age = today.getFullYear() - dobDate.getFullYear();
      if (today.getMonth() < dobDate.getMonth() ||
         (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) age--;
      if (age < 15) { errors.dob.textContent = "Must be at least 15 years old."; ok = false; }
    }
  }

  if (!getGender()) { errors.gender.textContent = "Select a gender."; ok = false; }
  if (!courseInput.value) { errors.course.textContent = "Select a course."; ok = false; }
  if (getSkills().length === 0) { errors.skills.textContent = "Select at least one skill."; ok = false; }

  const about = aboutInput.value.trim();
  if (!about) { errors.about.textContent = "About is required."; ok = false; }
  else if (about.length < 20) { errors.about.textContent = "About must be 20+ characters."; ok = false; }
  else if (about.length > 200) { errors.about.textContent = "About must be under 200 chars."; ok = false; }

  if (!photoInput.value) { errors.photo.textContent = "Photo is required."; ok = false; }
  else {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.indexOf(photoInput.files[0].type) === -1) {
      errors.photo.textContent = "Only JPG, JPEG, PNG accepted."; ok = false;
    }
  }

  return ok;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return dd + "/" + mm + "/" + d.getFullYear();
}

function updateStats() {
  $("totalStudents").textContent = students.length;
  const counts = {};
  $("totalStudents").nextElementSibling; 
  const statIds = {
    "Web Development": "statWebDev", "UI/UX": "statUIUX",
    "Python": "statPython", "Data Analytics": "statDataAnalytics",
    "MERN Stack": "statMERN", "Cloud Computing": "statCloud"
  };
  students.forEach((s) => { counts[s.course] = (counts[s.course] || 0) + 1; });
  Object.keys(statIds).forEach((course) => {
    $(statIds[course]).textContent = counts[course] || 0;
  });
}

function render(list) {
  container.innerHTML = "";
  noMsg.style.display = list.length === 0 ? "block" : "none";

  list.forEach((s) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.dataset.id = s.id;

    card.innerHTML = `
      <img class="card-photo" src="${s.photo}" alt="${s.name}">
      <h3 class="card-name">${s.name}</h3>
      <p class="card-details"><strong>Email:</strong> ${s.email}</p>
      <p class="card-details"><strong>Phone:</strong> ${s.phone}</p>
      <p class="card-details"><strong>DOB:</strong> ${formatDate(s.dob)}</p>
      <p class="card-details"><strong>Gender:</strong> ${s.gender}</p>
      <p class="card-details"><strong>Course:</strong> ${s.course}</p>
      <p class="card-details"><strong>Skills:</strong></p>
      <div class="card-skills">
        ${s.skills.map((sk) => `<span class="skill-tag">${sk}</span>`).join("")}
      </div>
      <p class="card-about"><strong>About:</strong> ${s.about}</p>
      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function getFiltered() {
  const search = searchInput.value.trim().toLowerCase();
  const course = courseFilter.value;
  return students.filter((s) => {
    const matchName = s.name.toLowerCase().indexOf(search) !== -1;
    const matchCourse = course === "All Courses" || s.course === course;
    return matchName && matchCourse;
  });
}

function refresh() {
  render(getFiltered());
  updateStats();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validate()) return;

  const photoFile = photoInput.files[0];
  const reader = new FileReader();

  reader.onload = function (ev) {
    const data = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender: getGender(),
      course: courseInput.value,
      skills: getSkills(),
      about: aboutInput.value.trim(),
      photo: ev.target.result
    };

    if (editingId !== null) {
      const student = students.find((s) => s.id === editingId);
      if (student) Object.assign(student, data);
    } else {
      students.push({ id: nextId++, ...data });
    }

    resetForm();
    refresh();
  };
  reader.readAsDataURL(photoFile);
});

container.addEventListener("click", function (e) {
  const card = e.target.closest(".student-card");
  if (!card) return;
  const id = parseInt(card.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Delete this student?")) {
      students = students.filter((s) => s.id !== id);
      refresh();
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const s = students.find((st) => st.id === id);
    if (!s) return;

    editingId = s.id;
    submitBtn.textContent = "Update Student";
    nameInput.value = s.name;
    emailInput.value = s.email;
    phoneInput.value = s.phone;
    dobInput.value = s.dob;
    courseInput.value = s.course;
    aboutInput.value = s.about;
    charCount.textContent = s.about.length;

    document.querySelectorAll('input[name="gender"]').forEach((r) => {
      r.checked = r.value === s.gender;
    });
    document.querySelectorAll('input[name="skills"]').forEach((c) => {
      c.checked = s.skills.indexOf(c.value) !== -1;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

searchInput.addEventListener("input", refresh);
courseFilter.addEventListener("change", refresh);
aboutInput.addEventListener("input", () => {
  charCount.textContent = aboutInput.value.length;
});
$("resetBtn").addEventListener("click", resetForm);

function autoClear(input, errorEl) {
  input.addEventListener("input", () => { if (errorEl.textContent) errorEl.textContent = ""; });
}

autoClear(nameInput, errors.name);
autoClear(emailInput, errors.email);
autoClear(phoneInput, errors.phone);
autoClear(dobInput, errors.dob);
autoClear(aboutInput, errors.about);
autoClear(courseInput, errors.course);

document.querySelectorAll('input[name="gender"]').forEach((r) => {
  r.addEventListener("change", () => { errors.gender.textContent = ""; });
});
document.querySelectorAll('input[name="skills"]').forEach((c) => {
  c.addEventListener("change", () => { errors.skills.textContent = ""; });
});
photoInput.addEventListener("change", () => { errors.photo.textContent = ""; });

refresh();
