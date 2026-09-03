const students = [];
let studentId = 1;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const aboutField = document.getElementById("about");
  const counter = document.createElement("small");
  counter.id = "charCounter";
  counter.style.display = "block";
  counter.style.marginTop = "5px";
  counter.textContent = "0 / 200";
  aboutField.parentNode.appendChild(counter);

  aboutField.addEventListener("input", () => {
    counter.textContent = `${aboutField.value.length} / 200`;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const course = document.getElementById("course").value;
    const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(s => s.value);
    const about = aboutField.value.trim();
    const photo = document.getElementById("photo");

    if (!name || !email || !phone || !dob || !gender || !course || skills.length === 0 || !photo.files.length) {
      alert("Please fill all required fields.");
      isValid = false;
    }

    if (isValid) {
      const student = {
        id: studentId++,
        name,
        email,
        phone,
        dob,
        gender: gender.value,
        course,
        skills,
        about,
        photo: URL.createObjectURL(photo.files[0])
      };

      students.push(student);
      displayStudents();
      updateStatistics();
      form.reset();
      counter.textContent = "0 / 200";
    }
  });

  function displayStudents() {
    const container = document.getElementById("studentContainer");
    container.innerHTML = "";
    students.forEach(student => {
      const card = document.createElement("div");
      card.classList.add("student-card");
      card.setAttribute("data-id", student.id);

      const img = document.createElement("img");
      img.src = student.photo;
      img.alt = student.name;
      img.style.width = "100px";

      const name = document.createElement("h3");
      name.textContent = student.name;

      const email = document.createElement("p");
      email.textContent = `Email: ${student.email}`;

      const phone = document.createElement("p");
      phone.textContent = `Phone: ${student.phone}`;

      const dob = document.createElement("p");
      dob.textContent = `DOB: ${student.dob}`;

      const gender = document.createElement("p");
      gender.textContent = `Gender: ${student.gender}`;

      const course = document.createElement("p");
      course.textContent = `Course: ${student.course}`;

      const skills = document.createElement("p");
      skills.textContent = `Skills: ${student.skills.join(", ")}`;

      const about = document.createElement("p");
      about.textContent = student.about;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => {
        const index = students.findIndex(s => s.id === student.id);
        students.splice(index, 1);
        displayStudents();
        updateStatistics();
      });

      card.append(img, name, email, phone, dob, gender, course, skills, about, editBtn, deleteBtn);
      container.appendChild(card);
    });
  }

  function updateStatistics() {
    const stats = {
      "Web Development": 0,
      "UI/UX": 0,
      "Python": 0,
      "Data Analytics": 0,
      "MERN Stack": 0,
      "Cloud Computing": 0
    };

    students.forEach(student => {
      if (stats.hasOwnProperty(student.course)) {
        stats[student.course]++;
      }
    });

    document.getElementById("totalStudents").textContent = `Total Students: ${students.length}`;
    document.getElementById("webDevCount").textContent = `Web Development: ${stats["Web Development"]}`;
    document.getElementById("uiuxCount").textContent = `UI/UX: ${stats["UI/UX"]}`;
    document.getElementById("pythonCount").textContent = `Python: ${stats["Python"]}`;
    document.getElementById("dataCount").textContent = `Data Analytics: ${stats["Data Analytics"]}`;
    document.getElementById("mernCount").textContent = `MERN Stack: ${stats["MERN Stack"]}`;
    document.getElementById("cloudCount").textContent = `Cloud Computing: ${stats["Cloud Computing"]}`;
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement("small");
    error.className = "error";
    error.style.color = "red";
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach(el => el.remove());
  }

  updateStatistics();
});
