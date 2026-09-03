let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("photo");
const studentContainer = document.getElementById("studentContainer");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const nameValue = studentName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value;
    const courseValue = course.value;
    const aboutValue = about.value.trim();

    let isValid = true;

    // NAME
    if (nameValue === "") {
        document.getElementById("nameError").textContent = "Name is required";
        isValid = false;
    }

    // EMAIL (basic format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === "") {
        document.getElementById("emailError").textContent = "Email is required";
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        document.getElementById("emailError").textContent = "Enter a valid email";
        isValid = false;
    }

    // PHONE (10 digits check)
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneValue === "") {
        document.getElementById("phoneError").textContent = "Phone number is required";
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        document.getElementById("phoneError").textContent = "Phone must contain 10 digits";
        isValid = false;
    }
    // DOB (only empty + future check)
    if (dobValue === "") {
        document.getElementById("dobError").textContent = "Date of birth is required";
        isValid = false;
    } else {
        const birthDate = new Date(dobValue);
        const today = new Date();
        if (birthDate > today) {
            document.getElementById("dobError").textContent = "Future date is not allowed";
            isValid = false;
        }
    }

    // ABOUT (only empty check)
    if (aboutValue === "") {
        document.getElementById("aboutError").textContent = "About student is required";
        isValid = false;
    }

    if (!isValid) return;

    let photoData = "";
    if (photo.files.length > 0) {
        photoData = URL.createObjectURL(photo.files[0]);
    }

    if (editId !== null) {
        const student = students.find(s => s.id === editId);
        student.name = nameValue;
        student.email = emailValue;
        student.phone = phoneValue;
        student.dob = dobValue;
        student.course = courseValue;
        student.about = aboutValue;
        if (photoData !== "") student.photo = photoData;
        editId = null;
        submitBtn.textContent = "Register Student";
    } else {
        const student = {
            id: Date.now(),
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            dob: dobValue,
            course: courseValue,
            about: aboutValue,
            photo: photoData
        };
        students.push(student);
    }

    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    updateStatistics();
    resetForm();
});

function displayStudents() {
    studentContainer.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();
    const selectedCourse = filterCourse.value;

    const filteredStudents = students.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(searchValue);
        const courseMatch = selectedCourse === "All Courses" || student.course === selectedCourse;
        return nameMatch && courseMatch;
    });

    if (filteredStudents.length === 0) {
        studentContainer.innerHTML = `<p class="no-students">No students found</p>`;
        return;
    }

    filteredStudents.forEach(function (student) {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const image = document.createElement("img");
        image.src = student.photo;
        image.alt = student.name;

        const heading = document.createElement("h3");
        heading.textContent = student.name;

        const emailText = document.createElement("p");
        emailText.textContent = "Email: " + student.email;

        const phoneText = document.createElement("p");
        phoneText.textContent = "Phone: " + student.phone;

        const dobText = document.createElement("p");
        dobText.textContent = "DOB: " + student.dob;

        const courseText = document.createElement("p");
        courseText.textContent = "Course: " + student.course;

        const aboutText = document.createElement("p");
        aboutText.textContent = "About: " + student.about;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("card-buttons");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        card.appendChild(image);
        card.appendChild(heading);
        card.appendChild(emailText);
        card.appendChild(phoneText);
        card.appendChild(dobText);
        card.appendChild(courseText);
        card.appendChild(aboutText);
        card.appendChild(buttonContainer);

        studentContainer.appendChild(card);
    });
}

studentContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.closest(".student-card");
        const id = Number(card.dataset.id);
        const answer = confirm("Are you sure you want to delete this student?");
        if (!answer) return;
        students = students.filter(s => s.id !== id);
        localStorage.setItem("students", JSON.stringify(students));
        displayStudents();
        updateStatistics();
    }

    if (event.target.classList.contains("edit-btn")) {
        const card = event.target.closest(".student-card");
        const id = Number(card.dataset.id);
        const student = students.find(s => s.id === id);
        if (!student) return;
        editId = id;
        studentName.value = student.name;
        email.value = student.email;
        phone.value = student.phone;
        dob.value = student.dob;
        course.value = student.course;
        about.value = student.about;
        submitBtn.textContent = "Update Student";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

function updateStatistics() {
    document.getElementById("totalStudents").textContent = students.length;
    let web = 0, uiux = 0, python = 0, data = 0, mern = 0, cloud = 0;
    students.forEach(student => {
        if (student.course === "Web Development") web++;
        if (student.course === "UI/UX") uiux++;
        if (student.course === "Python") python++;
        if (student.course === "Data Analytics") data++;
        if (student.course === "MERN Stack") mern++;
        if (student.course === "Cloud Computing") cloud++;
    });
    document.getElementById("webCount").textContent = web;
    document.getElementById("uiuxCount").textContent = uiux;
    document.getElementById("pythonCount").textContent = python;
    document.getElementById("dataCount").textContent = data;
    document.getElementById("mernCount").textContent = mern;
    document.getElementById("cloudCount").textContent = cloud;
}

searchInput.addEventListener("input", function () {
    displayStudents();
});

filterCourse.addEventListener("change", function () {
    displayStudents();
});

function clearErrors() {
    const errors = document.querySelectorAll(".error");
    errors.forEach(error => error.textContent = "");
}

resetBtn.addEventListener("click", function () {
    resetForm();
});

function resetForm() {
    form.reset();
    clearErrors();
    editId = null;
    submitBtn.textContent = "Register Student";
}

displayStudents();
update