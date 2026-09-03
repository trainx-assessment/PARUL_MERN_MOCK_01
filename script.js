const students = [];

const studentForm = document.getElementById("student-form");

const studentName = document.getElementById("student-name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const profilePhoto = document.getElementById("profile-photo");

const searchInput = document.getElementById("search-input");
const courseFilter = document.getElementById("course-filter");

const studentCardsContainer =
    document.getElementById("student-cards-container");

const studentStatistics =
    document.getElementById("student-statistics");

let editingStudentId = null;


// --------------------
// Error Message
// --------------------

function showError(input, message) {

    removeError(input);

    const error = document.createElement("small");

    error.classList.add("error-message");
    error.textContent = message;

    input.parentElement.appendChild(error);
}


function removeError(input) {

    const oldError =
        input.parentElement.querySelector(".error-message");

    if (oldError) {
        oldError.remove();
    }
}


// --------------------
// About Character Counter
// --------------------

const aboutCounter = document.createElement("small");

aboutCounter.textContent = "0 / 200";

about.parentElement.appendChild(aboutCounter);

about.addEventListener("input", function () {

    aboutCounter.textContent =
        about.value.length + " / 200";
});


// --------------------
// Display Students
// --------------------

function displayStudents(studentList = students) {

    studentCardsContainer.innerHTML = "";

    if (studentList.length === 0) {

        const message = document.createElement("p");

        message.textContent = "No students found";

        studentCardsContainer.appendChild(message);

        return;
    }

    studentList.forEach(function (student) {

        const card = document.createElement("div");

        card.classList.add("student-card");

        card.setAttribute("data-id", student.id);


        const photo = document.createElement("img");

        photo.src = student.photo;
        photo.alt = student.name;

        card.appendChild(photo);


        const name = document.createElement("h3");

        name.textContent = student.name;

        card.appendChild(name);


        const emailText = document.createElement("p");

        emailText.textContent =
            "Email: " + student.email;

        card.appendChild(emailText);


        const phoneText = document.createElement("p");

        phoneText.textContent =
            "Phone: " + student.phone;

        card.appendChild(phoneText);


        const dobText = document.createElement("p");

        dobText.textContent =
            "DOB: " + student.dob;

        card.appendChild(dobText);


        const genderText = document.createElement("p");

        genderText.textContent =
            "Gender: " + student.gender;

        card.appendChild(genderText);


        const courseText = document.createElement("p");

        courseText.textContent =
            "Course: " + student.course;

        card.appendChild(courseText);


        const skillsText = document.createElement("p");

        skillsText.textContent =
            "Skills: " + student.skills.join(", ");

        card.appendChild(skillsText);


        const aboutText = document.createElement("p");

        aboutText.textContent =
            "About: " + student.about;

        card.appendChild(aboutText);


        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        card.appendChild(editButton);


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        card.appendChild(deleteButton);


        studentCardsContainer.appendChild(card);
    });
}


// --------------------
// Update Statistics
// --------------------

function updateStatistics() {

    const courses = [
        "Web Development",
        "UI/UX",
        "Python",
        "Data Analytics",
        "MERN Stack",
        "Cloud Computing"
    ];

    studentStatistics.innerHTML = "";

    const total = document.createElement("p");

    total.textContent =
        "Total Students: " + students.length;

    studentStatistics.appendChild(total);


    courses.forEach(function (courseName) {

        const count =
            students.filter(function (student) {

                return student.course === courseName;

            }).length;

        const item = document.createElement("p");

        item.textContent =
            courseName + ": " + count;

        studentStatistics.appendChild(item);
    });
}


// --------------------
// Form Submit
// --------------------

studentForm.addEventListener("submit", function (event) {

    event.preventDefault();


    removeError(studentName);
    removeError(email);
    removeError(phone);
    removeError(dob);
    removeError(course);
    removeError(about);
    removeError(profilePhoto);


    let isValid = true;


    // Name

    const nameValue = studentName.value.trim();

    if (nameValue === "") {

        showError(studentName, "Name is required");

        isValid = false;

    } else if (
        nameValue.length < 3 ||
        nameValue.length > 40
    ) {

        showError(
            studentName,
            "Name must be 3-40 characters"
        );

        isValid = false;

    } else if (!/^[A-Za-z ]+$/.test(nameValue)) {

        showError(
            studentName,
            "Name can contain only letters and spaces"
        );

        isValid = false;
    }


    // Email

    const emailValue = email.value.trim();

    if (emailValue === "") {

        showError(email, "Email is required");

        isValid = false;

    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    ) {

        showError(email, "Enter a valid email");

        isValid = false;
    }


    // Phone

    const phoneValue = phone.value.trim();

    if (phoneValue === "") {

        showError(phone, "Phone number is required");

        isValid = false;

    } else if (!/^\d{10}$/.test(phoneValue)) {

        showError(
            phone,
            "Phone number must contain exactly 10 digits"
        );

        isValid = false;
    }


    // DOB

    const dobValue = dob.value;

    if (dobValue === "") {

        showError(dob, "Date of birth is required");

        isValid = false;

    } else {

        const today =
            new Date().toISOString().split("T")[0];

        if (dobValue > today) {

            showError(
                dob,
                "Date of birth cannot be in the future"
            );

            isValid = false;
        }
    }


    // Gender

    const selectedGender =
        document.querySelector(
            'input[name="gender"]:checked'
        );

    if (!selectedGender) {

        const genderGroup =
            document.querySelector(
                'input[name="gender"]'
            );

        showError(
            genderGroup,
            "Please select gender"
        );

        isValid = false;
    }


    // Course

    const courseValue = course.value;

    if (courseValue === "") {

        showError(
            course,
            "Please select a course"
        );

        isValid = false;
    }


    // Skills

    const selectedSkills =
        document.querySelectorAll(
            'input[name="skills"]:checked'
        );

    if (selectedSkills.length === 0) {

        const skillGroup =
            document.querySelector(
                'input[name="skills"]'
            );

        showError(
            skillGroup,
            "Please select at least one skill"
        );

        isValid = false;
    }


    // About

    const aboutValue = about.value.trim();

    if (aboutValue === "") {

        showError(
            about,
            "About student is required"
        );

        isValid = false;

    } else if (aboutValue.length < 20) {

        showError(
            about,
            "About must be at least 20 characters"
        );

        isValid = false;

    } else if (aboutValue.length > 200) {

        showError(
            about,
            "About cannot exceed 200 characters"
        );

        isValid = false;
    }


    // Photo

    if (
        editingStudentId === null &&
        profilePhoto.files.length === 0
    ) {

        showError(
            profilePhoto,
            "Profile photo is required"
        );

        isValid = false;
    }


    if (!isValid) {
        return;
    }


    // Skills

    const skills = [];

    selectedSkills.forEach(function (skill) {

        skills.push(skill.value);
    });


    // Gender

    const genderValue =
        selectedGender.value;


    // --------------------
    // Update Existing Student
    // --------------------

    if (editingStudentId !== null) {

        const student =
            students.find(function (student) {

                return student.id === editingStudentId;
            });


        if (student) {

            student.name = nameValue;
            student.email = emailValue;
            student.phone = phoneValue;
            student.dob = dobValue;
            student.gender = genderValue;
            student.course = courseValue;
            student.skills = skills;
            student.about = aboutValue;


            if (profilePhoto.files.length > 0) {

                student.photo =
                    URL.createObjectURL(
                        profilePhoto.files[0]
                    );
            }
        }

    } else {

        // --------------------
        // Add New Student
        // --------------------

        let photoURL = "";

        if (profilePhoto.files.length > 0) {

            photoURL =
                URL.createObjectURL(
                    profilePhoto.files[0]
                );
        }


        const newStudent = {

            id: students.length > 0
                ? students[students.length - 1].id + 1
                : 1,

            name: nameValue,

            email: emailValue,

            phone: phoneValue,

            dob: dobValue,

            gender: genderValue,

            course: courseValue,

            skills: skills,

            about: aboutValue,

            photo: photoURL
        };


        students.push(newStudent);
    }


    // --------------------
    // Task 12 Reset
    // After Successful Registration
    // --------------------

    studentForm.reset();

    editingStudentId = null;

    studentForm.querySelector(
        'button[type="submit"]'
    ).textContent = "Register Student";

    aboutCounter.textContent = "0 / 200";


    const errors =
        studentForm.querySelectorAll(".error-message");

    errors.forEach(function (error) {
        error.remove();
    });


    updateStatistics();

    performSearch();

});


// --------------------
// Task 12 Reset Button
// --------------------

studentForm.addEventListener("reset", function () {

    // Cancel edit mode
    editingStudentId = null;


    // Change button back
    studentForm.querySelector(
        'button[type="submit"]'
    ).textContent = "Register Student";


    // Remove validation messages
    const errors =
        studentForm.querySelectorAll(".error-message");

    errors.forEach(function (error) {
        error.remove();
    });


    // Reset counter
    aboutCounter.textContent = "0 / 200";

});


// --------------------
// Edit + Delete
// Event Delegation
// --------------------

studentCardsContainer.addEventListener(
    "click",
    function (event) {

        const card =
            event.target.closest(".student-card");

        if (!card) {
            return;
        }


        const studentId =
            Number(card.getAttribute("data-id"));


        // Delete

        if (
            event.target.classList.contains("delete-btn")
        ) {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this student?"
                );

            if (!confirmed) {
                return;
            }


            const index =
                students.findIndex(function (student) {

                    return student.id === studentId;
                });


            if (index !== -1) {

                students.splice(index, 1);

                card.remove();

                updateStatistics();

                performSearch();
            }
        }


        // Edit

        if (
            event.target.classList.contains("edit-btn")
        ) {

            const student =
                students.find(function (student) {

                    return student.id === studentId;
                });


            if (!student) {
                return;
            }


            studentName.value = student.name;

            email.value = student.email;

            phone.value = student.phone;

            dob.value = student.dob;

            course.value = student.course;

            about.value = student.about;

            aboutCounter.textContent =
                student.about.length + " / 200";


            const genderRadio =
                document.querySelectorAll(
                    'input[name="gender"]'
                );

            genderRadio.forEach(function (radio) {

                radio.checked =
                    radio.value === student.gender;
            });


            const skillCheckboxes =
                document.querySelectorAll(
                    'input[name="skills"]'
                );

            skillCheckboxes.forEach(function (checkbox) {

                checkbox.checked =
                    student.skills.includes(
                        checkbox.value
                    );
            });


            editingStudentId = student.id;


            studentForm.querySelector(
                'button[type="submit"]'
            ).textContent = "Update Student";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }
);


// --------------------
// Search + Course Filter
// --------------------

function performSearch() {

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
                selectedCourse === "all" ||
                student.course === selectedCourse;


            return matchesSearch && matchesCourse;
        });


    displayStudents(filteredStudents);
}


// Search

searchInput.addEventListener(
    "input",
    function () {

        performSearch();
    }
);


// Course Filter

courseFilter.addEventListener(
    "change",
    function () {

        performSearch();
    }
);


// --------------------
// Initial Display
// --------------------

displayStudents();

updateStatistics();