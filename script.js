const form = document.querySelector("#studentForm");
const studentNameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
const charCount = document.querySelector("#charCount");
const submitBtn = document.querySelector("#submitBtn");
const studentContainer = document.querySelector("#studentContainer");

aboutInput.addEventListener("input", function () {
    charCount.textContent = `${aboutInput.value.length} / 200`;
});

function showError(inputElement, message) {
    removeError(inputElement);
    const error = document.createElement("span");
    error.classList.add("error-message");
    error.textContent = message;
    inputElement.parentElement.appendChild(error);
}

function removeError(inputElement) {
    const parent = inputElement.parentElement;
    const existingError = parent.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }
}

function validateName() {
    const nameRegex = /^[A-Za-z\s]{3,40}$/;
    const value = studentNameInput.value.trim();
    if (!nameRegex.test(value)) {
        showError(studentNameInput, "Name must be 3-40 letters only, no numbers/symbols.");
        return false;
    }
    removeError(studentNameInput);
    return true;
}

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = emailInput.value.trim();
    if (!emailRegex.test(value)) {
        showError(emailInput, "Please enter a valid email address.");
        return false;
    }
    removeError(emailInput);
    return true;
}

function validatePhone() {
    const phoneRegex = /^[0-9]{10}$/;
    const value = phoneInput.value.trim();
    if (!phoneRegex.test(value)) {
        showError(phoneInput, "Phone number must be exactly 10 digits.");
        return false;
    }
    removeError(phoneInput);
    return true;
}

function validateDob() {
    const value = dobInput.value;
    if (!value) {
        showError(dobInput, "Date of birth is required.");
        return false;
    }
    const dobDate = new Date(value);
    const today = new Date();
    if (dobDate > today) {
        showError(dobInput, "Future dates are not allowed.");
        return false;
    }
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }
    if (age < 15) {
        showError(dobInput, "Student must be at least 15 years old.");
        return false;
    }
    removeError(dobInput);
    return true;
}

function validateGender() {
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    const genderGroup = document.querySelector('input[name="gender"]').closest(".form-group");
    if (!genderChecked) {
        showError(genderGroup.querySelector("label"), "Please select a gender.");
        return false;
    }
    removeError(genderGroup.querySelector("label"));
    return true;
}

function validateCourse() {
    if (courseInput.value === "") {
        showError(courseInput, "Please select a course.");
        return false;
    }
    removeError(courseInput);
    return true;
}

function validateSkills() {
    const skillsChecked = document.querySelectorAll('input[name="skills"]:checked');
    const skillsGroup = document.querySelector('input[name="skills"]').closest(".form-group");
    if (skillsChecked.length === 0) {
        showError(skillsGroup.querySelector("label"), "Select at least one skill.");
        return false;
    }
    removeError(skillsGroup.querySelector("label"));
    return true;
}

function validateAbout() {
    const value = aboutInput.value.trim();
    if (value.length < 20 || value.length > 200) {
        showError(aboutInput, "About must be 20-200 characters (no spaces-only).");
        return false;
    }
    removeError(aboutInput);
    return true;
}

function validatePhoto() {
    const file = photoInput.files[0];
    if (!file) {
        showError(photoInput, "Profile photo is required.");
        return false;
    }
    if (!file.type.startsWith("image/")) {
        showError(photoInput, "Only image files are allowed.");
        return false;
    }
    removeError(photoInput);
    return true;
}

const students = [];
let nextId = 1;
let editingId = null;

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();
    const isCourseValid = validateCourse();
    const isSkillsValid = validateSkills();
    const isAboutValid = validateAbout();
    const isPhotoValid = validatePhoto();

    const isFormValid =
        isNameValid && isEmailValid && isPhoneValid && isDobValid &&
        isGenderValid && isCourseValid && isSkillsValid && isAboutValid && isPhotoValid;

    if (!isFormValid) {
        return;
    }

    const genderChecked = document.querySelector('input[name="gender"]:checked');
    const skillsChecked = document.querySelectorAll('input[name="skills"]:checked');
    const skillsArray = Array.from(skillsChecked).map(function (checkbox) {
        return checkbox.value;
    });
    const photoFile = photoInput.files[0];
    const photoURL = photoFile ? URL.createObjectURL(photoFile) : null;

    if (editingId === null) {
        const newStudent = {
            id: nextId,
            name: studentNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dob: dobInput.value,
            gender: genderChecked.value,
            course: courseInput.value,
            skills: skillsArray,
            about: aboutInput.value.trim(),
            photo: photoURL
        };

        students.push(newStudent);
        nextId++;

    } else {
        updateStudent(editingId, {
            name: studentNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dob: dobInput.value,
            gender: genderChecked.value,
            course: courseInput.value,
            skills: skillsArray,
            about: aboutInput.value.trim()
        });
        editingId = null;
        submitBtn.textContent = "Register Student";
    }

    renderStudents();
    updateStatistics();
    form.reset();
    charCount.textContent = "0 / 200";
});

function renderStudents(studentsToRender = students) {
    studentContainer.innerHTML = "";

    if (studentsToRender.length === 0) {
        const noResult = document.createElement("p");
        noResult.textContent = "No students found";
        studentContainer.appendChild(noResult);
        return;
    }

    studentsToRender.forEach(function (student) {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const img = document.createElement("img");
        img.src = student.photo;
        img.alt = student.name;

        const name = document.createElement("h3");
        name.textContent = student.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${student.email}`;

        const phone = document.createElement("p");
        phone.textContent = `Phone: ${student.phone}`;

        const dob = document.createElement("p");
        dob.textContent = `DOB: ${student.dob}`;

        const gender = document.createElement("p");
        gender.textContent = `Gender: ${student.gender}`;

        const course = document.createElement("p");
        course.textContent = `Course: ${student.course}`;

        const skills = document.createElement("p");
        skills.textContent = `Skills: ${student.skills.join(", ")}`;

        const about = document.createElement("p");
        about.textContent = `About: ${student.about}`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        card.append(img, name, email, phone, dob, gender, course, skills, about, editBtn, deleteBtn);
        studentContainer.appendChild(card);
    });
}

function updateStatistics(studentsToCount = students) {
    const totalCount = document.querySelector("#totalCount");
    totalCount.textContent = `Total Students: ${studentsToCount.length}`;

    const courseCounts = {
        "Web Development": 0,
        "UI/UX": 0,
        "Python": 0,
        "Data Analytics": 0,
        "MERN Stack": 0,
        "Cloud Computing": 0
    };

    studentsToCount.forEach(function (student) {
        if (courseCounts.hasOwnProperty(student.course)) {
            courseCounts[student.course]++;
        }
    });

    for (const course in courseCounts) {
        const courseSpan = document.querySelector(`[data-course="${course}"]`);
        if (courseSpan) {
            courseSpan.textContent = `${course}: ${courseCounts[course]}`;
        }
    }
}

studentContainer.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.closest(".student-card");
        const studentId = Number(card.getAttribute("data-id"));

        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) {
            return;
        }

        const index = students.findIndex(function (student) {
            return student.id === studentId;
        });
        students.splice(index, 1);
        card.remove();
        updateStatistics();
    }

    if (event.target.classList.contains("edit-btn")) {
        const card = event.target.closest(".student-card");
        const studentId = Number(card.getAttribute("data-id"));

        const student = students.find(function (s) {
            return s.id === studentId;
        });

        if (!student) return;

        studentNameInput.value = student.name;
        emailInput.value = student.email;
        phoneInput.value = student.phone;
        dobInput.value = student.dob;
        courseInput.value = student.course;
        aboutInput.value = student.about;
        charCount.textContent = `${student.about.length} / 200`;

        document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
            radio.checked = (radio.value === student.gender);
        });

        document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
            checkbox.checked = student.skills.includes(checkbox.value);
        });

        photoInput.required = false;

        editingId = studentId;
        submitBtn.textContent = "Update Student";

        form.scrollIntoView({
            behavior: "smooth"
        });
    }

});

function updateStudent(id, updatedData) {
    const index = students.findIndex(function (student) {
        return student.id === id;
    });

    if (index === -1) return;

    const newPhoto = photoInput.files[0] ?
        URL.createObjectURL(photoInput.files[0]) :
        students[index].photo;

    students[index] = {
        id: id,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        dob: updatedData.dob,
        gender: updatedData.gender,
        course: updatedData.course,
        skills: updatedData.skills,
        about: updatedData.about,
        photo: newPhoto
    };

    photoInput.required = true;
}

const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");

function applySearchAndFilter() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    let filteredStudents = students.filter(function (student) {
        const matchesSearch = student.name.toLowerCase().includes(searchText);
        const matchesCourse = (selectedCourse === "All") || (student.course === selectedCourse);
        return matchesSearch && matchesCourse;
    });

    renderStudents(filteredStudents);
}

searchInput.addEventListener("input", applySearchAndFilter);
courseFilter.addEventListener("change", applySearchAndFilter);

form.addEventListener("reset", function () {
    charCount.textContent = "0 / 200";
    editingId = null;
    submitBtn.textContent = "Register Student";
    photoInput.required = true;

    document.querySelectorAll(".error-message").forEach(function (error) {
        error.remove();
    });
});

const darkModeBtn = document.querySelector("#darkModeBtn");

darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "Light Mode";
    } else {
        darkModeBtn.textContent = "Dark Mode";
    }
});