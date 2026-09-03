const students = [];
let editId = null;

const about = document.getElementById("about");
const charCount = document.getElementById("charCount");
about.addEventListener("input", () => {
  charCount.textContent = `${about.value.length} / 200`;
});


document.getElementById("studentForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector("input[name='gender']:checked")?.value;
  const course = document.getElementById("course").value;
  const skills = [...document.querySelectorAll("input[type='checkbox']:checked")].map(cb => cb.value);
  const aboutText = about.value.trim();
  const photo = document.getElementById("photo").files[0];

  const nameRegex = /^[A-Za-z ]{3,40}$/;
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!nameRegex.test(name)) return alert("Invalid name");
  if (!emailRegex.test(email)) return alert("Invalid email");
  if (!phoneRegex.test(phone)) return alert("Invalid phone");
  if (!dob) return alert("DOB required");
  if (!gender) return alert("Select gender");
  if (course === "Select Course") return alert("Select course");
  if (skills.length === 0) return alert("Select at least one skill");
  if (aboutText.length < 20) return alert("About must be at least 20 chars");
  if (!photo) return alert("Upload photo");

  const reader = new FileReader();
  reader.onload = function() {
    if (editId) {
      const student = students.find(s => s.id === editId);
      Object.assign(student, { name, email, phone, dob, gender, course, skills, about: aboutText, photo: reader.result });
      editId = null;
      document.getElementById("submitBtn").textContent = "Register Student";
    } else {
      const student = {
        id: Date.now(),
        name, email, phone, dob, gender, course, skills,
        about: aboutText,
        photo: reader.result
      };
      students.push(student);
    }
    renderStudents();
    updateStats();
    document.getElementById("studentForm").reset();
    charCount.textContent = "0 / 200";
  };
  reader.readAsDataURL(photo);
});


function renderStudents() {
  const container = document.getElementById("studentContainer");
  container.innerHTML = "";
  const search = document.getElementById("search").value.toLowerCase();
  const filterCourse = document.getElementById("filterCourse").value;

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search) &&
    (filterCourse === "All Courses" || s.course === filterCourse)
  );

  if (filtered.length === 0) {
    container.textContent = "No students found";
    return;
  }

  filtered.forEach(s => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.id = s.id;

    card.innerHTML = `
      <img src="${s.photo}" alt="Profile Photo">
      <h3>${s.name}</h3>
      <p>Email: ${s.email}</p>
      <p>Phone: ${s.phone}</p>
      <p>DOB: ${s.dob}</p>
      <p>Gender: ${s.gender}</p>
      <p>Course: ${s.course}</p>
      <p>Skills: ${s.skills.join(", ")}</p>
      <p>About: ${s.about}</p>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    `;

    container.appendChild(card);
  });