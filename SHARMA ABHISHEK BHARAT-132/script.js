/* This code had been taken from ChatGPT  because the topics that included hasn't even started in our Batch 10*/


/* =========================================================
   STUDENT APPLICATION MANAGEMENT SYSTEM
   ========================================================= */


/* =========================================================
   1. SELECT FORM ELEMENTS
   ========================================================= */

const form = document.querySelector("form");

const nameInput = document.querySelector(
    'input[placeholder="Enter you Name"]'
);

const emailInput = document.querySelector(
    'input[name="email"]'
);

const phoneInput = document.querySelector(
    'input[value="XXXXXXX123"]'
);

const dobInput = document.querySelector(
    'input[type="date"]'
);

const genderInputs = document.querySelectorAll(
    'input[type="radio"]'
);

const courseInput = document.querySelector(
    "#course"
);

const skillInputs = document.querySelectorAll(
    'input[type="checkbox"]'
);

const aboutInput = document.querySelector(
    "textarea"
);

const photoInput = document.querySelector(
    'input[type="file"]'
);

const submitButton = document.querySelector(
    'button[type="submit"]'
);

const resetButton = document.querySelector(
    'button[type="reset"]'
);


/* =========================================================
   2. STUDENT ARRAY
   ========================================================= */

let students = JSON.parse(
    localStorage.getItem("students")
) || [];

let editingId = null;


/* =========================================================
   3. CREATE MAIN CONTAINERS DYNAMICALLY
   ========================================================= */

const statistics = document.createElement("section");

statistics.id = "statistics";

statistics.innerHTML = `
    <h2>Student Statistics</h2>

    <div class="total-students">
        Total Students:
        <span id="total-students">0</span>
    </div>

    <div id="course-statistics"></div>
`;


const searchSection = document.createElement("section");

searchSection.id = "search-section";

searchSection.innerHTML = `
    <h2>Search and Filter Students</h2>

    <input
        type="text"
        id="search-student"
        placeholder="Search student by name..."
    >

    <select id="filter-course">
        <option value="all">All Courses</option>
        <option value="Web Development">Web Development</option>
        <option value="UI/UX">UI/UX</option>
        <option value="Python">Python</option>
        <option value="Data Analytics">Data Analytics</option>
        <option value="MERN Stack">MERN Stack</option>
        <option value="Cloud Computing">Cloud Computing</option>
    </select>
`;


const studentSection = document.createElement("section");

studentSection.id = "student-section";

studentSection.innerHTML = `
    <h2>Registered Students</h2>
    <div id="student-container"></div>
`;


/* Add sections to page */

form.parentNode.insertBefore(
    statistics,
    form
);

form.parentNode.insertBefore(
    searchSection,
    form
);

form.parentNode.appendChild(
    studentSection
);


/* =========================================================
   4. SELECT CREATED ELEMENTS
   ========================================================= */

const totalStudents =
    document.querySelector("#total-students");

const courseStatistics =
    document.querySelector("#course-statistics");

const studentContainer =
    document.querySelector("#student-container");

const searchInput =
    document.querySelector("#search-student");

const filterCourse =
    document.querySelector("#filter-course");


/* =========================================================
   5. COURSE LIST
   ========================================================= */

const courses = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];


/* =========================================================
   6. VALIDATION MESSAGE FUNCTION
   ========================================================= */

function showError(input, message) {

    removeError(input);

    const error = document.createElement("small");

    error.className = "validation-error";

    error.textContent = message;

    error.style.display = "block";
    error.style.color = "red";
    error.style.marginTop = "5px";

    input.parentElement.appendChild(error);

    input.style.borderColor = "red";
}


/* Remove old error */

function removeError(input) {

    input.style.borderColor = "";

    const oldError =
        input.parentElement.querySelector(
            ".validation-error"
        );

    if (oldError) {
        oldError.remove();
    }
}


/* =========================================================
   7. STUDENT NAME VALIDATION
   ========================================================= */

function validateName() {

    const name = nameInput.value.trim();

    const nameRegex =
        /^[A-Za-z ]{3,40}$/;

    if (name === "") {

        showError(
            nameInput,
            "Student name is required."
        );

        return false;
    }

    if (!nameRegex.test(name)) {

        showError(
            nameInput,
            "Name must contain only letters and spaces and be 3-40 characters."
        );

        return false;
    }

    removeError(nameInput);

    return true;
}


/* =========================================================
   8. EMAIL VALIDATION
   ========================================================= */

function validateEmail() {

    const email = emailInput.value.trim();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {

        showError(
            emailInput,
            "Email is required."
        );

        return false;
    }

    if (!emailRegex.test(email)) {

        showError(
            emailInput,
            "Enter a valid email address."
        );

        return false;
    }

    removeError(emailInput);

    return true;
}


/* =========================================================
   9. PHONE VALIDATION
   ========================================================= */

function validatePhone() {

    const phone = phoneInput.value.trim();

    const phoneRegex =
        /^\d{10}$/;

    if (phone === "") {

        showError(
            phoneInput,
            "Phone number is required."
        );

        return false;
    }

    if (!phoneRegex.test(phone)) {

        showError(
            phoneInput,
            "Phone number must contain exactly 10 digits."
        );

        return false;
    }

    removeError(phoneInput);

    return true;
}


/* =========================================================
   10. DATE OF BIRTH VALIDATION
   ========================================================= */

function validateDOB() {

    const dob = dobInput.value;

    if (dob === "") {

        showError(
            dobInput,
            "Date of birth is required."
        );

        return false;
    }

    const birthDate =
        new Date(dob);

    const today =
        new Date();

    if (birthDate > today) {

        showError(
            dobInput,
            "Future dates are not allowed."
        );

        return false;
    }


    /* Age calculation */

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const month =
        today.getMonth() -
        birthDate.getMonth();

    if (
        month < 0 ||
        (
            month === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--;
    }


    if (age < 15) {

        showError(
            dobInput,
            "Student must be at least 15 years old."
        );

        return false;
    }

    removeError(dobInput);

    return true;
}


/* =========================================================
   11. GENDER VALIDATION
   ========================================================= */

function validateGender() {

    const selected =
        [...genderInputs].find(
            radio => radio.checked
        );

    if (!selected) {

        alert("Please select a gender.");

        return false;
    }

    return true;
}


/* =========================================================
   12. COURSE VALIDATION
   ========================================================= */

function validateCourse() {

    const selected =
        courseInput.options[
            courseInput.selectedIndex
        ];

    if (
        !selected ||
        courseInput.selectedIndex === 0
    ) {

        alert("Please select a course.");

        return false;
    }

    return true;
}


/* =========================================================
   13. SKILLS VALIDATION
   ========================================================= */

function validateSkills() {

    const selectedSkills =
        [...skillInputs].filter(
            skill => skill.checked
        );

    if (selectedSkills.length === 0) {

        alert("Please select at least one skill.");

        return false;
    }

    return true;
}


/* =========================================================
   14. ABOUT STUDENT VALIDATION
   ========================================================= */

function validateAbout() {

    const about =
        aboutInput.value.trim();

    if (about === "") {

        showError(
            aboutInput,
            "About student is required."
        );

        return false;
    }

    if (about.length < 20) {

        showError(
            aboutInput,
            "About student must contain at least 20 characters."
        );

        return false;
    }

    if (about.length > 200) {

        showError(
            aboutInput,
            "Maximum 200 characters allowed."
        );

        return false;
    }

    removeError(aboutInput);

    return true;
}


/* =========================================================
   15. PROFILE PHOTO VALIDATION
   ========================================================= */

function validatePhoto() {

    if (
        photoInput.files.length === 0 &&
        editingId === null
    ) {

        alert("Please select a profile photo.");

        return false;
    }


    if (photoInput.files.length > 0) {

        const file =
            photoInput.files[0];

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            alert(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            return false;
        }
    }

    return true;
}


/* =========================================================
   16. CHARACTER COUNTER
========================================================= */

const counter =
    document.createElement("small");

counter.id = "character-counter";

counter.textContent = "0 / 200";

counter.style.display = "block";

counter.style.textAlign = "right";

counter.style.color = "#64748b";

aboutInput.parentElement.appendChild(
    counter
);


aboutInput.addEventListener(
    "input",
    function () {

        counter.textContent =
            `${aboutInput.value.length} / 200`;

        if (
            aboutInput.value.length > 200
        ) {
            counter.style.color = "red";
        } else {
            counter.style.color = "#64748b";
        }
    }
);


/* =========================================================
   17. GET SELECTED GENDER
   ========================================================= */

function getGender() {

    const selected =
        [...genderInputs].find(
            radio => radio.checked
        );

    if (!selected) {
        return "";
    }

    /*
       Your original HTML doesn't have
       name/value attributes on the radio buttons,
       so use the label text.
    */

    return selected.parentElement.textContent.trim();
}


/* =========================================================
   18. GET SELECTED SKILLS
   ========================================================= */

function getSkills() {

    return [...skillInputs]
        .filter(skill => skill.checked)
        .map(skill =>
            skill.parentElement.textContent.trim()
        );
}


/* =========================================================
   19. GET COURSE NAME
   ========================================================= */

function getCourse() {

    return courseInput
        .options[
            courseInput.selectedIndex
        ]
        .textContent.trim();
}


/* =========================================================
   20. SAVE STUDENTS
   ========================================================= */

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


/* =========================================================
   21. CREATE STUDENT
   ========================================================= */

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* Run all validations */

        const valid =
            validateName() &&
            validateEmail() &&
            validatePhone() &&
            validateDOB() &&
            validateGender() &&
            validateCourse() &&
            validateSkills() &&
            validateAbout() &&
            validatePhoto();


        if (!valid) {
            return;
        }


        /* =========================================
           EDIT EXISTING STUDENT
        ========================================= */

        if (editingId !== null) {

            const student =
                students.find(
                    student =>
                        student.id === editingId
                );


            if (student) {

                student.name =
                    nameInput.value.trim();

                student.email =
                    emailInput.value.trim();

                student.phone =
                    phoneInput.value.trim();

                student.dob =
                    dobInput.value;

                student.gender =
                    getGender();

                student.course =
                    getCourse();

                student.skills =
                    getSkills();

                student.about =
                    aboutInput.value.trim();


                if (photoInput.files.length > 0) {

                    student.photo =
                        URL.createObjectURL(
                            photoInput.files[0]
                        );
                }
            }


            editingId = null;

            submitButton.textContent =
                "Register Student";

        }


        /* =========================================
           ADD NEW STUDENT
        ========================================= */

        else {

            const student = {

                id:
                    Date.now(),

                name:
                    nameInput.value.trim(),

                email:
                    emailInput.value.trim(),

                phone:
                    phoneInput.value.trim(),

                dob:
                    dobInput.value,

                gender:
                    getGender(),

                course:
                    getCourse(),

                skills:
                    getSkills(),

                about:
                    aboutInput.value.trim(),

                photo:
                    photoInput.files.length > 0
                        ? URL.createObjectURL(
                            photoInput.files[0]
                        )
                        : ""
            };


            students.push(student);
        }


        /* Save data */

        saveStudents();


        /* Update UI */

        renderStudents();

        updateStatistics();


        /* Reset form */

        resetForm();
    }
);


/* =========================================================
   22. RENDER STUDENT CARDS
   ========================================================= */

function renderStudents() {

    studentContainer.innerHTML = "";


    /* Search */

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    /* Course filter */

    const selectedCourse =
        filterCourse.value;


    /* Filter students */

    const filteredStudents =
        students.filter(student => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCourse =
                selectedCourse === "all" ||
                student.course === selectedCourse;


            return (
                matchesSearch &&
                matchesCourse
            );
        });


    /* No students */

    if (filteredStudents.length === 0) {

        studentContainer.innerHTML = `
            <p class="no-students">
                No students found
            </p>
        `;

        return;
    }


    /* Create cards */

    filteredStudents.forEach(
        student => {

            const card =
                document.createElement("div");

            card.classList.add(
                "student-card"
            );

            card.setAttribute(
                "data-id",
                student.id
            );


            card.innerHTML = `
                <div class="student-photo">
                    ${
                        student.photo
                        ? `<img
                            src="${student.photo}"
                            alt="${student.name}"
                          >`
                        : `<div class="no-photo">
                            No Photo
                          </div>`
                    }
                </div>

                <div class="student-details">

                    <h3>${student.name}</h3>

                    <p>
                        <strong>Email:</strong>
                        ${student.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${student.phone}
                    </p>

                    <p>
                        <strong>DOB:</strong>
                        ${student.dob}
                    </p>

                    <p>
                        <strong>Gender:</strong>
                        ${student.gender}
                    </p>

                    <p>
                        <strong>Course:</strong>
                        ${student.course}
                    </p>

                    <p>
                        <strong>Skills:</strong>
                        ${student.skills.join(", ")}
                    </p>

                    <p>
                        <strong>About:</strong>
                        ${student.about}
                    </p>

                </div>

                <div class="student-actions">

                    <button
                        type="button"
                        class="edit-btn"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                    >
                        Delete
                    </button>

                </div>
            `;


            studentContainer.appendChild(card);
        }
    );
}


/* =========================================================
   23. DELETE + EDIT USING EVENT DELEGATION
   ========================================================= */

studentContainer.addEventListener(
    "click",
    function (event) {

        /* =====================================
           DELETE
        ===================================== */

        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            const card =
                event.target.closest(
                    ".student-card"
                );


            if (!card) {
                return;
            }


            const id =
                Number(
                    card.dataset.id
                );


            const student =
                students.find(
                    student =>
                        student.id === id
                );


            if (!student) {
                return;
            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete this student?"
                );


            if (!confirmed) {
                return;
            }


            /* Remove student */

            students =
                students.filter(
                    student =>
                        student.id !== id
                );


            saveStudents();


            /* Remove card */

            card.remove();


            /* Update statistics */

            updateStatistics();


            /* If no cards remain */

            if (students.length === 0) {
                renderStudents();
            }
        }


        /* =====================================
           EDIT
        ===================================== */

        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            const card =
                event.target.closest(
                    ".student-card"
                );


            if (!card) {
                return;
            }


            const id =
                Number(
                    card.dataset.id
                );


            const student =
                students.find(
                    student =>
                        student.id === id
                );


            if (!student) {
                return;
            }


            editingId =
                student.id;


            /* Fill form */

            nameInput.value =
                student.name;

            emailInput.value =
                student.email;

            phoneInput.value =
                student.phone;

            dobInput.value =
                student.dob;


            /* Gender */

            genderInputs.forEach(
                (radio, index) => {

                    radio.checked =
                        radio.parentElement
                            .textContent
                            .trim() ===
                        student.gender;
                }
            );


            /* Course */

            [...courseInput.options]
                .forEach(option => {

                    option.selected =
                        option.textContent
                            .trim() ===
                        student.course;
                });


            /* Skills */

            skillInputs.forEach(
                (skill, index) => {

                    const skillName =
                        skill.parentElement
                            .textContent
                            .trim();

                    skill.checked =
                        student.skills.includes(
                            skillName
                        );
                }
            );


            /* About */

            aboutInput.value =
                student.about;


            /* Counter */

            counter.textContent =
                `${aboutInput.value.length} / 200`;


            /* Change button */

            submitButton.textContent =
                "Update Student";


            form.scrollIntoView({
                behavior: "smooth"
            });
        }
    }
);




searchInput.addEventListener(
    "input",
    function () {

        renderStudents();
    }
);




filterCourse.addEventListener(
    "change",
    function () {

        renderStudents();
    }
);


/* =========================================================
   26. UPDATE STATISTICS
   ========================================================= */

function updateStatistics() {

    /* Total students */

    totalStudents.textContent =
        students.length;


    courseStatistics.innerHTML = "";


    courses.forEach(course => {

        const count =
            students.filter(
                student =>
                    student.course === course
            ).length;


        const stat =
            document.createElement("div");

        stat.classList.add(
            "course-stat"
        );


        stat.innerHTML = `
            <span>${course}</span>
            <strong>${count}</strong>
        `;


        courseStatistics.appendChild(stat);
    });
}


/* =========================================================
   27. RESET FORM
   ========================================================= */

function resetForm() {

    form.reset();


    editingId = null;


    submitButton.textContent =
        "Register Student";


    /* Remove validation errors */

    document
        .querySelectorAll(
            ".validation-error"
        )
        .forEach(error =>
            error.remove()
        );


    /* Reset borders */

    document
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach(input => {

            input.style.borderColor = "";
        });


    /* Reset counter */

    counter.textContent =
        "0 / 200";
}


/* =========================================================
   28. RESET BUTTON
   ========================================================= */

resetButton.addEventListener(
    "click",
    function () {

        setTimeout(
            resetForm,
            0
        );
    }
);


/* =========================================================
   29. INITIALIZE APPLICATION
   ========================================================= */

updateStatistics();

renderStudents();