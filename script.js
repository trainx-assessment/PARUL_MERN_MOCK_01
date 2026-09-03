const form=document.getElementById("form");
const nameInput=document.getElementById("Name")
const emailInput=document.getElementById("Email")
const phoneInput=document.getElementById("Phone")
const dobInput=document.getElementById("Dob")
const courseInput = document.getElementById("Course");
const aboutInput = document.getElementById("Aboutstudent");
const photoInput = document.getElementById("Profilephoto");

const genderInputs = document.querySelectorAll('input[name="gender"]');
const skillInputs = document.querySelectorAll(
    '.skills input[type="checkbox"]'
);

function validateName(){
    const name=nameInput.value.trim()
    if(name===" "){
        alert("Student name is required.")
        return false;
    }

    if(name.length<3){
        alert("Student name is required.")
        return false;
    }
    if(name.length>40){
        alert("Name must not exceed 40 characters.")
        return false;
    }
    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(name)) {
        
        alert("Name can contain only letters and spaces.")
        return false;
    }
    return true;
}

function validateEmail() {
    const email = emailInput.value.trim();

    if (email === "") {
        alert("Email is required")
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
                alert("Please enter a valid email address")

        return false;
    }

    removeError(emailInput);
    return true;
}

function validatePhone() {
    const phone = phoneInput.value.trim();

    if (phone === "") {
        alert("Phone number is required")
        return false;
    }

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phone)) {
        alert("phone number must contain 10 digits")
        return false;
    }

    removeError(phoneInput);
    return true;
}

function validateDob() {
    const dob = dobInput.value;

    if (dob === "") {
        showError(dobInput, "Date of birth is required.");
        return false;
    }

    const selectedDate = new Date(dob);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        showError(dobInput, "Future dates are not allowed.");
        return false;
    }

    const minimumAgeDate = new Date();
    minimumAgeDate.setFullYear(
        minimumAgeDate.getFullYear() - 15
    );

    if (selectedDate > minimumAgeDate) {
        showError(dobInput, "Student must be at least 15 years old.");
        return false;
    }

    removeError(dobInput);
    return true;
}

function validateGender() {
    let selected = false;

    genderInputs.forEach(function (gender) {
        if (gender.checked) {
            selected = true;
        }
    });

    const genderContainer = document.querySelector(".gender");

    const oldError = genderContainer.querySelector(".error-message");

    if (oldError) {
        oldError.remove();
    }

    if (!selected) {
        const error = document.createElement("small");
        error.className = "error-message";
        error.style.color = "red";
        error.textContent = "Please select a gender.";

        genderContainer.appendChild(error);

        return false;
    }

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
    let selected = false;

    skillInputs.forEach(function (skill) {
        if (skill.checked) {
            selected = true;
        }
    });

    const skillsContainer = document.querySelector(".skills");

    const oldError = skillsContainer.querySelector(".error-message");

    if (oldError) {
        oldError.remove();
    }

    if (!selected) {
        const error = document.createElement("small");
        error.className = "error-message";
        error.style.color = "red";
        error.textContent = "Please select at least one skill.";

        skillsContainer.appendChild(error);

        return false;
    }

    return true;
}

function validateAboutStudent() {
    const about = aboutInput.value.trim();

    if (about === "") {
        showError(aboutInput, "About student is required.");
        return false;
    }

    if (about.length < 20) {
        showError(
            aboutInput,
            "About student must be at least 20 characters."
        );
        return false;
    }

    if (about.length > 200) {
        showError(
            aboutInput,
            "About student must not exceed 200 characters."
        );
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

    const allowedTypes = [
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
        showError(
            photoInput,
            "Only JPG, JPEG and PNG images are allowed."
        );
        return false;
    }

    removeError(photoInput);
    return true;
}


form.addEventListener("submit", function (event) {

    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();
    const isCourseValid = validateCourse();
    const areSkillsValid = validateSkills();
    const isAboutValid = validateAboutStudent();
    const isPhotoValid = validatePhoto();

    if (
        !isNameValid ||
        !isEmailValid ||
        !isPhoneValid ||
        !isDobValid ||
        !isGenderValid ||
        !isCourseValid ||
        !areSkillsValid ||
        !isAboutValid ||
        !isPhotoValid
    ) {
        return;
    }

    alert("Student registration successful!");

});

function getSelectedGender() {

    let selectedGender = "";

    genderInputs.forEach(function (gender) {

        if (gender.checked) {

            if (gender.id === "male") {
                selectedGender = "Male";
            }

            else if (gender.id === "female") {
                selectedGender = "Female";
            }

            else if (gender.id === "others") {
                selectedGender = "Others";
            }

        }

    });

    return selectedGender;
}
function getSelectedSkills() {

    const skills = [];

    skillInputs.forEach(function (skill) {

        if (skill.checked) {

            // Convert checkbox id into readable skill name

            if (skill.id === "Html") {
                skills.push("HTML");
            }

            else if (skill.id === "Css") {
                skills.push("CSS");
            }

            else if (skill.id === "Javascript") {
                skills.push("JavaScript");
            }

            else if (skill.id === "Git") {
                skills.push("Git");
            }

            else if (skill.id === "React") {
                skills.push("React");
            }

            else if (skill.id === "Node.js") {
                skills.push("Node.js");
            }

        }

    });

    return skills;
}


const students = [];

let nextStudentId = 1;


function createStudentObject(photoURL) {

    const student = {

        id: nextStudentId,

        name: nameInput.value.trim(),

        email: emailInput.value.trim(),

        phone: phoneInput.value.trim(),

        dob: dobInput.value,

        gender: getSelectedGender(),

        course: courseInput.value,

        skills: getSelectedSkills(),

        about: aboutInput.value.trim(),

        photo: photoURL

    };

    nextStudentId++;

    return student;
}

function createStudentCard(student) {

    const card =
        document.createElement("div");

    card.classList.add("student-card");

    card.setAttribute(
        "data-id",
        student.id
    );

 const image =
        document.createElement("img");

    image.src = student.photo;

    image.alt =
        `${student.name} profile photo`;

    image.classList.add("student-photo");

    card.appendChild(image);
 const name =
        document.createElement("h3");

    name.textContent =
        student.name;

    card.appendChild(name);

    const email =
        document.createElement("p");

    email.textContent =
        `Email: ${student.email}`;

    card.appendChild(email);

     const phone =
        document.createElement("p");

    phone.textContent =
        `Phone: ${student.phone}`;

    card.appendChild(phone);
    const dob =
        document.createElement("p");

    dob.textContent =
        `Date of Birth: ${formatDate(student.dob)}`;

    card.appendChild(dob);
    const gender =
        document.createElement("p");

    gender.textContent =
        `Gender: ${student.gender}`;

    card.appendChild(gender);
    const course =
        document.createElement("p");

    course.textContent =
        `Course: ${student.course}`;

    card.appendChild(course);
    const skillsHeading =
        document.createElement("strong");

    skillsHeading.textContent =
        "Skills:";

    card.appendChild(skillsHeading);

    const skills =
        document.createElement("p");

    skills.textContent =
        student.skills.join(", ");

    card.appendChild(skills);

    const aboutHeading =
        document.createElement("strong");

    aboutHeading.textContent =
        "About Student:";

    card.appendChild(aboutHeading);

    const about =
        document.createElement("p");

    about.textContent =
        student.about;

    card.appendChild(about);


    const buttons =
        document.createElement("div");

    buttons.classList.add("card-buttons");
    const editButton =
        document.createElement("button");

    editButton.textContent = "Edit";

    editButton.type = "button";

    editButton.classList.add("edit-btn");

    editButton.setAttribute(
        "data-id",
        student.id
    );

    buttons.appendChild(editButton);


    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.type = "button";

    deleteButton.classList.add("delete-btn");

    deleteButton.setAttribute(
        "data-id",
        student.id
    );

    buttons.appendChild(deleteButton);


    card.appendChild(buttons);


    // Add card to container
    studentCardsContainer.appendChild(card);
}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const parts =
        dateString.split("-");

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}



function displayStudents() {

    studentCardsContainer.innerHTML = "";

    students.forEach(function (student) {

        createStudentCard(student);

    });

    updateStatistics();
}
