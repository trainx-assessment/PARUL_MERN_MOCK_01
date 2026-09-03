 
const form = document.getElementById("studentForm");
const studentCards = document.getElementById("studentCards");
const studentCount = document.getElementById("studentCount");

const students = [];

let nextId = 1;

form.addEventListener("submit", function (event) {
    event.preventDefault();

    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value.trim();
    const photoInput = document.getElementById("photo");

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    const selectedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    let isValid = true;

    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "") {
        showError("nameError", "Name is required.");
        isValid = false;
    } else if (name.length < 3) {
        showError("nameError", "Name must be at least 3 characters.");
        isValid = false;
    } else if (!nameRegex.test(name)) {
        showError(
            "nameError",
            "Name can contain only letters and spaces."
        );
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        showError("emailError", "Email is required.");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError("emailError", "Enter a valid email address.");
        isValid = false;
    }

    const phoneRegex = /^\d{10}$/;

    if (phone === "") {
        showError("phoneError", "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        showError(
            "phoneError",
            "Phone number must contain exactly 10 digits."
        );
        isValid = false;
    }

    if (dob === "") {
        showError("dobError", "Date of birth is required.");
        isValid = false;
    } else {
        const selectedDate = new Date(dob);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showError(
                "dobError",
                "Date of birth cannot be in the future."
            );
            isValid = false;
        }
    }

    if (!gender) {
        showError("genderError", "Please select a gender.");
        isValid = false;
    }

    if (course === "") {
        showError("courseError", "Please select a course.");
        isValid = false;
    }

    if (selectedSkills.length === 0) {
        showError(
            "skillsError",
            "Please select at least one skill."
        );
        isValid = false;
    }

    if (about === "") {
        showError(
            "aboutError",
            "About section is required."
        );
        isValid = false;
    }

    if (photoInput.files.length === 0) {
        showError(
            "photoError",
            "Profile photo is required."
        );
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const skills = [];

    selectedSkills.forEach(function (skill) {
        skills.push(skill.value);
    });

    const file = photoInput.files[0];

    const reader = new FileReader();

    reader.onload = function () {
        const student = {
            id: nextId++,
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender.value,
            course: course,
            skills: skills,
            about: about,
            photo: reader.result
        };

        students.push(student);

        console.log("Student added:", student);

        createStudentCard(student);

        updateStudentCount();

        form.reset();

        clearErrors();
    };

    reader.readAsDataURL(file);
});

function createStudentCard(student) {
    const card = document.createElement("div");

    card.classList.add("student-card");

    card.dataset.id = student.id;

    const image = document.createElement("img");

    image.src = student.photo;
    image.alt = student.name;

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

    const course = document.createElement("p");

    course.textContent = "Course: " + student.course;

    const skillsContainer = document.createElement("div");

    skillsContainer.classList.add("skills");

    student.skills.forEach(function (skill) {
        const skillSpan = document.createElement("span");

        skillSpan.classList.add("skill");

        skillSpan.textContent = skill;

        skillsContainer.appendChild(skillSpan);
    });

    const about = document.createElement("p");

    about.textContent = "About: " + student.about;

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    card.appendChild(image);
    card.appendChild(heading);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(dob);
    card.appendChild(gender);
    card.appendChild(course);
    card.appendChild(skillsContainer);
    card.appendChild(about);
    card.appendChild(deleteButton);

    studentCards.appendChild(card);
}

studentCards.addEventListener("click", function (event) {
    if (!event.target.classList.contains("delete-btn")) {
        return;
    }

    const card = event.target.closest(".student-card");

    if (!card) {
        return;
    }

    const id = Number(card.dataset.id);

    const studentIndex = students.findIndex(function (student) {
        return student.id === id;
    });

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
    }

    card.remove();

    updateStudentCount();

    console.log("Student deleted. ID:", id);
});

function updateStudentCount() {
    studentCount.textContent = students.length;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);

    errorElement.textContent = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll(".error");

    errorElements.forEach(function (error) {
        error.textContent = "";
    });
}
 
