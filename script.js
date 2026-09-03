// student array
const students = [];
let editId = null;

const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("photo");
const studentContainer =document.getElementById("studentContainer");
const searchInput =document.getElementById("searchInput");
const filterCourse =document.getElementById("filterCourse");

const submitButton =document.getElementById("submitButton");

const resetButton =document.getElementById("resetButton");

const charCount=document.getElementById("charCount");

about.addEventListener("input",function(){
    charCount.textContent =about.value.length + " / 200";
});

function clearErrors() {
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("dobError").textContent = "";
    document.getElementById("genderError").textContent = "";
    document.getElementById("courseError").textContent = "";
    document.getElementById("skillsError").textContent = "";
    document.getElementById("aboutError").textContent = "";
    document.getElementById("photoError").textContent = "";
}

function validateForm() {
    clearErrors();
    let valid = true;

    /* Name */
    const nameRegex = /^[A-Za-z ]+$/;
    if(studentName.value.trim() === "") {
        document.getElementById("nameError").textContent ="Name is required";
        valid = false;
    }else if(studentName.value.trim().length<3) {
        document.getElementById("nameError").textContent="Name must have at least 3 characters";
        valid = false;
    }else if(studentName.value.trim().length > 40) {
        document.getElementById("nameError").textContent ="Name cannot have more than 40 characters";
        valid = false;
    }else if(!nameRegex.test(studentName.value.trim())) {
        document.getElementById("nameError").textContent= "Only letters and spaces are allowed";
        valid = false;
    }

    /* Email */
    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {
        document.getElementById("emailError").textContent ="Email is required";
        valid = false;
    }else if(!emailRegex.test(email.value.trim())) {
        document.getElementById("emailError").textContent ="Enter a valid email";
        valid = false;
    }

    /* Phone */
    const phoneRegex = /^\d{10}$/;
    if (phone.value.trim() === "") {
           document.getElementById("phoneError").textContent="Phone number is required";
        valid = false;
    }else if(!phoneRegex.test(phone.value.trim())) {
        document.getElementById("phoneError").textContent="Phone number must contain 10 digits";
        valid = false;
    }
    /* Date */
    if(dob.value === "") {
        document.getElementById("dobError").textContent="Date of birth is required";
        valid = false;
    }else{
        const birthDate = new Date(dob.value);
        const today = new Date();
        if (birthDate > today) {
            document.getElementById("dobError").textContent="Future date is not allowed";
            valid = false;
        }
    }

    /* Gender */
    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );
    if(gender===null) {
        document.getElementById("genderError").textContent="Please select gender";
        valid = false;
    }

    /* Course */
    if(course.value === "") {
        document.getElementById("courseError").textContent ="Please select a course";
        valid = false;
    }

    /* Skills */
    const selectedSkills =
        document.querySelectorAll(
            'input[name="skills"]:checked'
        );
    if(selectedSkills.length === 0) {
        document.getElementById("skillsError").textContent ="Select at least one skill";
        valid = false;
    }

    /* About */
    if(about.value.trim() === "") {
           document.getElementById("aboutError").textContent="About student is required";

        valid = false;
    }else if (about.value.trim().length < 20) {
        document.getElementById("aboutError").textContent ="Minimum 20 characters required";
        valid = false;
    }

    /* Photo */
    if(editId === null && photo.files.length === 0) {
        document.getElementById("photoError").textContent ="Profile photo is required";
        valid = false;
    }

    if(photo.files.length > 0) {
        const fileType = photo.files[0].type;
        if(fileType !== "image/jpeg" && fileType !== "image/png"
        ){
            document.getElementById("photoError").textContent ="Only JPG, JPEG and PNG files are allowed";
            valid = false;
        }
    }
    return valid;
}

function getPhoto(file) {
    return new Promise(function (resolve) {
        if (!file) {
            resolve("");
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.readAsDataURL(file);
    });
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    /* Get Gender */
    const gender =
        document.querySelector('input[name="gender"]:checked').value;

    /* Get Skills */
    const skills = [];
    const checkedSkills =document.querySelectorAll('input[name="skills"]:checked');
    checkedSkills.forEach(function (skill) {
        skills.push(skill.value);
    });

    /* Get Photo */
    let photoData = "";
    if (photo.files.length > 0) {
        photoData=await getPhoto(photo.files[0]);
    }

    if (editId !== null) {
        const student =students.find(function(student){
                return student.id === editId;
            });

        student.name =studentName.value.trim();
        student.email = email.value.trim();
        student.phone =phone.value.trim();
        student.dob=dob.value;
        student.gender=gender;
        student.course=course.value;
        student.skills=skills;
        student.about=about.value.trim();
        if (photoData !== "") {
            student.photo=photoData;
        }

        editId = null;
        submitButton.textContent ="Register Student";
    }
    else {
        const student = {
            id: Date.now(),
            name: studentName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            dob: dob.value,
            gender: gender,
            course: course.value,
            skills: skills,
            about: about.value.trim(),
            photo: photoData
        };
        students.push(student);
    }
    resetForm();
    displayStudents();
    updateStatistics();
});

function displayStudents() {
    studentContainer.innerHTML = "";
    const searchValue =searchInput.value.toLowerCase();
    const selectedCourse =filterCourse.value;
    let foundStudents = [];

    /* Search  and Filter */
    students.forEach(function (student) {
        const nameMatches =student.name.toLowerCase().includes(searchValue);

        const courseMatches = selectedCourse === "" ||student.course === selectedCourse;

        if (nameMatches && courseMatches) foundStudents.push(student);  
    });

    /* No Students */
    if (foundStudents.length === 0) {
        const message =document.createElement("p");
        message.classList.add("no-students");
        message.textContent ="No students found";
        studentContainer.appendChild(message);
        return;
    }
    /* Create Cards */
    foundStudents.forEach(function (student) {
        const card =document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute(
            "data-id",student.id
        );
        /* Image */

        const image=document.createElement("img");
        image.src=student.photo;
        image.alt=student.name;
        /* Name */
        const heading=document.createElement("h3");
        heading.textContent=student.name;

        /* Email */
        const emailText= document.createElement("p");
        emailText.textContent ="Email: " + student.email;

        /* Phone */
        const phoneText =document.createElement("p");
        phoneText.textContent ="Phone: " + student.phone;

        /* DOB */
        const dobText =document.createElement("p");
        dobText.textContent ="DOB: " + student.dob;

        /* Gender */
        const genderText =document.createElement("p");
        genderText.textContent ="Gender: " + student.gender;

        /* Course */
        const courseText =document.createElement("p");

        courseText.textContent ="Course: " + student.course;

        /* Skills */
        const skillsText =document.createElement("p");
        skillsText.textContent = "Skills: " + student.skills.join(", ");

        /* About */
        const aboutText =document.createElement("p");
        aboutText.textContent ="About: " + student.about;

        /* Buttons */
        const buttons =document.createElement("div");
        buttons.classList.add("card-buttons");

        const editButton =document.createElement("button");
        editButton.textContent ="Edit";
        editButton.classList.add("edit-btn");

        const deleteButton =document.createElement("button");

        deleteButton.textContent ="Delete";
        deleteButton.classList.add("delete-btn");

        /* Add Buttons */
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);

        /* Add Content to Card */
        card.appendChild(image);
        card.appendChild(heading);
        card.appendChild(emailText);
        card.appendChild(phoneText);
        card.appendChild(dobText);
        card.appendChild(genderText);
        card.appendChild(courseText);
        card.appendChild(skillsText);
        card.appendChild(aboutText);
        card.appendChild(buttons);

        /* Add Card to Container */
        studentContainer.appendChild(card);
    });
}

studentContainer.addEventListener(
    "click",
    function(event) {
        const card =event.target.closest(".student-card");
        if(!card) return;

        const id= Number(card.getAttribute("data-id"));

        /* Delete */
        if(event.target.classList.contains("delete-btn")){
            const answer =confirm("Are you sure you want to delete this student?");
            if(!answer) return;
             const index =students.findIndex(function (student) {
                return student.id === id;
            });

            if(index!==-1) students.splice(index, 1);
            displayStudents();
            updateStatistics();
        }
        /* Edit */
        if (event.target.classList.contains("edit-btn")) {
            const student =
                students.find(function(student) {
                        return student.id === id;
                    }
                );
            if (!student) return;

            fillForm(student);

            editId =student.id;
            submitButton.textContent ="Update Student";
            window.scrollTo(0,0);
        }
    }
);


function fillForm(student) {
    studentName.value =student.name;
    email.value =student.email;
    phone.value =student.phone;
    dob.value =student.dob;
    course.value =student.course;
    about.value =student.about;

    /* Gender */
    const genderButtons =document.querySelectorAll('input[name="gender"]');

    genderButtons.forEach(function(button){
            if (button.value === student.gender) {
                button.checked = true;
            } else {
                button.checked = false;
            }
        }
    );

    /* Skills */
    const skillButtons =document.querySelectorAll('input[name="skills"]');

    skillButtons.forEach(
        function(button){
            if (student.skills.includes(button.value)) {
                button.checked = true;
            }else{
                  button.checked = false;
            }
        }
    );
    charCount.textContent =about.value.length + " / 200";
    clearErrors();
}

function resetForm() {
    form.reset();
    clearErrors();
    charCount.textContent ="0 / 200";
    editId = null;
    submitButton.textContent = "Register Student";
}

resetButton.addEventListener("click",function () {resetForm();});

searchInput.addEventListener("input",function () {displayStudents();});

filterCourse.addEventListener("change",function (){displayStudents();});

function updateStatistics(){
    document.getElementById("totalStudents").textContent=students.length;
    let webCount = 0;
    let uiuxCount = 0;
    let pythonCount = 0;
    let dataCount = 0;
    let mernCount = 0;
    let cloudCount = 0;

    students.forEach(function(student){
            if(student.course ==="Web Development") {
                webCount++;
            }
            if(student.course ==="UI/UX"){
              uiuxCount++;
            }
            if(student.course ==="Python"){
                  pythonCount++;
            }
            if(student.course ==="Data Analytics"){
                dataCount++;
            }
            if(student.course ==="MERN Stack"){
                mernCount++;
            }
            if(student.course ==="Cloud Computing"){
                cloudCount++;
            }
        }
    );
    document.getElementById("webCount").textContent = webCount;
    document.getElementById("uiuxCount").textContent = uiuxCount;
    document.getElementById("pythonCount").textContent = pythonCount;
    document.getElementById("dataCount").textContent = dataCount;
    document.getElementById("mernCount").textContent = mernCount;
    document.getElementById("cloudCount").textContent = cloudCount;
}
displayStudents();
updateStatistics();

