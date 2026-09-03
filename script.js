

let students = JSON.parse(localStorage.getItem("students")) || [];
let editStudentId = null;

const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("studentName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseSelect = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");
const charCounter = document.getElementById("charCounter");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const studentContainer = document.getElementById("studentContainer");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const themeToggleBtn = document.getElementById("themeToggleBtn");


document.addEventListener("DOMContentLoaded", () => {
  renderStudents();
  updateStatistics();
  
  aboutInput.addEventListener("input", updateCharCounter);
  studentForm.addEventListener("submit", handleFormSubmit);
  resetBtn.addEventListener("click", resetForm);
  studentContainer.addEventListener("click", handleCardActions);
  
  searchInput.addEventListener("input", renderStudents);
  filterCourse.addEventListener("change", renderStudents);
  themeToggleBtn.addEventListener("click", toggleDarkMode);
});


function updateCharCounter() {
  const currentLength = aboutInput.value.length;
  charCounter.textContent = `${currentLength} / 200`;
}


function clearError(elementId) {
  document.getElementById(elementId).textContent = "";
}


function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function clearAllErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((err) => (err.textContent = ""));
}


function validateForm() {
  clearAllErrors();
  let isValid = true;


  const nameValue = nameInput.value.trim();
  const nameRegex = /^[A-Za-z\s]{3,40}$/;
  if (!nameValue) {
    showError("nameError", "Student name is required.");
    isValid = false;
  } else if (!nameRegex.test(nameValue)) {
    showError("nameError", "Only letters and spaces (3-40 characters) allowed.");
    isValid = false;
  }


  const emailValue = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValue) {
    showError("emailError", "Email address is required.");
    isValid = false;
  } else if (!emailRegex.test(emailValue)) {
    showError("emailError", "Please enter a valid email address.");
    isValid = false;
  }


  const phoneValue = phoneInput.value.trim();
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneValue) {
    showError("phoneError", "Phone number is required.");
    isValid = false;
  } else if (!phoneRegex.test(phoneValue)) {
    showError("phoneError", "Phone number must be exactly 10 digits.");
    isValid = false;
  }

  
  const dobValue = dobInput.value;
  if (!dobValue) {
    showError("dobError", "Date of birth is required.");
    isValid = false;
  } else {
    const dobDate = new Date(dobValue);
    const today = new Date();
    if (dobDate > today) {
      showError("dobError", "Future dates are not accepted.");
      isValid = false;
    } else {
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 15) {
        showError("dobError", "Student must be at least 15 years old.");
        isValid = false;
      }
    }
  }

  
  const selectedGender = document.querySelector('input[name="gender"]:checked');
  if (!selectedGender) {
    showError("genderError", "Please select a gender.");
    isValid = false;
  }


  if (!courseSelect.value) {
    showError("courseError", "Please select a course.");
    isValid = false;
  }

  
  const checkedSkills = document.querySelectorAll('input[name="skills"]:checked');
  if (checkedSkills.length === 0) {
    showError("skillsError", "Select at least one skill.");
    isValid = false;
  }

  const aboutValue = aboutInput.value.trim();
  if (!aboutValue) {
    showError("aboutError", "About field cannot be empty or space-only.");
    isValid = false;
  } else if (aboutValue.length < 20 || aboutValue.length > 200) {
    showError("aboutError", "Must be between 20 and 200 characters.");
    isValid = false;
  }


  if (!editStudentId && photoInput.files.length === 0) {
    showError("photoError", "Profile photo is required.");
    isValid = false;
  }

  return isValid;
}


function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const dob = dobInput.value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const course = courseSelect.value;
  const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map((cb) => cb.value);
  const about = aboutInput.value.trim();

  const processDataAndSave = (photoUrl) => {
    if (editStudentId !== null) {
      // Edit Existing Student
      const index = students.findIndex((s) => s.id === editStudentId);
      if (index !== -1) {
        students[index] = {
          ...students[index],
          name,
          email,
          phone,
          dob,
          gender,
          course,
          skills,
          about,
          photo: photoUrl || students[index].photo
        };
      }
    } else {
      
      const newStudent = {
        id: Date.now(),
        name,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about,
        photo: photoUrl
      };
      students.push(newStudent);
    }

    saveToLocalStorage();
    renderStudents();
    updateStatistics();
    resetForm();
  };


  if (photoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      processDataAndSave(e.target.result);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    processDataAndSave(null);
  }
}


function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}


function renderStudents() {
  studentContainer.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedCourse = filterCourse.value;

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchValue);
    const matchesCourse = selectedCourse === "All" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  if (filteredStudents.length === 0) {
    const noDataDiv = document.createElement("div");
    noDataDiv.className = "no-data";
    noDataDiv.textContent = "No students found";
    studentContainer.appendChild(noDataDiv);
    return;
  }

  filteredStudents.forEach((student) => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

  
    const img = document.createElement("img");
    img.src = student.photo || "https://via.placeholder.com/150";
    img.alt = student.name;
    img.classList.add("card-photo");

    
    const title = document.createElement("h3");
    title.classList.add("card-title");
    title.textContent = student.name;

    const createInfoParagraph = (label, value) => {
      const p = document.createElement("p");
      p.classList.add("card-info");
      p.innerHTML = `<strong>${label}:</strong> ${value}`;
      return p;
    };

    const emailP = createInfoParagraph("Email", student.email);
    const phoneP = createInfoParagraph("Phone", student.phone);
    const dobP = createInfoParagraph("DOB", student.dob);
    const genderP = createInfoParagraph("Gender", student.gender);
    const courseP = createInfoParagraph("Course", student.course);
    const skillsP = createInfoParagraph("Skills", student.skills.join(", "));
    const aboutP = createInfoParagraph("About", student.about);

    
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("btn", "btn-primary", "edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn", "btn-danger", "delete-btn");

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

   
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(emailP);
    card.appendChild(phoneP);
    card.appendChild(dobP);
    card.appendChild(genderP);
    card.appendChild(courseP);
    card.appendChild(skillsP);
    card.appendChild(aboutP);
    card.appendChild(actionsDiv);

    studentContainer.appendChild(card);
  });
}


function updateStatistics() {
  document.getElementById("statTotal").textContent = students.length;

  const courseCounts = {
    "Web Development": 0,
    "UI/UX": 0,
    "Python": 0,
    "Data Analytics": 0,
    "MERN Stack": 0,
    "Cloud Computing": 0
  };

  students.forEach((student) => {
    if (courseCounts.hasOwnProperty(student.course)) {
      courseCounts[student.course]++;
    }
  });

  document.getElementById("statWeb").textContent = courseCounts["Web Development"];
  document.getElementById("statUI").textContent = courseCounts["UI/UX"];
  document.getElementById("statPython").textContent = courseCounts["Python"];
  document.getElementById("statData").textContent = courseCounts["Data Analytics"];
  document.getElementById("statMern").textContent = courseCounts["MERN Stack"];
  document.getElementById("statCloud").textContent = courseCounts["Cloud Computing"];
}


function handleCardActions(event) {
  const card = event.target.closest(".student-card");
  if (!card) return;

  const studentId = Number(card.getAttribute("data-id"));

  if (event.target.classList.contains("delete-btn")) {
    deleteStudent(studentId);
  } else if (event.target.classList.contains("edit-btn")) {
    populateEditForm(studentId);
  }
}


function deleteStudent(studentId) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");
  if (confirmDelete) {
    students = students.filter((student) => student.id !== studentId);
    saveToLocalStorage();
    renderStudents();
    updateStatistics();

    if (editStudentId === studentId) {
      resetForm();
    }
  }
}


function populateEditForm(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  editStudentId = student.id;

  nameInput.value = student.name;
  emailInput.value = student.email;
  phoneInput.value = student.phone;
  dobInput.value = student.dob;
  courseSelect.value = student.course;
  aboutInput.value = student.about;
  updateCharCounter();

 
  const genderRadio = document.querySelector(`input[name="gender"][value="${student.gender}"]`);
  if (genderRadio) genderRadio.checked = true;


  document.querySelectorAll('input[name="skills"]').forEach((cb) => {
    cb.checked = student.skills.includes(cb.value);
  });

  submitBtn.textContent = "Update Student";
  window.scrollTo({ top: 0, behavior: "smooth" });
}


function resetForm() {
  studentForm.reset();
  editStudentId = null;
  submitBtn.textContent = "Register Student";
  clearAllErrors();
  updateCharCounter();
}


function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  themeToggleBtn.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
}

