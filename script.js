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


// Show error message
function showError(input, message) {
    removeError(input);

    const error = document.createElement("small");
    error.className = "error-message";
    error.textContent = message;
    error.style.color = "red";

    input.parentElement.appendChild(error);
}


// Remove error message
function removeError(input) {
    const oldError = input.parentElement.querySelector(".error-message");

    if (oldError) {
        oldError.remove();
    }
}


// Remove all errors
function clearErrors() {
    document.querySelectorAll(".error-message").forEach(error => {
        error.remove();
    });
}


// Character counter
const counter = document.createElement("small");
counter.id = "character-counter";
counter.textContent = "0 / 200";

about.parentElement.appendChild(counter);

about.addEventListener("input", function () {
    counter.textContent = `${about.value.length} / 200`;
});


// Task 6 - Display Student Cards
function displayStudents() {

    studentCardsContainer.innerHTML = "";

    students.forEach(student => {

        const card = document.createElement("div");
        card.classList.add("student-card");

        // Store student ID
        card.setAttribute("data-id", student.id);


        // Student Photo
        const photo = document.createElement("img");

        photo.src = student.photo;
        photo.alt = student.name;


        // Student Name
        const name = document.createElement("h3");
        name.textContent = student.name;


        // Email
        const emailElement = document.createElement("p");
        emailElement.textContent = `Email: ${student.email}`;


        // Phone
        const phoneElement = document.createElement("p");
        phoneElement.textContent = `Phone: ${student.phone}`;


        // DOB
        const dobElement = document.createElement("p");
        dobElement.textContent = `DOB: ${student.dob}`;


        // Gender
        const genderElement = document.createElement("p");
        genderElement.textContent = `Gender: ${student.gender}`;


        // Course
        const courseElement = document.createElement("p");
        courseElement.textContent = `Course: ${student.course}`;


        // Skills
        const skillsElement = document.createElement("p");
        skillsElement.textContent =
            `Skills: ${student.skills.join(", ")}`;


        // About
        const aboutElement = document.createElement("p");
        aboutElement.textContent =
            `About: ${student.about}`;


        // Edit Button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";


        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";


        // Add elements to card
        card.appendChild(photo);
        card.appendChild(name);
        card.appendChild(emailElement);
        card.appendChild(phoneElement);
        card.appendChild(dobElement);
        card.appendChild(genderElement);
        card.appendChild(courseElement);
        card.appendChild(skillsElement);
        card.appendChild(aboutElement);
        card.appendChild(editButton);
        card.appendChild(deleteButton);


        // Add card to container
        studentCardsContainer.appendChild(card);
    });
}


// Form Submit
form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    // Student Name
    const nameValue = studentName.value.trim();
    const nameRegex = /^[A-Za-z ]+$/;

    if (nameValue === "") {

        showError(
            studentName,
            "Student name is required."
        );

        isValid = false;

    } else if (nameValue.length < 3) {

        showError(
            studentName,
            "Name must be at least 3 characters."
        );

        isValid = false;

    } else if (nameValue.length > 40) {

        showError(
            studentName,
            "Name cannot exceed 40 characters."
        );

        isValid = false;

    } else if (!nameRegex.test(nameValue)) {

        showError(
            studentName,
            "Name can contain only letters and spaces."
        );

        isValid = false;
    }


    // Email
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {

        showError(
            email,
            "Email is required."
        );

        isValid = false;

    } else if (!emailRegex.test(emailValue)) {

        showError(
            email,
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // Phone
    const phoneValue = phone.value.trim();
    const phoneRegex = /^\d{10}$/;

    if (phoneValue === "") {

        showError(
            phone,
            "Phone number is required."
        );

        isValid = false;

    } else if (!phoneRegex.test(phoneValue)) {

        showError(
            phone,
            "Phone number must contain exactly 10 digits."
        );

        isValid = false;
    }


    // DOB
    if (dob.value === "") {

        showError(
            dob,
            "Date of birth is required."
        );

        isValid = false;

    } else {

        const selectedDate = new Date(dob.value);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {

            showError(
                dob,
                "Future date is not allowed."
            );

            isValid = false;

        } else {

            // Minimum age 15
            const minimumAgeDate = new Date(selectedDate);

            minimumAgeDate.setFullYear(
                minimumAgeDate.getFullYear() + 15
            );

            if (minimumAgeDate > today) {

                showError(
                    dob,
                    "Student must be at least 15 years old."
                );

                isValid = false;
            }
        }
    }


    // Gender
    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        const genderGroup = document.querySelector(
            'input[name="gender"]'
        ).parentElement.parentElement;

        const error = document.createElement("small");

        error.className = "error-message";
        error.textContent = "Please select a gender.";
        error.style.color = "red";

        genderGroup.appendChild(error);

        isValid = false;
    }


    // Course
    if (course.value === "") {

        showError(
            course,
            "Please select a course."
        );

        isValid = false;
    }


    // Skills
    const selectedSkills = Array.from(
        document.querySelectorAll(
            'input[name="skills"]:checked'
        )
    ).map(skill => skill.value);

    if (selectedSkills.length === 0) {

        const skillInput = document.querySelector(
            'input[name="skills"]'
        );

        const skillGroup =
            skillInput.parentElement.parentElement;

        const error = document.createElement("small");

        error.className = "error-message";
        error.textContent =
            "Please select at least one skill.";

        error.style.color = "red";

        skillGroup.appendChild(error);

        isValid = false;
    }


    // About Student
    const aboutValue = about.value.trim();

    if (aboutValue === "") {

        showError(
            about,
            "About student is required."
        );

        isValid = false;

    } else if (aboutValue.length < 20) {

        showError(
            about,
            "About student must be at least 20 characters."
        );

        isValid = false;

    } else if (aboutValue.length > 200) {

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

    } else {

        const file = profilePhoto.files[0];

        if (!file.type.startsWith("image/")) {

            showError(
                profilePhoto,
                "Only image files are allowed."
            );

            isValid = false;
        }
    }


    // If valid
    if (isValid) {

        // Task 5 - Create Student Object
        const student = {

            id: students.length + 1,

            name: studentName.value.trim(),

            email: email.value.trim(),

            phone: phone.value.trim(),

            dob: dob.value,

            gender: gender.value,

            course: course.value,

            skills: selectedSkills,

            about: about.value.trim(),

            photo: profilePhoto.files[0].name
        };


        // Store student
        students.push(student);


        // Task 6 - Display card
        displayStudents();


        console.log("Student added:", student);

        console.log("All students:", students);


        alert("Student registration successful!");


        // Reset form
        form.reset();

        counter.textContent = "0 / 200";

        clearErrors();
    }
});


// Remove errors when user fixes input

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


// Gender error remove
document.querySelectorAll(
    'input[name="gender"]'
).forEach(input => {

    input.addEventListener("change", function () {

        const genderGroup =
            input.parentElement.parentElement;

        const error =
            genderGroup.querySelector(".error-message");

        if (error) {
            error.remove();
        }
    });
});


// Skills error remove
document.querySelectorAll(
    'input[name="skills"]'
).forEach(input => {

    input.addEventListener("change", function () {

        const selected =
            document.querySelectorAll(
                'input[name="skills"]:checked'
            );

        if (selected.length > 0) {

            const skillGroup =
                input.parentElement.parentElement;

            const error =
                skillGroup.querySelector(".error-message");

            if (error) {
                error.remove();
            }
        }
    });
});


console.log(
    "Student Application Management System loaded successfully."
);