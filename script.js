const students = [];

const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("photo");
const studentContainer = document.getElementById("studentContainer");
const charCount = document.getElementById("charCount");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

let editId = null;

about.addEventListener("input", function () {
    charCount.textContent = about.value.length + " / 200";
});

function showError(input, message) {
    removeError(input);

    const error = document.createElement("small");
    error.classList.add("error-message");
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function removeError(input) {
    const oldError = input.parentElement.querySelector(".error-message");
    if (oldError) {
        oldError.remove();
    }
}

function removeAllErrors() {
    document.querySelectorAll(".error-message").forEach(function (error) {
        error.remove();
    });
}
function getGender() {
    const gender = document.querySelector('input[name="gender"]:checked');
    return gender ? gender.value : "";
}
function getSkills() {
    return Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map(function (skill) {
        return skill.value;
    });
}
form.addEventListener("submit", function (event) {
    event.preventDefault();
    removeAllErrors();
    const nameValue = studentName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value;
    const genderValue = getGender();
    const courseValue = course.value;
    const skillsValue = getSkills();
    const aboutValue = about.value.trim();
    const photoFile = photo.files[0];
    let valid = true;
    const namePattern = /^[A-Za-z ]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    if (nameValue === "") {
        showError(studentName, "Student name is required");
        valid = false;
    } else if (nameValue.length < 3) {
        showError(studentName, "Name must be at least 3 characters");
        valid = false;
    } else if (nameValue.length > 40) {
        showError(studentName, "Name must not exceed 40 characters");
        valid = false;
    } else if (!namePattern.test(nameValue)) {
        showError(studentName, "Only letters and spaces are allowed");
        valid = false;
    }
    if (emailValue === "") {
        showError(email, "Email is required");
        valid = false;
    } else if (!emailPattern.test(emailValue)) {
        showError(email, "Enter a valid email address");
        valid = false;
    }
    if (phoneValue === "") {
        showError(phone, "Phone number is required");
        valid = false;
    } else if (!phonePattern.test(phoneValue)) {
        showError(phone, "Phone number must contain exactly 10 digits");
        valid = false;
    }
    if (dobValue === "") {
        showError(dob, "Date of birth is required");
        valid = false;
    } else {
        const birthDate = new Date(dobValue);
        const today = new Date();
        if (birthDate > today) {
            showError(dob, "Future date is not allowed");
            valid = false;
        } else {
            const age = today.getFullYear() - birthDate.getFullYear();
            const month = today.getMonth() - birthDate.getMonth();
            let currentAge = age;
            if (
                month < 0 ||
                (month === 0 && today.getDate() < birthDate.getDate())
            ) {
                currentAge--;
            }
            if (currentAge < 15) {
                showError(dob, "Student must be at least 15 years old");
                valid = false;
            }
        }
    }
    if (genderValue === "") {
        showError(
            document.querySelector(".radio-group"),
            "Please select gender"
        );
        valid = false;
    }
    if (courseValue === "") {
        showError(course, "Please select a course");
        valid = false;
    }
    if (skillsValue.length === 0) {
        showError(
            document.querySelector(".checkbox-group"),
            "Select at least one skill"
        );
        valid = false;
    }
    if (aboutValue === "") {
        showError(about, "About student is required");
        valid = false;
    } else if (aboutValue.length < 20) {
        showError(about, "About student must be at least 20 characters");
        valid = false;
    }
    if (editId === null && !photoFile) {
        showError(photo, "Profile photo is required");
        valid = false;
    }
    if (photoFile) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(photoFile.type)) {
            showError(photo, "Only JPG, JPEG and PNG files are allowed");
            valid = false;
        }
    }
    if (!valid) {
        return;
    }
   if (editId !== null) {
        const student = students.find(function (student) {
            return student.id === editId;
        });
        student.name = nameValue;
        student.email = emailValue;
        student.phone = phoneValue;
        student.dob = dobValue;
        student.gender = genderValue;
        student.course = courseValue;
        student.skills = skillsValue;
        student.about = aboutValue;
        if (photoFile) {
            student.photo = URL.createObjectURL(photoFile);
        }
        editId = null;
        document.getElementById("submitBtn").textContent = "Register Student";
    } else {
        const student = {
            id: students.length > 0
                ? students[students.length - 1].id + 1
                : 1,
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            dob: dobValue,
            gender: genderValue,
            course: courseValue,
            skills: skillsValue,
            about: aboutValue,
            photo: URL.createObjectURL(photoFile)
        };
        students.push(student);
    }
    displayStudents();
    updateStatistics();
    form.reset();
    charCount.textContent = "0 / 200";
});

function displayStudents() {
    studentContainer.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();
    const selectedCourse = courseFilter.value;
    students
        .filter(function (student) {
            const nameMatch = student.name
                .toLowerCase()
                .includes(searchValue);
            const courseMatch =
                selectedCourse === "All" ||
                student.course === selectedCourse;
            return nameMatch && courseMatch;
        })
        .forEach(function (student) {
            const card = document.createElement("div");
            card.classList.add("student-card");
            card.setAttribute("data-id", student.id);
            const image = document.createElement("img");
            image.setAttribute("src", student.photo);
            image.setAttribute("alt", student.name);
            const name = document.createElement("h3");
            name.textContent = student.name;
            const emailText = document.createElement("p");
            emailText.textContent = "Email: " + student.email;
            const phoneText = document.createElement("p");
            phoneText.textContent = "Phone: " + student.phone;
            const dobText = document.createElement("p");
            dobText.textContent = "DOB: " + student.dob;
            const genderText = document.createElement("p");
            genderText.textContent = "Gender: " + student.gender;
            const courseText = document.createElement("p");
            courseText.textContent = "Course: " + student.course;
            const skillsText = document.createElement("p");
            skillsText.textContent =
                "Skills: " + student.skills.join(", ");
            const aboutText = document.createElement("p");
            aboutText.textContent = "About: " + student.about;
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("btn", "primary-btn");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn", "secondary-btn");
            editButton.addEventListener("click", function () {
                editStudent(student.id);
            });
            deleteButton.addEventListener("click", function () {
                deleteStudent(student.id);
            });
            const buttons = document.createElement("div");
            buttons.classList.add("form-buttons");
            buttons.append(editButton, deleteButton);
            card.append(
                image,
                name,
                emailText,
                phoneText,
                dobText,
                genderText,
                courseText,
                skillsText,
                aboutText,
                buttons
            );
            studentContainer.appendChild(card);
        });
}
function editStudent(id) {
    const student = students.find(function (student) {
        return student.id === id;
    });
    studentName.value = student.name;
    email.value = student.email;
    phone.value = student.phone;
    dob.value = student.dob;
    course.value = student.course;
    about.value = student.about;
    document
        .querySelectorAll('input[name="gender"]')
        .forEach(function (radio) {
            radio.checked = radio.value === student.gender;
        });
    document
        .querySelectorAll('input[name="skills"]')
        .forEach(function (checkbox) {
            checkbox.checked = student.skills.includes(checkbox.value);
        });
    editId = id;
    document.getElementById("submitBtn").textContent = "Update Student";
    charCount.textContent = about.value.length + " / 200";
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function deleteStudent(id) {
    const index = students.findIndex(function (student) {
        return student.id === id;
    });
    if (index !== -1) {
        students.splice(index, 1);
    }
    displayStudents();
    updateStatistics();
}
function updateStatistics() {
    document.getElementById("totalStudents").textContent =
        students.length;
    document.getElementById("webDevelopmentCount").textContent =
        students.filter(function (student) {
            return student.course === "Web Development";
        }).length;
    document.getElementById("uiuxCount").textContent =
        students.filter(function (student) {
            return student.course === "UI/UX";
        }).length;
    document.getElementById("pythonCount").textContent =
        students.filter(function (student) {
            return student.course === "Python";
        }).length;
    document.getElementById("dataAnalyticsCount").textContent =
        students.filter(function (student) {
            return student.course === "Data Analytics";
        }).length;
    document.getElementById("mernCount").textContent =
        students.filter(function (student) {
            return student.course === "MERN Stack";
        }).length;
    document.getElementById("cloudCount").textContent =
        students.filter(function (student) {
            return student.course === "Cloud Computing";
        }).length;
}
document.getElementById("resetBtn").addEventListener("click", function () {
    form.reset();
    removeAllErrors();
    charCount.textContent = "0 / 200";
    editId = null;
    document.getElementById("submitBtn").textContent = "Register Student";
});
searchInput.addEventListener("input", displayStudents);
courseFilter.addEventListener("change", displayStudents);
displayStudents();
updateStatistics();