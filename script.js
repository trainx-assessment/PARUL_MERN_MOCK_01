const students = [];



const form = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const studentCount = document.getElementById("studentCount");

const aboutInput = document.getElementById("about");
const counter = document.getElementById("counter");

const searchInput = document.getElementById("search");
const filterCourse = document.getElementById("filterCourse");


aboutInput.addEventListener("input", function () {

    counter.textContent = `${aboutInput.value.length} / 200`;

});



form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();


    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value.trim();
    const photo = document.getElementById("photo").files[0];

    const genderElement = document.querySelector(
        'input[name="gender"]:checked'
    );

    const gender = genderElement
        ? genderElement.value
        : "";


    const skillElements = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    const skills = [];

    skillElements.forEach(function (skill) {
        skills.push(skill.value);
    });


    let isValid = true;


    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "") {

        showError("nameError", "Name is required");
        isValid = false;

    } else if (name.length < 3 || name.length > 40) {

        showError(
            "nameError",
            "Name must be between 3 and 40 characters"
        );

        isValid = false;

    } else if (!nameRegex.test(name)) {

        showError(
            "nameError",
            "Only letters and spaces are allowed"
        );

        isValid = false;
    }


    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {

        showError("emailError", "Email is required");
        isValid = false;

    } else if (!emailRegex.test(email)) {

        showError("emailError", "Enter a valid email");
        isValid = false;
    }


    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;

    if (phone === "") {

        showError("phoneError", "Phone number is required");
        isValid = false;

    } else if (!phoneRegex.test(phone)) {

        showError(
            "phoneError",
            "Phone number must contain exactly 10 digits"
        );

        isValid = false;
    }


    // Date validation
    if (dob === "") {

        showError("dobError", "Date of birth is required");
        isValid = false;

    } else {

        const birthDate = new Date(dob);
        const today = new Date();

        if (birthDate > today) {

            showError(
                "dobError",
                "Future date is not allowed"
            );

            isValid = false;
        }


        // Age validation
        const age = calculateAge(birthDate);

        if (age < 15) {

            showError(
                "dobError",
                "Student must be at least 15 years old"
            );

            isValid = false;
        }
    }


    // Gender validation
    if (gender === "") {

        showError(
            "genderError",
            "Please select gender"
        );

        isValid = false;
    }


    // Course validation
    if (course === "") {

        showError(
            "courseError",
            "Please select a course"
        );

        isValid = false;
    }


    // Skills validation
    if (skills.length === 0) {

        showError(
            "skillsError",
            "Select at least one skill"
        );

        isValid = false;
    }


    // About validation
    if (about === "") {

        showError(
            "aboutError",
            "About student is required"
        );

        isValid = false;

    } else if (about.length < 20) {

        showError(
            "aboutError",
            "Minimum 20 characters required"
        );

        isValid = false;

    } else if (about.length > 200) {

        showError(
            "aboutError",
            "Maximum 200 characters allowed"
        );

        isValid = false;
    }


    // Photo validation
    if (!photo) {

        showError(
            "photoError",
            "Profile photo is required"
        );

        isValid = false;

    } else {

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(photo.type)) {

            showError(
                "photoError",
                "Only JPG, JPEG and PNG images are allowed"
            );

            isValid = false;
        }
    }


 
    if (!isValid) {
        return;
    }


       const photoURL = URL.createObjectURL(photo);


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

        photo: photoURL

    };



    students.push(student);


    displayStudents(students);


 
    updateStudentCount();


  
    form.reset();

    counter.textContent = "0 / 200";

    alert("Student registered successfully!");

});



function showError(elementId, message) {

    document.getElementById(elementId).textContent = message;

}


function clearErrors() {

    const errors = document.querySelectorAll(".error");

    errors.forEach(function (error) {

        error.textContent = "";

    });

}


function calculateAge(birthDate) {

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
        today.getMonth() - birthDate.getMonth();

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



function displayStudents(studentList) {

    studentContainer.innerHTML = "";


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

        skills.textContent =
            `Skills: ${student.skills.join(", ")}`;


        const about = document.createElement("p");

        about.textContent =
            `About: ${student.about}`;


     
        const buttonContainer =
            document.createElement("div");

        buttonContainer.classList.add("card-buttons");


        const editButton =
            document.createElement("button");

        editButton.textContent = "Edit";

        editButton.classList.add("edit-btn");


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");


   
        deleteButton.addEventListener(
            "click",
            function () {

                deleteStudent(student.id);

            }
        );


    
        editButton.addEventListener(
            "click",
            function () {

                editStudent(student.id);

            }
        );


        buttonContainer.appendChild(editButton);

        buttonContainer.appendChild(deleteButton);


        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(email);
        card.appendChild(phone);
        card.appendChild(dob);
        card.appendChild(gender);
        card.appendChild(course);
        card.appendChild(skills);
        card.appendChild(about);
        card.appendChild(buttonContainer);

        studentContainer.appendChild(card);

    });

}



function updateStudentCount() {

    studentCount.textContent = students.length;

}


function deleteStudent(id) {

    const index = students.findIndex(function (student) {

        return student.id === id;

    });


    if (index !== -1) {

        students.splice(index, 1);

        displayStudents(students);

        updateStudentCount();

    }

}



function editStudent(id) {

    const student = students.find(function (student) {

        return student.id === id;

    });


    if (!student) {
        return;
    }


    document.getElementById("name").value =
        student.name;

    document.getElementById("email").value =
        student.email;

    document.getElementById("phone").value =
        student.phone;

    document.getElementById("dob").value =
        student.dob;

    document.getElementById("course").value =
        student.course;

    document.getElementById("about").value =
        student.about;


  
    const genderRadio =
        document.querySelector(
            `input[name="gender"][value="${student.gender}"]`
        );

    if (genderRadio) {
        genderRadio.checked = true;
    }


   
    const skillCheckboxes =
        document.querySelectorAll(
            'input[name="skills"]'
        );

    skillCheckboxes.forEach(function (checkbox) {

        checkbox.checked =
            student.skills.includes(checkbox.value);

    });


    counter.textContent =
        `${student.about.length} / 200`;


  
    const index = students.findIndex(
        function (item) {

            return item.id === id;

        }
    );

    students.splice(index, 1);


    displayStudents(students);

    updateStudentCount();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


searchInput.addEventListener(
    "input",
    filterStudents
);


// Course filter
filterCourse.addEventListener(
    "change",
    filterStudents
);


function filterStudents() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCourse =
        filterCourse.value;


    const filteredStudents =
        students.filter(function (student) {

            const matchesName =
                student.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCourse =
                selectedCourse === "" ||
                student.course === selectedCourse;


            return matchesName && matchesCourse;

        });


    displayStudents(filteredStudents);

}