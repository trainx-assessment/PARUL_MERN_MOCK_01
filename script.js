let students = []

const form = document.getElementById("student-form")
const container = document.getElementById("student-container")
const searchInput = document.getElementById("search")
const courseFilter = document.getElementById("course-filter");

form.addEventListener("submit", function(e){
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const course = document.getElementById("course").value;
  const about = document.getElementById("about").value
  const skills = Array.from(document.querySelectorAll('.skills-group input:checked')).map(s => s.value);
  const photoFile = document.getElementById("profile").files[0]

  if(!gender || !photoFile){
    alert("Please select gender and profile photo........")
    return;
  }

  const reader = new FileReader();
  reader.onload = function(){
    const student = {
      id: Date.now(),
      name, email, phone, dob,
      gender: gender.value,
      course, about, skills,
      photo: reader.result
    }
    students.push(student);
    renderStudents(students);
    updateStats();
    form.reset();
  }
  reader.readAsDataURL(photoFile);
})

function renderStudents(list){
  container.innerHTML = "";
  list.forEach(s => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.innerHTML = `
      <img src="${s.photo}" alt="${s.name}">
      <h3>${s.name}</h3>
      <p>${s.email}</p>
      <p>${s.phone}</p>
      <p>DOB: ${s.dob}</p>
      <p>Gender: ${s.gender}</p>
      <p>Course: ${s.course}</p>
      <p>Skills: ${s.skills.join(", ") || "None"}</p>
      <p>${s.about}</p>
      <button class="delete-btn" onclick="deleteStudent(${s.id})">Delete</button>
    `;
    container.appendChild(card);
  });
}

function deleteStudent(id){
  students = students.filter(s => s.id !== id);
  renderStudents(students)
  updateStats();
}

function updateStats(){
  document.getElementById("total-students").textContent = students.length;
  document.getElementById("web-count").textContent = students.filter(s => s.course === "Web Development").length
  document.getElementById("uiux-count").textContent = students.filter(s => s.course === "UI/UX").length
  document.getElementById("python-count").textContent = students.filter(s => s.course === "Python").length
  document.getElementById("data-count").textContent = students.filter(s => s.course === "Data Analytics").length
  document.getElementById("mern-count").textContent = students.filter(s => s.course === "MERN Stack").length
  document.getElementById("cloud-count").textContent = students.filter(s => s.course === "Cloud Computing").length
}

function filterStudents(){
  const term = searchInput.value.toLowerCase();
  const course = courseFilter.value;
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(term) &&
    (course === "" || s.course === course)
  )
  renderStudents(filtered);
}

searchInput.addEventListener("input", filterStudents)
courseFilter.addEventListener("change", filterStudents)

renderStudents(students)
updateStats()