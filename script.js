const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const email = document.getElementById("studentEmail");
const phone = document.getElementById("studentPhone");
const dob = document.getElementById("dateOfBirth");
const course = document.getElementById("course");
const about = document.getElementById("aboutStudent");
const photo = document.getElementById("profilePhoto");
const counter = document.getElementById("characterCounter");
const studentCardsContainer = document.getElementById("studentCardsContainer");
const statisticsContainer = document.getElementById("statisticsContainer");
const registerButton = document.querySelector(".register-btn");

let editStudentId = null;
const students = [];

function showError(id, message){
document.getElementById(id).innerText = message;
}

function clearError(id){
document.getElementById(id).innerText = "";
}

function validateName(){
const nameValue = studentName.value.trim();
const pattern = /^[A-Za-z ]+$/;

if(nameValue === ""){
showError("nameError", "Name is required");
return false;
}

if(nameValue.length < 3 || nameValue.length > 40){
showError("nameError", "Name must be between 3 and 40 characters");
return false;
}

if(!pattern.test(nameValue)){
showError("nameError", "Only letters and spaces are allowed");
return false;
}

clearError("nameError");
return true;
}

function validateEmail(){
const emailValue = email.value.trim();

if(emailValue === ""){
showError("emailError", "Email is required");
return false;
}

if(!emailValue.includes("@") || !emailValue.includes(".")){
showError("emailError", "Enter a valid email");
return false;
}

clearError("emailError");
return true;
}

function validatePhone(){
const phoneValue = phone.value.trim();
const pattern = /^[0-9]{10}$/;

if(phoneValue === ""){
showError("phoneError", "Phone number is required");
return false;
}

if(!pattern.test(phoneValue)){
showError("phoneError", "Enter exactly 10 digits");
return false;
}

clearError("phoneError");
return true;
}

function validateDob(){
if(dob.value === ""){
showError("dobError", "Date of birth is required");
return false;
}

const selectedDate = new Date(dob.value);
const today = new Date();

if(selectedDate>today){
showError("dobError", "Future date is not allowed");
return false;
}

let age = today.getFullYear() - selectedDate.getFullYear();

if(age < 15){
showError("dobError", "Student must be at least 15 years old");
return false;
}

clearError("dobError");
return true;
}

function validateGender(){
const gender = document.querySelector('input[name="gender"]:checked');

if(gender === null){
showError("genderError", "Please select gender");
return false;
}

clearError("genderError");
return true;
}

function validateCourse(){
if(course.value === ""){
showError("courseError", "Please select a course");
return false;
}

clearError("courseError");
return true;
}

function validateSkills(){
const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');

if(selectedSkills.length === 0){
showError("skillsError", "Select at least one skill");
return false;
}

clearError("skillsError");
return true;
}

function validateAbout(){
const aboutValue = about.value.trim();

if(aboutValue === ""){
showError("aboutError", "About student is required");
return false;
}

if(aboutValue.length < 20){
showError("aboutError", "Write at least 20 characters");
return false;
}

clearError("aboutError");
return true;
}

function validatePhoto(){
if(editStudentId !== null && photo.files.length === 0){
clearError("photoError");
return true;
}

if(photo.files.length === 0){
showError("photoError", "Profile photo is required");
return false;
}

const file = photo.files[0];

if(file.type !== "image/jpeg" && file.type !== "image/png"){
showError("photoError", "Only JPG and PNG images are allowed");
return false;
}

clearError("photoError");
return true;
}

function updateStatistics(){
let webDevelopment = 0;
let uiux = 0;
let python = 0;
let dataAnalytics = 0;
let mernStack = 0;
let cloudComputing = 0;

students.forEach(function(student){
if(student.course==="Web Development"){
webDevelopment++;
}

if(student.course==="UI/UX"){
uiux++;
}

if(student.course === "Python"){
python++;
}

if(student.course === "Data Analytics"){
dataAnalytics++;
}

if(student.course === "MERN Stack"){
mernStack++;
}

if(student.course === "Cloud Computing"){
cloudComputing++;
}
});

statisticsContainer.innerHTML = "";

const statistics = [
"Total Students: " + students.length,
"Web Development: " + webDevelopment,
"UI/UX: " + uiux,
"Python: " + python,
"Data Analytics: " + dataAnalytics,
"MERN Stack: " + mernStack,
"Cloud Computing: " + cloudComputing
];

statistics.forEach(function(text){
const statCard = document.createElement("div");
statCard.classList.add("stat-card");
statCard.textContent = text;
statisticsContainer.appendChild(statCard);
});
}

function displayStudents(){
studentCardsContainer.innerHTML = "";

students.forEach(function(student){
const card = document.createElement("div");
card.classList.add("student-card");
card.setAttribute("data-id", student.id);

const image = document.createElement("img");
image.src = student.photo;
image.alt = student.name;
image.style.width = "100%";
image.style.height = "200px";
image.style.objectFit = "cover";

const nameHeading = document.createElement("h3");
nameHeading.textContent = student.name;

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
skillsText.textContent = "Skills: " + student.skills.join(", ");

const aboutText = document.createElement("p");
aboutText.textContent = "About: " + student.about;

const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.classList.add("edit-btn");

const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.classList.add("delete-btn");
card.appendChild(image);
card.appendChild(nameHeading);
card.appendChild(emailText);
card.appendChild(phoneText);
card.appendChild(dobText);
card.appendChild(genderText);
card.appendChild(courseText);
card.appendChild(skillsText);
card.appendChild(aboutText);
card.appendChild(editButton);
card.appendChild(deleteButton);

studentCardsContainer.appendChild(card);
});
}

function clearAllErrors(){
clearError("nameError");
clearError("emailError");
clearError("phoneError");
clearError("dobError");
clearError("genderError");
clearError("courseError");
clearError("skillsError");
clearError("aboutError");
clearError("photoError");
}

about.addEventListener("input", function(){
counter.innerText = about.value.length + " / 200";
validateAbout();
});

studentName.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
phone.addEventListener("input", validatePhone);
dob.addEventListener("change", validateDob);
course.addEventListener("change", validateCourse);
photo.addEventListener("change", validatePhoto);

const genders = document.querySelectorAll('input[name="gender"]');

genders.forEach(function(item){
item.addEventListener("change", validateGender);
});

const skills = document.querySelectorAll('input[name="skills"]');

skills.forEach(function(item){
item.addEventListener("change", validateSkills);
});

form.addEventListener("submit", function(event){
event.preventDefault();

const nameValid = validateName();
const emailValid = validateEmail();
const phoneValid = validatePhone();
const dobValid = validateDob();
const genderValid = validateGender();
const courseValid = validateCourse();
const skillsValid = validateSkills();
const aboutValid = validateAbout();
const photoValid = validatePhoto();

if(nameValid && emailValid && phoneValid && dobValid && genderValid && courseValid && skillsValid && aboutValid && photoValid){

const selectedGender = document.querySelector('input[name="gender"]:checked').value;

const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
const skillsArray = [];

selectedSkills.forEach(function(skill){
skillsArray.push(skill.value);
});

if(editStudentId !== null && photo.files.length === 0){

const studentIndex = students.findIndex(function(student){
return student.id === editStudentId;
});
students[studentIndex].name = studentName.value.trim();
students[studentIndex].email = email.value.trim();
students[studentIndex].phone = phone.value.trim();
students[studentIndex].dob = dob.value;
students[studentIndex].gender = selectedGender;
students[studentIndex].course = course.value;
students[studentIndex].skills = skillsArray;
students[studentIndex].about = about.value.trim();

editStudentId = null;
registerButton.textContent = "Register Student";

displayStudents();
updateStatistics();

alert("Student updated successfully!");

form.reset();
counter.innerText = "0 / 200";
clearAllErrors();

}else{

const file = photo.files[0];
const reader = new FileReader();

reader.onload = function(){

const student = {
id: editStudentId === null ? Date.now() : editStudentId,
name: studentName.value.trim(),
email: email.value.trim(),
phone: phone.value.trim(),
dob: dob.value,
gender: selectedGender,
course: course.value,
skills: skillsArray,
about: about.value.trim(),
photo: reader.result
};

if(editStudentId === null){

students.push(student);
alert("Student registered successfully!");

}else{

const studentIndex = students.findIndex(function(item){
return item.id === editStudentId;
});

students[studentIndex] = student;
editStudentId = null;
registerButton.textContent = "Register Student";

alert("Student updated successfully!");
}

displayStudents();
updateStatistics();

form.reset();
counter.innerText = "0 / 200";
clearAllErrors();
};

reader.readAsDataURL(file);
}
}
});

studentCardsContainer.addEventListener("click", function(event){

if(event.target.classList.contains("delete-btn")){

const card = event.target.closest(".student-card");
const studentId = Number(card.getAttribute("data-id"));

const confirmDelete = confirm("Are you sure you want to delete this student?");

if(confirmDelete){

const studentIndex = students.findIndex(function(student){
return student.id === studentId;
});

students.splice(studentIndex, 1);

displayStudents();
updateStatistics();
}
}

if(event.target.classList.contains("edit-btn")){

const card = event.target.closest(".student-card");
const studentId = Number(card.getAttribute("data-id"));

const student = students.find(function(item){
return item.id === studentId;
});

studentName.value = student.name;
email.value = student.email;
phone.value = student.phone;
dob.value = student.dob;
course.value = student.course;
about.value = student.about;

genders.forEach(function(item){
if(item.value === student.gender){
item.checked = true;
}
});

skills.forEach(function(item){
item.checked = student.skills.includes(item.value);
});

editStudentId = studentId;

registerButton.textContent = "Update Student";

counter.innerText = about.value.length + " / 200";

clearAllErrors();
}
});

updateStatistics();