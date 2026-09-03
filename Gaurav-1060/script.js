
// Global database array to store all student objects
let students = [];

// Track if we are currently editing a student (stores student ID or null)
let editingStudentId = null;

// Temporary variable to hold uploaded photo Base64 data URL
let currentPhotoData = "";

const studentForm = document.querySelector("#studentForm");
const formHeading = document.querySelector("#formHeading");
const studentNameInput = document.querySelector("#studentName");
const studentEmailInput = document.querySelector("#studentEmail");
const studentPhoneInput = document.querySelector("#studentPhone");
const studentDobInput = document.querySelector("#studentDob");
const studentCourseSelect = document.querySelector("#studentCourse");
const studentAboutTextarea = document.querySelector("#studentAbout");
const charCounter = document.querySelector("#charCounter");
const studentPhotoInput = document.querySelector("#studentPhoto");
const photoPreviewContainer = document.querySelector("#photoPreviewContainer");
const photoPreview = document.querySelector("#photoPreview");

const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");

const studentContainer = document.querySelector("#studentContainer");
const emptyState = document.querySelector("#emptyState");

const searchInput = document.querySelector("#searchInput");
const courseFilterSelect = document.querySelector("#courseFilter");

const statTotal = document.querySelector("#statTotal");
const statWebDev = document.querySelector("#statWebDev");
const statUiUx = document.querySelector("#statUiUx");
const statPython = document.querySelector("#statPython");
const statDataAnalytics = document.querySelector("#statDataAnalytics");
const statMern = document.querySelector("#statMern");
const statCloud = document.querySelector("#statCloud");

document.addEventListener("DOMContentLoaded", function () {
    // Load existing data from browser LocalStorage into our Array database
    loadFromLocalStorage();

    // Render initial statistics and student list
    renderStudentCards();
    updateStatistics();

    // Check saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggleBtn.textContent = "Light Mode";
    }
});

function saveToLocalStorage() {
    localStorage.setItem("studentsDatabase", JSON.stringify(students));
}

// Function to load the array from LocalStorage when page opens
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("studentsDatabase");
    if (savedData) {
        try {
            students = JSON.parse(savedData);
        } catch (error) {
            console.error("Error reading saved student data:", error);
            students = [];
        }
    }
}

studentAboutTextarea.addEventListener("input", function () {
    const textLength = studentAboutTextarea.value.length;
    charCounter.textContent = textLength + " / 200";
});

studentPhotoInput.addEventListener("change", function () {
    const file = studentPhotoInput.files[0];
    if (file) {
        // Validate if selected file is an image
        if (!file.type.startsWith("image/")) {
            showError("photoError", "Please select a valid image file (.jpg, .jpeg, .png)");
            currentPhotoData = "";
            photoPreviewContainer.classList.add("hidden");
            return;
        }

        clearError("photoError");
        const reader = new FileReader();
        reader.onload = function (e) {
            currentPhotoData = e.target.result;
            photoPreview.src = currentPhotoData;
            photoPreviewContainer.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
});
function showError(elementId, message) {
    const errorMsgElement = document.querySelector("#" + elementId);
    if (errorMsgElement) {
        errorMsgElement.textContent = message;
    }
}

// Helper function to clear an inline error message
function clearError(elementId) {
    const errorMsgElement = document.querySelector("#" + elementId);
    if (errorMsgElement) {
        errorMsgElement.textContent = "";
    }
}

// Function to clear all validation error messages on form
function clearAllErrors() {
    const errorElements = document.querySelectorAll(".error-msg");
    errorElements.forEach(function (el) {
        el.textContent = "";
    });
}

// Full Form Validation Function
function validateForm() {
    let isValid = true;

    // --- 1. Student Name Validation ---
    const nameValue = studentNameInput.value.trim();
    // Regex: letters and spaces only, 3 to 40 characters long
    const nameRegex = /^[A-Za-z\s]{3,40}$/;

    if (nameValue === "") {
        showError("nameError", "Student Name is required.");
        isValid = false;
    } else if (nameValue.length < 3) {
        showError("nameError", "Name must be at least 3 characters long.");
        isValid = false;
    } else if (nameValue.length > 40) {
        showError("nameError", "Name must not exceed 40 characters.");
        isValid = false;
    } else if (!nameRegex.test(nameValue)) {
        showError("nameError", "Only letters and spaces are allowed (no numbers or special characters).");
        isValid = false;
    } else {
        clearError("nameError");
    }

    // --- 2. Email Validation ---
    const emailValue = studentEmailInput.value.trim();
    // Regex: standard email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        showError("emailError", "Email address is required.");
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError("emailError", "Please enter a valid email address (e.g. student@gmail.com).");
        isValid = false;
    } else {
        clearError("emailError");
    }

    // --- 3. Phone Number Validation ---
    const phoneValue = studentPhoneInput.value.trim();
    // Regex: exactly 10 numeric digits
    const phoneRegex = /^\d{10}$/;

    if (phoneValue === "") {
        showError("phoneError", "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        showError("phoneError", "Phone number must be exactly 10 numeric digits.");
        isValid = false;
    } else {
        clearError("phoneError");
    }

    // --- 4. Date of Birth & Age Validation ---
    const dobValue = studentDobInput.value;

    if (!dobValue) {
        showError("dobError", "Date of Birth is required.");
        isValid = false;
    } else {
        const selectedDob = new Date(dobValue);
        const today = new Date();

        if (selectedDob > today) {
            showError("dobError", "Date of Birth cannot be in the future.");
            isValid = false;
        } else {
            // Calculate student age in years
            let age = today.getFullYear() - selectedDob.getFullYear();
            const monthDiff = today.getMonth() - selectedDob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDob.getDate())) {
                age--;
            }

            if (age < 15) {
                showError("dobError", "Student must be at least 15 years old.");
                isValid = false;
            } else {
                clearError("dobError");
            }
        }
    }

    // --- 5. Gender Validation ---
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (!selectedGender) {
        showError("genderError", "Please select a gender.");
        isValid = false;
    } else {
        clearError("genderError");
    }

    // --- 6. Course Validation ---
    const selectedCourse = studentCourseSelect.value;
    if (!selectedCourse) {
        showError("courseError", "Please select a course.");
        isValid = false;
    } else {
        clearError("courseError");
    }

    // --- 7. Skills Validation ---
    const selectedSkills = document.querySelectorAll('input[name="skill"]:checked');
    if (selectedSkills.length === 0) {
        showError("skillsError", "Please select at least one skill.");
        isValid = false;
    } else {
        clearError("skillsError");
    }

    // --- 8. About Student Validation ---
    const aboutValue = studentAboutTextarea.value.trim();
    if (aboutValue === "") {
        showError("aboutError", "About student field is required.");
        isValid = false;
    } else if (aboutValue.length < 20) {
        showError("aboutError", "Please enter at least 20 characters.");
        isValid = false;
    } else if (aboutValue.length > 200) {
        showError("aboutError", "About field cannot exceed 200 characters.");
        isValid = false;
    } else {
        clearError("aboutError");
    }

    // --- 9. Profile Photo Validation ---
    // If adding a new student, photo is strictly required
    if (!editingStudentId && !currentPhotoData) {
        showError("photoError", "Profile photo is required.");
        isValid = false;
    } else {
        clearError("photoError");
    }

    return isValid;
}
studentForm.addEventListener("submit", function (event) {
    // 1. Prevent default form reload behavior
    event.preventDefault();

    // 2. Validate all form fields
    if (!validateForm()) {
        return;
    }

    // 3. Extract all form input values
    const name = studentNameInput.value.trim();
    const email = studentEmailInput.value.trim();
    const phone = studentPhoneInput.value.trim();
    const dob = studentDobInput.value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const course = studentCourseSelect.value;

    // Collect checked skills array
    const skillsElements = document.querySelectorAll('input[name="skill"]:checked');
    const skills = Array.from(skillsElements).map(function (input) {
        return input.value;
    });

    const about = studentAboutTextarea.value.trim();

    if (editingStudentId) {
        // --- EDIT MODE: Update existing student object inside the array ---
        const existingStudent = students.find(function (s) {
            return s.id === editingStudentId;
        });

        if (existingStudent) {
            existingStudent.name = name;
            existingStudent.email = email;
            existingStudent.phone = phone;
            existingStudent.dob = dob;
            existingStudent.gender = gender;
            existingStudent.course = course;
            existingStudent.skills = skills;
            existingStudent.about = about;
            // Update photo only if a new photo was selected
            if (currentPhotoData) {
                existingStudent.photo = currentPhotoData;
            }
        }

    } else {
        // --- ADD MODE: Create new student object and push to array ---
        const newStudent = {
            id: Date.now(), // Generate unique ID using current timestamp
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender,
            course: course,
            skills: skills,
            about: about,
            photo: currentPhotoData
        };

        // Add object into our database array
        students.push(newStudent);
    }

    // 4. Save updated array database to LocalStorage
    saveToLocalStorage();

    // 5. Update DOM Card UI & Statistics
    renderStudentCards();
    updateStatistics();

    // 6. Reset form back to fresh state
    resetForm();
});
function renderStudentCards() {
    // Read search and filter values
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCourseFilter = courseFilterSelect.value;

    // Filter array according to search input AND course selection
    const filteredStudents = students.filter(function (student) {
        const matchesName = student.name.toLowerCase().includes(searchTerm);
        const matchesCourse = (selectedCourseFilter === "ALL" || student.course === selectedCourseFilter);
        return matchesName && matchesCourse;
    });

    // Clear container except for emptyState paragraph
    studentContainer.innerHTML = "";

    if (filteredStudents.length === 0) {
        // Render fallback message when array or search is empty
        const emptyPara = document.createElement("p");
        emptyPara.id = "emptyState";
        emptyPara.className = "empty-state";
        emptyPara.textContent = "No students found";
        studentContainer.appendChild(emptyPara);
        return;
    }

    // Loop through filtered array and build dynamic DOM elements for each student
    filteredStudents.forEach(function (student) {
        // 1. Outer Card Container
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        // 2. Header Info Section (Photo, Name, Course Badge)
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("card-header-info");

        const img = document.createElement("img");
        img.src = student.photo || "https://via.placeholder.com/60?text=User";
        img.alt = student.name;
        img.classList.add("student-photo-img");

        const nameContainer = document.createElement("div");
        
        const nameTitle = document.createElement("h3");
        nameTitle.classList.add("student-name-title");
        nameTitle.textContent = student.name;

        const courseBadge = document.createElement("span");
        courseBadge.classList.add("student-course-badge");
        courseBadge.textContent = student.course;

        nameContainer.appendChild(nameTitle);
        nameContainer.appendChild(courseBadge);

        headerDiv.appendChild(img);
        headerDiv.appendChild(nameContainer);

        // 3. Details Section (Email, Phone, DOB, Gender)
        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("card-details");

        detailsDiv.innerHTML = `
            <p><strong>Email:</strong> ${escapeHtml(student.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(student.phone)}</p>
            <p><strong>DOB:</strong> ${formatDate(student.dob)}</p>
            <p><strong>Gender:</strong> ${escapeHtml(student.gender)}</p>
        `;

        // 4. Skills Section
        const skillsContainer = document.createElement("div");
        const skillsTitle = document.createElement("p");
        skillsTitle.innerHTML = "<strong>Skills:</strong>";

        const skillsList = document.createElement("div");
        skillsList.classList.add("card-skills-list");

        student.skills.forEach(function (skill) {
            const skillTag = document.createElement("span");
            skillTag.classList.add("skill-tag");
            skillTag.textContent = skill;
            skillsList.appendChild(skillTag);
        });

        skillsContainer.appendChild(skillsTitle);
        skillsContainer.appendChild(skillsList);

        // 5. About Section
        const aboutDiv = document.createElement("div");
        aboutDiv.classList.add("card-about");
        aboutDiv.textContent = student.about;

        // 6. Action Buttons (Edit & Delete)
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("card-actions");

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-edit edit-btn";
        editBtn.textContent = "Edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-danger delete-btn";
        deleteBtn.textContent = "Delete";

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        // Assemble full card
        card.appendChild(headerDiv);
        card.appendChild(detailsDiv);
        card.appendChild(skillsContainer);
        card.appendChild(aboutDiv);
        card.appendChild(actionsDiv);

        // Append card to main student container
        studentContainer.appendChild(card);
    });
}

// Utility function to format dates as DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
}

// Utility function to sanitize HTML text content
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
function updateStatistics() {
    // Total count
    statTotal.textContent = students.length;

    // Course counts initial state
    const courseCounts = {
        "Web Development": 0,
        "UI/UX": 0,
        "Python": 0,
        "Data Analytics": 0,
        "MERN Stack": 0,
        "Cloud Computing": 0
    };

    // Calculate count per course from array
    students.forEach(function (student) {
        if (courseCounts.hasOwnProperty(student.course)) {
            courseCounts[student.course]++;
        }
    });

    // Update DOM counters
    statWebDev.textContent = courseCounts["Web Development"];
    statUiUx.textContent = courseCounts["UI/UX"];
    statPython.textContent = courseCounts["Python"];
    statDataAnalytics.textContent = courseCounts["Data Analytics"];
    statMern.textContent = courseCounts["MERN Stack"];
    statCloud.textContent = courseCounts["Cloud Computing"];
}

studentContainer.addEventListener("click", function (event) {
    // Locate parent card element using closest()
    const cardElement = event.target.closest(".student-card");
    if (!cardElement) return;

    // Read student ID from dataset
    const studentId = Number(cardElement.getAttribute("data-id"));

    // --- HANDLE DELETE BUTTON CLICK ---
    if (event.target.classList.contains("delete-btn")) {
        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
            // Remove student object from global array
            students = students.filter(function (s) {
                return s.id !== studentId;
            });

            // Save updated array to LocalStorage
            saveToLocalStorage();

            // Re-render UI cards & update statistics
            renderStudentCards();
            updateStatistics();

            // If we were currently editing this deleted student, reset form
            if (editingStudentId === studentId) {
                resetForm();
            }
        }
    }

    // --- HANDLE EDIT BUTTON CLICK ---
    if (event.target.classList.contains("edit-btn")) {
        const studentToEdit = students.find(function (s) {
            return s.id === studentId;
        });

        if (studentToEdit) {
            populateFormForEdit(studentToEdit);
        }
    }
});

function populateFormForEdit(student) {
    editingStudentId = student.id;

    // Populate inputs
    studentNameInput.value = student.name;
    studentEmailInput.value = student.email;
    studentPhoneInput.value = student.phone;
    studentDobInput.value = student.dob;
    studentCourseSelect.value = student.course;
    studentAboutTextarea.value = student.about;

    // Update character counter display
    charCounter.textContent = student.about.length + " / 200";

    // Set gender radio button
    const genderRadio = document.querySelector(`input[name="gender"][value="${student.gender}"]`);
    if (genderRadio) {
        genderRadio.checked = true;
    }

    // Uncheck all skill checkboxes then check the student's skills
    const skillCheckboxes = document.querySelectorAll('input[name="skill"]');
    skillCheckboxes.forEach(function (checkbox) {
        checkbox.checked = student.skills.includes(checkbox.value);
    });

    // Handle photo preview
    currentPhotoData = student.photo;
    if (currentPhotoData) {
        photoPreview.src = currentPhotoData;
        photoPreviewContainer.classList.remove("hidden");
    } else {
        photoPreviewContainer.classList.add("hidden");
    }

    // Change Form Heading & Submit Button Label
    formHeading.textContent = "Edit Student Information";
    submitBtn.textContent = "Update Student";
    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-edit");

    // Scroll smoothly to form
    studentForm.scrollIntoView({ behavior: "smooth" });
}

function resetForm() {
    studentForm.reset();
    editingStudentId = null;
    currentPhotoData = "";
    photoPreviewContainer.classList.add("hidden");
    photoPreview.src = "";
    charCounter.textContent = "0 / 200";

    clearAllErrors();

    // Reset heading & submit button label back to Register mode
    formHeading.textContent = "Student Registration Form";
    submitBtn.textContent = "Register Student";
    submitBtn.classList.remove("btn-edit");
    submitBtn.classList.add("btn-primary");
}

resetBtn.addEventListener("click", resetForm);


searchInput.addEventListener("input", function () {
    renderStudentCards();
});
courseFilterSelect.addEventListener("change", function () {
    renderStudentCards();
});
