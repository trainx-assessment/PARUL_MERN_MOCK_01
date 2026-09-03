const students = [];
let editingId = null;

const form = document.querySelector("#form")
const nameInput = document.querySelector("#name")
const emailInput = document.querySelector("#email")
const phoneInput = document.querySelector("#phone_number")
const dobInput = document.querySelector("#dob")
const courseInput = document.querySelector("#course")
const aboutInput = document.querySelector("#about")
const photoInput = document.querySelector("#profilePhoto")
const studentContainer = document.querySelector("#studentContainer")
const charCounter = document.querySelector("#charCounter")
const searchInput = document.querySelector("#searchInput")
const filterCourse = document.querySelector("#filterCourse")
const submitButton = form.querySelector('button[type="submit"]')

const savedStudents = JSON.parse(localStorage.getItem("students")) || []

savedStudents.forEach(function(student) {
    students.push(student)
});

aboutInput.addEventListener("input", function() {
    charCounter.textContent = aboutInput.value.length + " / 200";
});

function clearErrors() {
    const errors = document.querySelectorAll(".error-message");

    errors.forEach(function(error) {
        error.remove()
    });
}

function showError(input, message) {
    const error = document.createElement("small")

    error.classList.add("error-message")
    error.textContent = message;
    input.parentElement.appendChild(error)
}

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students))
}

function getAge(date) {
    const today = new Date()
    const birthDate = new Date(date)

    let age = today.getFullYear() - birthDate.getFullYear()

    const month = today.getMonth() - birthDate.getMonth()

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age;
}

form.addEventListener("submit", function(event) {
    event.preventDefault()
    clearErrors()

    let isValid = true

    const name = nameInput.value.trim();
    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "") {
        showError(nameInput, "Student name is required.")
        isValid = false
    } else if (name.length < 3) {
        showError(nameInput, "Name must contain at least 3 characters.")
        isValid = false
    } else if (name.length > 40) {
        showError(nameInput, "Name cannot exceed 40 characters.");
        isValid = false
    } else if (!nameRegex.test(name)) {
        showError(nameInput, "Name can contain only letters and spaces.");
        isValid = false
    }

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email === "") {
        showError(emailInput, "Email is required.")
        isValid = false
    } else if (!emailRegex.test(email)) {
        showError(emailInput, "Enter a valid email address.")
        isValid = false
    }

    const phone = phoneInput.value.trim()
    const phoneRegex = /^\d{10}$/

    if (phone === "") {
        showError(phoneInput, "Phone number is required.")
        isValid = false
    } else if (!phoneRegex.test(phone)) {
        showError(phoneInput, "Phone number must contain exactly 10 digits.")
        isValid = false
    }

    const dob = dobInput.value

    if (dob === "") {
        showError(dobInput, "Date of birth is required.");
        isValid = false
    } else {
        const birthDate = new Date(dob)
        const today = new Date()

        today.setHours(0, 0, 0, 0)

        if (birthDate > today) {
            showError(dobInput, "Date of birth cannot be in the future.")
            isValid = false
        } else if (getAge(dob) < 15) {
            showError(dobInput, "Student must be at least 15 years old.")
            isValid = false
        }
    }

    const genderInput = document.querySelector('input[name="gender"]:checked')

    if (!genderInput) {
        showError(
            document.querySelector(".radio-group"),
            "Please select a gender."
        );
        isValid = false
    }

    const course = courseInput.value

    if (course === "") {
        showError(courseInput, "Please select a course.")
        isValid = false
    }

    const selectedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (selectedSkills.length === 0) {
        showError(
            document.querySelector(".skills-group"),
            "Please select at least one skill."
        );
        isValid = false;
    }

    const about = aboutInput.value.trim();

    if (about === "") {
        showError(aboutInput, "About student is required.");
        isValid = false;
    } else if (about.length < 20) {
        showError(
            aboutInput,
            "About student must contain at least 20 characters."
        );
        isValid = false;
    } else if (about.length > 200) {
        showError(
            aboutInput,
            "About student cannot exceed 200 characters."
        );
        isValid = false;
    }

    const photo = photoInput.files[0]

    if (!photo && editingId === null) {
        showError(photoInput, "Profile photo is required.");
        isValid = false;
    } else if (photo) {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        if (!allowedTypes.includes(photo.type)) {
            showError(
                photoInput,
                "Only JPG, JPEG and PNG images are allowed."
            );
            isValid = false
        }
    }

    if (!isValid) {
        return;
    }

    const gender = genderInput.value
    const skills = []

    selectedSkills.forEach(function(skill) {
        skills.push(skill.value)
    });

    if (photo) {
        const reader = new FileReader();

        reader.onload = function() {
            saveStudent(
                name,
                email,
                phone,
                dob,
                gender,
                course,
                skills,
                about,
                reader.result
            );
        };

        reader.readAsDataURL(photo);
    } else {
        const existingStudent = students.find(function(student) {
            return student.id === editingId;
        });

        saveStudent(
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            about,
            existingStudent.photo
        );
    }
});

function saveStudent(
    name,
    email,
    phone,
    dob,
    gender,
    course,
    skills,
    about,
    photo
) {
    if (editingId === null) {
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
            photo: photo
        };

        students.push(student)
    } else {
        const student = students.find(function(student) {
            return student.id === editingId
        });

        if (student) {
            student.name = name
            student.email = email
            student.phone = phone
            student.dob = dob
            student.gender = gender
            student.course = course
            student.skills = skills
            student.about = about
            student.photo = photo
        }
    }

    saveStudents()
    displayStudents()
    updateStatistics()
    resetForm()
}

function displayStudents() {
    studentContainer.innerHTML = ""

    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedCourse = filterCourse.value

    const filteredStudents = students.filter(function(student) {
        const matchesSearch = student.name
            .toLowerCase()
            .includes(searchValue)

        const matchesCourse =
            selectedCourse === "all" ||
            student.course === selectedCourse

        return matchesSearch && matchesCourse
    });

    if (filteredStudents.length === 0) {
        const message = document.createElement("p")

        message.classList.add("no-students")
        message.textContent = "No students found"

        studentContainer.appendChild(message)
        return
    }

    filteredStudents.forEach(function(student) {
        const card = document.createElement("div")

        card.classList.add("student-card")
        card.setAttribute("data-id", student.id)

        const image = document.createElement("img")

        image.src = student.photo
        image.alt = student.name
        image.classList.add("student-photo")

        card.appendChild(image)

        const heading = document.createElement("h3")

        heading.textContent = student.name
        card.appendChild(heading)

        const email = document.createElement("p")

        email.textContent = "Email: " + student.email
        card.appendChild(email)

        const phone = document.createElement("p")

        phone.textContent = "Phone: " + student.phone
        card.appendChild(phone)

        const dob = document.createElement("p")

        dob.textContent = "DOB: " + student.dob
        card.appendChild(dob)

        const gender = document.createElement("p")

        gender.textContent = "Gender: " + student.gender
        card.appendChild(gender)

        const course = document.createElement("p")

        course.textContent = "Course: " + student.course
        card.appendChild(course)

        const skills = document.createElement("p")

        skills.textContent = "Skills: " + student.skills.join(", ");
        card.appendChild(skills)

        const about = document.createElement("p")

        about.textContent = "About: " + student.about
        card.appendChild(about)

        const buttons = document.createElement("div")

        buttons.classList.add("card-buttons")

        const editButton = document.createElement("button")

        editButton.textContent = "Edit"
        editButton.classList.add("edit-btn")
        editButton.setAttribute("data-id", student.id)

        const deleteButton = document.createElement("button")

        deleteButton.textContent = "Delete"
        deleteButton.classList.add("delete-btn")
        deleteButton.setAttribute("data-id", student.id)

        buttons.appendChild(editButton)
        buttons.appendChild(deleteButton)

        card.appendChild(buttons)
        studentContainer.appendChild(card)
    });
}

function updateStatistics() {
    document.querySelector("#total").textContent = students.length

    document.querySelector("#webstudents").textContent =
        students.filter(function(student) {
            return student.course === "Web Development"
        }).length

    document.querySelector("#uiuxstudents").textContent =
        students.filter(function(student) {
            return student.course === "UI/UX"
        }).length

    document.querySelector("#pythonstudents").textContent =
        students.filter(function(student) {
            return student.course === "Python"
        }).length

    document.querySelector("#dataanalyticsstudents").textContent =
        students.filter(function(student) {
            return student.course === "Data Analytics"
        }).length

    document.querySelector("#mernstudents").textContent =
        students.filter(function(student) {
            return student.course === "MERN Stack"
        }).length

    document.querySelector("#cloudstudents").textContent =
        students.filter(function(student) {
            return student.course === "Cloud Computing"
        }).length
}

studentContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.closest(".student-card")
        const id = Number(card.getAttribute("data-id"))

        const confirmed = confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return
        }

        const index = students.findIndex(function(student) {
            return student.id === id
        });

        if (index !== -1) {
            students.splice(index, 1)
        }

        saveStudents()
        displayStudents()
        updateStatistics()

        return
    }

    if (event.target.classList.contains("edit-btn")) {
        const card = event.target.closest(".student-card")
        const id = Number(card.getAttribute("data-id"))

        const student = students.find(function(student) {
            return student.id === id;
        })

        if (!student) {
            return
        }

        editingId = student.id

        nameInput.value = student.name
        emailInput.value = student.email
        phoneInput.value = student.phone
        dobInput.value = student.dob
        courseInput.value = student.course
        aboutInput.value = student.about

        charCounter.textContent =
            aboutInput.value.length + " / 200";

        document
            .querySelectorAll('input[name="gender"]')
            .forEach(function(radio) {
                radio.checked = radio.value === student.gender
            });

        document
            .querySelectorAll('input[name="skills"]')
            .forEach(function(skill) {
                skill.checked = student.skills.includes(skill.value)
            });

        submitButton.textContent = "Update Student"

        form.scrollIntoView({
            behavior: "smooth"
        });
    }
});

searchInput.addEventListener("input", function() {
    displayStudents()
});

filterCourse.addEventListener("change", function() {
    displayStudents()
});

function resetForm() {
    form.reset()
    editingId = null
    submitButton.textContent = "Register Student"
    charCounter.textContent = "0 / 200"
    clearErrors()
}

form.addEventListener("reset", function() {
    setTimeout(function() {
        editingId = null
        submitButton.textContent = "Register Student"
        charCounter.textContent = "0 / 200"
        clearErrors()
    }, 0)
});

const darkModeButton = document.createElement("button")

darkModeButton.id = "darkModeBtn"
darkModeButton.textContent = "Dark Mode"
darkModeButton.type = "button"

document.querySelector("header").appendChild(darkModeButton)

darkModeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode")

    if (document.body.classList.contains("dark-mode")) {
        darkModeButton.textContent = "Light Mode"
    } else {
        darkModeButton.textContent = "Dark Mode"
    }
})

displayStudents()
updateStatistics()