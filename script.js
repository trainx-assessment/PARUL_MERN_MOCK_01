const form = document.querySelector("#studentForm");

const studentNameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#profilePhoto");

const submitButton = document.querySelector("#submitButton");
const resetButton = document.querySelector("#resetButton");

const studentContainer = document.querySelector("#studentContainer");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");

const characterCounter = document.querySelector("#characterCounter");
const themeButton = document.querySelector("#themeButton");


// Student Array

let students = [];

let editingId = null;


// Load students from localStorage

const savedStudents = localStorage.getItem("students");

if (savedStudents) {
    students = JSON.parse(savedStudents);
}


// Date restrictions

const today = new Date().toISOString().split("T")[0];

dobInput.setAttribute("max", today);


// Character Counter

aboutInput.addEventListener("input", function () {

    characterCounter.textContent =
        aboutInput.value.length + " / 200";

});


// Remove validation message

function clearErrors() {

    document.querySelector("#studentNameError").textContent = "";
    document.querySelector("#emailError").textContent = "";
    document.querySelector("#phoneError").textContent = "";
    document.querySelector("#dobError").textContent = "";
    document.querySelector("#genderError").textContent = "";
    document.querySelector("#courseError").textContent = "";
    document.querySelector("#skillsError").textContent = "";
    document.querySelector("#aboutError").textContent = "";
    document.querySelector("#photoError").textContent = "";
}


// Show error

function showError(id, message) {

    document.querySelector("#" + id).textContent = message;

}


// Get selected gender

function getSelectedGender() {

    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );

    if (gender) {
        return gender.value;
    }

    return "";
}


// Get selected skills

function getSelectedSkills() {

    const checkedSkills =
        document.querySelectorAll(
            'input[name="skills"]:checked'
        );

    const skills = [];

    checkedSkills.forEach(function (skill) {
        skills.push(skill.value);
    });

    return skills;
}


// Validate form

function validateForm() {

    clearErrors();

    let isValid = true;

    const name = studentNameInput.value.trim();

    const email = emailInput.value.trim();

    const phone = phoneInput.value.trim();

    const dob = dobInput.value;

    const gender = getSelectedGender();

    const course = courseInput.value;

    const skills = getSelectedSkills();

    const about = aboutInput.value.trim();


    // Name validation

    const nameRegex = /^[A-Za-z ]{3,40}$/;

    if (name === "") {

        showError(
            "studentNameError",
            "Student name is required."
        );

        isValid = false;

    } else if (!nameRegex.test(name)) {

        showError(
            "studentNameError",
            "Name must contain only letters and spaces (3-40 characters)."
        );

        isValid = false;
    }


    // Email validation

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {

        showError(
            "emailError",
            "Email is required."
        );

        isValid = false;

    } else if (!emailRegex.test(email)) {

        showError(
            "emailError",
            "Enter a valid email address."
        );

        isValid = false;
    }


    // Phone validation

    const phoneRegex = /^\d{10}$/;

    if (phone === "") {

        showError(
            "phoneError",
            "Phone number is required."
        );

        isValid = false;

    } else if (!phoneRegex.test(phone)) {

        showError(
            "phoneError",
            "Phone number must contain exactly 10 digits."
        );

        isValid = false;
    }


    // DOB validation

    if (dob === "") {

        showError(
            "dobError",
            "Date of birth is required."
        );

        isValid = false;

    } else {

        const birthDate = new Date(dob);
        const currentDate = new Date();

        if (birthDate > currentDate) {

            showError(
                "dobError",
                "Future dates are not allowed."
            );

            isValid = false;
        }


        // Age validation

        let age =
            currentDate.getFullYear() -
            birthDate.getFullYear();

        const monthDifference =
            currentDate.getMonth() -
            birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                currentDate.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        if (age < 15) {

            showError(
                "dobError",
                "Student must be at least 15 years old."
            );

            isValid = false;
        }
    }


    // Gender validation

    if (gender === "") {

        showError(
            "genderError",
            "Please select a gender."
        );

        isValid = false;
    }


    // Course validation

    if (course === "") {

        showError(
            "courseError",
            "Please select a course."
        );

        isValid = false;
    }


    // Skills validation

    if (skills.length === 0) {

        showError(
            "skillsError",
            "Select at least one skill."
        );

        isValid = false;
    }


    // About validation

    if (about === "") {

        showError(
            "aboutError",
            "About student is required."
        );

        isValid = false;

    } else if (about.length < 20) {

        showError(
            "aboutError",
            "About student must contain at least 20 characters."
        );

        isValid = false;

    } else if (about.length > 200) {

        showError(
            "aboutError",
            "About student cannot exceed 200 characters."
        );

        isValid = false;
    }


    // Photo validation

    if (editingId === null && photoInput.files.length === 0) {

        showError(
            "photoError",
            "Profile photo is required."
        );

        isValid = false;
    }

    if (photoInput.files.length > 0) {

        const file = photoInput.files[0];

        if (!file.type.startsWith("image/")) {

            showError(
                "photoError",
                "Only image files are allowed."
            );

            isValid = false;
        }
    }


    return isValid;
}


// Convert image to Base64

function convertImageToBase64(file) {

    return new Promise(function (resolve, reject) {

        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject(reader.error);
        };

        reader.readAsDataURL(file);

    });
}


// Form Submit

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    if (!validateForm()) {
        return;
    }


    const name = studentNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const gender = getSelectedGender();
    const course = courseInput.value;
    const skills = getSelectedSkills();
    const about = aboutInput.value.trim();


    let photo = "";


    // New photo

    if (photoInput.files.length > 0) {

        photo =
            await convertImageToBase64(
                photoInput.files[0]
            );

    }


    // EDIT MODE

    if (editingId !== null) {

        const student =
            students.find(function (student) {
                return student.id === editingId;
            });


        if (student) {

            student.name = name;
            student.email = email;
            student.phone = phone;
            student.dob = dob;
            student.gender = gender;
            student.course = course;
            student.skills = skills;
            student.about = about;


            if (photo !== "") {
                student.photo = photo;
            }
        }


        alert("Student updated successfully.");

    }


    // ADD MODE

    else {

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

            photo: photo
        };


        students.push(student);

        alert("Student registered successfully.");
    }


    saveStudents();

    renderStudents();

    updateStatistics();

    resetForm();

});


// Save students

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// Render students

function renderStudents() {

    studentContainer.innerHTML = "";


    const searchText =
        searchInput.value.trim().toLowerCase();

    const selectedCourse =
        courseFilter.value;


    const filteredStudents =
        students.filter(function (student) {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCourse =
                selectedCourse === "All Courses" ||
                student.course === selectedCourse;


            return matchesSearch && matchesCourse;

        });


    if (filteredStudents.length === 0) {

        document.querySelector("#noStudents").style.display =
            "block";

        return;

    }


    document.querySelector("#noStudents").style.display =
        "none";


    filteredStudents.forEach(function (student) {

        createStudentCard(student);

    });

}


// Create student card

function createStudentCard(student) {

    const card =
        document.createElement("div");

    card.classList.add("student-card");

    card.setAttribute(
        "data-id",
        student.id
    );


    const image =
        document.createElement("img");

    image.classList.add("student-photo");

    image.src = student.photo;

    image.alt =
        student.name + " profile photo";


    const content =
        document.createElement("div");

    content.classList.add("student-content");


    const heading =
        document.createElement("h3");

    heading.textContent =
        student.name;


    const email =
        createInfo(
            "Email",
            student.email
        );


    const phone =
        createInfo(
            "Phone",
            student.phone
        );


    const dob =
        createInfo(
            "DOB",
            formatDate(student.dob)
        );


    const gender =
        createInfo(
            "Gender",
            student.gender
        );


    const course =
        createInfo(
            "Course",
            student.course
        );


    const skillsContainer =
        document.createElement("div");

    skillsContainer.classList.add("skills");


    student.skills.forEach(function (skill) {

        const skillTag =
            document.createElement("span");

        skillTag.classList.add("skill-tag");

        skillTag.textContent = skill;

        skillsContainer.appendChild(skillTag);

    });


    const about =
        document.createElement("p");

    about.classList.add("about-text");

    about.textContent =
        student.about;


    const actions =
        document.createElement("div");

    actions.classList.add("card-actions");


    const editButton =
        document.createElement("button");

    editButton.classList.add("edit-btn");

    editButton.textContent = "Edit";


    const deleteButton =
        document.createElement("button");

    deleteButton.classList.add("delete-btn");

    deleteButton.textContent = "Delete";


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    content.appendChild(heading);

    content.appendChild(email);

    content.appendChild(phone);

    content.appendChild(dob);

    content.appendChild(gender);

    content.appendChild(course);

    content.appendChild(skillsContainer);

    content.appendChild(about);

    content.appendChild(actions);


    card.appendChild(image);

    card.appendChild(content);


    studentContainer.appendChild(card);

}


// Create information element

function createInfo(label, value) {

    const paragraph =
        document.createElement("p");

    paragraph.classList.add("student-info");


    const strong =
        document.createElement("strong");

    strong.textContent =
        label + ": ";


    const text =
        document.createTextNode(value);


    paragraph.appendChild(strong);

    paragraph.appendChild(text);


    return paragraph;

}


// Format date

function formatDate(date) {

    if (!date) {
        return "";
    }

    const parts =
        date.split("-");

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );
}


// Event Delegation

studentContainer.addEventListener(
    "click",
    function (event) {


        // EDIT

        if (
            event.target.classList.contains("edit-btn")
        ) {

            const card =
                event.target.closest(".student-card");


            const id =
                Number(
                    card.getAttribute("data-id")
                );


            editStudent(id);

        }


        // DELETE

        if (
            event.target.classList.contains("delete-btn")
        ) {

            const card =
                event.target.closest(".student-card");


            const id =
                Number(
                    card.getAttribute("data-id")
                );


            deleteStudent(id);

        }

    }
);


// Delete student

function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {
        return;
    }


    students =
        students.filter(function (student) {

            return student.id !== id;

        });


    saveStudents();

    renderStudents();

    updateStatistics();

    alert("Student deleted successfully.");

}


// Edit student

function editStudent(id) {

    const student =
        students.find(function (student) {

            return student.id === id;

        });


    if (!student) {
        return;
    }


    editingId = id;


    studentNameInput.value =
        student.name;

    emailInput.value =
        student.email;

    phoneInput.value =
        student.phone;

    dobInput.value =
        student.dob;

    courseInput.value =
        student.course;

    aboutInput.value =
        student.about;


    characterCounter.textContent =
        aboutInput.value.length +
        " / 200";


    // Gender

    document
        .querySelectorAll(
            'input[name="gender"]'
        )
        .forEach(function (radio) {

            radio.checked =
                radio.value === student.gender;

        });


    // Skills

    document
        .querySelectorAll(
            'input[name="skills"]'
        )
        .forEach(function (checkbox) {

            checkbox.checked =
                student.skills.includes(
                    checkbox.value
                );

        });


    submitButton.textContent =
        "Update Student";


    clearErrors();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Reset form

function resetForm() {

    form.reset();

    clearErrors();


    editingId = null;


    submitButton.textContent =
        "Register Student";


    characterCounter.textContent =
        "0 / 200";


    dobInput.setAttribute(
        "max",
        today
    );

}


// Reset button

resetButton.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


// Search

searchInput.addEventListener(
    "input",
    function () {

        renderStudents();

    }
);


// Filter

courseFilter.addEventListener(
    "change",
    function () {

        renderStudents();

    }
);


// Statistics

function updateStatistics() {

    document.querySelector("#totalStudents")
        .textContent = students.length;


    document.querySelector("#webDevelopmentCount")
        .textContent =
            countCourse("Web Development");


    document.querySelector("#uiuxCount")
        .textContent =
            countCourse("UI/UX");


    document.querySelector("#pythonCount")
        .textContent =
            countCourse("Python");


    document.querySelector("#dataAnalyticsCount")
        .textContent =
            countCourse("Data Analytics");


    document.querySelector("#mernStackCount")
        .textContent =
            countCourse("MERN Stack");


    document.querySelector("#cloudComputingCount")
        .textContent =
            countCourse("Cloud Computing");

}


// Count course

function countCourse(courseName) {

    return students.filter(function (student) {

        return student.course === courseName;

    }).length;

}


// Dark Mode

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeButton.textContent =
                "Light Mode";

        } else {

            themeButton.textContent =
                "Dark Mode";

        }

    }
);


// Initial render

renderStudents();

updateStatistics();