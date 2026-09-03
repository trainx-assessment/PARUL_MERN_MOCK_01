const form = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const studentCount = document.querySelector("#studentCount");

const students = [];

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get form values

    const name = document.querySelector("#name").value.trim();

    const email = document.querySelector("#email").value.trim();

    const phone = document.querySelector("#phone").value.trim();

    const dob = document.querySelector("#dob").value;

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    const course = document.querySelector("#course").value;

    const about = document.querySelector("#about").value.trim();

    const photo = document.querySelector("#photo").files[0];


    // Get selected skills

    const selectedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    const skills = [];

    selectedSkills.forEach(function (skill) {
        skills.push(skill.value);
    });


    // Validation

    const namePattern = /^[A-Za-z ]{3,}$/;

    const phonePattern = /^[0-9]{10}$/;


    if (!namePattern.test(name)) {
        alert("Enter a valid name");
        return;
    }


    if (!email) {
        alert("Email is required");
        return;
    }


    if (!phonePattern.test(phone)) {
        alert("Phone must contain exactly 10 digits");
        return;
    }


    if (!dob) {
        alert("Date of birth is required");
        return;
    }


    if (!gender) {
        alert("Please select gender");
        return;
    }


    if (!course) {
        alert("Please select a course");
        return;
    }


    if (skills.length === 0) {
        alert("Please select at least one skill");
        return;
    }


    if (!about) {
        alert("About student is required");
        return;
    }


    if (!photo) {
        alert("Please select a profile photo");
        return;
    }


    // Create student object

    const student = {

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        dob: dob,

        gender: gender.value,

        course: course,

        skills: skills,

        about: about,

        photo: URL.createObjectURL(photo)

    };


    // Add student to array

    students.push(student);


    // Create student card

    createStudentCard(student);


    // Update count

    studentCount.textContent = students.length;


    // Reset form

    form.reset();

});


function createStudentCard(student) {

    const card = document.createElement("article");

    card.classList.add("student-card");

    card.dataset.id = student.id;


    const image = document.createElement("img");

    image.src = student.photo;

    image.alt = "Student profile photo";


    const heading = document.createElement("h3");

    heading.textContent = student.name;


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
        "Skills: " + student.skills.join(", ");


    const about = document.createElement("p");

    about.textContent =
        "About: " + student.about;


    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add("delete-btn");


    card.append(
        image,
        heading,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about,
        deleteButton
    );


    studentContainer.appendChild(card);

}


/* Event Delegation */

studentContainer.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-btn")) {

        const card = event.target.closest(".student-card");

        const id = Number(card.dataset.id);


        const index = students.findIndex(function (student) {

            return student.id === id;

        });


        students.splice(index, 1);


        card.remove();


        studentCount.textContent = students.length;

    }

});