const students = [];

let editingStudentId = null;

const studentForm = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const statistics = document.querySelector("#statistics");
const submitButton = document.querySelector("#submitButton");
const photoInput = document.querySelector("#photo");
const aboutInput = document.querySelector("#about");
const charCount = document.querySelector("#charCount");


// ==================== FORM SUBMIT ====================

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("#studentName").value;
    const nameError = validateName(name);

    if (nameError !== "") {
        alert(nameError);
        return;
    }

    const email = document.querySelector("#email").value;
    const emailError = validateEmail(email);

    if (emailError !== "") {
        alert(emailError);
        return;
    }

    const phone = document.querySelector("#phone").value;
    const phoneError = validatePhone(phone);

    if (phoneError !== "") {
        alert(phoneError);
        return;
    }

    const dob = document.querySelector("#dob").value;
    const dobError = validateDOB(dob);

    if (dobError !== "") {
        alert(dobError);
        return;
    }

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    )?.value;

    const genderError = validateGender(gender);

    if (genderError !== "") {
        alert(genderError);
        return;
    }

    const course = document.querySelector("#course").value;
    const courseError = validateCourse(course);

    if (courseError !== "") {
        alert(courseError);
        return;
    }

    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    const selectedSkills = [];

    skills.forEach(function (skill) {
        selectedSkills.push(skill.value);
    });

    const skillsError = validateSkills(selectedSkills);

    if (skillsError !== "") {
        alert(skillsError);
        return;
    }

    const about = document.querySelector("#about").value;
    const aboutError = validateAbout(about);

    if (aboutError !== "") {
        alert(aboutError);
        return;
    }

    const photo = photoInput.files[0];

    // ==================== EDIT ====================

    if (editingStudentId !== null) {
        const student = students.find(function (student) {
            return student.id === editingStudentId;
        });

        if (!student) {
            return;
        }

        student.name = name;
        student.email = email;
        student.phone = phone;
        student.dob = dob;
        student.gender = gender;
        student.course = course;
        student.skills = selectedSkills;
        student.about = about;

        // Update photo only if a new photo was selected
        if (photo) {
            const photoError = validatePhoto(photo);

            if (photoError !== "") {
                alert(photoError);
                return;
            }

            const reader = new FileReader();

            reader.onload = function () {
                student.photo = reader.result;

                saveStudents();
                displayStudents();
                updateStatistics();
                resetForm();
            };

            reader.readAsDataURL(photo);
            return;
        }

        saveStudents();
        displayStudents();
        updateStatistics();
        resetForm();

        return;
    }

    // ==================== NEW STUDENT ====================

    const photoError = validatePhoto(photo);

    if (photoError !== "") {
        alert(photoError);
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const student = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender,
            course: course,
            skills: selectedSkills,
            about: about,
            photo: reader.result
        };

        students.push(student);

        saveStudents();
        displayStudents();
        updateStatistics();
        resetForm();
    };

    reader.readAsDataURL(photo);
});


// ==================== VALIDATION ====================

function validateName(name) {
    const namePattern = /^[A-Za-z ]+$/;

    if (name.trim() === "") {
        return "Name is required";
    }

    if (name.length < 3) {
        return "Name must be at least 3 characters";
    }

    if (name.length > 40) {
        return "Name must not exceed 40 characters";
    }

    if (!namePattern.test(name)) {
        return "Name can contain only letters and spaces";
    }

    return "";
}


function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
        return "Email is required";
    }

    if (!emailPattern.test(email)) {
        return "Invalid email format";
    }

    return "";
}


function validatePhone(phone) {
    const phonePattern = /^\d{10}$/;

    if (phone.trim() === "") {
        return "Phone number is required";
    }

    if (!phonePattern.test(phone)) {
        return "Phone number must be 10 digits";
    }

    return "";
}


function validateDOB(dob) {
    if (dob === "") {
        return "Date of birth is required";
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
        return "Future date is not allowed";
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    if (
        month < 0 ||
        (month === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    if (age < 15) {
        return "Student must be at least 15 years old";
    }

    return "";
}


function validateGender(gender) {
    if (!gender) {
        return "Please select a gender";
    }

    return "";
}


function validateCourse(course) {
    if (course === "") {
        return "Please select a course";
    }

    return "";
}


function validateSkills(skills) {
    if (skills.length === 0) {
        return "Please select at least one skill";
    }

    return "";
}


function validateAbout(about) {
    if (about.trim() === "") {
        return "About student is required";
    }

    if (about.trim().length < 20) {
        return "About student must be at least 20 characters";
    }

    if (about.length > 200) {
        return "About student must not exceed 200 characters";
    }

    return "";
}


function validatePhoto(photo) {
    if (!photo) {
        return "Profile photo is required";
    }

    if (!photo.type.startsWith("image/")) {
        return "Please select an image file";
    }

    return "";
}


// ==================== DISPLAY STUDENTS ====================

function displayStudents(studentList = students) {
    studentContainer.innerHTML = "";

    if (studentList.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No students found";
        studentContainer.appendChild(message);
        return;
    }

    studentList.forEach(function (student) {
        const card = document.createElement("div");

        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const image = document.createElement("img");

        image.src = student.photo;
        image.alt = student.name;

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

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        card.append(
            image,
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            about,
            editButton,
            deleteButton
        );

        studentContainer.appendChild(card);
    });
}


// ==================== EDIT & DELETE ====================

studentContainer.addEventListener("click", function (event) {

    // DELETE

    if (event.target.classList.contains("delete-btn")) {

        const card = event.target.closest(".student-card");

        const id = Number(card.dataset.id);

        const confirmDelete = confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        const index = students.findIndex(function (student) {
            return student.id === id;
        });

        students.splice(index, 1);

        saveStudents();
        displayStudents();
        updateStatistics();

        return;
    }


    // EDIT

    if (event.target.classList.contains("edit-btn")) {

        const card = event.target.closest(".student-card");

        const id = Number(card.dataset.id);

        const student = students.find(function (student) {
            return student.id === id;
        });

        if (!student) {
            return;
        }

        editingStudentId = id;

        document.querySelector("#studentName").value = student.name;
        document.querySelector("#email").value = student.email;
        document.querySelector("#phone").value = student.phone;
        document.querySelector("#dob").value = student.dob;
        document.querySelector("#course").value = student.course;
        document.querySelector("#about").value = student.about;

        const genderInput = document.querySelector(
            `input[name="gender"][value="${student.gender}"]`
        );

        if (genderInput) {
            genderInput.checked = true;
        }

        document
            .querySelectorAll('input[name="skills"]')
            .forEach(function (skill) {
                skill.checked = student.skills.includes(skill.value);
            });

        submitButton.textContent = "Update Student";

        charCount.textContent = `${aboutInput.value.length}/200`;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});


// ==================== STATISTICS ====================

function updateStatistics() {
    statistics.innerHTML = "";

    const total = document.createElement("p");

    total.textContent = `Total Students: ${students.length}`;

    statistics.appendChild(total);

    const courseCounts = {};

    students.forEach(function (student) {

        if (courseCounts[student.course]) {
            courseCounts[student.course]++;
        } else {
            courseCounts[student.course] = 1;
        }
    });

    for (const course in courseCounts) {

        const courseCount = document.createElement("p");

        courseCount.textContent =
            `${course}: ${courseCounts[course]}`;

        statistics.appendChild(courseCount);
    }
}


// ==================== SEARCH & FILTER ====================

searchInput.addEventListener("input", filterStudents);

courseFilter.addEventListener("change", filterStudents);


function filterStudents() {

    const searchText = searchInput.value.toLowerCase();

    const selectedCourse = courseFilter.value;

    const filteredStudents = students.filter(function (student) {

        const matchesName =
            student.name.toLowerCase().includes(searchText);

        const matchesCourse =
            selectedCourse === "" ||
            student.course === selectedCourse;

        return matchesName && matchesCourse;
    });

    displayStudents(filteredStudents);
}


// ==================== CHARACTER COUNTER ====================

aboutInput.addEventListener("input", function () {

    charCount.textContent =
        `${aboutInput.value.length}/200`;
});


// ==================== RESET FORM ====================

studentForm.addEventListener("reset", function () {

    setTimeout(function () {
        editingStudentId = null;

        submitButton.textContent = "Register Student";

        charCount.textContent = "0/200";
    }, 0);
});


function resetForm() {

    studentForm.reset();

    editingStudentId = null;

    submitButton.textContent = "Register Student";

    charCount.textContent = "0/200";
}


// ==================== LOCAL STORAGE ====================

function saveStudents() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


function loadStudents() {

    const savedStudents = localStorage.getItem("students");

    if (!savedStudents) {
        return;
    }

    const parsedStudents = JSON.parse(savedStudents);

    students.push(...parsedStudents);

    displayStudents();
    updateStatistics();
}


loadStudents();