const form=document.getElementById("studentForm");
const studentName=document.getElementById("studentName");
const email=document.getElementById("email");
const phone=document.getElementById("phone");
const dob=document.getElementById("dob");
const course=document.getElementById("course");
const about=document.getElementById("about");
const photo=document.getElementById("photo");
const studentContainer=document.getElementById("studentContainer");
const searchInput=document.getElementById("searchInput");
const courseFilter=document.getElementById("courseFilter");
const submitBtn=document.getElementById("submitBtn");
const resetBtn=document.getElementById("resetBtn");
const charCounter=document.getElementById("charCounter");
const themeBtn=document.getElementById("themeBtn");

let students=JSON.parse(localStorage.getItem("students"))||[];
let editId=null;

dob.max=new Date().toISOString().split("T")[0];

about.addEventListener("input",()=>{
charCounter.textContent=about.value.length;
});

function error(id,message){
document.getElementById(id).textContent=message;
}

function clearErrors(){
document.querySelectorAll(".error").forEach(e=>e.textContent="");
}

function getSkills(){
return [...document.querySelectorAll('input[name="skills"]:checked')].map(e=>e.value);
}

function validate(isEdit=false){
clearErrors();
let valid=true;
const name=studentName.value.trim();
const mail=email.value.trim();
const ph=phone.value.trim();
const aboutText=about.value.trim();
const gender=document.querySelector('input[name="gender"]:checked');
const skills=getSkills();

if(!name){
error("nameError","Name is required");
valid=false;
}else if(name.length<3||name.length>40){
error("nameError","Name must be 3-40 characters");
valid=false;
}else if(!/^[A-Za-z ]+$/.test(name)){
error("nameError","Only letters and spaces allowed");
valid=false;
}

if(!mail){
error("emailError","Email is required");
valid=false;
}else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){
error("emailError","Enter a valid email");
valid=false;
}

if(!/^\d{10}$/.test(ph)){
error("phoneError","Phone must contain exactly 10 digits");
valid=false;
}

if(!dob.value){
error("dobError","Date of birth is required");
valid=false;
}else if(new Date(dob.value)>new Date()){
error("dobError","Future date is not allowed");
valid=false;
}

if(!gender){
error("genderError","Select gender");
valid=false;
}

if(!course.value){
error("courseError","Select a course");
valid=false;
}

if(skills.length===0){
error("skillsError","Select at least one skill");
valid=false;
}

if(!aboutText){
error("aboutError","About student is required");
valid=false;
}else if(aboutText.length<20){
error("aboutError","Minimum 20 characters required");
valid=false;
}

if(!isEdit&&photo.files.length===0){
error("photoError","Profile photo is required");
valid=false;
}

if(photo.files.length>0){
const file=photo.files[0];
if(!["image/jpeg","image/png"].includes(file.type)){
error("photoError","Only JPG, JPEG and PNG allowed");
valid=false;
}
}

return valid;
}

function readImage(file){
return new Promise((resolve,reject)=>{
const reader=new FileReader();
reader.onload=()=>resolve(reader.result);
reader.onerror=()=>reject(reader.error);
reader.readAsDataURL(file);
});
}

form.addEventListener("submit",async e=>{
e.preventDefault();

if(!validate(editId!==null))return;

const gender=document.querySelector('input[name="gender"]:checked').value;
let image="";

if(photo.files.length>0){
image=await readImage(photo.files[0]);
}else if(editId!==null){
const oldStudent=students.find(s=>s.id===editId);
image=oldStudent.photo;
}

if(editId!==null){
const student=students.find(s=>s.id===editId);
student.name=studentName.value.trim();
student.email=email.value.trim();
student.phone=phone.value.trim();
student.dob=dob.value;
student.gender=gender;
student.course=course.value;
student.skills=getSkills();
student.about=about.value.trim();
student.photo=image;
}else{
students.push({
id:Date.now(),
name:studentName.value.trim(),
email:email.value.trim(),
phone:phone.value.trim(),
dob:dob.value,
gender:gender,
course:course.value,
skills:getSkills(),
about:about.value.trim(),
photo:image
});
}

saveStudents();
updateStatistics();
renderStudents();
resetForm();
});

function saveStudents(){
localStorage.setItem("students",JSON.stringify(students));
}

function renderStudents(){
studentContainer.innerHTML="";

const search=searchInput.value.trim().toLowerCase();
const selectedCourse=courseFilter.value;

const result=students.filter(student=>{
const nameMatch=student.name.toLowerCase().includes(search);
const courseMatch=selectedCourse==="All"||student.course===selectedCourse;
return nameMatch&&courseMatch;
});

if(result.length===0){
studentContainer.innerHTML='<div class="no-students">No students found</div>';
return;
}

result.forEach(student=>{
const card=document.createElement("div");
card.className="student-card";
card.dataset.id=student.id;

card.innerHTML=`
<img class="student-photo" src="${student.photo}" alt="${student.name}">
<div class="student-info">
<h3>${student.name}</h3>
<p><strong>Email:</strong> ${student.email}</p>
<p><strong>Phone:</strong> ${student.phone}</p>
<p><strong>DOB:</strong> ${student.dob}</p>
<p><strong>Gender:</strong> ${student.gender}</p>
<p><strong>Course:</strong> ${student.course}</p>
<div class="skills"><strong>Skills:</strong> ${student.skills.map(skill=>`<span class="skill">${skill}</span>`).join("")}</div>
<p><strong>About:</strong> ${student.about}</p>
<div class="card-buttons">
<button type="button" class="edit-btn">Edit</button>
<button type="button" class="delete-btn">Delete</button>
</div>
</div>`;

studentContainer.appendChild(card);
});
}

function updateStatistics(){
document.getElementById("totalStudents").textContent=students.length;
document.getElementById("webDevelopmentCount").textContent=students.filter(s=>s.course==="Web Development").length;
document.getElementById("uiuxCount").textContent=students.filter(s=>s.course==="UI/UX").length;
document.getElementById("pythonCount").textContent=students.filter(s=>s.course==="Python").length;
document.getElementById("dataAnalyticsCount").textContent=students.filter(s=>s.course==="Data Analytics").length;
document.getElementById("mernCount").textContent=students.filter(s=>s.course==="MERN Stack").length;
document.getElementById("cloudCount").textContent=students.filter(s=>s.course==="Cloud Computing").length;
}

studentContainer.addEventListener("click",e=>{
const card=e.target.closest(".student-card");
if(!card)return;

const id=Number(card.dataset.id);

if(e.target.classList.contains("delete-btn")){
if(confirm("Are you sure you want to delete this student?")){
students=students.filter(s=>s.id!==id);
saveStudents();
renderStudents();
updateStatistics();
}
}

if(e.target.classList.contains("edit-btn")){
editStudent(id);
}
});

function editStudent(id){
const student=students.find(s=>s.id===id);
if(!student)return;

editId=id;
studentName.value=student.name;
email.value=student.email;
phone.value=student.phone;
dob.value=student.dob;
course.value=student.course;
about.value=student.about;
charCounter.textContent=about.value.length;

document.querySelectorAll('input[name="gender"]').forEach(radio=>{
radio.checked=radio.value===student.gender;
});

document.querySelectorAll('input[name="skills"]').forEach(checkbox=>{
checkbox.checked=student.skills.includes(checkbox.value);
});

submitBtn.textContent="Update Student";
clearErrors();

window.scrollTo({top:0,behavior:"smooth"});
}

function resetForm(){
form.reset();
clearErrors();
editId=null;
submitBtn.textContent="Register Student";
charCounter.textContent="0";
}

resetBtn.addEventListener("click",resetForm);

searchInput.addEventListener("input",renderStudents);
courseFilter.addEventListener("change",renderStudents);

themeBtn.addEventListener("click",()=>{
document.body.classList.toggle("dark-mode");
themeBtn.textContent=document.body.classList.contains("dark-mode")?"Light Mode":"Dark Mode";
});

renderStudents();
updateStatistics();