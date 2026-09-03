let students = [];
let editId = null;

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("studentName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");

const studentContainer = document.getElementById("studentContainer");
const searchInput = document.getElementById("search");
const filterCourse = document.getElementById("filterCourse");
const counter = document.getElementById("counter");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

aboutInput.addEventListener("input", function() {
    counter.textContent = aboutInput.value.length + " / 200";
});

form.addEventListener("submit", function(event) {
    event.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const course = courseInput.value;
    const about = aboutInput.value.trim();

    const genderElement = document.querySelector('input[name="gender"]:checked');
    const gender = genderElement ? genderElement.value : "";

    const skillElements = document.querySelectorAll('input[name="skills"]:checked');
    const skills = [];

    skillElements.forEach(function(skill) {
        skills.push(skill.value);
    });

    let valid = true;

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        document.getElementById("nameError").textContent = "Enter a valid name.";
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email.";
        valid = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        document.getElementById("phoneError").textContent = "Enter 10 digit phone number.";
        valid = false;
    }

    if (dob === "") {
        document.getElementById("dobError").textContent = "Select date of birth.";
        valid = false;
    } else if (new Date(dob) > new Date()) {
        document.getElementById("dobError").textContent = "Future date is not allowed.";
        valid = false;
    }

    if (gender === "") {
        document.getElementById("genderError").textContent = "Select gender.";
        valid = false;
    }

    if (course === "") {
        document.getElementById("courseError").textContent = "Select course.";
        valid = false;
    }

    if (skills.length === ) {
        document.getElementById("skillsError").textContent = "Select at least one skill.";
        valid = false;
    }

    if (about.length < 20 || about.length > 200) {
        document.getElementById("aboutError").textContent = "Enter 20 to 200 characters.";
        valid = false;
    }

    if (editId === null && photoInput.files.length === 0) {
        document.getElementById("photoError").textContent = "Select profile photo.";
        valid = false;
    }

    if (!valid) {
        return;
    }

    if (editId !== null) {
        const student = students.find(function(student) {
            return student.id === editId;
        });

        student.name = name;
        student.email = email;
        student.phone = phone;
        student.dob = dob;
        student.gender = gender;
        student.course = course;
        student.skills = skills;
        student.about = about;

        editId = null;
        submitBtn.textContent = "Add Student";
    } else {
        const student = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender,
            course: course,
            skills: skills,
            about: about,
            photo: URL.createObjectURL(photoInput.files[0])
        };

        students.push(student);
    }

    saveStudents();
    displayStudents();
    updateStatistics();
    resetForm();
});

function displayStudents() {
    studentContainer.innerHTML = "";

    const text = searchInput.value.toLowerCase();
    const course = filterCourse.value;

    const result = students.filter(function(student) {
        return student.name.toLowerCase().includes(text) &&
        (course === "" || student.course === course);
    });

    if (result.length === 0) {
        studentContainer.innerHTML = "<p>No students found.</p>";
        return;
    }

    result.forEach(function(student) {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const image = document.createElement("img");
        image.src = student.photo;

        const heading = document.createElement("h3");
        heading.textContent = student.name;

        const email = document.createElement("p");
        email.textContent = "Email: " + student.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + student.phone;

        const dob = document.createElement("p");
        dob.textContent = "DOB: " + student.dob;

        const gender = document.createElement("p");
        gender.textContent = "Gender: " + student.gender;

        const courseText = document.createElement("p");
        courseText.textContent = "Course: " + student.course;

        const skills = document.createElement("p");
        skills.textContent = "Skills: " + student.skills.join(", ");

        const about = document.createElement("p");
        about.textContent = "About: " + student.about;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        card.appendChild(image);
        card.appendChild(heading);
        card.appendChild(email);
        card.appendChild(phone);
        card.appendChild(dob);
        card.appendChild(gender);
        card.appendChild(courseText);
        card.appendChild(skills);
        card.appendChild(about);
        card.appendChild(editButton);
        card.appendChild(deleteButton);

        studentContainer.appendChild(card);
    });
}

studentContainer.addEventListener("click", function(event) {
    const card = event.target.closest(".student-card");

    if (!card) {
        return;
    }

    const id = Number(card.getAttribute("data-id"));

    if (event.target.classList.contains("delete-btn")) {
        if (confirm("Delete this student?")) {
            students = students.filter(function(student) {
                return student.id !== id;
            });

            saveStudents();
            displayStudents();
            updateStatistics();
        }
    }

    if (event.target.classList.contains("edit-btn")) {
        const student = students.find(function(student) {
            return student.id === id;
        });

        nameInput.value = student.name;
        emailInput.value = student.email;
        phoneInput.value = student.phone;
        dobInput.value = student.dob;
        courseInput.value = student.course;
        aboutInput.value = student.about;
        counter.textContent = student.about.length + " / 200";

        document.querySelectorAll('input[name="gender"]').forEach(function(radio) {
            radio.checked = radio.value === student.gender;
        });

        document.querySelectorAll('input[name="skills"]').forEach(function(skill) {
            skill.checked = student.skills.includes(skill.value);
        });

        editId = student.id;
        submitBtn.textContent = "Update Student";
    }
});

searchInput.addEventListener("input", displayStudents);
filterCourse.addEventListener("change", displayStudents);
resetBtn.addEventListener("click", resetForm);

function resetForm() {
    form.reset();
    clearErrors();
    counter.textContent = "0 / 200";
    editId = null;
    submitBtn.textContent = "Add Student";
}

function clearErrors() {
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("dobError").textContent = "";
    document.getElementById("genderError").textContent = "";
    document.getElementById("courseError").textContent = "";
    document.getElementById("skillsError").textContent = "";
    document.getElementById("aboutError").textContent = "";
    document.getElementById("photoError").textContent = "";
}

function updateStatistics() {
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("webCount").textContent = countCourse("Web Development");
    document.getElementById("uiuxCount").textContent = countCourse("UI/UX");
    document.getElementById("pythonCount").textContent = countCourse("Python");
    document.getElementById("dataCount").textContent = countCourse("Data Analytics");
    document.getElementById("mernCount").textContent = countCourse("MERN Stack");
    document.getElementById("cloudCount").textContent = countCourse("Cloud Computing");
}

function countCourse(courseName) {
    return students.filter(function(student) {
        return student.course === courseName;
    }).length;
}

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

const savedStudents = localStorage.getItem("students");

if (savedStudents) {
    students = JSON.parse(savedStudents);
}

displayStudents();
updateStatistics();