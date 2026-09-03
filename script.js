const students = [];

const form = document.getElementById("student-form");

const studentName = document.getElementById("student-name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const profilePhoto = document.getElementById("profile-photo");

const studentCardsContainer = document.getElementById(
    "student-cards-container"
);

const statisticsContainer = document.getElementById(
    "student-statistics"
);


// ==================== ERROR FUNCTIONS ====================

function showError(element, message) {
    removeError(element);

    const error = document.createElement("small");
    error.classList.add("error-message");
    error.textContent = message;

    element.parentElement.appendChild(error);
}

function removeError(element) {
    const oldError =
        element.parentElement.querySelector(".error-message");

    if (oldError) {
        oldError.remove();
    }
}

function clearErrors() {
    const errors =
        document.querySelectorAll(".error-message");

    errors.forEach(function (error) {
        error.remove();
    });
}


// ==================== ABOUT CHARACTER COUNTER ====================

about.addEventListener("input", function () {
    let counter = document.getElementById("about-counter");

    if (!counter) {
        counter = document.createElement("small");
        counter.id = "about-counter";
        about.parentElement.appendChild(counter);
    }

    counter.textContent = `${about.value.length} / 200`;
});


// ==================== DISPLAY STUDENTS ====================

function displayStudents() {
    studentCardsContainer.innerHTML = "";

    students.forEach(function (student) {

        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const photo = document.createElement("img");
        photo.src = student.photo;
        photo.alt = student.name + " profile photo";

        const name = document.createElement("h3");
        name.textContent = student.name;

        const emailText = document.createElement("p");
        emailText.textContent = "Email: " + student.email;

        const phoneText = document.createElement("p");
        phoneText.textContent = "Phone: " + student.phone;

        const dobText = document.createElement("p");
        dobText.textContent = "DOB: " + student.dob;

        const genderText = document.createElement("p");
        genderText.textContent = "Gender: " + student.gender;

        const courseText = document.createElement("p");
        courseText.textContent = "Course: " + student.course;

        const skillsText = document.createElement("p");
        skillsText.textContent =
            "Skills: " + student.skills.join(", ");

        const aboutText = document.createElement("p");
        aboutText.textContent = "About: " + student.about;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        card.appendChild(photo);
        card.appendChild(name);
        card.appendChild(emailText);
        card.appendChild(phoneText);
        card.appendChild(dobText);
        card.appendChild(genderText);
        card.appendChild(courseText);
        card.appendChild(skillsText);
        card.appendChild(aboutText);
        card.appendChild(editButton);
        card.appendChild(deleteButton);

        studentCardsContainer.appendChild(card);
    });
}


// ==================== STATISTICS ====================

function updateStatistics() {

    statisticsContainer.innerHTML = "";

    const total = document.createElement("p");
    total.textContent = "Total Students: " + students.length;

    statisticsContainer.appendChild(total);

    const courses = [
        "Web Development",
        "UI/UX",
        "Python",
        "Data Analytics",
        "MERN Stack",
        "Cloud Computing"
    ];

    courses.forEach(function (courseName) {

        const count = students.filter(function (student) {
            return student.course === courseName;
        }).length;

        const courseStat = document.createElement("p");

        courseStat.textContent =
            courseName + ": " + count;

        statisticsContainer.appendChild(courseStat);
    });
}


// ==================== FORM SUBMIT ====================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;

    // Student Name
    const nameValue = studentName.value.trim();

    if (nameValue === "") {
        showError(studentName, "Student name is required.");
        isValid = false;
    }
    else if (nameValue.length < 3 || nameValue.length > 40) {
        showError(
            studentName,
            "Name must be between 3 and 40 characters."
        );
        isValid = false;
    }
    else if (!/^[A-Za-z ]+$/.test(nameValue)) {
        showError(
            studentName,
            "Name can contain only letters and spaces."
        );
        isValid = false;
    }


    // Email
    const emailValue = email.value.trim();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        showError(email, "Email is required.");
        isValid = false;
    }
    else if (!emailRegex.test(emailValue)) {
        showError(email, "Enter a valid email address.");
        isValid = false;
    }


    // Phone
    const phoneValue = phone.value.trim();

    if (phoneValue === "") {
        showError(phone, "Phone number is required.");
        isValid = false;
    }
    else if (!/^\d{10}$/.test(phoneValue)) {
        showError(
            phone,
            "Phone number must contain exactly 10 digits."
        );
        isValid = false;
    }


    // DOB
    const dobValue = dob.value;

    if (dobValue === "") {
        showError(dob, "Date of birth is required.");
        isValid = false;
    }
    else {

        const selectedDate = new Date(dobValue);
        const today = new Date();

        if (selectedDate > today) {
            showError(
                dob,
                "Date of birth cannot be in the future."
            );
            isValid = false;
        }
        else {

            let age =
                today.getFullYear() -
                selectedDate.getFullYear();

            const monthDifference =
                today.getMonth() -
                selectedDate.getMonth();

            if (
                monthDifference < 0 ||
                (
                    monthDifference === 0 &&
                    today.getDate() < selectedDate.getDate()
                )
            ) {
                age--;
            }

            if (age < 15) {
                showError(
                    dob,
                    "Student must be at least 15 years old."
                );
                isValid = false;
            }
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
            ).parentElement.parentElement;

        showError(
            genderGroup.querySelector("p"),
            "Please select a gender."
        );

        isValid = false;
    }


    // Course
    const courseValue = course.value;

    if (courseValue === "") {
        showError(course, "Please select a course.");
        isValid = false;
    }


    // Skills
    const selectedSkills =
        document.querySelectorAll(
            'input[name="skills"]:checked'
        );

    if (selectedSkills.length === 0) {

        const skillsGroup =
            document.querySelector(
                'input[name="skills"]'
            ).parentElement.parentElement;

        showError(
            skillsGroup.querySelector("p"),
            "Please select at least one skill."
        );

        isValid = false;
    }


    // About
    const aboutValue = about.value.trim();

    if (aboutValue === "") {
        showError(
            about,
            "About student is required."
        );
        isValid = false;
    }
    else if (aboutValue.length < 20) {
        showError(
            about,
            "About student must be at least 20 characters."
        );
        isValid = false;
    }
    else if (aboutValue.length > 200) {
        showError(
            about,
            "About student cannot exceed 200 characters."
        );
        isValid = false;
    }


    // Profile Photo
    if (profilePhoto.files.length === 0) {

        showError(
            profilePhoto,
            "Profile photo is required."
        );

        isValid = false;

    }
    else {

        const file =
            profilePhoto.files[0];

        if (!file.type.startsWith("image/")) {

            showError(
                profilePhoto,
                "Please select an image file."
            );

            isValid = false;
        }
    }


    // Stop if invalid
    if (!isValid) {
        return;
    }


    // ==================== CREATE STUDENT ====================

    const skills = [];

    selectedSkills.forEach(function (skill) {
        skills.push(skill.value);
    });


    const student = {

        id: students.length > 0
            ? students[students.length - 1].id + 1
            : 1,

        name: nameValue,

        email: emailValue,

        phone: phoneValue,

        dob: dobValue,

        gender: selectedGender.value,

        course: courseValue,

        skills: skills,

        about: aboutValue,

        photo: URL.createObjectURL(
            profilePhoto.files[0]
        )
    };


    // Add student to array
    students.push(student);


    // Display students
    displayStudents();


    // Update statistics
    updateStatistics();


    alert("Student registered successfully!");


    // Reset form
    form.reset();

    const counter =
        document.getElementById("about-counter");

    if (counter) {
        counter.textContent = "0 / 200";
    }

    clearErrors();
});


// ==================== REMOVE ERRORS WHEN FIXED ====================

studentName.addEventListener("input", function () {
    removeError(studentName);
});

email.addEventListener("input", function () {
    removeError(email);
});

phone.addEventListener("input", function () {
    removeError(phone);
});

dob.addEventListener("change", function () {
    removeError(dob);
});

course.addEventListener("change", function () {
    removeError(course);
});

about.addEventListener("input", function () {
    removeError(about);
});

profilePhoto.addEventListener("change", function () {
    removeError(profilePhoto);
});


// ==================== TASK 8: DELETE STUDENT ====================

// Only ONE click event listener on student card container
studentCardsContainer.addEventListener(
    "click",
    function (event) {

        // Check if Delete button was clicked
        if (
            !event.target.classList.contains("delete-btn")
        ) {
            return;
        }


        // Find the related student card
        const card =
            event.target.closest(".student-card");


        // Get student ID
        const studentId =
            Number(card.dataset.id);


        // Confirmation
        const confirmDelete =
            confirm(
                "Are you sure you want to delete this student?"
            );


        // Cancel deletion
        if (!confirmDelete) {
            return;
        }


        // Find student index
        const studentIndex =
            students.findIndex(function (student) {

                return student.id === studentId;

            });


        // Remove student from array
        if (studentIndex !== -1) {

            students.splice(studentIndex, 1);


            // Remove correct card
            card.remove();


            // Update statistics
            updateStatistics();
        }
    }
);


// ==================== INITIAL STATISTICS ====================

updateStatistics();