const students = [];

let nextStudentId = 1;

const form = document.querySelector("#studentForm");
const studentName = document.querySelector("#studentName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const course = document.querySelector("#course");
const about = document.querySelector("#about");
const profilePhoto = document.querySelector("#profilePhoto");

const studentContainer = document.querySelector("#studentContainer");
const studentCount = document.querySelector("#studentCount");

function showError(fieldId, message) {
    document.querySelector(`#${fieldId}Error`).textContent = message;
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
    const nameValue = studentName.value.trim();
    const nameRegex = /^[A-Za-z ]+$/;

    if (nameValue === "") {
        showError("studentName", "Student name is required.");
        isValid = false;
    } else if (nameValue.length < 3) {
        showError("studentName", "Name must contain at least 3 characters.");
        isValid = false;
    } else if (!nameRegex.test(nameValue)) {
        showError("studentName", "Name can contain only letters and spaces.");
        isValid = false;
    }
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        showError("email", "Email is required.");
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError("email", "Enter a valid email address.");
        isValid = false;
    }
    const phoneValue = phone.value.trim();
    const phoneRegex = /^\d{10}$/;

    if (phoneValue === "") {
        showError("phone", "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        showError("phone", "Phone number must contain exactly 10 digits.");
        isValid = false;
    }
    const dobValue = dob.value;

    if (dobValue === "") {
        showError("dob", "Date of birth is required.");
        isValid = false;
    } else {
        const selectedDate = new Date(`${dobValue}T00:00:00`);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showError("dob", "Date of birth cannot be in the future.");
            isValid = false;
        }
    }
    const selectedGender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!selectedGender) {
        showError("gender", "Please select a gender.");
        isValid = false;
    }
    if (course.value === "") {
        showError("course", "Please select a course.");
        isValid = false;
    }
    const selectedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (selectedSkills.length === 0) {
        showError("skills", "Please select at least one skill.");
        isValid = false;
    }
    const aboutValue = about.value.trim();

    if (aboutValue === "") {
        showError("about", "About student is required.");
        isValid = false;
    }
    if (profilePhoto.files.length === 0) {
        showError("profilePhoto", "Please select a profile photo.");
        isValid = false;
    }

    return isValid;
}
form.addEventListener("submit", function (event) {
    // Prevent page refresh
    event.preventDefault();

    // Stop if validation fails
    if (!validateForm()) {
        return;
    }

    const selectedGender = document.querySelector(
        'input[name="gender"]:checked'
    );

    const selectedSkills = Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map(function (checkbox) {
        return checkbox.value;
    });

    const file = profilePhoto.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        const student = {
            id: nextStudentId,
            name: studentName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            dob: dob.value,
            gender: selectedGender.value,
            course: course.value,
            skills: selectedSkills,
            about: about.value.trim(),
            photo: reader.result
        };

        students.push(student);

        nextStudentId++;

        createStudentCard(student);
        updateStudentCount();

        form.reset();
        clearErrors();
    });

    reader.readAsDataURL(file);
});
function createStudentCard(student) {
    const card = document.createElement("div");

    card.classList.add("student-card");
    card.dataset.id = student.id;

    const image = document.createElement("img");

    image.classList.add("student-photo");
    image.src = student.photo;
    image.alt = `${student.name}'s profile photo`;

    const content = document.createElement("div");

    content.classList.add("student-content");

    const heading = document.createElement("h3");

    heading.textContent = student.name;

    const emailElement = document.createElement("p");

    emailElement.classList.add("student-info");

    emailElement.innerHTML = `<strong>Email:</strong> ${student.email}`;

    const phoneElement = document.createElement("p");

    phoneElement.classList.add("student-info");

    phoneElement.innerHTML = `<strong>Phone:</strong> ${student.phone}`;

    const dobElement = document.createElement("p");

    dobElement.classList.add("student-info");

    dobElement.innerHTML = `<strong>Date of Birth:</strong> ${student.dob}`;

    const genderElement = document.createElement("p");

    genderElement.classList.add("student-info");

    genderElement.innerHTML = `<strong>Gender:</strong> ${student.gender}`;

    const courseElement = document.createElement("p");

    courseElement.classList.add("student-info");

    courseElement.innerHTML = `<strong>Course:</strong> ${student.course}`;

    const skillsLabel = document.createElement("p");

    skillsLabel.classList.add("student-info");

    skillsLabel.innerHTML = "<strong>Skills:</strong>";

    const skillsList = document.createElement("div");

    skillsList.classList.add("skills-list");

    student.skills.forEach(function (skill) {
        const skillElement = document.createElement("span");

        skillElement.classList.add("skill");
        skillElement.textContent = skill;

        skillsList.appendChild(skillElement);
    });

    const aboutElement = document.createElement("p");

    aboutElement.classList.add("about");

    aboutElement.innerHTML =
        `<strong>About:</strong> ${student.about}`;

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    content.appendChild(heading);
    content.appendChild(emailElement);
    content.appendChild(phoneElement);
    content.appendChild(dobElement);
    content.appendChild(genderElement);
    content.appendChild(courseElement);
    content.appendChild(skillsLabel);
    content.appendChild(skillsList);
    content.appendChild(aboutElement);
    content.appendChild(deleteButton);

    card.appendChild(image);
    card.appendChild(content);

    studentContainer.appendChild(card);
}
function updateStudentCount() {
    studentCount.textContent =
        `Total Students: ${students.length}`;
}

studentContainer.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-btn")) {
        return;
    }
    const card = event.target.closest(".student-card");

    if (!card) {
        return;
    }
    const studentId = Number(card.dataset.id);
    const studentIndex = students.findIndex(function (student) {
        return student.id === studentId;
    });

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
    }
    card.remove();
    updateStudentCount();
});
