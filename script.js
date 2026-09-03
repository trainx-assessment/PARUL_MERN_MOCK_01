//submit button selector

let submit = document.querySelector('#submit');

//reset button selector

let reset = document.querySelector('#reset');

//total students selector

let totalStudents = document.getElementById("totalStudents");

//counter of total student register yet

let studentCount = 0;

//counter of deleted students

let deletedNumberOfStudent = 0;

//name input from form selector

let name = document.getElementById("name");

//email input from form selector

let email = document.getElementById("email");

//phone input from form selector

let phone = document.getElementById("phone");

//dob input from form selector

let dob = document.getElementById("dob");

//gender input from form selector

let gender = document.querySelectorAll('.gend');

//skills input from form selector

let skills = document.querySelectorAll('.skills');

//course input from form selector

let course = document.querySelector('.Course');

//profile picture input from form selector

let pfp = document.querySelector('.pfp');

//about input from form selector

let about = document.getElementById("about");

//record html area

let recordArea = document.querySelector('.rec');

//students container selector

let studentsContainer = document.getElementById("studentsContainer");

//record array of objects to store all the student data

let studentRecords = [];

//function to validate name input

function validateName() {

    let canContain = /^[a-zA-Z\s]+$/;

    if (!canContain.test(name.value.trim())) {

        alert("Name can only contain letters and spaces");

        return false;

    }

    let nameValue = name.value.trim();

    if(nameValue.length > 40) {

        alert("Name cannot exceed 40 characters");

        return false;

    }

    if(nameValue.length < 3) {

        alert("Name must be at least 3 characters long");

        return false;

    }

    if (nameValue === "") {

        alert("Name is required");

        return false;

    }

    return true;

}

//function to validate email input

function validateEmail() {

    let emailValue = email.value.trim();

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {

        alert("Please enter a valid email address");

        return false;

    }

    return true;

}

//function to validate phone input

function validatePhone() {

    let phoneValue = phone.value.trim();

    if (phoneValue.length !== 10) {

        alert("Please enter a valid 10-digit phone number");

        return false;

    }

    return true;

}

//function to validate date of birth input

function validateDOB() {

    let dobValue = dob.value;

    if (!dobValue) {

        alert("Please select a date of birth");

        return false;

    } else if(new Date(dobValue) > new Date()) {

        alert("Date of birth cannot be in the future");

        return false;

    } else if(new Date(dobValue) > new Date('2011-09-02')) {

        alert("Date of birth cannot be before 15 years from today");

        return false;

    }

    return true;

}

//event listener for submit button click

submit.addEventListener('click',(event)=>{

    event.preventDefault();

    if (!validateName()) {
        return;
    }

    if (!validateEmail()) {
        return;
    }

    if (!validatePhone()) {
        return;
    }

    if (!validateDOB()) {
        return;
    }

    console.log(gender.value);

    const course = document.querySelector('.Course').value;

    if (course === "Select Course") {

        alert("Select a course");
        return;

    }

    let skillsArray = [];

    skills.forEach((skill)=>{

        if(skill.checked){

            skillsArray.push(skill.value);

        }

    });

    if(skillsArray.length == 0){

        alert("At least one skill is required");

        return;

    }

    console.log(skillsArray);

    let gen;

    gender.forEach((g)=>{

        if(g.checked){

            gen = g.value;

        }

    });

    if(gen == null){

        alert("Gender is required");

        return;

    }

    const pfp = document.querySelector('.pfp').value;

    console.log(pfp);

    let extt = pfp.split(".");

    let ext = extt[extt.length-1];

    if(pfp !== "" && !(ext==="jpg" || ext==="jpeg" || ext==="png")){

        alert("File Type Wrong");

        return;

    }

    //taking all the input values and storing them in an object

    let student = {

        id: studentCount + 1,

        name: name.value,

        email: email.value,

        phone: phone.value,

        dob: dob.value,

        gender: gen,

        skills: skillsArray,

        course: course,

        pfp: pfp,

        about: about.value

    };

    console.log(student);

    let newDiv = document.createElement('div');

    newDiv.innerHTML = `
                        <h3>${student.name}</h3>
                        <h5>${student.id}</h5>
                        <p>Email: ${student.email}</p>
                        <p>Phone: ${student.phone}</p>
                        <p>Date of Birth: ${student.dob}</p>
                        <p>Gender: ${student.gender}</p>
                        <p>Skills: ${student.skills.join(', ')}</p>
                        <p>Course: ${student.course}</p>`;

    studentsContainer.appendChild(newDiv);

    studentCount++;

    totalStudents.textContent = studentCount - deletedNumberOfStudent;

    studentRecords.push(student);

    console.log(studentRecords);

    let editbutton = document.createElement('button');

    editbutton.innerHTML = "Edit";

    let deletebutton = document.createElement('button');

    deletebutton.innerHTML = "Delete";

    newDiv.appendChild(deletebutton);

    newDiv.appendChild(editbutton);

    editbutton.addEventListener('click', () => {

        name.value = student.name;

        email.value = student.email;

        phone.value = student.phone;

        dob.value = student.dob;

        about.value = student.about;

        course.value = student.course;

        gender.forEach((g) => {

            g.checked = g.value === student.gender;

        });

        skills.forEach((skill) => {

            skill.checked = student.skills.includes(skill.value);

        });

        newDiv.remove();

        studentRecords = studentRecords.filter((s) => s.id !== student.id);

    });

    deletebutton.addEventListener('click', () => {

        newDiv.remove();

        deletedNumberOfStudent++;

        totalStudents.textContent =
            studentCount - deletedNumberOfStudent;

        studentRecords = studentRecords.filter((s) => s.id !== student.id);

    });

});