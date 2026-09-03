let form = document.querySelector("#StudentForm");
let toogle = document.querySelector("#toogle");
const students = [];
let edit=null;

// toogle.addEventListener('click',()=>{
//     body.style.color="black";
// })
form.addEventListener("submit",(data)=>{
    data.preventDefault();

    const name = document.querySelector("#StudentName").value.trim();
    const email = document.querySelector("#Email").value.trim();
    const phoneNumber = document.querySelector("#PhoneNumber").value.trim();
    const DOB = document.querySelector("#DOB").value;
    const gender=document.querySelector("input[name='gender']:checked")?.value;
    const course = document.querySelector("#course").value;
    const skills = Array.from(document.querySelectorAll("input[name='skills']:checked")).map(skill=>skill.value);
    const about = document.querySelector("#about").value.trim();
    const photo = document.querySelector("#photo").files[0];

    let isValid = true;

    if(!validateName(name)){
        showValidateMessage(document.querySelector("#StudentName"),"Name must be 30-40 char");
        isValid=false;
    }
    if(!validateEmail(email)){
        showValidateMessage(document.querySelector("#Email"),"Enter a valid email address");
        isValid=false;
    }
    if(!validatePhone(phoneNumber)){
        showValidateMessage(document.querySelector("#PhoneNumber"),"Enter a valid number (exactly 10 digits)");
        isValid=false;
    }
    if(!validateDOB(DOB)){
        showValidateMessage(document.querySelector("#DOB"),"Enter a valid DOB");
        isValid=false;
    }
    if(!gender){
        showValidateMessage(document.querySelector("#gender"),
        "Select a Gender"
    );
    isValid=false;
    }
    if(!validateCourse(course)){
        showValidateMessage(document.querySelector("#course"),
        "Select a Gender"
    );
    isValid=false;
    }
    if(!validateSkills(skills)){
        showValidateMessage(document.querySelector("#skills"),
        "Select at least one skills"
    );
    isValid=false;
    }
    if(!validateAbout(about)){
        showValidateMessage(document.querySelector("#about"),
        "minimum 20 characters and maximum 200 characters are allowed"
    )
    }
    if(!validatePhoto(photo)){
        showValidateMessage(document.querySelector("#photo"),
        "profie photo is required only images file type is supported"
    );
    isValid=false;
    }
    if(isValid){
        if(edit){
            const student = students.find(s=>s.id===
                edit
            );
            student.name=name;
            student.email=email;
            student.phone=phoneNumber;
            student.dob=DOB;
            student.gender=gender;
            student.course=course;
            student.skills=skills;
            student.about=about;
            student.photo=URL.createObjectURL(photo);
            edit=null;
            document.querySelector("#RegisterBtn").textContent="Register Student";
        }else{
            const id = Date.now();
            students.push({id,name,email,phone: phoneNumber,dob: DOB,gender,course,skills,about,photo:URL.createObjectURL(photo)});
        }
        updateUI();
        form.reset();
    }
});

function validateName(name){
    return name.length >= 3 && name.length <= 40;
}
function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePhone(phone){
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}
function validateDOB(dob){
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const isFutureDate = dobDate > today;
    return dobDate < today && !isFutureDate;
}
function validateCourse(course){
    return course !== "";
}
function validateSkills(skills){
    return skills.length > 0;
}
function validateAbout(about){
    return about.length >= 20 && about.length <= 200;
}
function validatePhoto(photo){
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    return photo && allowedTypes.includes(photo.type);
}
function showValidateMessage(inputElement, message){
    const errorElement = inputElement.nextElementSibling;
    errorElement.textContent = message;
    errorElement.style.display = "block";
}
function clearValidateMessage(inputElement){
    const errorElement = inputElement.nextElementSibling;
    errorElement.textContent = "";
    errorElement.style.display = "none";
}
function updateUI(){
    renderStudents(students);
}
function renderStudents(students){
    const studentContainer = document.querySelector("#student-card-cont");
    studentContainer.innerHTML = "";
    students.forEach(student => {
        const studentCard = document.createElement("div");
        studentCard.className = "student-card";
        studentCard.innerHTML = `
            <h3>${student.name}</h3>
            <p>Email: ${student.email}</p>
            <p>Phone: ${student.phone}</p>
            <p>DOB: ${student.dob}</p>
            <p>Gender: ${student.gender}</p>
            <p>Course: ${student.course}</p>
            <p>Skills: ${student.skills.join(", ")}</p>
            <p>About: ${student.about}</p>
            <img src="${student.photo}" alt="Profile Photo">
        `;
        studentContainer.appendChild(studentCard);
    });
}
