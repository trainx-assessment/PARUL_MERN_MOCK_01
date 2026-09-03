

const studentForm = document.querySelector("#studentForm");

const studentName = document.querySelector("#studentName");
const studentEmail = document.querySelector("#studentEmail");
const studentPhone = document.querySelector("#studentPhone");
const studentDob = document.querySelector("#studentDob");

const genderInputs = document.querySelectorAll(
    'input[name="gender"]'
);

const course = document.querySelector("#course");

const skillInputs = document.querySelectorAll(
    'input[name="skills"]'
);

const aboutStudent = document.querySelector("#aboutStudent");
const profilePhoto = document.querySelector("#profilePhoto");

const submitButton = document.querySelector("#submitButton");
const resetButton = document.querySelector("#resetButton");

const characterCount = document.querySelector("#characterCount");

const studentContainer = document.querySelector(
    "#studentContainer"
);

const noStudentsMessage = document.querySelector(
    "#noStudentsMessage"
);

const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");



// Error Message Elements


const studentNameError = document.querySelector(
    "#studentNameError"
);

const studentEmailError = document.querySelector(
    "#studentEmailError"
);

const studentPhoneError = document.querySelector(
    "#studentPhoneError"
);

const studentDobError = document.querySelector(
    "#studentDobError"
);

const genderError = document.querySelector(
    "#genderError"
);

const courseError = document.querySelector(
    "#courseError"
);

const skillsError = document.querySelector(
    "#skillsError"
);

const aboutStudentError = document.querySelector(
    "#aboutStudentError"
);

const profilePhotoError = document.querySelector(
    "#profilePhotoError"
);



// Statistics Elements


const totalStudents = document.querySelector(
    "#totalStudents"
);

const webDevelopmentCount = document.querySelector(
    "#webDevelopmentCount"
);

const uiuxCount = document.querySelector(
    "#uiuxCount"
);

const pythonCount = document.querySelector(
    "#pythonCount"
);

const dataAnalyticsCount = document.querySelector(
    "#dataAnalyticsCount"
);

const mernStackCount = document.querySelector(
    "#mernStackCount"
);

const cloudComputingCount = document.querySelector(
    "#cloudComputingCount"
);



// Students Array


let students = [];

let editingStudentId = null;



// Load Students From Local Storage


const savedStudents = localStorage.getItem(
    "students"
);

if (savedStudents) {
    students = JSON.parse(savedStudents);
}



// Save Students To Local Storage


function saveStudents() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}



// Student Name Validation

function validateStudentName() {

    const name = studentName.value.trim();

    if (name === "") {
        studentNameError.textContent =
            "Student name is required.";
        return false;
    }

    if (name.length < 3) {
        studentNameError.textContent =
            "Name must be at least 3 characters.";
        return false;
    }

    if (name.length > 40) {
        studentNameError.textContent =
            "Name cannot exceed 40 characters.";
        return false;
    }

    const namePattern = /^[A-Za-z ]+$/;

    if (!namePattern.test(name)) {
        studentNameError.textContent =
            "Name can contain only letters and spaces.";
        return false;
    }

    studentNameError.textContent = "";

    return true;
}



// Email Validation


function validateEmail() {

    const email = studentEmail.value.trim();

    if (email === "") {
        studentEmailError.textContent =
            "Email is required.";
        return false;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        studentEmailError.textContent =
            "Please enter a valid email address.";
        return false;
    }

    studentEmailError.textContent = "";

    return true;
}



// Phone Number Validation


function validatePhone() {

    const phone = studentPhone.value.trim();

    if (phone === "") {
        studentPhoneError.textContent =
            "Phone number is required.";
        return false;
    }

    const phonePattern = /^\d{10}$/;

    if (!phonePattern.test(phone)) {
        studentPhoneError.textContent =
            "Phone number must contain exactly 10 digits.";
        return false;
    }

    studentPhoneError.textContent = "";

    return true;
}



// Date Of Birth Validation


function validateDateOfBirth() {

    const dob = studentDob.value;

    if (dob === "") {
        studentDobError.textContent =
            "Date of birth is required.";
        return false;
    }

    const selectedDate = new Date(dob);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        studentDobError.textContent =
            "Future dates are not allowed.";
        return false;
    }


    // Check minimum age of 15 years

    const birthDate = new Date(dob);

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

    if (age < 15) {
        studentDobError.textContent =
            "Student must be at least 15 years old.";
        return false;
    }

    studentDobError.textContent = "";

    return true;
}



// Gender Validation


function validateGender() {

    let selectedGender = false;

    genderInputs.forEach(function (input) {

        if (input.checked) {
            selectedGender = true;
        }

    });

    if (!selectedGender) {
        genderError.textContent =
            "Please select a gender.";
        return false;
    }

    genderError.textContent = "";

    return true;
}


// Course Validation


function validateCourse() {

    if (course.value === "") {
        courseError.textContent =
            "Please select a course.";
        return false;
    }

    courseError.textContent = "";

    return true;
}



// Skills Validation


function validateSkills() {

    let selectedSkills = [];

    skillInputs.forEach(function (input) {

        if (input.checked) {
            selectedSkills.push(input.value);
        }

    });

    if (selectedSkills.length === 0) {
        skillsError.textContent =
            "Please select at least one skill.";
        return false;
    }

    skillsError.textContent = "";

    return true;
}



// About Student Validation


function validateAboutStudent() {

    const about = aboutStudent.value.trim();

    if (about === "") {
        aboutStudentError.textContent =
            "About student is required.";
        return false;
    }

    if (about.length < 20) {
        aboutStudentError.textContent =
            "Please enter at least 20 characters.";
        return false;
    }

    if (about.length > 200) {
        aboutStudentError.textContent =
            "About student cannot exceed 200 characters.";
        return false;
    }

    aboutStudentError.textContent = "";

    return true;
}



// Profile Photo Validation

function validateProfilePhoto() {

    /*
        During edit mode, the user does not
        have to upload a new photo.
    */

    if (
        editingStudentId !== null &&
        profilePhoto.files.length === 0
    ) {
        profilePhotoError.textContent = "";
        return true;
    }

    if (profilePhoto.files.length === 0) {
        profilePhotoError.textContent =
            "Profile photo is required.";
        return false;
    }

    const file = profilePhoto.files[0];

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
        profilePhotoError.textContent =
            "Only JPG, JPEG and PNG images are allowed.";
        return false;
    }

    profilePhotoError.textContent = "";

    return true;
}



// Validate Complete Form


function validateForm() {

    const nameValid = validateStudentName();
    const emailValid = validateEmail();
    const phoneValid = validatePhone();
    const dobValid = validateDateOfBirth();
    const genderValid = validateGender();
    const courseValid = validateCourse();
    const skillsValid = validateSkills();
    const aboutValid = validateAboutStudent();
    const photoValid = validateProfilePhoto();

    return (
        nameValid &&
        emailValid &&
        phoneValid &&
        dobValid &&
        genderValid &&
        courseValid &&
        skillsValid &&
        aboutValid &&
        photoValid
    );
}



// Get Selected Gender


function getSelectedGender() {

    let selectedGender = "";

    genderInputs.forEach(function (input) {

        if (input.checked) {
            selectedGender = input.value;
        }

    });

    return selectedGender;
}



// Get Selected Skills


function getSelectedSkills() {

    const selectedSkills = [];

    skillInputs.forEach(function (input) {

        if (input.checked) {
            selectedSkills.push(input.value);
        }

    });

    return selectedSkills;
}


// Convert Image To Data URL


function getPhotoData(file) {

    return new Promise(function (resolve, reject) {

        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject("Unable to read image.");
        };

        reader.readAsDataURL(file);

    });
}



// Generate Student ID


function generateStudentId() {

    if (students.length === 0) {
        return 1;
    }

    const ids = students.map(function (student) {
        return student.id;
    });

    return Math.max(...ids) + 1;
}


// Form Submit


studentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const formIsValid = validateForm();

        if (!formIsValid) {
            return;
        }


        // Get image

        let photo = "";

        if (profilePhoto.files.length > 0) {

            photo = await getPhotoData(
                profilePhoto.files[0]
            );

        }


        // Get form values

        const name = studentName.value.trim();
        const email = studentEmail.value.trim();
        const phone = studentPhone.value.trim();
        const dob = studentDob.value;
        const gender = getSelectedGender();
        const selectedCourse = course.value;
        const skills = getSelectedSkills();
        const about = aboutStudent.value.trim();


        // Edit Existing Student
       

        if (editingStudentId !== null) {

            const student = students.find(
                function (student) {
                    return student.id === editingStudentId;
                }
            );

            if (student) {

                student.name = name;
                student.email = email;
                student.phone = phone;
                student.dob = dob;
                student.gender = gender;
                student.course = selectedCourse;
                student.skills = skills;
                student.about = about;

                if (photo !== "") {
                    student.photo = photo;
                }

            }

            alert("Student updated successfully.");

        }


        // Add New Student
       

        else {

            const newStudent = {

                id: generateStudentId(),

                name: name,

                email: email,

                phone: phone,

                dob: dob,

                gender: gender,

                course: selectedCourse,

                skills: skills,

                about: about,

                photo: photo

            };

            students.push(newStudent);

            alert("Student registered successfully.");

        }


        // Save data

        saveStudents();


        // Refresh display

        displayStudents();

        updateStatistics();


        // Reset form

        resetForm();

    }
);



// Display Students


function displayStudents() {

    studentContainer.innerHTML = "";

    const searchText =
        searchInput.value.trim().toLowerCase();

    const selectedCourse =
        courseFilter.value;


    // Filter students

    const filteredStudents =
        students.filter(function (student) {

            const nameMatches =
                student.name
                    .toLowerCase()
                    .includes(searchText);

            const courseMatches =
                selectedCourse === "All Courses" ||
                student.course === selectedCourse;

            return nameMatches && courseMatches;

        });


    // No students found

    if (filteredStudents.length === 0) {

        noStudentsMessage.style.display = "block";

        return;

    }

    noStudentsMessage.style.display = "none";


    // Create cards

    filteredStudents.forEach(function (student) {

        createStudentCard(student);

    });

}



// Create Student Card


function createStudentCard(student) {

    const card =
        document.createElement("div");

    card.classList.add("student-card");

    card.setAttribute(
        "data-id",
        student.id
    );


    // Student Photo
   

    const image =
        document.createElement("img");

    image.src = student.photo;

    image.alt =
        student.name + " profile photo";


    
    // Student Name
   

    const heading =
        document.createElement("h3");

    heading.textContent =
        student.name;


   
    // Email
  

    const email =
        document.createElement("p");

    email.innerHTML =
        "<strong>Email:</strong> " +
        student.email;


   
    // Phone
  

    const phone =
        document.createElement("p");

    phone.innerHTML =
        "<strong>Phone:</strong> " +
        student.phone;


    
    // Date Of Birth
  

    const dob =
        document.createElement("p");

    dob.innerHTML =
        "<strong>DOB:</strong> " +
        formatDate(student.dob);


  
    // Gender
   

    const gender =
        document.createElement("p");

    gender.innerHTML =
        "<strong>Gender:</strong> " +
        student.gender;


    // Course
  

    const studentCourse =
        document.createElement("p");

    studentCourse.innerHTML =
        "<strong>Course:</strong> " +
        student.course;


  
    // Skills Title
   

    const skillsTitle =
        document.createElement("p");

    skillsTitle.innerHTML =
        "<strong>Skills:</strong>";


    // Skills Container
  

    const skillsContainer =
        document.createElement("div");

    skillsContainer.classList.add(
        "student-skills"
    );


    student.skills.forEach(function (skill) {

        const skillItem =
            document.createElement("span");

        skillItem.textContent = skill;

        skillsContainer.appendChild(
            skillItem
        );

    });


    
    // About
  

    const about =
        document.createElement("p");

    about.innerHTML =
        "<strong>About:</strong> " +
        student.about;


    
    // Buttons
   

    const actions =
        document.createElement("div");

    actions.classList.add(
        "student-actions"
    );


    const editButton =
        document.createElement("button");

    editButton.textContent = "Edit";

    editButton.classList.add("edit-btn");

    editButton.setAttribute(
        "type",
        "button"
    );


    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add(
        "delete-btn"
    );

    deleteButton.setAttribute(
        "type",
        "button"
    );


    // Add buttons

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    
    // Add Everything To Card
   

    card.appendChild(image);
    card.appendChild(heading);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(dob);
    card.appendChild(gender);
    card.appendChild(studentCourse);
    card.appendChild(skillsTitle);
    card.appendChild(skillsContainer);
    card.appendChild(about);
    card.appendChild(actions);


    // Add card to container

    studentContainer.appendChild(card);

}



// Format Date


function formatDate(dateString) {

    const date = new Date(dateString);

    const day =
        String(date.getDate()).padStart(2, "0");

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const year =
        date.getFullYear();

    return day + "/" + month + "/" + year;
}



// Event Delegation


studentContainer.addEventListener(
    "click",
    function (event) {

        
        // Delete Button
       

        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            const card =
                event.target.closest(
                    ".student-card"
                );

            const studentId =
                Number(
                    card.getAttribute("data-id")
                );


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this student?"
                );


            if (!confirmDelete) {
                return;
            }


            students =
                students.filter(
                    function (student) {
                        return student.id !== studentId;
                    }
                );


            saveStudents();

            displayStudents();

            updateStatistics();

        }


        // Edit Button
      

        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            const card =
                event.target.closest(
                    ".student-card"
                );

            const studentId =
                Number(
                    card.getAttribute("data-id")
                );

            editStudent(studentId);

        }

    }
);



// Edit Student


function editStudent(studentId) {

    const student =
        students.find(
            function (student) {
                return student.id === studentId;
            }
        );


    if (!student) {
        return;
    }


    // Store ID being edited

    editingStudentId = studentId;


    // Fill form

    studentName.value =
        student.name;

    studentEmail.value =
        student.email;

    studentPhone.value =
        student.phone;

    studentDob.value =
        student.dob;

    course.value =
        student.course;

    aboutStudent.value =
        student.about;


    // Select gender

    genderInputs.forEach(function (input) {

        input.checked =
            input.value === student.gender;

    });


    // Select skills

    skillInputs.forEach(function (input) {

        input.checked =
            student.skills.includes(
                input.value
            );

    });


    // Update button

    submitButton.textContent =
        "Update Student";


    // Update character counter

    updateCharacterCount();


    // Scroll to form

    studentForm.scrollIntoView({
        behavior: "smooth"
    });

}



// Search Students


searchInput.addEventListener(
    "input",
    function () {

        displayStudents();

    }
);



// Course Filter

courseFilter.addEventListener(
    "change",
    function () {

        displayStudents();

    }
);



// Character Counter


aboutStudent.addEventListener(
    "input",
    function () {

        updateCharacterCount();

        if (aboutStudent.value.trim() !== "") {
            aboutStudentError.textContent = "";
        }

    }
);


function updateCharacterCount() {

    const currentLength =
        aboutStudent.value.length;

    characterCount.textContent =
        currentLength + " / 200";

}


// Remove All Error Messages


function clearErrorMessages() {

    studentNameError.textContent = "";
    studentEmailError.textContent = "";
    studentPhoneError.textContent = "";
    studentDobError.textContent = "";
    genderError.textContent = "";
    courseError.textContent = "";
    skillsError.textContent = "";
    aboutStudentError.textContent = "";
    profilePhotoError.textContent = "";

}



// Reset Form


function resetForm() {

    studentForm.reset();

    editingStudentId = null;

    submitButton.textContent =
        "Register Student";

    clearErrorMessages();

    updateCharacterCount();

}



// Reset Button


resetButton.addEventListener(
    "click",
    function () {

        resetForm();

    }
);



// Live Validation


studentName.addEventListener(
    "input",
    function () {

        validateStudentName();

    }
);


studentEmail.addEventListener(
    "input",
    function () {

        validateEmail();

    }
);


studentPhone.addEventListener(
    "input",
    function () {

        validatePhone();

    }
);


studentDob.addEventListener(
    "change",
    function () {

        validateDateOfBirth();

    }
);


genderInputs.forEach(function (input) {

    input.addEventListener(
        "change",
        function () {

            validateGender();

        }
    );

});


course.addEventListener(
    "change",
    function () {

        validateCourse();

    }
);


skillInputs.forEach(function (input) {

    input.addEventListener(
        "change",
        function () {

            validateSkills();

        }
    );

});


profilePhoto.addEventListener(
    "change",
    function () {

        validateProfilePhoto();

    }
);



// Update Statistics


function updateStatistics() {

    totalStudents.textContent =
        students.length;


    let webDevelopment = 0;
    let uiux = 0;
    let python = 0;
    let dataAnalytics = 0;
    let mernStack = 0;
    let cloudComputing = 0;


    students.forEach(function (student) {

        if (student.course === "Web Development") {
            webDevelopment++;
        }

        if (student.course === "UI/UX") {
            uiux++;
        }

        if (student.course === "Python") {
            python++;
        }

        if (student.course === "Data Analytics") {
            dataAnalytics++;
        }

        if (student.course === "MERN Stack") {
            mernStack++;
        }

        if (student.course === "Cloud Computing") {
            cloudComputing++;
        }

    });


    webDevelopmentCount.textContent =
        webDevelopment;

    uiuxCount.textContent =
        uiux;

    pythonCount.textContent =
        python;

    dataAnalyticsCount.textContent =
        dataAnalytics;

    mernStackCount.textContent =
        mernStack;

    cloudComputingCount.textContent =
        cloudComputing;

}



// Initial Display


displayStudents();

updateStatistics();

updateCharacterCount();

