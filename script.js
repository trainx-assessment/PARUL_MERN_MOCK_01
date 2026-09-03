let students = [];
let editingStudentId = null;

const form = document.getElementById("student-form");

const nameInput = document.getElementById("student-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseSelect = document.getElementById("course");
const aboutTextarea = document.getElementById("about");
const photoInput = document.getElementById("profile-photo");

const genderRadios = document.querySelectorAll('input[name="gender"]');
const skillCheckboxes = document.querySelectorAll('input[name="skills"]');

const submitBtn = document.getElementById("submit-btn");
const charCounter = document.getElementById("char-counter");

const searchInput = document.getElementById("search-input");
const filterCourse = document.getElementById("filter-course");
const cardsContainer = document.getElementById("student-cards-container");

aboutTextarea.addEventListener("input", function () {
    charCounter.textContent = aboutTextarea.value.length + " / 200";
    clearError(aboutTextarea);
});

function showError(element, message) {
    const group = element.closest(".form-group");

    let error = group.querySelector(".error-msg");

    if (!error) {
        error = document.createElement("span");
        error.className = "error-msg";
        group.appendChild(error);
    }

    error.textContent = message;
    element.classList.add("input-error");
}

function clearError(element) {
    const group = element.closest(".form-group");

    if (!group) {
        return;
    }

    const error = group.querySelector(".error-msg");

    if (error) {
        error.textContent = "";
    }

    element.classList.remove("input-error");
}

nameInput.addEventListener("input", function () {
    clearError(nameInput);
});

emailInput.addEventListener("input", function () {
    clearError(emailInput);
});

phoneInput.addEventListener("input", function () {
    clearError(phoneInput);
});

dobInput.addEventListener("change", function () {
    clearError(dobInput);
});

courseSelect.addEventListener("change", function () {
    clearError(courseSelect);
});

photoInput.addEventListener("change", function () {
    clearError(photoInput);
});

genderRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
        clearError(document.getElementById("gender-fieldset"));
    });
});

skillCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        clearError(document.getElementById("skills-fieldset"));
    });
});

function validateForm() {
    let valid = true;

    // Name validation
    const name = nameInput.value.trim();

    if (name === "") {
        showError(nameInput, "Student Name is required.");
        valid = false;
    } else if (!namePattern.test(name)) {
        showError(
            nameInput,
            "Name must contain 3-40 letters and spaces only."
        );
        valid = false;
    } else {
        clearError(nameInput);
    }

    const email = emailInput.value.trim();

    if (email === "") {
        showError(emailInput, "Email is required.");
        valid = false;
    } else if (!emailPattern.test(email)) {
        showError(emailInput, "Please enter a valid email address.");
        valid = false;
    } else {
        clearError(emailInput);
    }

    const phone = phoneInput.value.trim();

    if (phone === "") {
        showError(phoneInput, "Phone number is required.");
        valid = false;
    } else if (!/^\d{10}$/.test(phone)) {
        showError(phoneInput, "Phone number must be exactly 10 digits.");
        valid = false;
    } else {
        clearError(phoneInput);
    }

    if (dobInput.value === "") {
        showError(dobInput, "Date of Birth is required.");
        valid = false;
    } else {
        const dob = new Date(dobInput.value);
        const today = new Date();

        if (dob > today) {
            showError(dobInput, "Date of Birth cannot be in the future.");
            valid = false;
        } else {
            let age = today.getFullYear() - dob.getFullYear();

            const monthDifference =
                today.getMonth() - dob.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 &&
                    today.getDate() < dob.getDate())
            ) {
                age--;
            }

            if (age < 15) {
                showError(
                    dobInput,
                    "Student must be at least 15 years old."
                );
                valid = false;
            } else {
                clearError(dobInput);
            }
        }
    }

    const genderFieldset =
        document.getElementById("gender-fieldset");

    let genderSelected = false;

    genderRadios.forEach(function (radio) {
        if (radio.checked) {
            genderSelected = true;
        }
    });

    if (!genderSelected) {
        showError(genderFieldset, "Please select a gender.");
        valid = false;
    } else {
        clearError(genderFieldset);
    }

    if (courseSelect.value === "") {
        showError(courseSelect, "Please choose a course.");
        valid = false;
    } else {
        clearError(courseSelect);
    }
    const skillsFieldset =
        document.getElementById("skills-fieldset");

    let skillSelected = false;

    skillCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            skillSelected = true;
        }
    });

    if (!skillSelected) {
        showError(skillsFieldset, "Select at least one skill.");
        valid = false;
    } else {
        clearError(skillsFieldset);
    }
    const about = aboutTextarea.value.trim();

    if (about === "") {
        showError(aboutTextarea, "About section is required.");
        valid = false;
    } else if (about.length < 20) {
        showError(
            aboutTextarea,
            "Minimum 20 characters required."
        );
        valid = false;
    } else {
        clearError(aboutTextarea);
    }

    const file = photoInput.files[0];
    const validExtensions = ["jpg", "jpeg", "png"];
    if (editingStudentId !== null && !file) {
        clearError(photoInput);
    } else if (!file) {
        showError(photoInput, "Profile photo is required.");
        valid = false;
    } else {
        const extension =
            file.name.split(".").pop().toLowerCase();

        if (!validExtensions.includes(extension)) {
            showError(
                photoInput,
                "Only JPG, JPEG, and PNG files are allowed."
            );
            valid = false;
        } else {
            clearError(photoInput);
        }
    }

    return valid;
}

function fileToBase64(file) {
    return new Promise(function (resolve) {
        if (!file) {
            resolve("");
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            resolve("");
        };

        reader.readAsDataURL(file);
    });
}

function renderStudents(list = students) {
    cardsContainer.innerHTML = "";

    if (list.length === 0) {
        cardsContainer.innerHTML =
            '<p class="empty-state">No student applications found.</p>';
        return;
    }

    list.forEach(function (student) {

        const dateParts = student.dob.split("-");
        const formattedDate =
            dateParts[2] +
            "/" +
            dateParts[1] +
            "/" +
            dateParts[0];


        let skillBadges = "";

        student.skills.forEach(function (skill) {
            skillBadges +=
                '<span class="skill-badge">' +
                skill +
                "</span>";
        });

        const card = document.createElement("div");
        card.className = "student-card";
        card.dataset.id = student.id;


        card.innerHTML = `
            <img
                src="${student.photo}"
                alt="${student.name}"
                class="student-photo"
            >

            <h3 class="student-name">
                ${student.name}
            </h3>

            <div class="student-details">
                <p>
                    <strong>Email:</strong> ${student.email}
                </p>

                <p>
                    <strong>Phone:</strong> ${student.phone}
                </p>

                <p>
                    <strong>DOB:</strong> ${formattedDate}
                </p>

                <p>
                    <strong>Gender:</strong> ${student.gender}
                </p>

                <p>
                    <strong>Course:</strong> ${student.course}
                </p>
            </div>

            <div class="skills-container">
                <strong>Skills:</strong>

                <div class="skills-list">
                    ${skillBadges}
                </div>
            </div>

            <div class="student-about">
                <strong>About:</strong> ${student.about}
            </div>

            <div class="card-actions">
                <button
                    type="button"
                    class="btn-edit"
                    data-id="${student.id}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn-delete"
                    data-id="${student.id}"
                >
                    Delete
                </button>
            </div>
        `;

        cardsContainer.appendChild(card);
    });
}

function updateStats() {

    document.getElementById("stat-total").textContent =
        students.length;

    const counts = {
        "Web Development": 0,
        "UI/UX": 0,
        "Python": 0,
        "Data Analytics": 0,
        "MERN Stack": 0,
        "Cloud Computing": 0
    };

    students.forEach(function (student) {
        if (counts[student.course] !== undefined) {
            counts[student.course]++;
        }
    });

    document.getElementById("stat-web-dev").textContent =
        counts["Web Development"];

    document.getElementById("stat-uiux").textContent =
        counts["UI/UX"];

    document.getElementById("stat-python").textContent =
        counts["Python"];

    document.getElementById("stat-data-analytics").textContent =
        counts["Data Analytics"];

    document.getElementById("stat-mern").textContent =
        counts["MERN Stack"];

    document.getElementById("stat-cloud").textContent =
        counts["Cloud Computing"];
}

function getFilteredStudents() {

    const searchText =
        searchInput.value.trim().toLowerCase();

    const selectedCourse = filterCourse.value;

    return students.filter(function (student) {

        const nameMatches =
            student.name.toLowerCase().includes(searchText);

        const courseMatches =
            selectedCourse === "ALL" ||
            student.course === selectedCourse;

        return nameMatches && courseMatches;
    });
}

function handleFilter() {
    renderStudents(getFilteredStudents());
}
searchInput.addEventListener("input", handleFilter);
filterCourse.addEventListener("change", handleFilter);
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    const photoFile = photoInput.files[0];
    let photoData = "";
    if (photoFile) {
        photoData = await fileToBase64(photoFile);
    }
    const selectedSkills = [];

    skillCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedSkills.push(checkbox.value);
        }
    });
    let selectedGender = "";

    genderRadios.forEach(function (radio) {
        if (radio.checked) {
            selectedGender = radio.value;
        }
    });
    if (editingStudentId !== null) {

        const index = students.findIndex(function (student) {
            return student.id === editingStudentId;
        });


        if (index !== -1) {

            students[index] = {
                id: editingStudentId,
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                dob: dobInput.value,
                gender: selectedGender,
                course: courseSelect.value,
                skills: selectedSkills,
                about: aboutTextarea.value.trim(),

                photo:
                    photoData || students[index].photo
            };
        }
    } else {
        const newStudent = {
            id: Date.now(),
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dob: dobInput.value,
            gender: selectedGender,
            course: courseSelect.value,
            skills: selectedSkills,
            about: aboutTextarea.value.trim(),
            photo: photoData
        };

        students.push(newStudent);
    }
    resetFormState();
    updateStats();
    handleFilter();
});

cardsContainer.addEventListener("click", function (event) {
    const target = event.target;
    const id = Number(target.dataset.id);
    if (!id) {
        return;
    }
    if (target.classList.contains("btn-delete")) {

        const answer = confirm(
            "Are you sure you want to delete this student application?"
        );

        if (!answer) {
            return;
        }
        students = students.filter(function (student) {
            return student.id !== id;
        });


        if (editingStudentId === id) {
            resetFormState();
        }
        updateStats();
        handleFilter();

        return;
    }

    if (target.classList.contains("btn-edit")) {
        const student = students.find(function (student) {
            return student.id === id;
        });
        if (!student) {
            return;
        }
        editingStudentId = student.id;
        nameInput.value = student.name;
        emailInput.value = student.email;
        phoneInput.value = student.phone;
        dobInput.value = student.dob;
        courseSelect.value = student.course;
        aboutTextarea.value = student.about;

        charCounter.textContent =
            student.about.length + " / 200";


        genderRadios.forEach(function (radio) {
            radio.checked = radio.value === student.gender;
        });


        skillCheckboxes.forEach(function (checkbox) {
            checkbox.checked =
                student.skills.includes(checkbox.value);
        });

        photoInput.value = "";


        clearAllErrors();

        submitBtn.textContent = "Update Student";

        form.scrollIntoView({
            behavior: "smooth"
        });
    }
});

function clearAllErrors() {

    const errors =
        document.querySelectorAll(".error-msg");

    errors.forEach(function (error) {
        error.textContent = "";
    });


    const errorFields =
        document.querySelectorAll(".input-error");

    errorFields.forEach(function (field) {
        field.classList.remove("input-error");
    });
}

function resetFormState() {

    form.reset();

    genderRadios.forEach(function (radio) {
        radio.checked = false;
    });

    skillCheckboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });


    photoInput.value = "";

    charCounter.textContent = "0 / 200";

    editingStudentId = null;

    submitBtn.textContent = "Register Student";

    clearAllErrors();
}

form.addEventListener("reset", function (event) {

    event.preventDefault();

    resetFormState();
});

updateStats();
renderStudents();
