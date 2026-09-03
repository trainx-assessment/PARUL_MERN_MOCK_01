const students = [];

let nextStudentId = 1;

const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validate all required fields
    if (!studentForm.checkValidity()) {
        studentForm.reportValidity();
        return;
    }

    // Get selected skills
    const selectedSkills = [];

    const skillCheckboxes = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    skillCheckboxes.forEach(function (checkbox) {
        selectedSkills.push(checkbox.value);
    });

    // Get selected gender
    const selectedGender = document.querySelector(
        'input[name="gender"]:checked'
    );

    // Get photo
    const photoInput = document.getElementById("profilePhoto");

    let photo = "";

    if (photoInput.files.length > 0) {
        photo = URL.createObjectURL(photoInput.files[0]);
    }

    // Create student object
    const student = {
        id: nextStudentId++,
        name: document.getElementById("studentName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        gender: selectedGender.value,
        course: document.getElementById("course").value,
        skills: selectedSkills,
        about: document.getElementById("about").value,
        photo: photo
    };

    // Add student to array
    students.push(student);

    renderStudents();
    updateStatistics();

    // Reset form
    studentForm.reset();
});


function renderStudents() {
    const studentsContainer = document.getElementById("studentsContainer");

    // Clear old cards
    studentsContainer.innerHTML = "";

    students.forEach(function (student) {

        // Card
        const studentCard = document.createElement("div");
        studentCard.classList.add("student-card");
        studentCard.setAttribute("data-id", student.id);

        // Photo
        const photo = document.createElement("img");
        photo.setAttribute("src", student.photo);
        photo.setAttribute("alt", student.name);
        photo.classList.add("student-photo");

        // Name
        const name = document.createElement("h3");
        name.textContent = student.name;

        // Email
        const email = document.createElement("p");
        email.textContent = `Email: ${student.email}`;

        // Phone
        const phone = document.createElement("p");
        phone.textContent = `Phone: ${student.phone}`;

        // DOB
        const dob = document.createElement("p");
        dob.textContent = `DOB: ${student.dob}`;

        // Gender
        const gender = document.createElement("p");
        gender.textContent = `Gender: ${student.gender}`;

        // Course
        const course = document.createElement("p");
        course.textContent = `Course: ${student.course}`;

        // Skills
        const skillsTitle = document.createElement("strong");
        skillsTitle.textContent = "Skills:";

        const skills = document.createElement("p");
        skills.textContent = student.skills.join(", ");

        // About
        const aboutTitle = document.createElement("strong");
        aboutTitle.textContent = "About:";

        const about = document.createElement("p");
        about.textContent = student.about;

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        // Button container
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("card-buttons");

        buttonContainer.append(editButton, deleteButton);

        // Add everything to card
        studentCard.append(
            photo,
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skillsTitle,
            skills,
            aboutTitle,
            about,
            buttonContainer
        );

        studentsContainer.appendChild(studentCard);
    });
}
function updateStatistics() {

    // Total students
    document.getElementById("totalStudents").textContent =
        students.length;

    // Course counters
    let webDevelopmentCount = 0;
    let uiuxCount = 0;
    let pythonCount = 0;
    let dataAnalyticsCount = 0;
    let mernStackCount = 0;
    let cloudComputingCount = 0;

    students.forEach(function (student) {
        if (student.course === "Web Development") {
            webDevelopmentCount++;
        } else if (student.course === "UI/UX") {
            uiuxCount++;
        } else if (student.course === "Python") {
            pythonCount++;
        } else if (student.course === "Data Analytics") {
            dataAnalyticsCount++;
        } else if (student.course === "MERN Stack") {
            mernStackCount++;
        } else if (student.course === "Cloud Computing") {
            cloudComputingCount++;
        }
    });

    // Update Web Development
    document.getElementById("webDevelopmentCount").textContent =
        webDevelopmentCount;

    // Update UI/UX
    document.getElementById("uiuxCount").textContent =
        uiuxCount;

    // Update Python
    document.getElementById("pythonCount").textContent =
        pythonCount;

    // Update Data Analytics
    document.getElementById("dataAnalyticsCount").textContent =
        dataAnalyticsCount;

    // Update MERN Stack
    document.getElementById("mernStackCount").textContent =
        mernStackCount;

    // Update Cloud Computing
    document.getElementById("cloudComputingCount").textContent =
        cloudComputingCount;
}