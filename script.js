let name =  document.getElementById("name");
let email =  document.getElementById("email");
let phone =  document.getElementById("number");
let dob =  document.getElementById("dob");
let gender = document.getElementById("gender");
let course = document.getElementById("course");
let skills = document.getElementsById("skill");
let about = document.getElementById("about");
let profile= document.getElementById("profile");



// data validation
for(let i=0;i<name.length;i++){
    if(name[i] === null){ 
        console.log("Invalid name")
    }
    if(name[i].length <40 && name[i].length <= 3){
        console.log("Invalid name")
    }
    if(name[i] === numeric){
        console.log("Invalid name")
    }
    if(name[i] === specialCharacter){
        console.log("Invalid name")
    }
}
for(let i=0;i<email.length;i++){
    if(email[i] === null){
        console.log("Invalid email")
    }else if(email[i] !== emailFormat){
        console.log("Invalid email")
    }else{
        continue
    }
}
for(let i=0;i<phone.length;i++){
    if(phone[i].length < 10 && phone[i].length > 10){
        console.log("Invalid phone number")
    }else if(phone[i] === alphabetic){
        console.log("Invalid phone number")
    }else if(phone[i] === specialCharacter){
        console.log("Invalid phone number")
    }else if(phone[i] === null){
        console.log("Invalid phone number")
    }else{
        continue
    }
}

for(let i=0;i<dob.length;i++){
    if(dob[i] === null){
        console.log("Invalid date of birth")
    }else if(dob[i] === futureDate){
        console.log("Invalid date of birth")
    }else if(dob[i] === calculatedAge < 15){
        console.log("Invalid date of birth")
    }else{
        continue;
    }
}

for(let i=0;i<gender.length;i++){
    if(gender[i] === null){
        console.log("Invalid gender")
    }else{
        continue;
    }
}

for(let i=0;i<course.length;i++){
    if(course[i] === null){
        console.log("Invalid Course");
    }
    if(course[i] ==="Select Course"){
        console.log("Invalid Course");
    }
}

for(let i=0;i<skills.length;i++){
    if(skills[i] < 1){
        console.log("Invalid skills");
    }
}

for(let i=0;i<about.length;i++){
    if(about[i] === null){
        console.log("Invalid about");
    }
    if(about[i].length< 20 || about.length > 200){
        console.log("Invalid about");
    }
    aboutInput.addEventListener("input", function () {
        charCount.textContent = `${aboutInput.value.length}/200`;
    });
}


for(let i =0;i<profile.length;i++){
    if(profile[i] === null){
        console.log("Invalid profile");
    }
    if(profile[i] !== imageFormat){
        console.log("Invalid profile");
    }
}

// create object to store student data
const students =[]

if(name && email && phone && dob && gender && course && skills && about && profile){
    student = {
        id: students.length + 1,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about,
        photo: profile
    }
    students.push(student);
}




function displayStudents() {
    const cardContainer = document.querySelector(".card");
    cardContainer.innerHTML = "";
    students.forEach(student => {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.innerHTML = `
            <img src="${student.photo}" alt="${student.name}">
            <h2>${student.name}</h2>
            <p>Email: ${student.email}</p>
            <p>Phone: ${student.phone}</p>
            <p>Date of Birth: ${student.dob}</p>
            <p>Gender: ${student.gender}</p>
            <p>Course: ${student.course}</p>
            <p>Skills: ${student.skills.join(", ")}</p>`;
        cardContainer.appendChild(card);
    });
}


