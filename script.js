const students = [];

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

dob.max = new Date().toISOString().split("T")[0];

function clearErrors() {
    document.querySelectorAll(".error").forEach(function (error) {
        error.textContent = "";
    });
}

function showError(id, message) {
    document.querySelector("#" + id).textContent = message;
}

function updateStudentCount() {
    studentCount.textContent = "Total Students: " + students.length;
}

function createStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.id = student.id;

    const image = document.createElement("img");
    image.src = student.photo;
    image.alt = student.name + " Profile Photo";

    const content = document.createElement("div");
    content.classList.add("card-content");

    const heading = document.createElement("h3");
    heading.textContent = student.name;

    const emailText = document.createElement("p");
    emailText.textContent = "📧 Email: " + student.email;

    const phoneText = document.createElement("p");
    phoneText.textContent = "📱 Phone: " + student.phone;

    const dobText = document.createElement("p");
    dobText.textContent = "🎂 Date of Birth: " + student.dob;

    const genderText = document.createElement("p");
    genderText.textContent = "👤 Gender: " + student.gender;

    const courseText = document.createElement("p");
    courseText.textContent = "📚 Course: " + student.course;

    const skillsTitle = document.createElement("p");
    skillsTitle.textContent = "🛠️ Skills:";

    const skillList = document.createElement("div");
    skillList.classList.add("skill-list");

    student.skills.forEach(function (skill) {
        const skillTag = document.createElement("span");
        skillTag.classList.add("skill-tag");
        skillTag.textContent = skill;
        skillList.appendChild(skillTag);
    });

    const aboutText = document.createElement("p");
    aboutText.textContent = "📝 About: " + student.about;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.type = "button";
    deleteButton.textContent = "🗑 Delete Student";

    content.append(
        heading,
        emailText,
        phoneText,
        dobText,
        genderText,
        courseText,
        skillsTitle,
        skillList,
        aboutText,
        deleteButton
    );

    card.append(image, content);
    studentContainer.appendChild(card);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const nameValue = studentName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value;
    const courseValue = course.value;
    const aboutValue = about.value.trim();

    const genderElement = document.querySelector('input[name="gender"]:checked');
    const skillElements = document.querySelectorAll('input[name="skills"]:checked');

    const skills = [];

    skillElements.forEach(function (skill) {
        skills.push(skill.value);
    });

    let isValid = true;

    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nameValue === "") {
        showError("nameError", "Student name is required.");
        isValid = false;
    } else if (nameValue.length < 3) {
        showError("nameError", "Name must contain at least 3 characters.");
        isValid = false;
    } else if (!nameRegex.test(nameValue)) {
        showError("nameError", "Name can contain only letters and spaces.");
        isValid = false;
    }

    if (emailValue === "") {
        showError("emailError", "Email is required.");
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError("emailError", "Enter a valid email address.");
        isValid = false;
    }

    if (phoneValue === "") {
        showError("phoneError", "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        showError("phoneError", "Phone number must contain exactly 10 digits.");
        isValid = false;
    }

    if (dobValue === "") {
        showError("dobError", "Date of birth is required.");
        isValid = false;
    } else {
        const selectedDate = new Date(dobValue + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showError("dobError", "Future dates are not allowed.");
            isValid = false;
        }
    }

    if (!genderElement) {
        showError("genderError", "Please select a gender.");
        isValid = false;
    }

    if (courseValue === "") {
        showError("courseError", "Please select a course.");
        isValid = false;
    }

    if (skills.length === 0) {
        showError("skillsError", "Please select at least one skill.");
        isValid = false;
    }

    if (aboutValue === "") {
        showError("aboutError", "About student is required.");
        isValid = false;
    }

    if (photo.files.length === 0) {
        showError("photoError", "Please select a profile photo.");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const photoURL = URL.createObjectURL(photo.files[0]);

    const student = {
        id: Date.now(),
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        dob: dobValue,
        gender: genderElement.value,
        course: courseValue,
        skills: skills,
        about: aboutValue,
        photo: photoURL
    };

    students.push(student);
    createStudentCard(student);
    updateStudentCount();

    form.reset();
    clearErrors();
});

studentContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.closest(".student-card");
        const studentId = Number(card.dataset.id);

        const studentIndex = students.findIndex(function (student) {
            return student.id === studentId;
        });

        if (studentIndex !== -1) {
            URL.revokeObjectURL(students[studentIndex].photo);
            students.splice(studentIndex, 1);
        }

        card.remove();
        updateStudentCount();
    }
});
