const students = [];
const form = document.getElementById("student-form");
const submitButton = form.querySelector('button[type="submit"]');
const studentCardsContainer = document.getElementById("student-cards-container");
let editingStudentId = null;

function updateStatistics() {
    let webDevelopmentCount = 0;
    let uiUxCount = 0;
    let pythonCount = 0;
    let dataAnalyticsCount = 0;
    let mernStackCount = 0;
    let cloudComputingCount = 0;

    students.forEach((student) => {
        if (student.course === "Web Development") {
            webDevelopmentCount++;
        } else if (student.course === "UI/UX") {
            uiUxCount++;
        } else if (student.course === "Python") {
            pythonCount++;
        } else if (student.course === "Data Analytics") {
            dataAnalyticsCount++;
        } else if (student.course === "MERN Stack") {
            mernStackCount++;
        } else if (student.course === "Cloud Computing") {
            cloudComputingCount++;
        }
    });

    document.getElementById("total-students").innerText = "Total Students: " + students.length;
    document.getElementById("web-development-count").innerText = "Web Development: " + webDevelopmentCount;
    document.getElementById("ui-ux-count").innerText = "UI/UX: " + uiUxCount;
    document.getElementById("python-count").innerText = "Python: " + pythonCount;
    document.getElementById("data-analytics-count").innerText = "Data Analytics: " + dataAnalyticsCount;
    document.getElementById("mern-stack-count").innerText = "MERN Stack: " + mernStackCount;
    document.getElementById("cloud-computing-count").innerText = "Cloud Computing: " + cloudComputingCount;
}

function getNextStudentId() {
    const lastStudent = students[students.length - 1];
    return lastStudent ? lastStudent.id + 1 : 1;
}

function displayStudents() {
    studentCardsContainer.innerHTML = "";
    updateStatistics();

    students.forEach((student) => {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const photo = document.createElement("img");
        photo.setAttribute("src", student.photo);
        photo.setAttribute("alt", "Student Photo");

        const name = document.createElement("h3");
        name.textContent = student.name;

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

        const skillsTitle = document.createElement("p");
        skillsTitle.textContent = "Skills:";

        const skills = document.createElement("p");
        skills.textContent = student.skills.join(", ");

        const aboutTitle = document.createElement("p");
        aboutTitle.textContent = "About:";

        const about = document.createElement("p");
        about.textContent = student.about;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-student");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-student");

        card.append(photo, name, email, phone, dob, gender, course, skillsTitle, skills, aboutTitle, about, editButton, deleteButton);
        studentCardsContainer.appendChild(card);
    });
}

studentCardsContainer.addEventListener("click", (event) => {
    const editButton = event.target.closest(".edit-student");
    const deleteButton = event.target.closest(".delete-student");

    if (editButton === null && deleteButton === null) {
        return;
    }

    const studentCard = event.target.closest(".student-card");
    const studentId = Number(studentCard.getAttribute("data-id"));
    const studentIndex = students.findIndex((student) => student.id === studentId);

    if (studentIndex === -1) {
        return;
    }

    if (editButton !== null) {
        const student = students[studentIndex];

        document.getElementById("student-name").value = student.name;
        document.getElementById("student-email").value = student.email;
        document.getElementById("student-phone").value = student.phone;
        document.getElementById("student-dob").value = student.dob;
        document.querySelector('input[name="studentGender"][value="' + student.gender + '"]').checked = true;
        document.getElementById("student-course").value = student.course;
        document.getElementById("student-skills").value = student.skills[0];
        document.getElementById("student-about").value = student.about;
        document.getElementById("about-counter").innerText = student.about.length + " / 200";

        editingStudentId = student.id;
        submitButton.innerText = "Update Student";
        
        return;
    }

    const shouldDelete = confirm("Are you sure you want to delete this student?");

    if (!shouldDelete) {
        return;
    }

    students.splice(studentIndex, 1);
    studentCard.remove();
    updateStatistics();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("student-name").value.trim();
    const email = document.getElementById("student-email").value.trim();
    const phone = document.getElementById("student-phone").value.trim();
    const dob = document.getElementById("student-dob").value;
    const gender = document.querySelector('input[name="studentGender"]:checked');
    const course = document.getElementById("student-course").value;
    const skills = document.getElementById("student-skills").value;
    const about = document.getElementById("student-about").value.trim();
    const photo = document.getElementById("student-photo").files[0];
    let valid = true;

    document.getElementById("name-error").innerText = "";
    document.getElementById("email-error").innerText = "";
    document.getElementById("phone-error").innerText = "";
    document.getElementById("dob-error").innerText = "";
    document.getElementById("gender-error").innerText = "";
    document.getElementById("course-error").innerText = "";
    document.getElementById("skills-error").innerText = "";
    document.getElementById("about-error").innerText = "";
    document.getElementById("photo-error").innerText = "";

    let nameHasInvalidCharacter = false;
    const letters = "abcdefghijklmnopqrstuvwxyz ";
    for (let i = 0; i < name.length; i++) {
        if (!letters.includes(name[i].toLowerCase())) {
            nameHasInvalidCharacter = true;
        }
    }

    if (name === "") {
        document.getElementById("name-error").innerText = "Student name is required.";
        valid = false;
    } else if (name.length < 3 || name.length > 40 || nameHasInvalidCharacter) {
        document.getElementById("name-error").innerText = "Enter 3 to 40 letters and spaces only.";
        valid = false;
    }

    if (email === "") {
        document.getElementById("email-error").innerText = "Email is required.";
        valid = false;
    } else if (!email.includes("@") || !email.includes(".") || email.startsWith("@") || email.endsWith("@")) {
        document.getElementById("email-error").innerText = "Enter a valid email address.";
        valid = false;
    }

    let phoneHasInvalidCharacter = false;
    const numbers = "0123456789";
    for (let i = 0; i < phone.length; i++) {
        if (!numbers.includes(phone[i])) {
            phoneHasInvalidCharacter = true;
        }
    }

    if (phone === "") {
        document.getElementById("phone-error").innerText = "Phone number is required.";
        valid = false;
    } else if (phone.length !== 10 || phoneHasInvalidCharacter) {
        document.getElementById("phone-error").innerText = "Phone number must contain exactly 10 digits.";
        valid = false;
    }

    if (dob === "") {
        document.getElementById("dob-error").innerText = "Date of birth is required.";
        valid = false;
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        if (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate > today) {
            document.getElementById("dob-error").innerText = "Future dates are not allowed.";
            valid = false;
        } else if (age < 15) {
            document.getElementById("dob-error").innerText = "Student must be at least 15 years old.";
            valid = false;
        }
    }

    if (gender === null) {
        document.getElementById("gender-error").innerText = "Select a gender.";
        valid = false;
    }

    if (course === "") {
        document.getElementById("course-error").innerText = "Select a course.";
        valid = false;
    }

    if (skills === "") {
        document.getElementById("skills-error").innerText = "Select at least one skill.";
        valid = false;
    }

    if (about === "") {
        document.getElementById("about-error").innerText = "About student is required.";
        valid = false;
    } else if (about.length < 20 || about.length > 200) {
        document.getElementById("about-error").innerText = "About student must be 20 to 200 characters.";
        valid = false;
    }

    if (photo === undefined && editingStudentId === null) {
        document.getElementById("photo-error").innerText = "Profile photo is required.";
        valid = false;
    } else if (photo !== undefined && photo.type !== "image/jpeg" && photo.type !== "image/png") {
        document.getElementById("photo-error").innerText = "Select a JPG, JPEG, or PNG image.";
        valid = false;
    }

    if (!valid) {
        return;
    }

    if (editingStudentId !== null) {
        const studentIndex = students.findIndex((student) => student.id === editingStudentId);

        if (studentIndex === -1) {
            return;
        }

        students[studentIndex].name = name;
        students[studentIndex].email = email;
        students[studentIndex].phone = phone;
        students[studentIndex].dob = dob;
        students[studentIndex].gender = gender.value;
        students[studentIndex].course = course;
        students[studentIndex].skills = [skills];
        students[studentIndex].about = about;

        if (photo !== undefined) {
            students[studentIndex].photo = photo.name;
        }

        editingStudentId = null;
        submitButton.innerText = "Register Student";
        displayStudents();
        form.reset();
        document.getElementById("about-counter").innerText = "0 / 200";
        return;
    }

    const student = {
        id: getNextStudentId(),
        name,
        email,
        phone,
        dob,
        gender: gender.value,
        course,
        skills: [skills],
        about,
        photo: photo.name
    };

    students.push(student);
    displayStudents();
    form.reset();
    document.getElementById("about-counter").innerText = "0 / 200";
});

document.getElementById("student-name").addEventListener("input", () => document.getElementById("name-error").innerText = "");
document.getElementById("student-email").addEventListener("input", () => document.getElementById("email-error").innerText = "");
document.getElementById("student-phone").addEventListener("input", () => document.getElementById("phone-error").innerText = "");
document.getElementById("student-dob").addEventListener("change", () => document.getElementById("dob-error").innerText = "");
document.getElementById("student-male").addEventListener("change", () => document.getElementById("gender-error").innerText = "");
document.getElementById("student-female").addEventListener("change", () => document.getElementById("gender-error").innerText = "");
document.getElementById("student-course").addEventListener("change", () => document.getElementById("course-error").innerText = "");
document.getElementById("student-skills").addEventListener("change", () => document.getElementById("skills-error").innerText = "");
document.getElementById("student-photo").addEventListener("change", () => document.getElementById("photo-error").innerText = "");

document.getElementById("student-about").addEventListener("input", () => {
    const aboutLength = document.getElementById("student-about").value.length;
    document.getElementById("about-counter").innerText = aboutLength + " / 200";
    document.getElementById("about-error").innerText = "";
});

form.addEventListener("reset", () => {
    document.querySelectorAll(".error-message").forEach((error) => error.innerText = "");
    document.getElementById("about-counter").innerText = "0 / 200";
    editingStudentId = null;
    submitButton.innerText = "Register Student";
});
