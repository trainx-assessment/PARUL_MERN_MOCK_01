const studentForm = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");
const about = document.getElementById("about");
const charCount = document.getElementById("charCount");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const themeButton = document.getElementById("themeButton");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    const errors = document.querySelectorAll(".error");
    errors.forEach(function (error) {
        error.textContent = "";
    });
}

function validateForm() {
    clearErrors();
    let isValid = true;
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const course = document.getElementById("course").value;
    const selectedSkills = document.querySelectorAll('input[name="skill"]:checked');
    const aboutText = about.value.trim();
    const photo = document.getElementById("photo").files[0];
    const namePattern = /^[A-Za-z ]{3,40}$/;
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namePattern.test(name)) {
        showError("nameError", "Name should have 3 to 40 letters and spaces only.");
        isValid = false;
    }

    if (!emailPattern.test(email)) {
        showError("emailError", "Enter a valid email address.");
        isValid = false;
    }

    if (!phonePattern.test(phone)) {
        showError("phoneError", "Phone number should have exactly 10 digits.");
        isValid = false;
    }

    if (dob === "") {
        showError("dobError", "Date of birth is required.");
        isValid = false;
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate > today) {
            showError("dobError", "Future date is not allowed.");
            isValid = false;
        } else if (age < 15) {
            showError("dobError", "Student should be at least 15 years old.");
            isValid = false;
        }
    }

    if (!gender) {
        showError("genderError", "Please select gender.");
        isValid = false;
    }

    if (course === "") {
        showError("courseError", "Please select a course.");
        isValid = false;
    }

    if (selectedSkills.length === 0) {
        showError("skillsError", "Please select at least one skill.");
        isValid = false;
    }

    if (aboutText.length < 20 || aboutText.length > 200) {
        showError("aboutError", "About student should have 20 to 200 characters.");
        isValid = false;
    }

    if (editId === null && !photo) {
        showError("photoError", "Please select a profile photo.");
        isValid = false;
    } else if (photo && !photo.type.startsWith("image/")) {
        showError("photoError", "Please select a JPG, JPEG or PNG image.");
        isValid = false;
    }

    return isValid;
}

function getPhoto(file, student) {
    if (!file) {
        saveStudent(student, student.photo);
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        saveStudent(student, reader.result);
    };
    reader.readAsDataURL(file);
}

function saveStudent(student, photo) {
    student.photo = photo;

    if (editId === null) {
        students.push(student);
    } else {
        const studentIndex = students.findIndex(function (item) {
            return item.id === editId;
        });
        students[studentIndex] = student;
    }

    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    updateStatistics();
    resetForm();
}

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const selectedSkills = document.querySelectorAll('input[name="skill"]:checked');
    const skills = [];
    selectedSkills.forEach(function (skill) {
        skills.push(skill.value);
    });

    const selectedGender = document.querySelector('input[name="gender"]:checked');
    let studentId = Date.now();
    let oldStudent = null;

    if (editId !== null) {
        studentId = editId;
        oldStudent = students.find(function (item) {
            return item.id === editId;
        });
    }

    const student = {
        id: studentId,
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: document.getElementById("dob").value,
        gender: selectedGender.value,
        course: document.getElementById("course").value,
        skills: skills,
        about: about.value.trim(),
        photo: oldStudent ? oldStudent.photo : ""
    };

    getPhoto(document.getElementById("photo").files[0], student);
});

function displayStudents() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedCourse = filterCourse.value;
    const filteredStudents = students.filter(function (student) {
        const nameMatches = student.name.toLowerCase().includes(searchValue);
        const courseMatches = selectedCourse === "All Courses" || student.course === selectedCourse;
        return nameMatches && courseMatches;
    });

    studentContainer.innerHTML = "";

    if (filteredStudents.length === 0) {
        studentContainer.innerHTML = '<p class="no-student">No students found</p>';
        return;
    }

    filteredStudents.forEach(function (student) {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        card.innerHTML = `
            <img src="${student.photo}" alt="${student.name}">
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone}</p>
            <p><strong>DOB:</strong> ${student.dob}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Skills:</strong> ${student.skills.join(", ")}</p>
            <p><strong>About:</strong> ${student.about}</p>
            <button class="edit-button" type="button">Edit</button>
            <button class="delete-button" type="button">Delete</button>
        `;
        studentContainer.appendChild(card);
    });
}

function updateStatistics() {
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("webCount").textContent = countCourse("Web Development");
    document.getElementById("uiCount").textContent = countCourse("UI/UX");
    document.getElementById("pythonCount").textContent = countCourse("Python");
    document.getElementById("dataCount").textContent = countCourse("Data Analytics");
    document.getElementById("mernCount").textContent = countCourse("MERN Stack");
    document.getElementById("cloudCount").textContent = countCourse("Cloud Computing");
}

function countCourse(courseName) {
    return students.filter(function (student) {
        return student.course === courseName;
    }).length;
}

studentContainer.addEventListener("click", function (event) {
    const card = event.target.closest(".student-card");

    if (!card) {
        return;
    }

    const id = Number(card.getAttribute("data-id"));

    if (event.target.classList.contains("delete-button")) {
        const answer = confirm("Are you sure you want to delete this student?");
        if (answer) {
            students = students.filter(function (student) {
                return student.id !== id;
            });
            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
            updateStatistics();
        }
    }

    if (event.target.classList.contains("edit-button")) {
        editStudent(id);
    }
});

function editStudent(id) {
    const student = students.find(function (item) {
        return item.id === id;
    });

    document.getElementById("studentName").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("phone").value = student.phone;
    document.getElementById("dob").value = student.dob;
    document.getElementById("course").value = student.course;
    about.value = student.about;
    charCount.textContent = student.about.length;

    document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
    const skillInputs = document.querySelectorAll('input[name="skill"]');
    skillInputs.forEach(function (skill) {
        skill.checked = student.skills.includes(skill.value);
    });

    editId = id;
    submitButton.textContent = "Update Student";
    clearErrors();
    window.scrollTo(0, 0);
}

function resetForm() {
    studentForm.reset();
    editId = null;
    submitButton.textContent = "Register Student";
    charCount.textContent = "0";
    clearErrors();
}

resetButton.addEventListener("click", function () {
    resetForm();
});

about.addEventListener("input", function () {
    charCount.textContent = about.value.length;
    if (about.value.trim().length >= 20) {
        showError("aboutError", "");
    }
});

searchInput.addEventListener("input", displayStudents);
filterCourse.addEventListener("change", displayStudents);

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "Light Mode";
    } else {
        themeButton.textContent = "Dark Mode";
    }
});

displayStudents();
updateStatistics();
