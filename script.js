// const form = document.querySelector("#studentForm");
// const studentName = document.querySelector("#studentName");
// const studentContainer = document.querySelector("#studentContainer");

// form.addEventListener("submit", function (event) {
//     event.preventDefault(); 

//     const name = studentName.value.trim();

//     if (name === "") {
//         alert("Name is required");
//         return;
//     }


//     if (!/^[A-Za-z ]{3,40}$/.test(name)) {
//         alert("Invalid name. Use only letters and spaces, 3–40 characters.");
//         return;
//     }

//     const card = document.createElement("div");
//     card.classList.add("student-card");

//     const heading = document.createElement("h3");
//     heading.textContent = name;

//     const deleteButton = document.createElement("button");
//     deleteButton.textContent = "Delete";
//     deleteButton.classList.add("delete-btn"); // correct class

//     card.appendChild(heading);
//     card.appendChild(deleteButton);

//     studentContainer.appendChild(card);

//     studentName.value = "";
// });

// studentContainer.addEventListener("click", function (event) {
//     if (event.target.classList.contains("delete-btn")) {
//         const card = event.target.closest(".student-card"); // use closest()
//         card.remove();
//     }
// });




















let students = JSON.parse(localStorage.getItem("students")) || [];
let studentId = students.length ? students[students.length - 1].id + 1 : 1;

const form = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const charCount = document.getElementById("charCount");
const about = document.getElementById("about");
const search = document.getElementById("search");
const filterCourse = document.getElementById("filterCourse");
const totalStudents = document.getElementById("totalStudents");
const courseStats = document.getElementById("courseStats");

if (about) {
  about.addEventListener("input", () => {
    charCount.textContent = `${about.value.length} / 200`;
  });
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
      alert("Invalid name");
      return;
    }

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector("input[name='gender']:checked")?.value;
    const course = document.getElementById("course").value;
    const skills = [...document.querySelectorAll("input[type='checkbox']:checked")].map(s => s.value);
    const aboutText = about.value.trim();
    const photo = document.getElementById("photo").files[0];

    if (!email || !phone || !dob || !gender || course === "Select Course" || skills.length === 0 || aboutText.length < 20 || !photo) {
      alert("Please fill all fields correctly");
      return;
    }

    const student = {
      id: studentId++,
      name,
      email,
      phone,
      dob,
      gender,
      course,
      skills,
      about: aboutText,
      photo: URL.createObjectURL(photo)
    };

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    alert("Student registered successfully!");
    form.reset();
    charCount.textContent = "0 / 200";
  });
}

function renderStudents(list = students) {
  if (!studentContainer) return;
  studentContainer.innerHTML = "";

  if (list.length === 0) {
    studentContainer.innerHTML = "<p>No students found</p>";
    return;
  }

  list.forEach(student => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.id = student.id;

    card.innerHTML = `
      <img src="${student.photo}" alt="${student.name}" width="100">
      <h3>${student.name}</h3>
      <p>Email: ${student.email}</p>
      <p>Phone: ${student.phone}</p>
      <p>DOB: ${student.dob}</p>
      <p>Gender: ${student.gender}</p>
      <p>Course: ${student.course}</p>
      <p>Skills: ${student.skills.join(", ")}</p>
      <p>About: ${student.about}</p>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    studentContainer.appendChild(card);
  });

  updateStatistics();
}

// Update statistics
function updateStatistics() {
  if (!totalStudents || !courseStats) return;
  totalStudents.textContent = students.length;

  const courses = ["Web Development","UI/UX","Python","Data Analytics","MERN Stack","Cloud Computing"];
  courseStats.innerHTML = "";
  courses.forEach(course => {
    const count = students.filter(s => s.course === course).length;
    const li = document.createElement("li");
    li.textContent = `${course}: ${count}`;
    courseStats.appendChild(li);
  });
}

// Delete student (event delegation)
if (studentContainer) {
  studentContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const card = e.target.closest(".student-card");
      const id = parseInt(card.dataset.id);

      if (confirm("Are you sure you want to delete this student?")) {
        students = students.filter(s => s.id !== id);
        localStorage.setItem("students", JSON.stringify(students));
        renderStudents();
      }
    }
  });
}

// Search + Filter
if (search) {
  search.addEventListener("input", () => {
    filterAndSearch();
  });
}
if (filterCourse) {
  filterCourse.addEventListener("change", () => {
    filterAndSearch();
  });
}

function filterAndSearch() {
  let filtered = students;

  const query = search.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(query));
  }

  const course = filterCourse.value;
  if (course !== "All Courses") {
    filtered = filtered.filter(s => s.course === course);
  }

  renderStudents(filtered);
}

renderStudents();
