const form = document.getElementById("studentForm");
const studentCards = document.getElementById("studentCards");
const statistics = document.getElementById("statistics");
const aboutStudent = document.getElementById("aboutStudent");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

// Form Submit
form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm()) return;

    const gender = document.querySelector('input[name="gender"]:checked');
    const skills = [...document.querySelectorAll('input[name="skills"]:checked')]
        .map(x => x.value);
    const photo = document.getElementById("profilePhoto").files[0];

    const data = {
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: document.getElementById("dob").value,
        gender: gender.value,
        course: document.getElementById("course").value,
        skills,
        about: aboutStudent.value.trim()
    };

    if (editId !== null) {
        const student = students.find(x => x.id === editId);
        Object.assign(student, data);
        if (photo) student.photo = URL.createObjectURL(photo);
        alert("Student Updated Successfully!");
    } else {
        students.push({
            id: Date.now(),
            ...data,
            photo: photo ? URL.createObjectURL(photo) : ""
        });
        alert("Student Registered Successfully!");
    }

    saveStudents();
    renderStudents();
    updateStatistics();
    resetForm();
});

// Validation the form
function validateForm() {
    clearErrors();
    let valid = true;

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const course = document.getElementById("course").value;
    const skills = document.querySelectorAll('input[name="skills"]:checked');
    const about = aboutStudent.value.trim();
    const photo = document.getElementById("profilePhoto").files[0];

    // Name
    if (!name) {
        showError("studentName", "Name is required");
        valid = false;
    } else if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        showError("studentName", "Name must be 3-40 letters");
        valid = false;
    }

    // Email
    if (!email) {
        showError("email", "Email is required");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Enter a valid email");
        valid = false;
    }

    // Phone
    if (!phone) {
        showError("phone", "Phone number is required");
        valid = false;
    } else if (!/^\d{10}$/.test(phone)) {
        showError("phone", "Phone must contain 10 digits");
        valid = false;
    }

    // DOB
    if (!dob) {
        showError("dob", "Date of birth is required");
        valid = false;
    } else {
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        if (new Date(dob) > new Date()) {
            showError("dob", "Future date is not allowed");
            valid = false;
        } else if (age < 15) {
            showError("dob", "Student must be at least 15 years old");
            valid = false;
        }
    }

    // Gender
    if (!gender) {
        showError("gender", "Select gender");
        valid = false;
    }

    // Course
    if (!course) {
        showError("course", "Select a course");
        valid = false;
    }

    // Skills
    if (!skills.length) {
        showError("skills", "Select at least one skill");
        valid = false;
    }

    // About
    if (!about) {
        showError("aboutStudent", "About student is required");
        valid = false;
    } else if (about.length < 20) {
        showError("aboutStudent", "Minimum 20 characters required");
        valid = false;
    } else if (about.length > 200) {
        showError("aboutStudent", "Maximum 200 characters allowed");
        valid = false;
    }

    // Photo
    if (!editId && !photo) {
        showError("profilePhoto", "Profile photo is required");
        valid = false;
    }

    if (photo && !["image/jpeg", "image/png"].includes(photo.type)) {
        showError("profilePhoto", "Only JPG, JPEG and PNG allowed");
        valid = false;
    }

    return valid;
}

// Error Message
function showError(id, message) {
    const input = document.getElementById(id);
    const error = document.createElement("small");
    error.className = "error";
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(x => x.remove());
}

// counting the Characters
aboutStudent.addEventListener("input", () => {
    let counter = aboutStudent.parentElement.querySelector(".character-counter");

    if (!counter) {
        counter = document.createElement("small");
        counter.className = "character-counter";
        aboutStudent.parentElement.appendChild(counter);
    }

    counter.textContent = `${aboutStudent.value.length} / 200`;
});

// Render Students
function renderStudents() {
    studentCards.innerHTML = "";

    const search = document.getElementById("searchStudent").value.toLowerCase();
    const course = document.getElementById("filterCourse").value;

    const result = students.filter(s =>
        s.name.toLowerCase().includes(search) &&
        (!course || s.course === course)
    );

    if (!result.length) {
        studentCards.innerHTML = "<p>No students found</p>";
        return;
    }

    result.forEach(s => {
        const card = document.createElement("div");
        card.className = "student-card";
        card.dataset.id = s.id;

        card.innerHTML = `
            ${s.photo ? `<img src="${s.photo}" alt="${s.name}">` : ""}
            <h3>${s.name}</h3>
            <p>Email: ${s.email}</p>
            <p>Phone: ${s.phone}</p>
            <p>DOB: ${s.dob}</p>
            <p>Gender: ${s.gender}</p>
            <p>Course: ${s.course}</p>
            <p>Skills: ${s.skills.join(", ")}</p>
            <p>About: ${s.about}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        studentCards.appendChild(card);
    });
}

// Event Delegation
studentCards.addEventListener("click", e => {
    const card = e.target.closest(".student-card");
    if (!card) return;

    const id = Number(card.dataset.id);

    // Delete
    if (e.target.classList.contains("delete-btn")) {
        if (!confirm("Are you sure you want to delete this student?")) return;

        students = students.filter(s => s.id !== id);
        saveStudents();
        renderStudents();
        updateStatistics();
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {
        const s = students.find(x => x.id === id);
        if (!s) return;

        document.getElementById("studentName").value = s.name;
        document.getElementById("email").value = s.email;
        document.getElementById("phone").value = s.phone;
        document.getElementById("dob").value = s.dob;
        document.getElementById("course").value = s.course;
        aboutStudent.value = s.about;

        document.querySelectorAll('input[name="gender"]').forEach(x =>
            x.checked = x.value === s.gender
        );

        document.querySelectorAll('input[name="skills"]').forEach(x =>
            x.checked = s.skills.includes(x.value)
        );

        editId = id;
        document.getElementById("registerBtn").textContent = "Update Student";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

// Search
document.getElementById("searchStudent")
    .addEventListener("input", renderStudents);

document.getElementById("filterCourse")
    .addEventListener("change", renderStudents);

// Statistics
function updateStatistics() {
    const courses = [
        "Web Development",
        "UI/UX",
        "Python",
        "Data Analytics",
        "MERN Stack",
        "Cloud Computing"
    ];

    statistics.innerHTML = `
        <div class="stat-card">
            <h3>Total Students</h3>
            <p>${students.length}</p>
        </div>
    `;

    courses.forEach(course => {
        const count = students.filter(s => s.course === course).length;

        statistics.innerHTML += `
            <div class="stat-card">
                <h3>${course}</h3>
                <p>${count}</p>
            </div>
        `;
    });
}

// saving the data
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Reset Form
function resetForm() {
    form.reset();
    clearErrors();
    aboutStudent.value = "";
    editId = null;
    document.getElementById("registerBtn").textContent = "Register Student";

    const counter = aboutStudent.parentElement.querySelector(".character-counter");
    if (counter) counter.textContent = "0 / 200";
}

document.getElementById("resetBtn").addEventListener("click", resetForm);

// removing the error
document.querySelectorAll(
    "#studentForm input, #studentForm select, #studentForm textarea"
).forEach(input => {
    input.addEventListener("input", () => {
        input.parentElement.querySelector(".error")?.remove();
    });

    input.addEventListener("change", () => {
        input.parentElement.querySelector(".error")?.remove();
    });
});

// load students
renderStudents();
updateStatistics();