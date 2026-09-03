
const form = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const studentCount = document.querySelector("#studentCount");

const studentName = document.querySelector("#studentName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const course = document.querySelector("#course");
const about = document.querySelector("#about");
const photo = document.querySelector("#photo");

const students = [];


function clearErrors() {
    document.querySelector("#nameError").textContent = "";
    document.querySelector("#emailError").textContent = "";
    document.querySelector("#phoneError").textContent = "";
    document.querySelector("#dobError").textContent = "";
    document.querySelector("#genderError").textContent = "";
    document.querySelector("#courseError").textContent = "";
    document.querySelector("#skillsError").textContent = "";
    document.querySelector("#aboutError").textContent = "";
    document.querySelector("#photoError").textContent = "";
}


function validateForm() {

    clearErrors();

    let valid = true;


    const nameValue = studentName.value.trim();

    const nameRegex = /^[A-Za-z ]+$/;

    if (nameValue === "") {

        document.querySelector("#nameError").textContent =
            "Name is required";

        valid = false;

    } else if (nameValue.length < 3) {

        document.querySelector("#nameError").textContent =
            "Name must contain at least 3 characters";

        valid = false;

    } else if (!nameRegex.test(nameValue)) {

        document.querySelector("#nameError").textContent =
            "Name can contain only letters and spaces";

        valid = false;
    }


    const emailValue = email.value.trim();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {

        document.querySelector("#emailError").textContent =
            "Email is required";

        valid = false;

    } else if (!emailRegex.test(emailValue)) {

        document.querySelector("#emailError").textContent =
            "Enter a valid email";

        valid = false;
    }


    const phoneValue = phone.value.trim();

    const phoneRegex = /^[0-9]{10}$/;

    if (phoneValue === "") {

        document.querySelector("#phoneError").textContent =
            "Phone number is required";

        valid = false;

    } else if (!phoneRegex.test(phoneValue)) {

        document.querySelector("#phoneError").textContent =
            "Phone number must contain exactly 10 digits";

        valid = false;
    }


    if (dob.value === "") {

        document.querySelector("#dobError").textContent =
            "Date of birth is required";

        valid = false;

    } else {

        const selectedDate = new Date(dob.value);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {

            document.querySelector("#dobError").textContent =
                "Future date is not allowed";

            valid = false;
        }
    }


    const gender =
        document.querySelector('input[name="gender"]:checked');

    if (!gender) {

        document.querySelector("#genderError").textContent =
            "Please select gender";

        valid = false;
    }


    if (course.value === "") {

        document.querySelector("#courseError").textContent =
            "Please select a course";

        valid = false;
    }


    const selectedSkills =
        document.querySelectorAll(
            'input[name="skills"]:checked'
        );

    if (selectedSkills.length === 0) {

        document.querySelector("#skillsError").textContent =
            "Select at least one skill";

        valid = false;
    }


    if (about.value.trim() === "") {

        document.querySelector("#aboutError").textContent =
            "About student is required";

        valid = false;
    }


    if (photo.files.length === 0) {

        document.querySelector("#photoError").textContent =
            "Please select a profile photo";

        valid = false;
    }


    return valid;
}


form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!validateForm()) {
        return;
    }


    const selectedGender =
        document.querySelector(
            'input[name="gender"]:checked'
        ).value;


    const selectedSkills =
        Array.from(
            document.querySelectorAll(
                'input[name="skills"]:checked'
            )
        ).map(function (skill) {

            return skill.value;

        });


    const student = {

        id: Date.now(),

        name: studentName.value.trim(),

        email: email.value.trim(),

        phone: phone.value.trim(),

        dob: dob.value,

        gender: selectedGender,

        course: course.value,

        skills: selectedSkills,

        about: about.value.trim(),

        photo: URL.createObjectURL(photo.files[0])
    };


    students.push(student);


    createStudentCard(student);


    updateStudentCount();


    form.reset();

    clearErrors();
});


function createStudentCard(student) {

    const card = document.createElement("div");

    card.classList.add("student-card");

    card.dataset.id = student.id;


    const image = document.createElement("img");

    image.src = student.photo;

    image.alt = student.name;


    const heading = document.createElement("h3");

    heading.textContent = student.name;


    const emailElement = document.createElement("p");

    emailElement.textContent =
        "Email: " + student.email;


    const phoneElement = document.createElement("p");

    phoneElement.textContent =
        "Phone: " + student.phone;


    const dobElement = document.createElement("p");

    dobElement.textContent =
        "Date of Birth: " + student.dob;


    const genderElement = document.createElement("p");

    genderElement.textContent =
        "Gender: " + student.gender;


    const courseElement = document.createElement("p");

    courseElement.textContent =
        "Course: " + student.course;


    const skillsElement = document.createElement("p");

    skillsElement.textContent =
        "Skills: " + student.skills.join(", ");


    const aboutElement = document.createElement("p");

    aboutElement.textContent =
        "About: " + student.about;


    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add("delete-btn");


    card.appendChild(image);

    card.appendChild(heading);

    card.appendChild(emailElement);

    card.appendChild(phoneElement);

    card.appendChild(dobElement);

    card.appendChild(genderElement);

    card.appendChild(courseElement);

    card.appendChild(skillsElement);

    card.appendChild(aboutElement);

    card.appendChild(deleteButton);


    studentContainer.appendChild(card);
}


function updateStudentCount() {

    studentCount.textContent =
        "Total Students: " + students.length;
}


studentContainer.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-btn")) {
        return;
    }


    const card =
        event.target.closest(".student-card");


    const studentId =
        Number(card.dataset.id);


    const studentIndex =
        students.findIndex(function (student) {

            return student.id === studentId;

        });


    if (studentIndex !== -1) {

        students.splice(studentIndex, 1);
    }


    card.remove();

    updateStudentCount();
});