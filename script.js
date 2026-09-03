let students = JSON.parse(localStorage.getItem("students")) || [];
let editingStudentId = null;

const ALL_COURSES = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];

const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("date-of-birth");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("profile-photo");
const charCount = document.getElementById("charCount");
const submitBtn = document.getElementById("submitBtn");

const studentCardsContainer = document.getElementById("student-cards");
const totalStudentsCount = document.getElementById("totalStudentsCount");
const courseStatsContainer = document.getElementById("courseStats");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const themeToggleBtn = document.getElementById("themeToggleBtn");

themeToggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "Light Mode";
}

aboutInput.addEventListener("input", function () {
    charCount.textContent = aboutInput.value.length;
});

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearError(elementId) {
    document.getElementById(elementId).textContent = "";
}

function setFieldStatus(inputElement, isValid) {
    if (isValid) {
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
    } else {
        inputElement.classList.remove("valid");
        inputElement.classList.add("invalid");
    }
}

function validateForm() {
    let isValid = true;

    const nameValue = nameInput.value.trim();
    const namePattern = /^[A-Za-z\s]{3,40}$/;
    if (!namePattern.test(nameValue)) {
        showError("nameError", "Name must contain 3-40 letters and spaces only.");
        setFieldStatus(nameInput, false);
        isValid = false;
    } else {
        clearError("nameError");
        setFieldStatus(nameInput, true);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        showError("emailError", "Please enter a valid email address.");
        setFieldStatus(emailInput, false);
        isValid = false;
    } else {
        clearError("emailError");
        setFieldStatus(emailInput, true);
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
        showError("phoneError", "Phone number must be exactly 10 digits.");
        setFieldStatus(phoneInput, false);
        isValid = false;
    } else {
        clearError("phoneError");
        setFieldStatus(phoneInput, true);
    }

    if (dobInput.value === "") {
        showError("dobError", "Date of birth is required.");
        setFieldStatus(dobInput, false);
        isValid = false;
    } else {
        const dob = new Date(dobInput.value);
        const today = new Date();
        
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (dob > today) {
            showError("dobError", "Future dates are not allowed.");
            setFieldStatus(dobInput, false);
            isValid = false;
        } else if (age < 15) {
            showError("dobError", "Student must be at least 15 years old.");
            setFieldStatus(dobInput, false);
            isValid = false;
        } else {
            clearError("dobError");
            setFieldStatus(dobInput, true);
        }
    }

    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (!selectedGender) {
        showError("genderError", "Please select a gender.");
        isValid = false;
    } else {
        clearError("genderError");
    }

    if (courseInput.value === "") {
        showError("courseError", "Please select a course.");
        setFieldStatus(courseInput, false);
        isValid = false;
    } else {
        clearError("courseError");
        setFieldStatus(courseInput, true);
    }

    const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
    if (selectedSkills.length === 0) {
        showError("skillsError", "Please select at least one skill.");
        isValid = false;
    } else {
        clearError("skillsError");
    }

    const aboutValue = aboutInput.value.trim();
    if (aboutValue === "") {
        showError("aboutError", "Spaces-only or empty description is not allowed.");
        setFieldStatus(aboutInput, false);
        isValid = false;
    } else if (aboutValue.length < 20 || aboutValue.length > 200) {
        showError("aboutError", "About student must be between 20 and 200 characters.");
        setFieldStatus(aboutInput, false);
        isValid = false;
    } else {
        clearError("aboutError");
        setFieldStatus(aboutInput, true);
    }

    if (editingStudentId === null && photoInput.files.length === 0) {
        showError("photoError", "Profile photo is required.");
        setFieldStatus(photoInput, false);
        isValid = false;
    } else if (photoInput.files.length > 0) {
        const fileName = photoInput.files[0].name;
        const validExtensions = /\.(jpg|jpeg|png)$/i;
        if (!validExtensions.test(fileName)) {
            showError("photoError", "Only .jpg, .jpeg, and .png images are allowed.");
            setFieldStatus(photoInput, false);
            isValid = false;
        } else {
            clearError("photoError");
            setFieldStatus(photoInput, true);
        }
    } else {
        clearError("photoError");
    }

    return isValid;
}

function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCourse = filterCourse.value;

    const filtered = students.filter(student => {
        const matchesName = student.name.toLowerCase().includes(searchTerm);
        const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
        return matchesName && matchesCourse;
    });

    renderStudents(filtered);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value);

    const processSubmission = (photoUrl) => {
        if (editingStudentId !== null) {
            const index = students.findIndex(s => s.id === editingStudentId);
            if (index !== -1) {
                students[index] = {
                    id: editingStudentId,
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    dob: dobInput.value,
                    gender: selectedGender,
                    course: courseInput.value,
                    skills: selectedSkills,
                    about: aboutInput.value.trim(),
                    photo: photoUrl || students[index].photo
                };
            }
        } else {
            const newStudent = {
                id: Date.now().toString(),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                dob: dobInput.value,
                gender: selectedGender,
                course: courseInput.value,
                skills: selectedSkills,
                about: aboutInput.value.trim(),
                photo: photoUrl
            };
            students.push(newStudent);
        }

        saveToLocalStorage();
        resetFormState();
        applyFilters();
        updateStatistics();
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            processSubmission(e.target.result);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        processSubmission(null);
    }
});

studentCardsContainer.addEventListener("click", function (event) {
    const card = event.target.closest(".student-card");
    if (!card) return;

    const studentId = card.getAttribute("data-id");

    if (event.target.classList.contains("delete-btn")) {
        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
            students = students.filter(student => student.id !== studentId);
            saveToLocalStorage();
            applyFilters();
            updateStatistics();
        }
    }

    if (event.target.classList.contains("edit-btn")) {
        const studentToEdit = students.find(student => student.id === studentId);
        if (studentToEdit) {
            editingStudentId = studentToEdit.id;

            nameInput.value = studentToEdit.name;
            emailInput.value = studentToEdit.email;
            phoneInput.value = studentToEdit.phone;
            dobInput.value = studentToEdit.dob;
            courseInput.value = studentToEdit.course;
            aboutInput.value = studentToEdit.about;
            charCount.textContent = studentToEdit.about.length;

            const genderRadio = document.querySelector(`input[name="gender"][value="${studentToEdit.gender}"]`);
            if (genderRadio) genderRadio.checked = true;

            document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
                checkbox.checked = studentToEdit.skills.includes(checkbox.value);
            });

            submitBtn.textContent = "Update Student";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

searchInput.addEventListener("input", applyFilters);
filterCourse.addEventListener("change", applyFilters);

function renderStudents(listToRender = students) {
    studentCardsContainer.innerHTML = "";

    if (listToRender.length === 0) {
        studentCardsContainer.innerHTML = `<div class="no-students">No students found</div>`;
        return;
    }

    listToRender.forEach(student => {
        const card = document.createElement("div");
        card.className = "student-card";
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
            <div class="card-actions">
                <button type="button" class="edit-btn">Edit</button>
                <button type="button" class="delete-btn">Delete</button>
            </div>
        `;

        studentCardsContainer.appendChild(card);
    });
}

function updateStatistics() {
    totalStudentsCount.textContent = students.length;

    const courseCounts = {};
    ALL_COURSES.forEach(course => courseCounts[course] = 0);

    students.forEach(s => {
        if (courseCounts[s.course] !== undefined) {
            courseCounts[s.course]++;
        }
    });

    courseStatsContainer.innerHTML = "";
    ALL_COURSES.forEach(course => {
        const statItem = document.createElement("div");
        statItem.className = "stat-item";
        statItem.innerHTML = `<strong>${course}:</strong> ${courseCounts[course]}`;
        courseStatsContainer.appendChild(statItem);
    });
}

function resetFormState() {
    form.reset();
    editingStudentId = null;
    submitBtn.textContent = "Register Student";
    charCount.textContent = "0";

    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    document.querySelectorAll("input, select, textarea").forEach(input => {
        input.classList.remove("valid", "invalid");
    });
}

form.addEventListener("reset", function (e) {
    e.preventDefault();
    resetFormState();
});

applyFilters();
updateStatistics();