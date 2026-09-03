const students = [];
let editingStudentId = null;

const studentForm = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const searchStudent = document.getElementById("searchStudent");
const courseFilter = document.getElementById("courseFilter");
const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");
const aboutStudent = document.getElementById("aboutStudent");
const aboutCounter = document.getElementById("aboutCounter");

const formElements = {
  name: document.getElementById("studentName"),
  email: document.getElementById("studentEmail"),
  phone: document.getElementById("studentPhone"),
  dob: document.getElementById("studentDob"),
  gender: document.querySelectorAll('input[name="gender"]'),
  course: document.getElementById("studentCourse"),
  skills: document.querySelectorAll('input[name="skills"]'),
  about: aboutStudent,
  photo: document.getElementById("studentPhoto")
};

const errorMessages = {
  name: document.getElementById("studentNameError"),
  email: document.getElementById("studentEmailError"),
  phone: document.getElementById("studentPhoneError"),
  dob: document.getElementById("studentDobError"),
  gender: document.getElementById("genderError"),
  course: document.getElementById("studentCourseError"),
  skills: document.getElementById("skillsError"),
  about: document.getElementById("aboutStudentError"),
  photo: document.getElementById("studentPhotoError")
};

const courseLabelMap = {
  "Web Development": "webDevelopmentCount",
  "UI/UX": "uiuxCount",
  "Python": "pythonCount",
  "Data Analytics": "dataAnalyticsCount",
  "MERN Stack": "mernStackCount",
  "Cloud Computing": "cloudComputingCount"
};

function setupEventListeners() {
  studentForm.addEventListener("submit", handleSubmit);
  resetButton.addEventListener("click", () => resetForm(true));
  searchStudent.addEventListener("input", renderStudentCards);
  courseFilter.addEventListener("change", renderStudentCards);
  aboutStudent.addEventListener("input", updateAboutCounter);

  Object.values(formElements).forEach((element) => {
    if (element instanceof NodeList) {
      element.forEach((input) => {
        input.addEventListener("input", () => clearFieldError(input));
        input.addEventListener("change", () => clearFieldError(input));
      });
      return;
    }

    if (element && element.tagName !== "SELECT" && element.type !== "file") {
      element.addEventListener("input", () => clearFieldError(element));
    }
    if (element && (element.tagName === "SELECT" || element.type === "file")) {
      element.addEventListener("change", () => clearFieldError(element));
    }
  });
}

function clearFieldError(field) {
  if (!field) return;

  if (field.name === "gender") {
    setError("gender", "");
    return;
  }

  if (field.name === "skills") {
    setError("skills", "");
    return;
  }

  const fieldKey = getFieldKey(field.id);
  if (fieldKey) {
    setError(fieldKey, "");
  }
}

function getFieldKey(elementId) {
  const mapping = {
    studentName: "name",
    studentEmail: "email",
    studentPhone: "phone",
    studentDob: "dob",
    studentCourse: "course",
    aboutStudent: "about",
    studentPhoto: "photo"
  };

  return mapping[elementId] || null;
}

function setError(fieldKey, message) {
  if (!errorMessages[fieldKey]) return;
  errorMessages[fieldKey].textContent = message;
}

function updateAboutCounter() {
  const currentLength = aboutStudent.value.length;
  aboutCounter.textContent = `${currentLength} / 200`;
}

function resetForm(cancelEditMode = true) {
  studentForm.reset();
  updateAboutCounter();
  clearAllErrors();

  if (cancelEditMode) {
    editingStudentId = null;
    submitButton.textContent = "Register Student";
  }
}

function clearAllErrors() {
  Object.keys(errorMessages).forEach((key) => setError(key, ""));
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function validateStudentName(value) {
  const trimmed = value.trim();

  if (!trimmed) return "Student name is required.";
  if (trimmed.length < 3) return "Student name must be at least 3 characters.";
  if (trimmed.length > 40) return "Student name must not exceed 40 characters.";
  if (!/^[A-Za-z ]+$/.test(trimmed)) return "Student name can only contain letters and spaces.";

  return "";
}

function validateEmail(value) {
  const trimmed = value.trim();

  if (!trimmed) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Please enter a valid email address.";

  return "";
}

function validatePhone(value) {
  const trimmed = value.trim();

  if (!trimmed) return "Phone number is required.";
  if (!/^\d{10}$/.test(trimmed)) return "Phone number must be exactly 10 digits.";

  return "";
}

function validateDob(value) {
  if (!value) return "Date of birth is required.";

  const selectedDate = new Date(value);
  const today = new Date();

  if (Number.isNaN(selectedDate.getTime())) return "Please enter a valid date.";
  if (selectedDate > today) return "Future dates are not allowed.";

  const age = today.getFullYear() - selectedDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > selectedDate.getMonth() ||
    (today.getMonth() === selectedDate.getMonth() && today.getDate() >= selectedDate.getDate());

  if (age < 15 || (age === 15 && !hasBirthdayPassed)) {
    return "Student must be at least 15 years old.";
  }

  return "";
}

function validateGender() {
  const selectedGender = Array.from(formElements.gender).find((input) => input.checked);
  if (!selectedGender) return "Please select a gender.";
  return "";
}

function validateCourse(value) {
  if (!value) return "Please select a course.";
  return "";
}

function validateSkills() {
  const selectedSkills = Array.from(formElements.skills).filter((input) => input.checked);
  if (selectedSkills.length === 0) return "Please select at least one skill.";
  return "";
}

function validateAbout(value) {
  const trimmed = value.trim();

  if (!trimmed) return "About student is required.";
  if (trimmed.length < 20) return "About student must be at least 20 characters.";
  if (trimmed.length > 200) return "About student must not exceed 200 characters.";

  return "";
}

function validatePhoto(file, existingPhoto) {
  if (!file && !existingPhoto) return "Profile photo is required.";
  if (file && !file.type.startsWith("image/")) return "Only image files are allowed.";
  return "";
}

function collectFormData() {
  const selectedSkills = Array.from(formElements.skills)
    .filter((input) => input.checked)
    .map((input) => input.value);

  return {
    name: formElements.name.value,
    email: formElements.email.value,
    phone: formElements.phone.value,
    dob: formElements.dob.value,
    gender: Array.from(formElements.gender).find((input) => input.checked)?.value || "",
    course: formElements.course.value,
    skills: selectedSkills,
    about: formElements.about.value,
    photoFile: formElements.photo.files[0] || null
  };
}

function validateFormData(data, existingPhoto = "") {
  const errors = {
    name: validateStudentName(data.name),
    email: validateEmail(data.email),
    phone: validatePhone(data.phone),
    dob: validateDob(data.dob),
    gender: validateGender(),
    course: validateCourse(data.course),
    skills: validateSkills(),
    about: validateAbout(data.about),
    photo: validatePhoto(data.photoFile, existingPhoto)
  };

  Object.keys(errors).forEach((key) => {
    if (key === "gender") {
      setError("gender", errors.gender || "");
      return;
    }

    if (key === "skills") {
      setError("skills", errors.skills || "");
      return;
    }

    const errorField = key === "about" ? "about" : key;
    setError(errorField, errors[key] || "");
  });

  return !Object.values(errors).some((message) => message !== "");
}

async function handleSubmit(event) {
  event.preventDefault();

  const currentStudent = editingStudentId !== null
    ? students.find((student) => student.id === editingStudentId)
    : null;

  const formData = collectFormData();
  const isValid = validateFormData(formData, currentStudent ? currentStudent.photo : "");

  if (!isValid) {
    return;
  }

  let photoValue = currentStudent ? currentStudent.photo : "";

  if (formData.photoFile) {
    try {
      photoValue = await readFileAsDataURL(formData.photoFile);
    } catch (error) {
      setError("photo", "Unable to read the selected photo.");
      return;
    }
  }

  const studentObject = {
    id: editingStudentId !== null ? editingStudentId : students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1,
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    dob: formData.dob,
    gender: formData.gender,
    course: formData.course,
    skills: formData.skills,
    about: formData.about.trim(),
    photo: photoValue
  };

  if (editingStudentId !== null) {
    const studentIndex = students.findIndex((student) => student.id === editingStudentId);
    if (studentIndex !== -1) {
      students[studentIndex] = studentObject;
    }
  } else {
    students.push(studentObject);
  }

  resetForm(true);
  renderStudentCards();
  updateStatistics();
}

function renderStudentCards() {
  const searchText = searchStudent.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  const filteredStudents = students.filter((student) => {
    const matchesSearch = !searchText || student.name.toLowerCase().includes(searchText);
    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  studentContainer.innerHTML = "";

  if (!filteredStudents.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No students found";
    studentContainer.appendChild(emptyState);
    return;
  }

  filteredStudents.forEach((student) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.dataset.id = student.id;

    const image = document.createElement("img");
    image.src = student.photo || "https://via.placeholder.com/300x200?text=No+Photo";
    image.alt = `${student.name} profile`;
    image.className = "student-photo";

    const heading = document.createElement("h3");
    heading.textContent = student.name;

    const meta = document.createElement("div");
    meta.className = "student-meta";
    meta.innerHTML = `
      <div><strong>Email:</strong> ${student.email}</div>
      <div><strong>Phone:</strong> ${student.phone}</div>
      <div><strong>DOB:</strong> ${formatDate(student.dob)}</div>
      <div><strong>Gender:</strong> ${student.gender}</div>
      <div><strong>Course:</strong> ${student.course}</div>
    `;

    const skillContainer = document.createElement("div");
    skillContainer.className = "skill-list";
    student.skills.forEach((skill) => {
      const skillTag = document.createElement("span");
      skillTag.className = "skill-tag";
      skillTag.textContent = skill;
      skillContainer.appendChild(skillTag);
    });

    const about = document.createElement("p");
    about.className = "about-text";
    about.innerHTML = `<strong>About:</strong> ${student.about}`;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.dataset.action = "edit";
    editButton.dataset.id = student.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = student.id;

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(image);
    card.appendChild(heading);
    card.appendChild(meta);
    card.appendChild(skillContainer);
    card.appendChild(about);
    card.appendChild(actions);

    studentContainer.appendChild(card);
  });
}

studentContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const studentId = Number(button.dataset.id);

  if (button.dataset.action === "delete") {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    const index = students.findIndex((student) => student.id === studentId);
    if (index !== -1) {
      students.splice(index, 1);
      if (editingStudentId === studentId) {
        resetForm(true);
      }
      renderStudentCards();
      updateStatistics();
    }
  }

  if (button.dataset.action === "edit") {
    const student = students.find((item) => item.id === studentId);
    if (!student) return;

    editingStudentId = student.id;
    submitButton.textContent = "Update Student";

    formElements.name.value = student.name;
    formElements.email.value = student.email;
    formElements.phone.value = student.phone;
    formElements.dob.value = student.dob;

    Array.from(formElements.gender).forEach((input) => {
      input.checked = input.value === student.gender;
    });

    formElements.course.value = student.course;

    Array.from(formElements.skills).forEach((input) => {
      input.checked = student.skills.includes(input.value);
    });

    formElements.about.value = student.about;
    updateAboutCounter();
    clearAllErrors();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

function updateStatistics() {
  const total = students.length;
  document.getElementById("totalStudentsCount").textContent = total;

  const counts = {
    "Web Development": 0,
    "UI/UX": 0,
    "Python": 0,
    "Data Analytics": 0,
    "MERN Stack": 0,
    "Cloud Computing": 0
  };

  students.forEach((student) => {
    if (counts[student.course] !== undefined) {
      counts[student.course] += 1;
    }
  });

  Object.entries(courseLabelMap).forEach(([courseName, elementId]) => {
    document.getElementById(elementId).textContent = counts[courseName] || 0;
  });
}

function init() {
  setupEventListeners();
  updateAboutCounter();
  updateStatistics();
  renderStudentCards();
}

init();
