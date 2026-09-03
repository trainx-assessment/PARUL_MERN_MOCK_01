
const form = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");

const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");

const about = document.getElementById("about");
const charCount = document.getElementById("charCount");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const themeBtn = document.getElementById("themeBtn");


let students = JSON.parse(localStorage.getItem("students")) || [];


let editId = null;


about.addEventListener("input", function () {

    charCount.textContent = about.value.length;

});


// Form submit

form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    if (!validateForm()) {
        return;
    }

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const aboutText = about.value.trim();

    const genderElement = document.querySelector(
        'input[name="gender"]:checked'
    );

    const gender = genderElement.value;


    const skillElements = document.querySelectorAll(
        'input[name="skill"]:checked'
    );

    const skills = [];

    skillElements.forEach(function (item) {
        skills.push(item.value);
    });



    const photoInput = document.getElementById("photo");


    if (editId !== null) {

        updateStudent(
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            aboutText,
            photoInput
        );

    } else {

        addStudent(
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            aboutText,
            photoInput
        );

    }

});


function addStudent(
    name,
    email,
    phone,
    dob,
    gender,
    course,
    skills,
    aboutText,
    photoInput
) {

    const studentId = Date.now();

    let photo = "";

    if (photoInput.files.length > 0) {

        const file = photoInput.files[0];

        const reader = new FileReader();

        reader.onload = function () {

            photo = reader.result;

            saveNewStudent(
                studentId,
                name,
                email,
                phone,
                dob,
                gender,
                course,
                skills,
                aboutText,
                photo
            );

        };

        reader.readAsDataURL(file);

    } else {

        saveNewStudent(
            studentId,
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            aboutText,
            photo
        );

    }

}


function saveNewStudent(
    id,
    name,
    email,
    phone,
    dob,
    gender,
    course,
    skills,
    aboutText,
    photo
) {

    const student = {

        id: id,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: aboutText,
        photo: photo

    };


    students.push(student);

    saveStudents();

    showStudents();

    updateStatistics();

    resetForm();

    alert("Student registered successfully!");

}


function validateForm() {

    let valid = true;



    const name = document.getElementById("studentName").value.trim();

    const namePattern = /^[A-Za-z ]+$/;


    if (name === "") {

        showError("nameError", "Name is required");
        valid = false;

    } else if (name.length < 3) {

        showError("nameError", "Name must contain at least 3 characters");
        valid = false;

    } else if (name.length > 40) {

        showError("nameError", "Name cannot exceed 40 characters");
        valid = false;

    } else if (!namePattern.test(name)) {

        showError("nameError", "Only letters and spaces are allowed");
        valid = false;

    }


    const email = document.getElementById("email").value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (email === "") {

        showError("emailError", "Email is required");
        valid = false;

    } else if (!emailPattern.test(email)) {

        showError("emailError", "Enter a valid email");
        valid = false;

    }


    const phone = document.getElementById("phone").value.trim();

    const phonePattern = /^[0-9]{10}$/;


    if (phone === "") {

        showError("phoneError", "Phone number is required");
        valid = false;

    } else if (!phonePattern.test(phone)) {

        showError("phoneError", "Phone must contain exactly 10 digits");
        valid = false;

    }


    const dob = document.getElementById("dob").value;


    if (dob === "") {

        showError("dobError", "Date of birth is required");
        valid = false;

    } else {

        const birthDate = new Date(dob);
        const today = new Date();

        if (birthDate > today) {

            showError("dobError", "Future date is not allowed");
            valid = false;

        } else {

            const age = today.getFullYear() - birthDate.getFullYear();

            if (age < 15) {

                showError(
                    "dobError",
                    "Student must be at least 15 years old"
                );

                valid = false;
            }
        }
    }


    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );


    if (!gender) {

        showError("genderError", "Please select gender");
        valid = false;

    }

    const course = document.getElementById("course").value;


    if (course === "") {

        showError("courseError", "Please select a course");
        valid = false;

    }


    const selectedSkills = document.querySelectorAll(
        'input[name="skill"]:checked'
    );


    if (selectedSkills.length === 0) {

        showError(
            "skillsError",
            "Select at least one skill"
        );

        valid = false;

    }



    const aboutText = about.value.trim();


    if (aboutText === "") {

        showError(
            "aboutError",
            "About section is required"
        );

        valid = false;

    } else if (aboutText.length < 20) {

        showError(
            "aboutError",
            "Write at least 20 characters"
        );

        valid = false;

    }


    const photoInput = document.getElementById("photo");


    // Photo is required only for a new student

    if (editId === null && photoInput.files.length === 0) {

        showError(
            "photoError",
            "Profile photo is required"
        );

        valid = false;

    } else if (photoInput.files.length > 0) {

        const file = photoInput.files[0];

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];


        if (!allowedTypes.includes(file.type)) {

            showError(
                "photoError",
                "Only JPG, JPEG or PNG images are allowed"
            );

            valid = false;

        }

    }


    return valid;
}


