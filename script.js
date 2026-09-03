const students = [];
let nextId = 1;
const form = document.getElementById("studentForm");
const about = document.getElementById("about");
const charCount = document.getElementById("charCount");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
about.addEventListener("input", function() {
    charCount.textContent = about.value.length + " / 200 characters";
});
form.addEventListener("submit", function(event) {
    event.preventDefault();
    removeErrors();
    let valid = true;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const aboutText = about.value.trim();
    const photo = document.getElementById("profilePhoto").files[0];
    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );
    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
        showError("name", "Name is required");
        valid = false;
    }
    else if (name.length < 3) {
        showError("name", "Name must have at least 3 characters");
        valid = false;
    }
    else if (name.length > 40) {
        showError("name", "Name cannot have more than 40 characters");
        valid = false;
    }
    else if (!namePattern.test(name)) {
        showError("name", "Name can contain only letters and spaces");
        valid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        showError("email", "Email is required");
        valid = false;
    }
    else if (!emailPattern.test(email)) {
        showError("email", "Enter a valid email");
        valid = false;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (phone === "") {
        showError("phone", "Phone number is required");
        valid = false;
    }
    else if (!phonePattern.test(phone)) {
        showError("phone", "Phone number must contain 10 digits");
        valid = false;
    }
    if (dob === "") {
        showError("dob", "Date of birth is required");
        valid = false;
    }
    else {
        const birthDate = new Date(dob);
        const today = new Date();
        if (birthDate > today) {
            showError("dob", "Date cannot be in the future");
            valid = false;
        }
        let age = today.getFullYear() - birthDate.getFullYear();
        if (
            today.getMonth() < birthDate.getMonth() ||
            (
                today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }
        if (age < 15) {
            showError("dob", "Student must be at least 15 years old");
            valid = false;
        }
    }
    if (!gender) {
        showFieldsetError("gender", "Please select a gender");
        valid = false;
    }
    if (course === "") {
        showError("course", "Please select a course");
        valid = false;
    }
    if (skills.length === 0) {
        showFieldsetError("skills", "Please select at least one skill");
        valid = false;
    }

    if (aboutText === "") {
        showError("about", "About student is required");
        valid = false;
    }
    else if (aboutText.length < 20) {
        showError(
            "about",
            "About student must have at least 20 characters"
        );
        valid = false;
    }
    else if (aboutText.length > 200) {
        showError(
            "about",
            "About student cannot exceed 200 characters"
        );
        valid = false;
    }
    const editId = form.getAttribute("data-edit-id");
    if (!editId && !photo) {
        showError("profilePhoto", "Profile photo is required");
        valid = false;
    }
    else if (photo && !photo.type.startsWith("image/")) {
        showError("profilePhoto", "Only image files are allowed");
        valid = false;
    }
    if (valid) {
        const skillList = [];
        skills.forEach(function(skill) {
            skillList.push(skill.value);
        });
        if (editId) {
            const student = students.find(function(student) {
                return student.id === Number(editId);
            });
            student.name = name;
            student.email = email;
            student.phone = phone;
            student.dob = dob;
            student.gender = gender.value;
            student.course = course;
            student.skills = skillList;
            student.about = aboutText;
            if (photo) {
                student.photo = photo.name;
            }
            alert("Student updated successfully!");
            form.removeAttribute("data-edit-id");
            document.querySelector(
                'button[type="submit"]'
            ).textContent = "Register Student";
        }
        else {
            const student = {
                id: nextId++,
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                gender: gender.value,
                course: course,
                skills: skillList,
                about: aboutText,
                photo: photo.name
            };
            students.push(student);
            console.log(student);
            console.log(students);
            alert("Student registered successfully!");
        }
        displayStudents(students);
        form.reset();
        charCount.textContent = "0 / 200 characters";
    }
});
function showError(id, message) {
    const input = document.getElementById(id);
    input.classList.add("input-error");
    const error = document.createElement("p");
    error.className = "error";
    error.textContent = message;
    input.parentElement.appendChild(error);
}
function showFieldsetError(name, message) {
    const input = document.querySelector(
        'input[name="' + name + '"]'
    );
    const fieldset = input.closest("fieldset");
    const error = document.createElement("p");
    error.className = "error";
    error.textContent = message;
    fieldset.appendChild(error);
}
function removeErrors() {
    const errors = document.querySelectorAll(".error");
    errors.forEach(function(error) {
        error.remove();
    });
    const inputs = document.querySelectorAll(".input-error");
    inputs.forEach(function(input) {
        input.classList.remove("input-error");
    });
}
function displayStudents(list) {
    studentList.innerHTML = "";
    if (list.length === 0) {
        studentList.innerHTML = "<p>No students found</p>";
        return;
    }
    list.forEach(function(student) {
        const card = document.createElement("div");
        card.className = "student-card";
        card.setAttribute("data-id", student.id);
        card.innerHTML = `
            <h3>${student.name}</h3>
            <p>Email: ${student.email}</p>
            <p>Phone: ${student.phone}</p>
            <p>DOB: ${student.dob}</p>
            <p>Gender: ${student.gender}</p>
            <p>Course: ${student.course}</p>
            <p>Skills: ${student.skills.join(", ")}</p>
            <p>About: ${student.about}</p>
            <p>Photo: ${student.photo}</p>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;
        studentList.appendChild(card);
    });
}
studentList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-button")) {
        const card = event.target.closest(".student-card");
        const id = Number(
            card.getAttribute("data-id")
        );
        const answer = confirm(
            "Are you sure you want to delete this student?"
        );
        if (answer) {
            const index = students.findIndex(function(student) {
                return student.id === id;
            });
            if (index !== -1) {
                students.splice(index, 1);
                card.remove();
                console.log(students);
                if (students.length === 0) {
                    displayStudents(students);
                }
            }
        }
    }
    else if (event.target.classList.contains("edit-button")) {
        const card = event.target.closest(".student-card");
        const id = Number(
            card.getAttribute("data-id")
        );
        const student = students.find(function(student) {
            return student.id === id;
        });
        if (student) {
            document.getElementById("name").value = student.name;
            document.getElementById("email").value = student.email;
            document.getElementById("phone").value = student.phone;
            document.getElementById("dob").value = student.dob;
            document.getElementById("course").value = student.course;
            document.getElementById("about").value = student.about;
            const gender = document.querySelector(
                'input[name="gender"][value="' + student.gender + '"]'
            );
            gender.checked = true;
            const skills = document.querySelectorAll(
                'input[name="skills"]'
            );
            skills.forEach(function(skill) {
                if (student.skills.includes(skill.value)) {
                    skill.checked = true;
                }
                else {
                    skill.checked = false;
                }
            });
            charCount.textContent =
                student.about.length + " / 200 characters";
            document.querySelector(
                'button[type="submit"]'
            ).textContent = "Update Student";
            form.setAttribute(
                "data-edit-id",
                student.id
            );
            window.scrollTo(0, 0);
        }
    }
});
searchInput.addEventListener("input", function() {
    const searchText = searchInput.value.toLowerCase();
    const filteredStudents = students.filter(function(student) {
        return student.name.toLowerCase().includes(searchText);
    });
    displayStudents(filteredStudents);
});