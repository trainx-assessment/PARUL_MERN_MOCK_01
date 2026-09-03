const students = [];
let nextId = 1;
const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("Phonenumber");
const dobInput = document.getElementById("date");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("yourself");
const photoInput = document.getElementById("photo");

const studentList = document.getElementById("studentList");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Remove old errors
    document.querySelectorAll(".error").forEach(error => {
        error.remove();
    });

    let isValid = true;

    if (nameInput.value.trim() === "") {
        showError(nameInput, "Name is required");
        isValid = false;
    }

    if (emailInput.value.trim() === "") {
        showError(emailInput, "Email is required");
        isValid = false;
    }

    if (phoneInput.value.trim() === "") {
        showError(phoneInput, "Phone number is required");
        isValid = false;
    }

    if (dobInput.value === "") {
        showError(dobInput, "Date of Birth is required");
        isValid = false;
    }


    // Gender
    const selectedGender =
        document.querySelector('input[name="gender"]:checked');

    if (!selectedGender) {

        const genderContainer =
            document.querySelector('input[name="gender"]');

        showError(genderContainer, "Gender is required");

        isValid = false;
    }


    if (courseInput.value === "") {
        showError(courseInput, "Please select a course");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const selectedSkills = [];

    const skillCheckboxes =
        document.querySelectorAll('input[name="skill"]:checked');

    skillCheckboxes.forEach(function (checkbox) {
        selectedSkills.push(checkbox.value);
    });

    let photo = "";

    if (photoInput.files.length > 0) {
        photo = URL.createObjectURL(photoInput.files[0]);
    }

    const student = {

        id: nextId++,

        name: nameInput.value.trim(),

        email: emailInput.value.trim(),

        phone: phoneInput.value.trim(),

        dob: dobInput.value,

        gender: selectedGender.value,

        course: courseInput.value,

        skills: selectedSkills,

        about: aboutInput.value.trim(),

        photo: photo
    };

    //student card
    students.push(student);
    console.log(students);
    createStudentCard(student);

    updateStatistics();
    form.reset();

    alert("Student registered successfully!");

});

function createStudentCard(student) {

    // Main card
    const card = document.createElement("div");

    card.classList.add("student-card");

    // Store ID
    card.setAttribute("data-id", student.id);

    const image = document.createElement("img");

    image.classList.add("student-photo");

    if (student.photo !== "") {

        image.setAttribute("src", student.photo);

    } else {

        image.setAttribute("src","https://via.placeholder.com/150");
    }

    image.setAttribute("alt", student.name);

    const studentName = document.createElement("h3");

    studentName.textContent = student.name;


    const email = document.createElement("p");

    email.textContent = "Email: " + student.email;

    const phone = document.createElement("p");

    phone.textContent = "Phone: " + student.phone;

    const dob = document.createElement("p");

    dob.textContent = "DOB: " + student.dob;

    const gender = document.createElement("p");

    gender.textContent = "Gender: " + student.gender;

    const course = document.createElement("p");

    course.textContent = "Course: " + student.course;
    const skills = document.createElement("p");

    skills.textContent =
        "Skills: " +
        (student.skills.length > 0? student.skills.join(", "): "No skills selected");

    const about = document.createElement("p");

    about.textContent =
        "About: " +
        (student.about || "No information");

    card.appendChild(image);
    card.appendChild(studentName);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(dob);
    card.appendChild(gender);
    card.appendChild(course);
    card.appendChild(skills);
    card.appendChild(about);
    card.appendChild(editButton);
    card.appendChild(deleteButton);
    studentList.appendChild(card);
}

function deleteStudent(id) {
    const index = students.findIndex(function (student) {
        return student.id === id;
    });
    if (index !== -1) {
        students.splice(index, 1);
    }
    const card = document.querySelector(`.student-card[data-id="${id}"]`);
    if (card) {
        card.remove();
    }
    updateStatistics();
}

function editStudent(id) {
    const student = students.find(function (student) {
            return student.id === id;
        });
    if (!student) {
        return;
    }
    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseInput.value = student.course;
    aboutInput.value = student.about;
   
    document.querySelectorAll('input[name="gender"]')
    .forEach(function (radio) {
            radio.checked = radio.value === student.gender;
        });
    // Skills
    document.querySelectorAll('input[name="skill"]')
    .forEach(function (checkbox) {
        checkbox.checked = student.skills.includes(checkbox.value)
        });

    const index = students.findIndex(function (item) {
            return item.id === id;
        });

    students.splice(index, 1);


    const oldCard = document.querySelector( `.student-card[data-id="${id}"]`
        );

    if (oldCard) {
        oldCard.remove();
    }

    updateStatistics();


    // Scroll to form
    form.scrollIntoView({
        behavior: "smooth"
    });
}


