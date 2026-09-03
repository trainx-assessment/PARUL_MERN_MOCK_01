const students = JSON.parse(localStorage.getItem("students_data")) || [];
let editingStudentId = null;

const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const aboutTextarea = document.getElementById("studentAbout");
const aboutCounter = document.getElementById("aboutCounter");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const studentContainer = document.getElementById("studentContainer");
const noResultsMsg = document.getElementById("noResultsMsg");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");


// about count 
aboutTextarea.addEventListener("input", () => {
  aboutCounter.textContent = `${aboutTextarea.value.length} / 200`;
});

// Dark Mode Toggle
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

function saveToStorage() {
  localStorage.setItem("students_data", JSON.stringify(students));
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}


function validateForm() {
    clearErrors();
    let isValid = true;
    //1. Name
    const nameVal = document.getElementById("studentName").value.trim();
    const nameRegex = /^[A-Za-z\s]{3,40}$/;
    if (!nameVal) {
        setError("nameError", "Name is required.");
        isValid = false;
    } else if (!nameRegex.test(nameVal)) {
        setError("nameError", "Name must be 3-40 letters and spaces only.");
        isValid = false;
    }

    // 2. Email
    const emailVal = document.getElementById("studentEmail").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
        setError("emailError", "Email is required.");
        isValid = false;
    } else if (!emailRegex.test(emailVal)) {
        setError("emailError", "Enter a valid email address.");
        isValid = false;
    }

    // 3. Phone
    const phoneVal = document.getElementById("studentPhone").value.trim();
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneVal) {
        setError("phoneError", "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phoneVal)) {
        setError("phoneError", "Phone number must be exactly 10 digits.");
        isValid = false;
    }

    // 4. DOB
    const dobVal = document.getElementById("studentDob").value;
    if (!dobVal) {
        setError("dobError", "Date of birth is required.");
        isValid = false;
    } else {
        const dobDate = new Date(dobVal);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dobDate > today) {
        setError("dobError", "Future dates are not accepted.");
        isValid = false;
        } else {
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        if (age < 15) {
            setError("dobError", "Student must be at least 15 years old.");
            isValid = false;
        }
        }
  }

  // 5. Gender
  const genderChecked = document.querySelector('input[name="gender"]:checked');
  if (!genderChecked) {
    setError("genderError", "Please select a gender.");
    isValid = false;
  }

  // 6. Course
  const courseVal = document.getElementById("studentCourse").value;
  if (!courseVal) {
    setError("courseError", "Please select a course.");
    isValid = false;
  }

  // 7. Skills
  const skillsChecked = document.querySelectorAll('input[name="skills"]:checked');
  if (skillsChecked.length === 0) {
    setError("skillsError", "Select at least one skill.");
    isValid = false;
  }

  // 8. About Student
  const aboutVal = aboutTextarea.value.trim();
  if (aboutVal.length < 20 || aboutVal.length > 200) {
    setError("aboutError", "About section must be between 20 and 200 characters.");
    isValid = false;
  }

  // 9. Photo: Required on new create, optional on edit if already exists
  const photoInput = document.getElementById("studentPhoto");
  if (!editingStudentId && photoInput.files.length === 0) {
    setError("photoError", "Profile photo is required.");
    isValid = false;
  } else if (photoInput.files.length > 0) {
    const file = photoInput.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("photoError", "Only .jpg, .jpeg, and .png are allowed.");
      isValid = false;
    }
  }

  return isValid;


}

// student card
function createStudentCard(student) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", student.id);

  const img = document.createElement("img");
  img.src = student.photo || "https://placehold.co/150x150?text=No+Photo";
  img.alt = `${student.name}'s Photo`;

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
  skills.classList.add("card-skills");
  skills.textContent = `Skills: ${student.skills.join(", ")}`;

  const about = document.createElement("p");
  about.textContent = `About: ${student.about}`;

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.classList.add("btn", "btn-secondary", "edit-btn");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.classList.add("btn", "btn-danger", "delete-btn");
  deleteBtn.textContent = "Delete";

  actionsDiv.append(editBtn, deleteBtn);
  card.append(img, name, email, phone, dob, gender, course, skills, about, actionsDiv);

  return card;
}

function updateStatistics() {
  document.getElementById("statTotal").textContent = `Total Students: ${students.length}`;

  const courseCounts = {
    "Web Development": 0,
    "UI/UX": 0,
    "Python": 0,
    "Data Analytics": 0,
    "MERN Stack": 0,
    "Cloud Computing": 0
  };

  students.forEach(s => {
    if (courseCounts.hasOwnProperty(s.course)) {
      courseCounts[s.course]++;
    }
  });

  function renderFilteredStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  studentContainer.innerHTML = "";

  const filtered = students.filter(student => {
    const matchesName = student.name.toLowerCase().includes(query);
    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
    return matchesName && matchesCourse;
  });

  if (filtered.length === 0) {
    noResultsMsg.classList.remove("hidden");
  } else {
    noResultsMsg.classList.add("hidden");
    filtered.forEach(student => {
      studentContainer.appendChild(createStudentCard(student));
    });
  }

  updateStatistics();
}


  document.querySelectorAll(".stat-pill").forEach(pill => {
    const course = pill.getAttribute("data-course");
    const countSpan = pill.querySelector("span");
    if (countSpan && courseCounts.hasOwnProperty(course)) {
      countSpan.textContent = courseCounts[course];
    }
  });
}

function resetForm() {
  studentForm.reset();
  aboutCounter.textContent = "0 / 200";
  editingStudentId = null;
  submitBtn.textContent = "Register Student";
  clearErrors();
}



studentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!validateForm()) return;

  const photoInput = document.getElementById("studentPhoto");
  let photoData = "";

  if (photoInput.files.length > 0) {
    photoData = await readFileAsBase64(photoInput.files[0]);
  }

  const selectedSkills = Array.from(
    document.querySelectorAll('input[name="skills"]:checked')
  ).map(cb => cb.value);

  if (editingStudentId) {
    // Edit flow
    const index = students.findIndex(s => s.id === editingStudentId);
    if (index !== -1) {
      students[index].name = document.getElementById("studentName").value.trim();
      students[index].email = document.getElementById("studentEmail").value.trim();
      students[index].phone = document.getElementById("studentPhone").value.trim();
      students[index].dob = document.getElementById("studentDob").value;
      students[index].gender = document.querySelector('input[name="gender"]:checked').value;
      students[index].course = document.getElementById("studentCourse").value;
      students[index].skills = selectedSkills;
      students[index].about = aboutTextarea.value.trim();
      if (photoData) students[index].photo = photoData;
    }
  } else {
    // New create flow
    const newStudent = {
      id: Date.now(),
      name: document.getElementById("studentName").value.trim(),
      email: document.getElementById("studentEmail").value.trim(),
      phone: document.getElementById("studentPhone").value.trim(),
      dob: document.getElementById("studentDob").value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      course: document.getElementById("studentCourse").value,
      skills: selectedSkills,
      about: aboutTextarea.value.trim(),
      photo: photoData
    };
    students.push(newStudent);
    if (target.classList.contains("edit-btn")) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
    
        editingStudentId = student.id;
        document.getElementById("studentName").value = student.name;
        document.getElementById("studentEmail").value = student.email;
        document.getElementById("studentPhone").value = student.phone;
        document.getElementById("studentDob").value = student.dob;
    
        const genderRadio = document.querySelector(`input[name="gender"][value="${student.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
    
        document.getElementById("studentCourse").value = student.course;
    
        document.querySelectorAll('input[name="skills"]').forEach(cb => {
          cb.checked = student.skills.includes(cb.value);
        });
    
        aboutTextarea.value = student.about;
        aboutCounter.textContent = `${student.about.length} / 200`;
    
        submitBtn.textContent = "Update Student";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
  }

  saveToStorage();
  renderFilteredStudents();
  resetForm();
});
function resetForm() {
  studentForm.reset();
  aboutCounter.textContent = "0 / 200";
  editingStudentId = null;
  submitBtn.textContent = "Register Student";
  clearErrors();
}

