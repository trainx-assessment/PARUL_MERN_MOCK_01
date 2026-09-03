let name = document.getElementById("name").value.trim();
let email = document.getElementById("email").value.trim();
let phone = document.getElementById("phone").value.trim();
let dob = document.getElementById("dob");
let gender = document.getElementById("gender");
let course = document.getElementById("course").value;
let skill = document.getElementById("skill").value;
let about = document.getElementById("about").value.trim();
let s_btn = document.getElementsByClassName("s_btn");
let f_btn = document.getElementsByClassName("f_btn");
let form = document.getElementById("form");
let next_id = 1 ;
const students = [];
form.addEventListener("submit" , function(event){

if(name === ""){
    alert("Name is required")
    return;
}

 if (name.length < 3) {
    valid = false;
    alert("Name must be at least 3 characters");
}

if (name.length > 40) {
    valid = false;
    alert("Name cannot exceed 40 characters");
}

if(!/^[A-Za-z ]+$/.text(name)){
    alert("Only letters and spaces allowed")
    return ;
}

if(email === ""){
    alert("Email is required");
    return ;
}
if(phone === ""){
    alert("Phone Number required")
    return ;
}

if(!/^[0-9]{10}$/.test(phone)){
    alert("Enter Correct phone number")
    return ;
}

const b_date = new Date(dob);
const today = new Date();

if(b_date > today) {
    alert("Future date is not allowed");
    return;
}

if(!gender) {
    alert("Please select a gender");
    return;
}

if(course === ""){
    alert("Please select a course")
    return ;
}

if(skill === ""){
    alert("Slect atleast one skill")
    return ;
}

if(about === ""){
    alert("About student is required")
    return ;
}

if(about.length < 20 && about.length > 200){
    alert("About must be between 20 and 200 characters")
}

if(photo.length === 0){
    alert("Profile photo is required");
    return ;
}


const student = {
    id: next_id++,
    name: name,
    email: email,
    phone: phone,
    dob: dob,
    gender: gender.value,
    course: course,
    skills: skill,
    about: about,
    photo: photo
};
students.push(student);


})