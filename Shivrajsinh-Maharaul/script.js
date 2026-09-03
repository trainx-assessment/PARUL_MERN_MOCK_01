let students = [];
let editId = null;

let form = document.getElementById("registerForm");
let allStudents = document.querySelector(".students");
let statsDiv = document.getElementById("stats");

let searchInput = document.createElement("input");
searchInput.placeholder = "Search student by name...";
allStudents.parentNode.insertBefore(searchInput, allStudents);

let filterCourse = document.createElement("select");
filterCourse.innerHTML = `
  <option value="All">All Courses</option>
  <option value="Web Development">Web Development</option>
  <option value="UI/UX">UI/UX</option>
  <option value="Python">Python</option>
  <option value="Data Analytics">Data Analytics</option>
  <option value="MERN Stack">MERN Stack</option>
  <option value="Cloud Computing">Cloud Computing</option>
`;
allStudents.parentNode.insertBefore(filterCourse, allStudents);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = form.name.value;
  let email = form.email.value;
  let phone = form.phoneNumber.value;
  let dob = form.dob.value;
  let course = form.course.value;
  let about = form.about.value;

  let gender = "";
  let genderInputs = document.getElementsByName("gender");
  for (let i = 0; i < genderInputs.length; i++) {
    if (genderInputs[i].checked) {
      gender = genderInputs[i].value;
    }
  }

  let skills = [];
  let skillInputs = document.getElementsByName("skills");
  for (let i = 0; i < skillInputs.length; i++) {
    if (skillInputs[i].checked) {
      skills.push(skillInputs[i].value);
    }
  }

  if (name.length < 3) {
    alert("Enter a valid name");
    return;
  }
  if (email == "" || !email.includes("@")) {
    alert("Enter a valid email");
    return;
  }
  if (phone.length != 10) {
    alert("Enter 10 digit phone number");
    return;
  }
  if (dob == "") {
    alert("Select date of birth");
    return;
  }
  if (gender == "") {
    alert("Select gender");
    return;
  }
  if (course == "Select Course" || course == "") {
    alert("Select course");
    return;
  }
  if (skills.length == 0) {
    alert("Select at least one skill");
    return;
  }
  if (about.length < 20) {
    alert("About student must be at least 20 characters");
    return;
  }

  if (editId != null) {
    for (let i = 0; i < students.length; i++) {
      if (students[i].id == editId) {
        students[i].name = name;
        students[i].email = email;
        students[i].phone = phone;
        students[i].dob = dob;
        students[i].gender = gender;
        students[i].course = course;
        students[i].skills = skills;
        students[i].about = about;
      }
    }
    editId = null;
    form.querySelector("button[type='submit']").textContent = "Register Student";
  } else {
    let student = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      dob: dob,
      gender: gender,
      course: course,
      skills: skills,
      about: about
    };
    students.push(student);
  }

  form.reset();
  show();
});

allStudents.addEventListener("click", function (e) {
  let card = e.target.closest(".card");
  if (!card) return;
  let id = card.dataset.id;

  if (e.target.id == "deleteStudent" || e.target.classList.contains("delete-btn")) {
    if (confirm("Delete student?")) {
      let temp = [];
      for (let i = 0; i < students.length; i++) {
        if (students[i].id != id) {
          temp.push(students[i]);
        }
      }
      students = temp;
      show();
    }
  }

  if (e.target.id == "editStudent" || e.target.classList.contains("edit-btn")) {
    let student = null;
    for (let i = 0; i < students.length; i++) {
      if (students[i].id == id) {
        student = students[i];
      }
    }

    if (student) {
      editId = student.id;
      form.name.value = student.name;
      form.email.value = student.email;
      form.phoneNumber.value = student.phone;
      form.dob.value = student.dob;
      form.course.value = student.course;
      form.about.value = student.about;

      let genderInputs = document.getElementsByName("gender");
      for (let i = 0; i < genderInputs.length; i++) {
        if (genderInputs[i].value.toLowerCase() == student.gender.toLowerCase()) {
          genderInputs[i].checked = true;
        }
      }

      let skillInputs = document.getElementsByName("skills");
      for (let i = 0; i < skillInputs.length; i++) {
        skillInputs[i].checked = student.skills.includes(skillInputs[i].value);
      }

      form.querySelector("button[type='submit']").textContent = "Update Student";
    }
  }
});

function show() {
  allStudents.innerHTML = "";
  let search = searchInput.value.toLowerCase();
  let course = filterCourse.value;

  let count = 0;
  for (let i = 0; i < students.length; i++) {
    let s = students[i];
    let matchName = s.name.toLowerCase().includes(search);
    let matchCourse = course == "All" || s.course == course;

    if (matchName && matchCourse) {
      count++;
      let card = document.createElement("div");
      card.className = "card";
      card.dataset.id = s.id;
      card.innerHTML = `
        <div>
          <p>Name: ${s.name}</p>
          <p>Email: ${s.email}</p>
          <p>Phone: ${s.phone}</p>
          <p>DOB: ${s.dob}</p>
          <p>Gender: ${s.gender}</p>
          <p>Course: ${s.course}</p>
        </div>
        <div>
          <p>Skills: ${s.skills.join(", ")}</p>
          <p>About: ${s.about}</p>
        </div>
        <div>
          <button id="editStudent" class="edit-btn">Edit</button>
          <button id="deleteStudent" class="delete-btn">Delete</button>
        </div>
      `;
      allStudents.appendChild(card);
    }
  }

  if (count == 0) {
    allStudents.innerHTML = "<p>No students found</p>";
  }

  statsDiv.innerHTML = "<p>Total Students: " + students.length + "</p>";
}

searchInput.addEventListener("input", show);
filterCourse.addEventListener("change", show);

show();