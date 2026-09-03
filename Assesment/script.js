"use strict";

const students = [];
let nextStudentId = 1;

const studentForm = document.querySelector("#studentForm");
const studentNameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
const studentContainer = document.querySelector("#studentContainer");
const totalStudents = document.querySelector("#totalStudents");

const errorElements = {
    name: document.querySelector("#nameError"),
    email: document.querySelector("#emailError"),
    phone: document.querySelector("#phoneError"),
    dob: document.querySelector("#dobError"),
    gender: document.querySelector("#genderError"),
    course: document.querySelector("#courseError"),
    skills: document.querySelector("#skillsError"),
    about: document.querySelector("#aboutError"),
    photo: document.querySelector("#photoError")
};

const fieldElements = {
    name: studentNameInput,
    email: emailInput,
    phone: phoneInput,
    dob: dobInput,
    gender: document.querySelector("#genderField"),
    course: courseInput,
    skills: document.querySelector("#skillsField"),
    about: aboutInput,
    photo: photoInput
};

function getFormData() {
    return {
        name: studentNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || "",
        course: courseInput.value,
        skills: Array.from(document.querySelectorAll('input[name="skills"]:checked'), (input) => input.value),
        about: aboutInput.value.trim(),
        photoFile: photoInput.files[0] || null
    };
}

function validateForm(data) {
    const errors = {};
    const namePattern = /^[A-Za-z ]{3,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (!data.name) {
        errors.name = "Student name is required.";
    } else if (!namePattern.test(data.name)) {
        errors.name = "Use at least 3 letters and spaces only.";
    }

    if (!data.email) {
        errors.email = "Email is required.";
    } else if (!emailPattern.test(data.email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!data.phone) {
        errors.phone = "Phone number is required.";
    } else if (!phonePattern.test(data.phone)) {
        errors.phone = "Phone number must contain exactly 10 digits.";
    }

    if (!data.dob) {
        errors.dob = "Date of birth is required.";
    } else if (new Date(`${data.dob}T00:00:00`) > startOfToday()) {
        errors.dob = "Date of birth cannot be in the future.";
    }

    if (!data.gender) {
        errors.gender = "Select a gender.";
    }

    if (!data.course) {
        errors.course = "Select a course.";
    }

    if (data.skills.length === 0) {
        errors.skills = "Select at least one skill.";
    }

    if (!data.about) {
        errors.about = "About Student is required and cannot contain only spaces.";
    }

    if (!data.photoFile) {
        errors.photo = "Select a profile photo.";
    }

    return errors;
}

function startOfToday() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function showErrors(errors) {
    Object.keys(errorElements).forEach((key) => {
        setFieldError(key, errors[key] || "");
    });
}

function setFieldError(key, message) {
    errorElements[key].textContent = message;

    if (key === "gender" || key === "skills") {
        fieldElements[key].classList.toggle("invalid", Boolean(message));
    } else {
        fieldElements[key].setAttribute("aria-invalid", String(Boolean(message)));
    }
}

function clearErrors() {
    showErrors({});
}

function clearChangedFieldError(key) {
    if (errorElements[key].textContent) {
        setFieldError(key, "");
    }
}

function updateStudentCount() {
    totalStudents.textContent = students.length;
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function createDetail(label, value) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    return row;
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(`${dateString}T00:00:00`));
}

function createStudentCard(student) {
    const card = createElement("article", "student-card");
    card.dataset.id = student.id;

    const image = createElement("img", "student-photo");
    image.src = student.photo;
    image.alt = `${student.name}'s profile photo`;

    const content = createElement("div", "student-card-content");
    const heading = createElement("h3", "", student.name);
    const details = createElement("dl", "student-details");
    details.append(
        createDetail("Email", student.email),
        createDetail("Phone", student.phone),
        createDetail("DOB", formatDate(student.dob)),
        createDetail("Gender", student.gender),
        createDetail("Course", student.course)
    );

    const skillsList = createElement("div", "skills-list");
    student.skills.forEach((skill) => {
        skillsList.append(createElement("span", "skill-tag", skill));
    });

    const aboutHeading = createElement("p", "about-heading", "About Student");
    const aboutText = createElement("p", "about-text", student.about);
    const deleteButton = createElement("button", "delete-btn", "Delete");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Delete ${student.name}`);

    content.append(heading, details, skillsList, aboutHeading, aboutText, deleteButton);
    card.append(image, content);
    return card;
}

function removeEmptyState() {
    studentContainer.querySelector(".empty-state")?.remove();
}

function showEmptyState() {
    if (students.length === 0 && !studentContainer.querySelector(".empty-state")) {
        studentContainer.append(createElement("p", "empty-state", "No students have been added yet."));
    }
}

studentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = getFormData();
    const errors = validateForm(formData);
    showErrors(errors);

    if (Object.keys(errors).length > 0) {
        return;
    }

    const student = {
        id: nextStudentId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        course: formData.course,
        skills: formData.skills,
        about: formData.about,
        photo: URL.createObjectURL(formData.photoFile)
    };

    students.push(student);
    nextStudentId += 1;
    removeEmptyState();
    studentContainer.append(createStudentCard(student));
    updateStudentCount();
    studentForm.reset();
    clearErrors();
});

studentContainer.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-btn");

    if (!deleteButton) {
        return;
    }

    const studentCard = deleteButton.closest(".student-card");
    const studentId = Number(studentCard.dataset.id);
    const studentIndex = students.findIndex((student) => student.id === studentId);

    if (studentIndex === -1) {
        return;
    }

    URL.revokeObjectURL(students[studentIndex].photo);
    students.splice(studentIndex, 1);
    studentCard.remove();
    updateStudentCount();
    showEmptyState();
});

studentNameInput.addEventListener("input", () => clearChangedFieldError("name"));
emailInput.addEventListener("input", () => clearChangedFieldError("email"));
phoneInput.addEventListener("input", () => clearChangedFieldError("phone"));
dobInput.addEventListener("change", () => clearChangedFieldError("dob"));
courseInput.addEventListener("change", () => clearChangedFieldError("course"));
aboutInput.addEventListener("input", () => clearChangedFieldError("about"));
photoInput.addEventListener("change", () => clearChangedFieldError("photo"));

document.querySelectorAll('input[name="gender"]').forEach((input) => {
    input.addEventListener("change", () => clearChangedFieldError("gender"));
});

document.querySelectorAll('input[name="skills"]').forEach((input) => {
    input.addEventListener("change", () => clearChangedFieldError("skills"));
});

updateStudentCount();
showEmptyState();
