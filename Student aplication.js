/**
 * Student Application Manager - Main Script
 */

// Student Data Store
const students = [];

// DOM Elements Selection
const studentForm = document.querySelector("#studentForm");
const studentNameInput = document.querySelector("#studentName");
const studentEmailInput = document.querySelector("#studentEmail");
const studentPhoneInput = document.querySelector("#studentPhone");
const studentDobInput = document.querySelector("#studentDob");
const studentCourseSelect = document.querySelector("#studentCourse");
const studentPhotoInput = document.querySelector("#studentPhoto");
const studentAboutTextarea = document.querySelector("#studentAbout");

const studentContainer = document.querySelector("#studentContainer");
const totalCountSpan = document.querySelector("#totalCount");
const emptyState = document.querySelector("#emptyState");

// Error Elements Selection
const nameError = document.querySelector("#nameError");
const emailError = document.querySelector("#emailError");
const phoneError = document.querySelector("#phoneError");
const dobError = document.querySelector("#dobError");
const genderError = document.querySelector("#genderError");
const courseError = document.querySelector("#courseError");
const skillsError = document.querySelector("#skillsError");
const photoError = document.querySelector("#photoError");
const aboutError = document.querySelector("#aboutError");

// Helper function to set single field error
function setError(inputElement, errorElement, message) {
    if (inputElement) {
        inputElement.classList.add("invalid");
    }
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear all validation error states
function clearAllErrors() {
    const inputs = studentForm.querySelectorAll("input, select, textarea");
    inputs.forEach(input => input.classList.remove("invalid"));

    const errorMsgs = studentForm.querySelectorAll(".error-msg");
    errorMsgs.forEach(msg => msg.textContent = "");
}

// Form Validation Function
function validateForm() {
    let isValid = true;
    clearAllErrors();

    // 1. Student Name: Required, min 3 chars, letters and spaces only
    const nameVal = studentNameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]{3,}$/;

    if (!nameVal) {
        setError(studentNameInput, nameError, "Student name is required.");
        isValid = false;
    } else if (!nameRegex.test(nameVal)) {
        if (nameVal.length < 3) {
            setError(studentNameInput, nameError, "Name must be at least 3 characters long.");
        } else {
            setError(studentNameInput, nameError, "Only letters and spaces are allowed.");
        }
        isValid = false;
    }

    // 2. Email: Required, valid format
    const emailVal = studentEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailVal) {
        setError(studentEmailInput, emailError, "Email address is required.");
        isValid = false;
    } else if (!emailRegex.test(emailVal)) {
        setError(studentEmailInput, emailError, "Please enter a valid email address.");
        isValid = false;
    }

    // 3. Phone Number: Required, exactly 10 digits
    const phoneVal = studentPhoneInput.value.trim();
    const phoneRegex = /^\d{10}$/;

    if (!phoneVal) {
        setError(studentPhoneInput, phoneError, "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phoneVal)) {
        setError(studentPhoneInput, phoneError, "Phone number must be exactly 10 digits.");
        isValid = false;
    }

    // 4. Date of Birth: Required, future dates not accepted
    const dobVal = studentDobInput.value;
    if (!dobVal) {
        setError(studentDobInput, dobError, "Date of birth is required.");
        isValid = false;
    } else {
        const selectedDob = new Date(dobVal);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (selectedDob > today) {
            setError(studentDobInput, dobError, "Future dates are not allowed.");
            isValid = false;
        }
    }

    // 5. Gender: One option must be selected
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (!selectedGender) {
        setError(null, genderError, "Please select a gender.");
        isValid = false;
    }

    // 6. Course: A course must be selected
    const courseVal = studentCourseSelect.value;
    if (!courseVal) {
        setError(studentCourseSelect, courseError, "Please select a course.");
        isValid = false;
    }

    // 7. Skills: At least one skill must be selected
    const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
    if (selectedSkills.length === 0) {
        setError(null, skillsError, "Select at least one skill.");
        isValid = false;
    }

    // 8. Profile Photo: Profile photo must be selected
    if (!studentPhotoInput.files || studentPhotoInput.files.length === 0) {
        setError(studentPhotoInput, photoError, "Profile photo is required.");
        isValid = false;
    }

    // 9. About Student: Required, space-only input rejected
    const aboutVal = studentAboutTextarea.value.trim();
    if (!aboutVal) {
        setError(studentAboutTextarea, aboutError, "About student is required.");
        isValid = false;
    }

    return isValid;
}

// Convert uploaded image file into Data URL string
function readProfilePhoto(file) {
    return new Promise((resolve) => {
        if (!file) {
            resolve("https://via.placeholder.com/150");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.onerror = function () {
            resolve("https://via.placeholder.com/150");
        };
        reader.readAsDataURL(file);
    });
}

// Create & Render Dynamic Student Card
function createStudentCard(student) {
    // Card Container Element
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    // Decorative Header Bar
    const headerBar = document.createElement("div");
    headerBar.classList.add("card-header-bar");
    card.appendChild(headerBar);

    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Profile Row (Photo, Name, Course Badge)
    const profileRow = document.createElement("div");
    profileRow.classList.add("profile-row");

    const photoImg = document.createElement("img");
    photoImg.classList.add("student-photo");
    photoImg.src = student.photo;
    photoImg.alt = student.name;

    const profileInfo = document.createElement("div");
    profileInfo.classList.add("profile-info");

    const nameHeading = document.createElement("h3");
    nameHeading.classList.add("student-name");
    nameHeading.textContent = student.name;

    const courseBadge = document.createElement("span");
    courseBadge.classList.add("course-badge");
    courseBadge.textContent = student.course;

    profileInfo.appendChild(nameHeading);
    profileInfo.appendChild(courseBadge);

    profileRow.appendChild(photoImg);
    profileRow.appendChild(profileInfo);
    cardBody.appendChild(profileRow);

    // Info Details List
    const infoList = document.createElement("div");
    infoList.classList.add("info-list");

    // Email Item
    const emailItem = document.createElement("div");
    emailItem.classList.add("info-item");
    const emailIcon = document.createElement("i");
    emailIcon.classList.add("fa-regular", "fa-envelope");
    const emailText = document.createElement("span");
    emailText.textContent = student.email;
    emailItem.appendChild(emailIcon);
    emailItem.appendChild(emailText);
    infoList.appendChild(emailItem);

    // Phone Item
    const phoneItem = document.createElement("div");
    phoneItem.classList.add("info-item");
    const phoneIcon = document.createElement("i");
    phoneIcon.classList.add("fa-solid", "fa-phone");
    const phoneText = document.createElement("span");
    phoneText.textContent = student.phone;
    phoneItem.appendChild(phoneIcon);
    phoneItem.appendChild(phoneText);
    infoList.appendChild(phoneItem);

    // DOB & Gender Item
    const dobItem = document.createElement("div");
    dobItem.classList.add("info-item");
    const dobIcon = document.createElement("i");
    dobIcon.classList.add("fa-regular", "fa-calendar");
    const dobText = document.createElement("span");
    dobText.textContent = `${student.dob} (${student.gender})`;
    dobItem.appendChild(dobIcon);
    dobItem.appendChild(dobText);
    infoList.appendChild(dobItem);

    cardBody.appendChild(infoList);

    // Skills Section
    const skillsContainer = document.createElement("div");
    skillsContainer.classList.add("skills-container");

    const skillsTitle = document.createElement("div");
    skillsTitle.classList.add("skills-title");
    skillsTitle.textContent = "Skills";

    const skillsTags = document.createElement("div");
    skillsTags.classList.add("skills-tags");

    student.skills.forEach(skill => {
        const skillTag = document.createElement("span");
        skillTag.classList.add("skill-tag");
        skillTag.textContent = skill;
        skillsTags.appendChild(skillTag);
    });

    skillsContainer.appendChild(skillsTitle);
    skillsContainer.appendChild(skillsTags);
    cardBody.appendChild(skillsContainer);

    // About Section
    const aboutSection = document.createElement("div");
    aboutSection.classList.add("about-section");

    const aboutHeader = document.createElement("strong");
    aboutHeader.textContent = "About:";
    const aboutParagraph = document.createElement("span");
    aboutParagraph.textContent = student.about;

    aboutSection.appendChild(aboutHeader);
    aboutSection.appendChild(aboutParagraph);
    cardBody.appendChild(aboutSection);

    card.appendChild(cardBody);

    // Card Footer & Delete Button
    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.type = "button";
    
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    const deleteText = document.createElement("span");
    deleteText.textContent = "Delete";

    deleteBtn.appendChild(deleteIcon);
    deleteBtn.appendChild(deleteText);
    cardFooter.appendChild(deleteBtn);

    card.appendChild(cardFooter);

    // Append completed card to DOM container
    studentContainer.appendChild(card);
}

// Update Total Student Count Display
function updateStudentCount() {
    totalCountSpan.textContent = students.length;

    if (students.length === 0) {
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";
    }
}

// Form Submission Listener
studentForm.addEventListener("submit", async function (event) {
    // 1. Prevent default form submission behaviour
    event.preventDefault();

    // 2 & 3. Validate input values
    if (!validateForm()) {
        return;
    }

    // Extract Values
    const name = studentNameInput.value.trim();
    const email = studentEmailInput.value.trim();
    const phone = studentPhoneInput.value.trim();
    const dob = studentDobInput.value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const course = studentCourseSelect.value;
    const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value);
    const about = studentAboutTextarea.value.trim();

    // Read profile photo Data URL
    const photoFile = studentPhotoInput.files[0];
    const photoDataUrl = await readProfilePhoto(photoFile);

    // Create Student Object with unique ID
    const student = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about,
        photo: photoDataUrl
    };

    // Store in global array
    students.push(student);

    // Render dynamic student card
    createStudentCard(student);

    // Update total count
    updateStudentCount();

    // Reset Form and clear messages
    studentForm.reset();
    clearAllErrors();
});

// Event Delegation for Deleting Student Cards
studentContainer.addEventListener("click", function (event) {
    // Identify clicked delete button
    const deleteBtn = event.target.closest(".delete-btn");

    if (deleteBtn) {
        // Find closest student card using closest()
        const card = deleteBtn.closest(".student-card");

        if (card) {
            // Get student ID from data-id attribute
            const studentId = parseInt(card.getAttribute("data-id"), 10);

            // Remove student object from array
            const studentIndex = students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                students.splice(studentIndex, 1);
            }

            // Remove card element from DOM
            card.remove();

            // Update total count display
            updateStudentCount();
        }
    }
});

// Initial count setup
updateStudentCount();