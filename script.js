let form = document.getElementById("studentForm");
let studentContainer =document.getElementById("studentContainer");
let searchInput = document.getElementById("searchInput");
let courseFilter =document.getElementById("courseFilter");

let about = document.getElementById("about");
let charCount = document.getElementById("charCount");
let totalStudents =document.getElementById("totalStudents");
let webCount =document.getElementById("webCount");
let uiuxCount =document.getElementById("uiuxCount");
let pythonCount = document.getElementById("pythonCount");
let dataCount =document.getElementById("dataCount");
let mernCount =document.getElementById("mernCount");
let cloudCount =document.getElementById("cloudCount");
let students = [];
let editId = null;-
about.addEventListener("input", function () {
    let length = about.value.length;
    charCount.textContent = length;
});
form.addEventListener("submit", function (event) {
    event.preventDefault();
   let studentName = document.getElementById("studentName").value.trim();
    let email =document.getElementById("email").value.trim();
    let phone =document.getElementById("phone").value.trim();
    let dob =document.getElementById("dob").value;
    let gender = document.querySelector(
            'input[name="gender"]:checked'
        );
    let course =document.getElementById("course").value;
    let skills =
        document.querySelectorAll(
            'input[name="skills"]:checked'
        );
    let aboutText =about.value.trim();
    let photo = document.getElementById("photo").files[0];

    let namePattern = /^[A-Za-z ]+$/;
    if (studentName === "") {
        alert("Please enter student name");
        return;
    }

    if (studentName.length < 3 ||
        studentName.length > 40) {
        alert("Name must be between 3 and 40 characters");
        return;
    }

    if (!namePattern.test(studentName)) {
        alert("Name should contain only letters and spaces");
        return;
    }
    let emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        alert("Please enter email");
        return;
    }
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email");
        return;
    }
    let phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        alert("Phone number must contain exactly 10 digits");
        return;
    }
    if (dob === "") {
        alert("Please select date of birth");
        return;
    }
    let birthDate = new Date(dob);
    let today = new Date();
    if (birthDate > today) {
        alert("Date of birth cannot be in the future");
        return;
    }
    let age =today.getFullYear() -birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (
            month === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--;
    }
    if (age < 15) {
        alert("Student must be at least 15 years old");
        return;
    }
    if (!gender) {
        alert("Please select gender");
        return;
    }
    if (course === "") {
        alert("Please select a course");
        return;
    }
    if (skills.length === 0) {
        alert("Please select at least one skill");
        return;
    }
    if (aboutText === "") {
        alert("Please write something about the student");
        return;
    }
    if (aboutText.length < 20) {
        alert("About Student must contain at least 20 characters");
        return;
    }
    if (aboutText.length > 200) {
        alert("About Student cannot exceed 200 characters");
        return;
    }
    if (!photo && editId === null) {
        alert("Please select a profile photo");
        return;
    }
    if (photo) {
        if (!photo.type.startsWith("image/")) {
            alert("Please select an image file only");
            return;
        }
    }
    let skillArray = [];
    skills.forEach(function (skill) {
        skillArray.push(skill.value);
    });
    if (editId === null) {
        let student = {
            id: Date.now(),
            name: studentName,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender.value,
            course: course,
            skills: skillArray,
            about: aboutText,
            photo: ""
        };
        if (photo) {
            student.photo = URL.createObjectURL(photo);

        }
        students.push(student);
        alert("Student registered successfully");
    }
    else {
        let studentIndex =students.findIndex(function (student) {
             return student.id === editId;
            });
        if (studentIndex !== -1) {
            students[studentIndex].name =studentName;
            students[studentIndex].email =email;
            students[studentIndex].phone =phone;
            students[studentIndex].dob = dob;
            students[studentIndex].gender =gender.value;
            students[studentIndex].course = course;
            students[studentIndex].skills =skillArray;
            students[studentIndex].about = aboutText;
            if (photo) {
                students[studentIndex].photo = URL.createObjectURL(photo);
            }
            alert("Student updated successfully");
        }
    }
    displayStudents();
    updateStatistics();
    resetForm();

});
function displayStudents() {
    studentContainer.innerHTML = "";
    let searchText = searchInput.value.toLowerCase();
    let selectedCourse = courseFilter.value;
    let filteredStudents = students.filter(function (student) {
            let nameMatch =student.name.toLowerCase().includes(searchText);
            let courseMatch =selectedCourse === "All" ||student.course === selectedCourse;
            return nameMatch && courseMatch;
        });
    if(filteredStudents.length === 0) {
        studentContainer.innerHTML =
            "<p>No students found</p>";
        return;
    }
    filteredStudents.forEach(function (student) {
        createStudentCard(student);
    });
}
function createStudentCard(student) {
    let card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute(
        "data-id",
        student.id
    );
    let image =document.createElement("img");
    image.src = student.photo;
    image.alt = student.name;

    let name = document.createElement("h3");
    name.textContent =student.name;
    let email = document.createElement("p");
    email.textContent = "Email: " + student.email;
    let phone = document.createElement("p");
    phone.textContent ="Phone: " + student.phone;

    let dob =document.createElement("p");
    dob.textContent = "DOB: " + student.dob;
  
    let gender =document.createElement("p");
    gender.textContent = "Gender: " + student.gender;

    let course =document.createElement("p");
    course.textContent = "Course: " + student.course;

    let skills =document.createElement("p");
    skills.textContent = "Skills: " +student.skills.join(", ");

    let about =document.createElement("p");
    about.textContent ="About: " + student.about;

    let editButton =document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    let deleteButton =document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    let buttonContainer =document.createElement("div");
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(dob);
    card.appendChild(gender);
    card.appendChild(course);
    card.appendChild(skills);
    card.appendChild(about);
    card.appendChild(buttonContainer);
    studentContainer.appendChild(card);

}

studentContainer.addEventListener(
    "click",
    function (event) {
        let clickedButton =event.target;

        let card = clickedButton.closest(
                ".student-card"
            );
        if (!card) {
            return;

        }
        let id = Number(card.dataset.id);
        if (
            clickedButton.classList.contains(
                "delete-btn"
            )
        ) {
            let confirmDelete = confirm("Are you sure you want to delete this student?");
            if (!confirmDelete) {
                return;
            }
            students =students.filter(function (student) {
                    return student.id !== id;
                });
            displayStudents();
            updateStatistics();

        }
        if (
            clickedButton.classList.contains(
                "edit-btn"
            )
        ) {
            editStudent(id);

        }
    }
);

function editStudent(id) {
    let student = students.find(function (student) {
            return student.id === id;
        });
    if (!student) {
        return;
    }
    editId = id;
    document.getElementById("studentName").value = student.name;
    document.getElementById("email").value =student.email;
    document.getElementById("phone").value =student.phone;
    document.getElementById("dob").value =student.dob;
    let genderRadio =document.querySelector(
            'input[name="gender"][value="' +
            student.gender +
            '"]'
        );
    if (genderRadio) {
        genderRadio.checked = true;

    }
    document.getElementById("course").value =
        student.course;
    let allSkills =
        document.querySelectorAll(
            'input[name="skills"]'
        );
    allSkills.forEach(function (skill) {
        if (
            student.skills.includes(
                skill.value
            )
        ) {
            skill.checked = true;

        } else {
            skill.checked = false;
        }
    });
    about.value =student.about;
    charCount.textContent =student.about.length;
    
    document.getElementById("submitBtn").textContent = "Update Student";
    form.scrollIntoView({
        behavior: "smooth"
    });

}

searchInput.addEventListener(
    "input",
    function () {
        displayStudents();

    }
);
courseFilter.addEventListener(
    "change",
    function () {
        displayStudents();

    }
);

function updateStatistics() {
    totalStudents.textContent =
        students.length;
    let web = 0;
    let uiux = 0;
    let python = 0;
    let data = 0;
    let mern = 0;
    let cloud = 0;
    students.forEach(function (student) {
        if (student.course === "Web Development") {
            web++;
        }
        if (student.course === "UI/UX") {
            uiux++;
        }
        if (student.course === "Python") {
            python++;
        }
        if (student.course === "Data Analytics") {
            data++;
        }
        if (student.course === "MERN Stack") {
            mern++;
        }
        if (student.course === "Cloud Computing") {
            cloud++;
        }
    });
    webCount.textContent = web;
    uiuxCount.textContent = uiux;
    pythonCount.textContent = python;
    dataCount.textContent = data;
    mernCount.textContent = mern;
    cloudCount.textContent = cloud;

}
function resetForm() {
    form.reset();
    editId = null;
    charCount.textContent = "0";
    document.getElementById("submitBtn").textContent =
        "Register Student";

}
form.addEventListener(
    "reset",
    function () {
        editId = null;
        charCount.textContent = "0";
        document.getElementById("submitBtn").textContent =
            "Register Student";
    }
);
displayStudents();
updateStatistics();