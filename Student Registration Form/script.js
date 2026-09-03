const form = document.querySelector("#studentForm");

const studentName = document.querySelector("#studentName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const course = document.querySelector("#course");
const about = document.querySelector("#about");
const photo = document.querySelector("#photo");

const studentContainer = document.querySelector("#studentContainer");

const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");

const searchInput = document.querySelector("#searchInput");
const filterCourse = document.querySelector("#filterCourse");

const counter = document.querySelector("#counter");
const noStudents = document.querySelector("#noStudents");

const darkModeBtn = document.querySelector("#darkModeBtn");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const gender = document.querySelector('input[name="gender"]:checked').value;
    const skills = [];

    document.querySelectorAll('input[name="skills"]:checked').forEach(function (item) { skills.push(item.value);
    });

    const file = photo.files[0];
    if (editId === null) {
        const reader = new FileReader();
        reader.onload = function () {

            const student = {id: Date.now(), name: studentName.value.trim(),email: email.value.trim(),phone: phone.value.trim(),dob: dob.value,gender: gender,course: course.value,
                skills: skills,about: about.value.trim(),photo: reader.result };

            students.push(student);
            saveStudents();
            renderStudents();
            updateStats();

            resetForm();
};

 reader.readAsDataURL(file);
}
 else {
        const student = students.find(function (item) {
                return item.id === editId;
            });
        student.name = studentName.value.trim();
        student.email = email.value.trim();
        student.phone = phone.value.trim();
        student.dob = dob.value;
        student.gender = gender;
        student.course = course.value;
        student.skills = skills;
        student.about = about.value.trim();

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                student.photo = reader.result;
                saveStudents();
                renderStudents();
                updateStats();
                resetForm();
            };
            reader.readAsDataURL(file);
        } else {
            saveStudents();
            renderStudents();
            updateStats();
            resetForm();
        }
    }
});

function validateForm() {
    clearErrors();
    let valid = true;

    const nameRegex = /^[A-Za-z ]{3,40}$/;
    if (!nameRegex.test(studentName.value.trim())) {
        document.querySelector("#nameError").textContent =
            "Name must contain 3-40 letters only.";
        valid = false;
    }
    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value.trim())) {
        document.querySelector("#emailError").textContent ="Enter a valid email.";
        valid = false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        document.querySelector("#phoneError").textContent ="Phone must contain exactly 10 digits.";
        valid = false;
    }

    if (dob.value === "") {
        document.querySelector("#dobError").textContent ="Date of birth is required.";
        valid = false;
    } else {
        const birthDate = new Date(dob.value);
        const today = new Date();

        if (birthDate > today) {
            document.querySelector("#dobError").textContent ="Future date is not allowed.";
            valid = false;
        }

        let age =today.getFullYear() -birthDate.getFullYear();
        const month =today.getMonth()- birthDate.getMonth();

        if (month < 0 ||(month === 0 &&today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 15) {
            document.querySelector("#dobError").textContent ="Student must be at least 15 years old.";
             valid = false;
        }
    }

    const gender =document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        document.querySelector("#genderError").textContent ="Select gender.";
        valid = false;
    }

    
    if (course.value === "") {
        document.querySelector("#courseError").textContent ="Select a course.";
        valid = false;
    }

    const selectedSkills =document.querySelectorAll('input[name="skills"]:checked');
    if (selectedSkills.length === 0) {
        document.querySelector("#skillsError").textContent ="Select at least one skill.";
        valid = false;
    }

    const aboutText = about.value.trim();
    if (aboutText.length < 20 || aboutText.length > 200) {
        document.querySelector("#aboutError").textContent ="About must contain 20-200 characters.";
        valid = false;
    }

    if (editId === null && photo.files.length === 0) {
        document.querySelector("#photoError").textContent ="Profile photo is required.";
        valid = false;
    }

     else if(photo.files.length > 0) {
        const file = photo.files[0];
        if (!file.type.startsWith("image/")) {
            document.querySelector("#photoError").textContent ="Only image files are allowed.";
            valid = false;
        }
    }
    return valid;
}


/* Clear Errors */
function clearErrors() {
    document.querySelectorAll("small").forEach(
        function (item) {item.textContent = "";
        }
    );
}

about.addEventListener("input",function () {
    counter.textContent =
        about.value.length + " / 200";
});


function renderStudents() {
    studentContainer.innerHTML = "";
    const searchText =searchInput.value.toLowerCase();
     const selectedCourse =filterCourse.value;
    const filteredStudents = students.filter(
        function (student) {
            const nameMatch =student.name.toLowerCase().includes(searchText);
            const courseMatch =selectedCourse === "" ||student.course === selectedCourse;
            return nameMatch && courseMatch;
        }
    );
    if (filteredStudents.length === 0) {
        noStudents.style.display = "block";
    } 
    else {
        noStudents.style.display = "none";
    }

    filteredStudents.forEach(function (student) {
        const card =document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id",student.id);
        const image =document.createElement("img");

        image.src = student.photo;
        image.alt = student.name;

        const heading =document.createElement("h3");
        heading.textContent = student.name;

        const emailText =document.createElement("p");
        emailText.textContent ="Email: " + student.email;

        const phoneText =document.createElement("p");
        phoneText.textContent ="Phone: " + student.phone;

        const dobText =document.createElement("p");
        dobText.textContent ="DOB: " + student.dob;

        const genderText =document.createElement("p");
        genderText.textContent ="Gender: " + student.gender;


        const courseText = document.createElement("p");
        courseText.textContent ="Course: " + student.course;

        const skillsText =document.createElement("p");
        skillsText.textContent ="Skills: " + student.skills.join(", ");

        const aboutText =document.createElement("p");
        aboutText.textContent ="About: " + student.about;

        const buttons =document.createElement("div");
        buttons.classList.add("card-buttons");
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        const deleteButton =document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        buttons.append(
            editButton,
            deleteButton
        );

        card.append(image,heading,emailText,phoneText,dobText,genderText,courseText,skillsText,aboutText,buttons);
        studentContainer.appendChild(card);
    });
}

/* Event Delegation */
studentContainer.addEventListener("click",function (event) {
const card =event.target.closest(".student-card");

        if (!card) {
            return;
        }
        const id =Number(card.dataset.id);

        /* Delete */
        if (event.target.classList.contains("delete-btn")) {
            const confirmDelete =confirm("Are you sure you want to delete this student?");

            if (!confirmDelete) {
                return;
            }
            students =students.filter(function (student) {
                        return student.id !== id;
                    });
            saveStudents();
            renderStudents();
            updateStats();
        }
        /* Edit */
        if (event.target.classList.contains("edit-btn")) {
            editStudent(id);
        }
    });


/* Edit Student */
function editStudent(id) {
    const student =students.find(function (item) {
                return item.id === id;
            });
    if (!student) {
        return;
    }

    editId = id;
    studentName.value = student.name;
    email.value = student.email;
    phone.value = student.phone;
    dob.value = student.dob;
    course.value = student.course;
    about.value = student.about;

    counter.textContent =about.value.length + " / 200";
    document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
    document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
     checkbox.checked =student.skills.includes(checkbox.value);
    });
    submitBtn.textContent ="Update Student";
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* Reset */
resetBtn.addEventListener("click",resetForm);
function resetForm() {
    form.reset();
    clearErrors();
    counter.textContent = "0 / 200";
    editId = null;
    submitBtn.textContent ="Register Student";
}

searchInput.addEventListener("input",renderStudents);
filterCourse.addEventListener("change",renderStudents);
/* Statistics */

function updateStats() {
    document.querySelector("#totalStudents").textContent = students.length;
    document.querySelector("#webCount").textContent = countCourse("Web Development");
    document.querySelector("#uiuxCount").textContent = countCourse("UI/UX");
    document.querySelector("#pythonCount").textContent = countCourse("Python");
    document.querySelector("#dataCount").textContent = countCourse("Data Analytics");
    document.querySelector("#mernCount").textContent = countCourse("MERN Stack");
    document.querySelector("#cloudCount").textContent = countCourse("Cloud Computing");
}


function countCourse(courseName) {
    return students.filter(function (student) {
            return student.course === courseName;
        }
    ).length;
}

/* localStorage */
function saveStudents() {
    localStorage.setItem("students",JSON.stringify(students)
    );
}

darkModeBtn.addEventListener("click",function () {

        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeBtn.textContent ="Light Mode";
        } 
        else{
            darkModeBtn.textContent ="Dark Mode";
        }
    });
renderStudents();
updateStats();