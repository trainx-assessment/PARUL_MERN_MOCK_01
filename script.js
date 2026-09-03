class Students {
    constructor(id, name, email, phone, dob, gender, course, skills, about, photo) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dob = dob;
        this.gender = gender;
        this.course = course;
        this.skills = skills;
        this.about = about;
        this.photo = photo;
    }
}

const students = [];
let studId = 1;
const form = document.querySelector("form");
const studentCards = document.querySelector("#student_cards");
function showStudentCard(student) {
    let card = document.createElement("div");
    card.className = "student-card";
    card.innerHTML = `
        <img src="${student.photo}" class="student-photo" alt="Student Photo">
        <p><b>ID:</b> ${student.id}</p>
        <p><b>Name:</b> ${student.name}</p>
        <p><b>Email:</b> ${student.email}</p>
        <p><b>Phone:</b> ${student.phone}</p>
        <p><b>Date of Birth:</b> ${student.dob}</p>
        <p><b>Gender:</b> ${student.gender}</p>
        <p><b>Course:</b> ${student.course}</p>
        <p><b>Skills:</b> ${student.skills.join(", ")}</p>
        <p><b>About:</b> ${student.about}</p>
    `;
    studentCards.appendChild(card);
}


// form submission functin : 

form.addEventListener("submit", function(event) {
    event.preventDefault();
    let name = document.querySelector("#name_field").value;
    let email = document.querySelector("#email_field").value;
    let phone = document.querySelector("#phonenumber_field").value;
    let dob = document.querySelector("#dob_field").value;
    let gender = document.querySelector('input[name="gender"]:checked');
    let course = document.querySelector("#course").value;
    let nameRegexp = /^[A-Za-z ]{3,40}$/;
    let phoneRegexp = /^[0-9]{10}$/;
    let emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // let photourl = document.querySelector("#profile_photo").value;

    // if (photourl.contains(".jpg"))
    if (!nameRegexp.test(name)) {
        alert("Student name should be 3 to 40 letters and spaces only. No Special Characters");
        return;
    }

    if (!emailRegexp.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!phoneRegexp.test(phone)) {
        alert("Phone number should have exactly 10 digits.");
        return;
    }
    let birthDate = new Date(dob);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDifference = today.getMonth() - birthDate.getMonth();

    if (birthDate > today) {
        alert("Date of birth cant be in future.");
        return;
    }

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 15) {
        alert("Age should be at least 15 yrs.");
    }
    let selectedSkills = [];
    let skillBoxes = document.querySelectorAll('input[name="skills"]:checked');
    skillBoxes.forEach(function(skill) {
        selectedSkills.push(skill.value);
    });
    let photoInput = document.querySelector("#profile_photo");
    let photoUrl = "";
    if (photoInput.files.length > 0) {
        photoUrl = URL.createObjectURL(photoInput.files[0]);
    }
    let student = new Students(
        studId,
        name,
        email,
        phone,
        dob,
        gender.value,
        course,
        selectedSkills,
        document.querySelector("#about_student").value,
        photoUrl
    );
    students.push(student);
    showStudentCard(student);
    studId++;
    console.log(students);
    form.reset();
});


