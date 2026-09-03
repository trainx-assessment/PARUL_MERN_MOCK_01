
const students = JSON.parse(localStorage.getItem("students")) || [];


let editId = null;


const studentForm = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const charCounter = document.getElementById("charCounter");

const studentCards = document.getElementById("studentCards");
const noStudents = document.getElementById("noStudents");

const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

const darkModeBtn = document.getElementById("darkModeBtn");



displayStudents();

updateStatistics();



aboutInput.addEventListener("input", function () {

    const length = aboutInput.value.length;

    charCounter.textContent = `${length} / 200`;

});



studentForm.addEventListener("submit", function (event) {

    
    event.preventDefault();



    clearErrors();



    const name = nameInput.value.trim();

    const email = emailInput.value.trim();

    const phone = phoneInput.value.trim();

    const dob = dobInput.value;

    const genderElement = document.querySelector(
        'input[name="gender"]:checked'
    );

    const gender = genderElement ? genderElement.value : "";

    const course = courseInput.value;

    const skillElements = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    const skills = Array.from(skillElements).map(function (skill) {
        return skill.value;
    });

    const about = aboutInput.value.trim();

    const photoFile = photoInput.files[0];



    let isValid = true;


  
    const nameRegex = /^[A-Za-z ]{3,40}$/;

    if (name === "") {

        showError("nameError", "Student name is required.");

        isValid = false;

    }
    else if (!nameRegex.test(name)) {

        showError(
            "nameError",
            "Name must contain only letters and spaces (3-40 characters)."
        );

        isValid = false;
    }


  
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (email === "") {

        showError("emailError", "Email is required.");

        isValid = false;

    }
    else if (!emailRegex.test(email)) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;
    }



    const phoneRegex = /^[0-9]{10}$/;


    if (phone === "") {

        showError(
            "phoneError",
            "Phone number is required."
        );

        isValid = false;

    }
    else if (!phoneRegex.test(phone)) {

        showError(
            "phoneError",
            "Phone number must contain exactly 10 digits."
        );

        isValid = false;
    }




    if (dob === "") {

        showError(
            "dobError",
            "Date of birth is required."
        );

        isValid = false;

    }
    else {

        const selectedDate = new Date(dob);

        const today = new Date();

        today.setHours(0, 0, 0, 0);


        if (selectedDate > today) {

            showError(
                "dobError",
                "Date of birth cannot be in the future."
            );

            isValid = false;

        }
        else {

            // Bonus: minimum age 15
            const age = calculateAge(dob);

            if (age < 15) {

                showError(
                    "dobError",
                    "Student must be at least 15 years old."
                );

                isValid = false;
            }

        }

    }


    if (gender === "") {

        showError(
            "genderError",
            "Please select gender."
        );

        isValid = false;
    }



    if (course === "") {

        showError(
            "courseError",
            "Please select a course."
        );

        isValid = false;
    }




    if (skills.length === 0) {

        showError(
            "skillsError",
            "Please select at least one skill."
        );

        isValid = false;
    }



    if (about === "") {

        showError(
            "aboutError",
            "About section is required."
        );

        isValid = false;

    }
    else if (about.length < 20) {

        showError(
            "aboutError",
            "About section must contain at least 20 characters."
        );

        isValid = false;

    }
    else if (about.length > 200) {

        showError(
            "aboutError",
            "About section cannot exceed 200 characters."
        );

        isValid = false;
    }


  
    if (!editId && !photoFile) {

        showError(
            "photoError",
            "Profile photo is required."
        );

        isValid = false;
    }


    if (photoFile) {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];


        if (!allowedTypes.includes(photoFile.type)) {

            showError(
                "photoError",
                "Only JPG, JPEG and PNG images are allowed."
            );

            isValid = false;
        }
    }



    if (!isValid) {

        return;
    }


    if (photoFile) {

        const reader = new FileReader();


        reader.onload = function () {

            saveStudent(
                name,
                email,
                phone,
                dob,
                gender,
                course,
                skills,
                about,
                reader.result
            );

        };


        reader.readAsDataURL(photoFile);

    }
    else {

    
        const existingStudent = students.find(function (student) {

            return student.id === editId;

        });


        saveStudent(
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            about,
            existingStudent.photo
        );

    }

});



function saveStudent(
    name,
    email,
    phone,
    dob,
    gender,
    course,
    skills,
    about,
    photo
) 
{

    if (editId !== null) {

        const student = students.find(function (student) {

            return student.id === editId;

        });


        if (student) {

            student.name = name;

            student.email = email;

            student.phone = phone;

            student.dob = dob;

            student.gender = gender;

            student.course = course;

            student.skills = skills;

            student.about = about;

            student.photo = photo;

        }


        editId = null;

        submitBtn.textContent = "Register Student";

    }




    else {

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

            photo: photo

        };


        students.push(student);

    }


    saveToLocalStorage();


    displayStudents();


    updateStatistics();


    resetForm();

}



function displayStudents() {

    studentCards.replaceChildren();

    const searchValue =
        searchInput.value.trim().toLowerCase();


    const selectedCourse =
        courseFilter.value;




    const filteredStudents = students.filter(function (student) {

        const matchesSearch =
            student.name.toLowerCase().includes(searchValue);


        const matchesCourse =
            selectedCourse === "All" ||
            student.course === selectedCourse;


        return matchesSearch && matchesCourse;

    });


    // No students found

    if (filteredStudents.length === 0) {

        noStudents.style.display = "block";

        return;

    }


    noStudents.style.display = "none";


    // Create cards

    filteredStudents.forEach(function (student) {

        createStudentCard(student);

    });

}



function createStudentCard(student) {


    const card = document.createElement("div");

    card.classList.add("student-card");

    card.setAttribute("data-id", student.id);



    const image = document.createElement("img");

    image.classList.add("student-image");

    image.setAttribute("src", student.photo);

    image.setAttribute(
        "alt",
        `${student.name} profile photo`
    );


    const heading = document.createElement("h3");

    heading.textContent = student.name;

    const email = createInfo(
        "Email",
        student.email
    );

    const phone = createInfo(
        "Phone",
        student.phone
    );



    const dob = createInfo(
        "DOB",
        student.dob
    );

    const gender = createInfo(
        "Gender",
        student.gender
    );


    const course = createInfo(
        "Course",
        student.course
    );

    const skillsTitle = document.createElement("strong");

    skillsTitle.textContent = "Skills";


    const skillsContainer =
        document.createElement("div");

    skillsContainer.classList.add("skill-tags");


    student.skills.forEach(function (skill) {

        const skillTag =
            document.createElement("span");

        skillTag.classList.add("skill-tag");

        skillTag.textContent = skill;

        skillsContainer.append(skillTag);

    });



    const about = document.createElement("p");

    about.classList.add("about-text");

    about.textContent = student.about;


    // Buttons container
    const buttons =
        document.createElement("div");

    buttons.classList.add("card-buttons");


    // Edit button
    const editButton =
        document.createElement("button");

    editButton.classList.add(
        "card-btn",
        "edit-btn"
    );

    editButton.setAttribute("type", "button");

    editButton.textContent = "Edit";


    // Delete button
    const deleteButton =
        document.createElement("button");

    deleteButton.classList.add(
        "card-btn",
        "delete-btn"
    );

    deleteButton.setAttribute("type", "button");

    deleteButton.textContent = "Delete";


    // Add buttons
    buttons.append(
        editButton,
        deleteButton
    );


    // Add everything to card
    card.append(
        image,
        heading,
        email,
        phone,
        dob,
        gender,
        course,
        skillsTitle,
        skillsContainer,
        about,
        buttons
    );


    // Add card to container
    studentCards.append(card);

}


function createInfo(label, value) {

    const paragraph =
        document.createElement("p");

    paragraph.classList.add("student-info");


    const strong =
        document.createElement("strong");

    strong.textContent = `${label}: `;


    const text =
        document.createTextNode(value);


    paragraph.append(
        strong,
        text
    );


    return paragraph;

}



studentCards.addEventListener("click", function (event) {

    // Find clicked edit button
    const editButton =
        event.target.closest(".edit-btn");


    // Find clicked delete button
    const deleteButton =
        event.target.closest(".delete-btn");


    // Find parent card
    const card =
        event.target.closest(".student-card");


    // If no card
    if (!card) {

        return;

    }


    // Get ID
    const id =
        Number(card.getAttribute("data-id"));


    // ================= DELETE =================

    if (deleteButton) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this student?"
            );


        if (!confirmed) {

            return;

        }


        const index =
            students.findIndex(function (student) {

                return student.id === id;

            });


        if (index !== -1) {

            students.splice(index, 1);

        }


        saveToLocalStorage();

        displayStudents();

        updateStatistics();

        return;

    }


    // ================= EDIT =================

    if (editButton) {

        editStudent(id);

    }

});


// ======================================================
// EDIT STUDENT
// ======================================================

function editStudent(id) {

    const student =
        students.find(function (student) {

            return student.id === id;

        });


    if (!student) {

        return;

    }


    editId = id;


    // Fill form

    nameInput.value = student.name;

    emailInput.value = student.email;

    phoneInput.value = student.phone;

    dobInput.value = student.dob;

    courseInput.value = student.course;

    aboutInput.value = student.about;


    // Gender

    const genderRadio =
        document.querySelector(
            `input[name="gender"][value="${student.gender}"]`
        );


    if (genderRadio) {

        genderRadio.checked = true;

    }


    // Skills

    const allSkills =
        document.querySelectorAll(
            'input[name="skills"]'
        );


    allSkills.forEach(function (checkbox) {

        checkbox.checked =
            student.skills.includes(
                checkbox.value
            );

    });


    // Update counter

    charCounter.textContent =
        `${aboutInput.value.length} / 200`;


    // Change button

    submitBtn.textContent =
        "Update Student";


    // Scroll to form

    document.getElementById(
        "registration"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ======================================================
// SEARCH
// ======================================================

searchInput.addEventListener(
    "input",
    function () {

        displayStudents();

    }
);


// ======================================================
// COURSE FILTER
// ======================================================

courseFilter.addEventListener(
    "change",
    function () {

        displayStudents();

    }
);


// ======================================================
// RESET BUTTON
// ======================================================

resetBtn.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


// ======================================================
// RESET FORM FUNCTION
// ======================================================

function resetForm() {

    studentForm.reset();


    editId = null;


    submitBtn.textContent =
        "Register Student";


    charCounter.textContent =
        "0 / 200";


    clearErrors();

}


// ======================================================
// CLEAR ERRORS
// ======================================================

function clearErrors() {

    const errors =
        document.querySelectorAll(".error");


    errors.forEach(function (error) {

        error.textContent = "";

    });

}


// ======================================================
// SHOW ERROR
// ======================================================

function showError(elementId, message) {

    document.getElementById(
        elementId
    ).textContent = message;

}


// ======================================================
// CALCULATE AGE
// ======================================================

function calculateAge(dob) {

    const birthDate =
        new Date(dob);

    const today =
        new Date();


    let age =
        today.getFullYear() -
        birthDate.getFullYear();


    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {

        age--;

    }


    return age;

}


// ======================================================
// LOCAL STORAGE
// ======================================================

function saveToLocalStorage() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}



function updateStatistics() {



    document.getElementById(
        "totalStudents"
    ).textContent = students.length;


   
    let webDevelopment = 0;

    let python = 0;

    let mern = 0;

    let uiux = 0;

    let dataAnalytics = 0;

    let cloud = 0;


    students.forEach(function (student) {

        if (student.course === "Web Development") {

            webDevelopment++;

        }


        if (student.course === "Python") {

            python++;

        }


        if (student.course === "MERN Stack") {

            mern++;

        }


        if (student.course === "UI/UX") {

            uiux++;

        }


        if (student.course === "Data Analytics") {

            dataAnalytics++;

        }


        if (student.course === "Cloud Computing") {

            cloud++;

        }

    });


    document.getElementById(
        "webDevelopmentCount"
    ).textContent = webDevelopment;


    document.getElementById(
        "pythonCount"
    ).textContent = python;


    document.getElementById(
        "mernCount"
    ).textContent = mern;


    document.getElementById(
        "uiuxCount"
    ).textContent = uiux;


    document.getElementById(
        "dataAnalyticsCount"
    ).textContent = dataAnalytics;


    document.getElementById(
        "cloudCount"
    ).textContent = cloud;

}



darkModeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            darkModeBtn.textContent =
                "☀️ Light Mode";

        }
        else {

            darkModeBtn.textContent =
                "🌙 Dark Mode";

        }

    }
);