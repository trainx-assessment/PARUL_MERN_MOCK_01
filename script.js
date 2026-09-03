let students = JSON.parse(localStorage.getItem("students")) || [];

let editId = null;


/* Get HTML elements */

let form = document.getElementById("studentForm");

let name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let dob = document.getElementById("dob");
let course = document.getElementById("course");
let about = document.getElementById("about");
let photo = document.getElementById("photo");

let studentBox = document.getElementById("students");

let search = document.getElementById("search");
let filter = document.getElementById("filter");

let submitBtn = document.getElementById("submitBtn");
let resetBtn = document.getElementById("resetBtn");

let count = document.getElementById("count");


/* Character Counter */

about.addEventListener("input", function () {

    count.innerText = about.value.length + " / 200";

});


/* Form Submit */

form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (checkForm() == false) {
        return;
    }


    /* Get Gender */

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    ).value;


    /* Get Skills */

    let skills = [];

    let skillBoxes = document.querySelectorAll(".skill");

    skillBoxes.forEach(function (box) {

        if (box.checked) {
            skills.push(box.value);
        }

    });


    /* Photo */

    if (photo.files.length > 0) {

        let reader = new FileReader();

        reader.onload = function () {

            saveStudent(
                gender,
                skills,
                reader.result
            );

        };

        reader.readAsDataURL(photo.files[0]);

    } else {

        /* Keep old photo while editing */

        let oldStudent = students.find(function (student) {
            return student.id == editId;
        });

        saveStudent(
            gender,
            skills,
            oldStudent.photo
        );
    }

});


/* Validate Form */

function checkForm() {

    clearErrors();

    let valid = true;


    /* Name */

    let nameValue = name.value.trim();

    if (nameValue == "") {

        document.getElementById("nameError").innerText =
            "Name is required";

        valid = false;

    } else if (!/^[A-Za-z ]{3,40}$/.test(nameValue)) {

        document.getElementById("nameError").innerText =
            "Enter 3 to 40 letters only";

        valid = false;
    }


    /* Email */

    let emailValue = email.value.trim();

    if (emailValue == "") {

        document.getElementById("emailError").innerText =
            "Email is required";

        valid = false;

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {

        document.getElementById("emailError").innerText =
            "Enter valid email";

        valid = false;
    }


    /* Phone */

    if (!/^\d{10}$/.test(phone.value)) {

        document.getElementById("phoneError").innerText =
            "Enter exactly 10 digits";

        valid = false;
    }


    /* Date */

    if (dob.value == "") {

        document.getElementById("dobError").innerText =
            "Date is required";

        valid = false;

    } else {

        let birthDate = new Date(dob.value);
        let today = new Date();

        if (birthDate > today) {

            document.getElementById("dobError").innerText =
                "Future date is not allowed";

            valid = false;
        }
    }


    /* Gender */

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        document.getElementById("genderError").innerText =
            "Select gender";

        valid = false;
    }


    /* Course */

    if (course.value == "") {

        document.getElementById("courseError").innerText =
            "Select course";

        valid = false;
    }


    /* Skills */

    let checkedSkills = document.querySelectorAll(".skill:checked");

    if (checkedSkills.length == 0) {

        document.getElementById("skillError").innerText =
            "Select at least one skill";

        valid = false;
    }


    /* About */

    let aboutValue = about.value.trim();

    if (aboutValue.length < 20) {

        document.getElementById("aboutError").innerText =
            "Minimum 20 characters required";

        valid = false;
    }


    /* Photo */

    if (editId == null && photo.files.length == 0) {

        document.getElementById("photoError").innerText =
            "Photo is required";

        valid = false;
    }


    return valid;
}


/* Clear Errors */

function clearErrors() {

    document.querySelectorAll(".error").forEach(function (error) {

        error.innerText = "";

    });

}


/* Save Student */

function saveStudent(gender, skills, photoData) {

    let student = {

        id: editId == null ? Date.now() : editId,

        name: name.value.trim(),

        email: email.value.trim(),

        phone: phone.value,

        dob: dob.value,

        gender: gender,

        course: course.value,

        skills: skills,

        about: about.value.trim(),

        photo: photoData

    };


    /* Add */

    if (editId == null) {

        students.push(student);

    }

    /* Edit */

    else {

        let index = students.findIndex(function (student) {

            return student.id == editId;

        });

        students[index] = student;
    }


    /* Save in browser */

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    resetForm();

    displayStudents();

    showStatistics();

}


/* Display Students */

function displayStudents() {

    studentBox.innerHTML = "";


    let searchText = search.value.toLowerCase();

    let selectedCourse = filter.value;


    let result = students.filter(function (student) {

        let nameMatch =
            student.name.toLowerCase().includes(searchText);

        let courseMatch =
            selectedCourse == "" ||
            student.course == selectedCourse;

        return nameMatch && courseMatch;

    });


    if (result.length == 0) {

        studentBox.innerHTML =
            "<p class='no-result'>No students found</p>";

        return;
    }


    result.forEach(function (student) {

        /* Card */

        let card = document.createElement("div");

        card.classList.add("student-card");

        card.setAttribute("data-id", student.id);


        /* Image */

        let image = document.createElement("img");

        image.src = student.photo;

        image.alt = student.name;


        /* Name */

        let heading = document.createElement("h3");

        heading.innerText = student.name;


        /* Details */

        let emailText = document.createElement("p");

        emailText.innerText =
            "Email: " + student.email;


        let phoneText = document.createElement("p");

        phoneText.innerText =
            "Phone: " + student.phone;


        let dobText = document.createElement("p");

        dobText.innerText =
            "DOB: " + student.dob;


        let genderText = document.createElement("p");

        genderText.innerText =
            "Gender: " + student.gender;


        let courseText = document.createElement("p");

        courseText.innerText =
            "Course: " + student.course;


        let skillText = document.createElement("p");

        skillText.innerText =
            "Skills: " + student.skills.join(", ");


        let aboutText = document.createElement("p");

        aboutText.innerText =
            "About: " + student.about;


        /* Buttons */

        let buttons = document.createElement("div");

        buttons.classList.add("card-buttons");


        let editButton = document.createElement("button");

        editButton.innerText = "Edit";

        editButton.classList.add("edit");


        let deleteButton = document.createElement("button");

        deleteButton.innerText = "Delete";

        deleteButton.classList.add("delete");


        buttons.append(editButton, deleteButton);


        /* Add everything to card */

        card.append(
            image,
            heading,
            emailText,
            phoneText,
            dobText,
            genderText,
            courseText,
            skillText,
            aboutText,
            buttons
        );


        /* Add card to page */

        studentBox.appendChild(card);

    });

}


/* Edit and Delete */

studentBox.addEventListener("click", function (event) {

    /* Find card */

    let card = event.target.closest(".student-card");

    if (!card) {
        return;
    }


    /* Get ID */

    let id = Number(card.dataset.id);


    /* Delete */

    if (event.target.classList.contains("delete")) {

        let answer = confirm(
            "Are you sure you want to delete this student?"
        );

        if (answer) {

            students = students.filter(function (student) {

                return student.id != id;

            });


            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );


            displayStudents();

            showStatistics();
        }

    }


    /* Edit */

    if (event.target.classList.contains("edit")) {

        let student = students.find(function (student) {

            return student.id == id;

        });


        editStudent(student);
    }

});


/* Edit Student */

function editStudent(student) {

    editId = student.id;


    name.value = student.name;

    email.value = student.email;

    phone.value = student.phone;

    dob.value = student.dob;

    course.value = student.course;

    about.value = student.about;


    /* Gender */

    document.querySelector(
        'input[name="gender"][value="' +
        student.gender +
        '"]'
    ).checked = true;


    /* Skills */

    document.querySelectorAll(".skill").forEach(function (box) {

        if (student.skills.includes(box.value)) {

            box.checked = true;

        } else {

            box.checked = false;
        }

    });


    count.innerText =
        about.value.length + " / 200";


    submitBtn.innerText = "Update Student";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* Reset Form */

function resetForm() {

    form.reset();

    editId = null;

    submitBtn.innerText = "Register Student";

    count.innerText = "0 / 200";

    clearErrors();

}


/* Reset Button */

resetBtn.addEventListener("click", function () {

    resetForm();

});


/* Search */

search.addEventListener("input", function () {

    displayStudents();

});


/* Filter */

filter.addEventListener("change", function () {

    displayStudents();

});


/* Statistics */

function showStatistics() {

    document.getElementById("total").innerText =
        students.length;


    document.getElementById("web").innerText =
        countCourse("Web Development");

    document.getElementById("uiux").innerText =
        countCourse("UI/UX");

    document.getElementById("python").innerText =
        countCourse("Python");

    document.getElementById("data").innerText =
        countCourse("Data Analytics");

    document.getElementById("mern").innerText =
        countCourse("MERN Stack");

    document.getElementById("cloud").innerText =
        countCourse("Cloud Computing");

}


/* Count Course */

function countCourse(courseName) {

    let number = 0;

    students.forEach(function (student) {

        if (student.course == courseName) {

            number++;

        }

    });

    return number;

}


/* Dark Mode */

document.getElementById("darkBtn").addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            this.innerText = "Light Mode";

        } else {

            this.innerText = "Dark Mode";
        }

    }
);


/* Run when page opens */

displayStudents();

showStatistics();

