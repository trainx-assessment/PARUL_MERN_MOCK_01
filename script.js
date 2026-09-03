let students=[];
let form=document.getElementById("studentForm");
let studentBox=document.getElementById("students");
let search=document.getElementById("search");
form.addEventListener("submit",function(event){
    event.preventDefault();
    let name=document.getElementById("name").value.trim();
    let namePattern =/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    if(name.length<3 ||name.length>40 ||!namePattern.test(name)){
        alert("Student name must be 3-40 characters");
        return;
    }
    let email=document.getElementById("email").value.trim();
    let emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
        alert("Please enter a valid email address");
        return;
    }
    let phone=document.getElementById("phone").value.trim();
    let phonePattern=/^[0-9]{10}$/;
    if(!phonePattern.test(phone)){
        alert("Phone number must contain exactly 10 digits");
        return;
    }
    let student={
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: document.getElementById("dob").value,
        profilePhoto: profilePhoto.name,
        gender: document.getElementById("gender").value,
        course: document.getElementById("course").value,
        about: document.getElementById("about").value
    };
    if(student.name=="" || student.email=="" ||student.course==""){
        alert("Please fill required fields");
        return;
    }
    students.push(student);
    displayStudents();
});
function displayStudents(){
    studentBox.innerHTML="";
    let text=search.value.toLowerCase();
    students
        .filter(student=>student.name.toLowerCase().includes(text))
        .forEach(student=>{
            let card=document.createElement("div");
            card.className="card";
            card.innerHTML=`
                <h3>${student.name}</h3>
                <p>Email: ${student.email}</p>
                <p>Phone: ${student.phone}</p>
                <p>Course: ${student.course}</p>
                <p>${student.about}</p>
                <button class="delete" onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            `;
            studentBox.appendChild(card);
        });
}
function deleteStudent(id){
    students=students.filter(student=>student.id!==id);
    displayStudents();
}
search.addEventListener("input",displayStudents);