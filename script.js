// Batch 10, Javascript toipcs not coverd yet
//Using AI







const students = [];

// DOM Elements
const form = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const totalStudentsElement = document.querySelector("#totalStudents");

// Form Inputs
const nameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#studentEmail");
const phoneInput = document.querySelector("#studentPhone");
const dobInput = document.querySelector("#studentDob");
const courseInput = document.querySelector("#studentCourse");
const aboutInput = document.querySelector("#studentAbout");
const photoInput = document.querySelector("#studentPhoto");

// Form Submit Event Handler
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    // Clear previous error messages
    clearErrors();

    // Validate inputs
    const isValid = validateForm();

    if (!isValid) {
        return; // Stop execution if validation fails
    }

    // Get selected gender
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    
    // Get selected skills
    const selectedSkills = Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map((cb) => cb.value);

    // Get image preview URL or file name
    const photoFile = photoInput.files[0];
    const photoUrl = photoFile ? URL.createObjectURL(photoFile) : "";

    // Create Student Object
    const student = {
        id: Date.now(), // Unique ID using timestamp
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: selectedGender.value,
        course: courseInput.value,
        skills: selectedSkills,
        about: aboutInput.value.trim(),
        photo: photoUrl
    };

    // Add to array
    students.push(student);

    // Render Student Card
    renderStudentCard(student);

    // Update Counter & Reset Form
    updateStudentCount();
    form.reset();
});

// Validation Logic
function validateForm() {
    let isValid = true;

    // 1. Name Validation (Regex: Only letters and spaces, min 3 chars)
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameInput.value.trim() || !nameRegex.test(nameInput.value.trim())) {
        showError(nameInput, "Enter a valid name (at least 3 letters, no numbers/symbols).");
        isValid = false;
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, "Enter a valid email address.");
        isValid = false;
    }

    // 3. Phone Validation (Regex: Exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
        showError(phoneInput, "Enter a valid 10-digit phone number.");
        isValid = false;
    }

    // 4. Date of Birth Validation (No future dates)
    const selectedDate = new Date(dobInput.value);
    const today = new Date();
    if (!dobInput.value || selectedDate > today) {
        showError(dobInput, "Select a valid birth date (future dates are not allowed).");
        isValid = false;
    }

    // 5. Gender Validation
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        showError(document.querySelector('.gender-group'), "Please select a gender.");
        isValid = false;
    }

    // 6. Course Validation
    if (!courseInput.value) {
        showError(courseInput, "Please select a course.");
        isValid = false;
    }

    // 7. Skills Validation (At least one required)
    const skillsSelected = document.querySelectorAll('input[name="skills"]:checked');
    if (skillsSelected.length === 0) {
        showError(document.querySelector('.skills-group'), "Select at least one skill.");
        isValid = false;
    }

    // 8. About Student Validation (Cannot be empty/spaces only)
    if (!aboutInput.value.trim()) {
        showError(aboutInput, "About section cannot be empty.");
        isValid = false;
    }

    // 9. Profile Photo Validation
    if (!photoInput.files || photoInput.files.length === 0) {
        showError(photoInput, "Please upload a profile photo.");
        isValid = false;
    }

    return isValid;
}

// Display Error Message
function showError(element, message) {
    const errorDiv = document.createElement("small");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.textContent = message;
    element.parentElement.appendChild(errorDiv);
}

// Clear Error Messages
function clearErrors() {
    const errors = document.querySelectorAll(".error-message");
    errors.forEach((err) => err.remove());
}

// Render Dynamic Student Card
function renderStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    const img = document.createElement("img");
    img.src = student.photo;
    img.alt = student.name;

    const heading = document.createElement("h3");
    heading.textContent = student.name;

    const emailPara = document.createElement("p");
    emailPara.textContent = `Email: ${student.email}`;

    const phonePara = document.createElement("p");
    phonePara.textContent = `Phone: ${student.phone}`;

    const dobPara = document.createElement("p");
    dobPara.textContent = `DOB: ${student.dob}`;

    const genderPara = document.createElement("p");
    genderPara.textContent = `Gender: ${student.gender}`;

    const coursePara = document.createElement("p");
    coursePara.textContent = `Course: ${student.course}`;

    const skillsPara = document.createElement("p");
    skillsPara.textContent = `Skills: ${student.skills.join(", ")}`;

    const aboutPara = document.createElement("p");
    aboutPara.textContent = `About: ${student.about}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    card.append(img, heading, emailPara, phonePara, dobPara, genderPara, coursePara, skillsPara, aboutPara, deleteBtn);
    studentContainer.appendChild(card);
}

// Update Student Count
function updateStudentCount() {
    totalStudentsElement.textContent = `Total Students: ${students.length}`;
}

// Delete Functionality with Event Delegation (Task 4)
studentContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        // Use closest() to find the student card container
        const card = event.target.closest(".student-card");
        const id = Number(card.getAttribute("data-id"));

        // Remove student from array
        const index = students.findIndex((s) => s.id === id);
        if (index !== -1) {
            students.splice(index, 1);
        }

        // Remove card from DOM
        card.remove();

        // Update total student count
        updateStudentCount();
    }
});