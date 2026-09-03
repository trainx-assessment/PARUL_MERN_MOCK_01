const studentForm=document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const about=document.querySelector("#about");
const submitBtn = document.querySelector("#submitBtn");
const resetBtn=document.querySelector("#resetBtn");
const photoInput = document.querySelector("#photo");

let students=JSON.parse(localStorage.getItem("students")) || [];
let editId = null;


function showError(id,message){
    document.querySelector("#"+id).textContent=message;
}

function clearErrors(){
    const errors=document.querySelectorAll(".error");

    errors.forEach(function(item){
        item.textContent = "";
    });
}

function getGender(){
    let gender=document.querySelector('input[name="gender"]:checked');

    if(gender){
        return gender.value;
    }

    return "";
}

function getSkills(){
    let skills = [];

    document.querySelectorAll('input[name="skills"]:checked').forEach(function(item){
        skills.push(item.value);
    });

    return skills;
}


function validateForm(){

    clearErrors();

    let ok=true;

    const name=document.querySelector("#studentName").value.trim();
    let email = document.querySelector("#email").value.trim();
    const phone=document.querySelector("#phone").value.trim();

    let namePattern=/^[A-Za-z ]+$/;
    const phonePattern = /^[0-9]{10}$/;
    let emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(name==""){
        showError("nameError","Name is required");
        ok=false;
    }
    else if(name.length < 3 || !namePattern.test(name)){
        showError("nameError","Enter a valid name");
        ok = false;
    }

    if(email==""){
        showError("emailError","Email is required");
        ok=false;
    }
    else if(!emailPattern.test(email)){
        showError("emailError","Enter a valid email");
        ok = false;
    }

    if(phone == ""){
        showError("phoneError","Phone is required");
        ok = false;
    }
    else if(!phonePattern.test(phone)){
        showError("phoneError","Enter 10 digit phone number");
        ok=false;
    }

    return ok;
}


function saveStudents(){
    localStorage.setItem("students",JSON.stringify(students));
}


function updateStats(){

    document.querySelector("#totalStudents").textContent=students.length;

    let web=0;
    let ui = 0;
    let python=0;
    let data=0;
    let mern = 0;
    let cloud=0;

    students.forEach(function(student){

        if(student.course=="Web Development"){
            web++;
        }

        if(student.course == "UI/UX"){
            ui++;
        }

        if(student.course=="Python") python++;

        if(student.course == "Data Analytics"){
            data++;
        }

        if(student.course=="MERN Stack") mern++;

        if(student.course == "Cloud Computing"){
            cloud++;
        }
    });

    document.querySelector("#webCount").textContent=web;
    document.querySelector("#uiCount").textContent = ui;
    document.querySelector("#pythonCount").textContent=python;
    document.querySelector("#dataCount").textContent=data;
    document.querySelector("#mernCount").textContent = mern;
    document.querySelector("#cloudCount").textContent=cloud;
}


function makeCard(student){

    let card=document.createElement("div");
    card.classList.add("student-card");
    card.dataset.id=student.id;

    let image=document.createElement("img");
    image.src=student.photo || "";
    image.alt=student.name + " photo";

    let name=document.createElement("h3");
    name.textContent=student.name;

    let email = document.createElement("p");
    email.textContent="Email: "+student.email;

    let phone=document.createElement("p");
    phone.textContent = "Phone: "+student.phone;

    let course=document.createElement("p");
    course.textContent="Course: "+(student.course || "Not given");

    let edit=document.createElement("button");
    edit.textContent="Edit";
    edit.classList.add("edit-btn");

    let del = document.createElement("button");
    del.textContent = "Delete";
    del.classList.add("delete-btn");

    card.append(image,name,email,phone,course,edit,del);

    return card;
}


function displayStudents(){

    studentContainer.innerHTML="";

    let list = students;


    if(list.length==0){

        let msg=document.createElement("p");
        msg.textContent="No students found";

        studentContainer.appendChild(msg);
        return;
    }

    list.forEach(function(student){
        studentContainer.appendChild(makeCard(student));
    });
}


function resetForm(){

    studentForm.reset();
    clearErrors();

    editId=null;
    submitBtn.textContent="Register Student";
}


function readPhoto(file,callback){

    if(!file){
        callback("");
        return;
    }

    let reader=new FileReader();

    reader.onload=function(){
        callback(reader.result);
    };

    reader.readAsDataURL(file);
}


studentForm.addEventListener("submit",function(event){

    event.preventDefault();

    if(!validateForm()){
        return;
    }

    let studentData={

        name:document.querySelector("#studentName").value.trim(),
        email: document.querySelector("#email").value.trim(),
        phone:document.querySelector("#phone").value.trim(),
        dob:document.querySelector("#dob").value,
        gender:getGender(),
        course: document.querySelector("#course").value,
        skills:getSkills(),
        about:about.value.trim()
    };


    if(editId!=null){

        let student=students.find(function(item){
            return item.id==editId;
        });

        Object.assign(student,studentData);

        readPhoto(photoInput.files[0],function(photo){

            if(photo!=""){
                student.photo=photo;
            }

            saveStudents();
            displayStudents();
            updateStats();
            resetForm();
        });

    }
    else{

        let newStudent={

            id:Date.now(),
            name:studentData.name,
            email:studentData.email,
            phone:studentData.phone,
            dob:studentData.dob,
            gender:studentData.gender,
            course:studentData.course,
            skills:studentData.skills,
            about:studentData.about,
            photo:""
        };

        readPhoto(photoInput.files[0],function(photo){

            newStudent.photo=photo;
            students.push(newStudent);

            saveStudents();
            displayStudents();
            updateStats();
            resetForm();
        });
    }
});


resetBtn.addEventListener("click",function(){

    resetForm();

});


studentContainer.addEventListener("click",function(event){

    let card=event.target.closest(".student-card");

    if(!card){
        return;
    }

    let id=Number(card.dataset.id);


    if(event.target.classList.contains("delete-btn")){

        if(confirm("Are you sure you want to delete this student?")){

            students=students.filter(function(student){
                return student.id!=id;
            });

            saveStudents();
            displayStudents();
            updateStats();
        }
    }


    if(event.target.classList.contains("edit-btn")){

        let student=students.find(function(item){
            return item.id==id;
        });

        document.querySelector("#studentName").value=student.name;
        document.querySelector("#email").value = student.email;
        document.querySelector("#phone").value=student.phone;
        document.querySelector("#dob").value=student.dob;
        document.querySelector("#course").value=student.course;

        about.value=student.about;


        document.querySelectorAll('input[name="gender"]').forEach(function(item){

            item.checked=item.value==student.gender;

        });


        document.querySelectorAll('input[name="skills"]').forEach(function(item){
            item.checked=student.skills.includes(item.value);
        });


        editId=student.id;
        submitBtn.textContent = "Update Student";

        
    }

});


displayStudents();
updateStats();