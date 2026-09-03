// Array acts as our "database"
let students = JSON.parse(localStorage.getItem("students")) || [];

const form = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const totalCount = document.getElementById("totalCount");
const courseStats = document.getElementById("courseStats");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const charCount = document.getElementById("charCount");
const about = document.getElementById("about");
const submitBtn = document.getElementById("submitBtn");

let editId = null; // tracking editing mode

// Char counter
about.addEventListener("input", () => {
  charCount.textContent = `${about.value.length} / 200`;
});

// Validation helpers
function validateName(name) {
  return /^[A-Za-z ]{3,40}/.test(name);
}
function validatePhone(phone) {
  return /^[0-9]{10}/.test(phone);
}

// Render students from array
function renderStudents(list = students) {
  studentContainer.innerHTML = "";
  if (list.length === 0) {
    studentContainer.textContent = "No students found";
    return;
  }
  list.forEach(s => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.dataset.id = s.id;
    card.innerHTML = `
      <img src="${s.photo}" alt="Photo" width="100">
      <h3>${s.name}</h3>
      <p>Email: ${s.email}</p>
      <p>Phone: ${s.phone}</p>
      <p>DOB: ${s.dob}</p>
      <p>Gender: ${s.gender}</p>
      <p>Course: ${s.course}</p>
      <p>Skills: ${s.skills.join(", ")}</p>
      <p>About: ${s.about}</p>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    studentContainer.appendChild(card);
  });
  updateStats();
}

// Update statistics
function updateStats() {
  totalCount.textContent = students.length;
     const courses = ["Web Development","UI/UX","Python","Data Analytics","MERN Stack","Cloud Computing"];
  courseStats.innerHTML = "";
  courses.forEach(c => {
    const count = students.filter(s => s.course === c).length;
    const li = document.createElement("li");
    li.textContent = `${c}: ${count}`;
    courseStats.appendChild(li);
  });
}

// Saving array to local storage
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Add or update student
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector("input[name='gender']:checked").value;
  const course = document.getElementById("course").value;
  const skills = [...document.querySelectorAll("input[type='checkbox']:checked")].map(cb => cb.value);
  const aboutText = about.value.trim();
  const photoFile = document.getElementById("photo").files[0];

  // Validations
  if (!validateName(name))
     return alert("Invalid name");
  if (!email.includes("@")) 
    return alert("Invalid email");
  if (!validatePhone(phone)) 
    return alert("Invalid phone");
  if (!dob)
     return alert("DOB required");
  if (!gender) 
    return alert("Select gender");
  if (course === "Select Course") 
    return alert("Select course");
  if (skills.length === 0) 
    return alert("Select at least one skill");
  if (aboutText.length < 20) 
    return alert("About must be 10+ chars");
  if (!photoFile && !editId) 
    return alert("Photo required");

  const reader = new FileReader();
  reader.onload = () => {
    if (editId) {
      // Updating exisiting student in 
      const student = students.find(s => s.id === editId);
      student.name = name;
      student.email = email;
      student.phone = phone;
      student.dob = dob;
      student.gender = gender;
      student.course = course;
      student.skills = skills;
      student.about = aboutText;
      if (photoFile) student.photo = reader.result;
      editId = null;
      submitBtn.textContent = "Register Student";
    } else {
      // Add new student
      const student = {
        id: Date.now(),
        name, email, phone, dob, gender, course, skills, about: aboutText, photo: reader.result
      };
      students.push(student);
    }
    saveData();
    renderStudents();
    form.reset();
    charCount.textContent = "0 / 200";
  };
  reader.readAsDataURL(photoFile || new Blob());
});

// Event delegation for edit/delete
studentContainer.addEventListener("click", e => {
  const card = e.target.closest(".student-card");
  if (!card) return;
  const id = Number(card.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this student?")) {
      students = students.filter(s => s.id !== id);
      saveData();
      renderStudents();
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const student = students.find(s => s.id === id);
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("phone").value = student.phone;
    document.getElementById("dob").value = student.dob;
    document.querySelector(`input[name='gender'][value='${student.gender}']`).checked = true;
    document.getElementById("course").value = student.course;
    document.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.checked = student.skills.includes(cb.value);
    });
    about.value = student.about;
    charCount.textContent = `${student.about.length} / 200`;
    editId = id;
    submitBtn.textContent = "Update Student";
  }
});

// Search + filter
function applyFilters() {
  const searchVal = searchInput.value.toLowerCase();
  const courseVal = filterCourse.value;
  let filtered = students.filter(s => s.name.toLowerCase().includes(searchVal));
  if (courseVal !== "All Courses") {
    filtered = filtered.filter(s => s.course === courseVal);
  }
  renderStudents(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterCourse.addEventListener("change", applyFilters);

// Initial render
renderStudents();
