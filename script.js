let submit = document.querySelector('#submit');
let reset = document.querySelector('#reset');
let totalStudents = document.getElementById("totalStudents");
let studentCount = 0;
let name = document.getElementById("name");
let email =document.getElementById("email")
let phone =document.getElementById("phone");
let dob = document.getElementById("dob");

let gender = document.querySelectorAll('.gend');

let skills = document.querySelectorAll('.skills');

let about = document.getElementById("about")

// let photo = document.getElementById("photo").files[0];

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


function validateEmail() {
    let emailValue = email.value.trim();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    
    if (!emailPattern.test(emailValue)) {
        alert("Please enter a valid email address");
        return false;
    }
    return true;
}


function validatePhone() {
    let phoneValue = phone.value.trim();
    if (phoneValue.length !== 10) {
        alert("Please enter a valid 10-digit phone number");
        return false;
    }
    return true;
}

function validateDOB() {
    let dobValue = dob.value;
    if (!dobValue) {
        alert("Please select a date of birth");
        return false;
    }else if(new Date(dobValue) > new Date()) {
        alert("Date of birth cannot be in the future");
        return false;
    }
    else if(new Date(dobValue) > new Date('2011-09-02')) {
        alert("Date of birth cannot be before 15 years from today");
        return false;
    }

    
    return true;
}

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
    const course = document.querySelector('.Course').value

    if (course === "Select Course") {
        alert("Select a course")
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
    const pfp = document.querySelector('.pfp').value
    console.log(pfp)
    let extt = pfp.split(".")
    let ext = extt[extt.length-1]
    if(!(ext==="jpg" || ext==="jpeg" || ext==="png")){
        alert("File Type Wrong")
    }
    console.log(gen);
})