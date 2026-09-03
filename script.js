const students=[];
let studentId=1;
const form=document.querySelector("form");
const name=document.getElementById("name");
const email=document.getElementById("email");
const phone=document.getElementById("phone");
const dob=document.getElementById("dob");
const course=document.getElementById("course");
const about=document.getElementById("about");
const photo=document.getElementById("photo");
const search=document.getElementById("search");
const filter=document.getElementById("filterCourse");
const studentList=document.querySelector(".student-list");
const counter=document.createElement("p");
counter.textContent="0/200";
about.parentNode.insertBefore(counter,about.nextSibling);
about.addEventListener("input",function(){
    counter.textContent=about.value.length+" / 200";
});
function showError(input,msg){
    let old=input.parentNode.querySelector(".error");
    if(old){
        old.remove();
    }
    let p=document.createElement("p");
    p.className="error";
    p.style.color="red";
    p.textContent=msg;
    input.parentNode.appendChild(p);
}
function removeError(input){
    let old=input.parentNode.querySelector(".error");
    if(old){
        old.remove();
    }
}
form.addEventListener("submit",function(e){
    e.preventDefault();
    let valid=true;
    let namePattern=/^[A-Za-z ]{3,40}$/;
    let emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern=/^[0-9]{10}$/;
    if(name.value.trim()===""){
        showError(name,"Name is required");
        valid=false;
    }
    else if(!namePattern.test(name.value.trim())){
        showError(name,"Enter a valid name");
        valid=false;
    }
    else{
        removeError(name);
    }
    if(email.value.trim()===""){
        showError(email,"Email is required");
        valid=false;
    }
    else if(!emailPattern.test(email.value.trim())){
        showError(email,"Enter a valid email");
        valid=false;
    }
    else{
        removeError(email);
    }
    if(phone.value.trim()===""){
        showError(phone,"Phone number is required");
        valid=false;
    }
    else if(!phonePattern.test(phone.value.trim())){
        showError(phone,"Phone must contain 10 digits");
        valid=false;
    }
    else{
        removeError(phone);
    }

    if(dob.value===""){
        showError(dob,"Date of birth is required");
        valid=false;
    }
    else{
        let birth=new Date(dob.value);
        let today=new Date();

        if(birth>today){
            showError(dob,"Future date is not allowed");
            valid=false;
        }
        else{
            let age=today.getFullYear()-birth.getFullYear();
            if(
                today.getMonth()<birth.getMonth() ||
                (today.getMonth()===birth.getMonth() &&
                today.getDate()<birth.getDate())
            ){
                age--;
            }
            if(age<15){
                showError(dob,"Age must be at least 15 years");
                valid=false;
            }
            else{
                removeError(dob);
            }
        }
    }
    let gender=document.querySelector('input[name="gender"]:checked');
    let genderBox=document.querySelector(".radio-group");
    if(!gender){
        showError(genderBox,"Select gender");
        valid=false;
    }
    else{
        removeError(genderBox);
    }
    if(course.value===""){
        showError(course,"Select a course");
        valid=false;
    }
    else{
        removeError(course);
    }
    let skills=document.querySelectorAll(".skills-group input:checked");
    let skillBox=document.querySelector(".skills-group");
    if(skills.length===0){
        showError(skillBox,"Select at least one skill");
        valid=false;
    }
    else{
        removeError(skillBox);
    }
    if(about.value.trim()===""){
        showError(about,"About student is required");
        valid=false;
    }
    else if(about.value.trim().length<20){
        showError(about,"Minimum 20 characters required");
        valid=false;
    }
    else{
        removeError(about);
    }

    if(photo.files.length===0){
        showError(photo,"Profile photo is required");
        valid=false;
    }
    else{
        let type=photo.files[0].type;
        if(type!=="image/jpeg" &&
           type!=="image/jpg" &&
           type!=="image/png"){
            showError(photo,"Only JPG, JPEG and PNG allowed");
            valid=false;
        }
        else{
            removeError(photo);
        }
    }

    if(!valid){
        return;
    }
    let skillArray=[];
    skills.forEach(function(item){
        skillArray.push(item.value);
    });
    let student={
        id:studentId++,
        name:name.value.trim(),
        email:email.value.trim(),
        phone:phone.value.trim(),
        dob:dob.value,
        gender:gender.value,
        course:course.value,
        skills:skillArray,
        about:about.value.trim(),
        photo:URL.createObjectURL(photo.files[0])
    };
    students.push(student);
    showStudents();
    updateStats();
    form.reset();
    counter.textContent="0 / 200";
    alert("Student registered successfully");
});
function showStudents(){
    studentList.innerHTML="";
    let text=search.value.toLowerCase();
    let selectedCourse=filter.value;
    students.forEach(function(student){
        if(
            !student.name.toLowerCase().includes(text) &&
            !student.email.toLowerCase().includes(text)
        ){
            return;
        }
        if(selectedCourse!=="" && student.course!==selectedCourse){
            return;
        }
        let card=document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id",student.id);
        let image=document.createElement("img");
        image.setAttribute("src",student.photo);
        image.setAttribute("alt",student.name);
        let title=document.createElement("h3");
        title.textContent=student.name;
        let emailText=document.createElement("p");
        emailText.textContent="Email: "+student.email;
        let phoneText=document.createElement("p");
        phoneText.textContent="Phone: "+student.phone;
        let dobText=document.createElement("p");
        dobText.textContent="DOB: "+student.dob;
        let genderText=document.createElement("p");
        genderText.textContent="Gender: "+student.gender;
        let courseText=document.createElement("p");
        courseText.textContent="Course: "+student.course;
        let skillText=document.createElement("p");
        skillText.textContent="Skills: "+student.skills.join(", ");
        let aboutText=document.createElement("p");
        aboutText.textContent="About: "+student.about;
        let edit=document.createElement("button");
        edit.textContent="Edit";
        edit.addEventListener("click",function(){
            editStudent(student.id);
        });
        let remove=document.createElement("button");
        remove.textContent="Delete";
        remove.addEventListener("click",function(){
            deleteStudent(student.id);
        });
        card.append(
            image,
            title,
            emailText,
            phoneText,
            dobText,
            genderText,
            courseText,
            skillText,
            aboutText,
            edit,
            remove
        );
        studentList.appendChild(card);
    });
}
function deleteStudent(id){
    for(let i=0;i<students.length;i++){
        if(students[i].id===id){
            students.splice(i,1);
            break;
        }
    }
    showStudents();
    updateStats();
}
function editStudent(id){
    let student=null;
    for(let i=0;i<students.length;i++){
        if(students[i].id===id){
            student=students[i];
            break;
        }
    }
    if(!student){
        return;
    }
    name.value=student.name;
    email.value=student.email;
    phone.value=student.phone;
    dob.value=student.dob;
    course.value=student.course;
    about.value=student.about;
    let gender=document.querySelector(
        'input[name="gender"][value="'+student.gender+'"]'
    );
    if(gender){
        gender.checked=true;
    }
    let allSkills=document.querySelectorAll(".skills-group input");

    allSkills.forEach(function(item){
        item.checked=student.skills.includes(item.value);
    });
    deleteStudent(id);
    counter.textContent=about.value.length+" / 200";
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}
function updateStats(){
    document.getElementById("totalStudents").textContent=students.length;
    let count={
        "web development":0,
        "uiux":0,
        "python":0,
        "data analytics":0,
        "mern":0,
        "cloud":0
    };
    students.forEach(function(student){
        count[student.course]++;
    });
    document.getElementById("webDevelopment").textContent=count["web development"];
    document.getElementById("uiux").textContent=count["uiux"];
    document.getElementById("python").textContent=count["python"];
    document.getElementById("dataAnalytics").textContent=count["data analytics"];
    document.getElementById("mern").textContent=count["mern"];
    document.getElementById("cloud").textContent=count["cloud"];
}
search.addEventListener("input",showStudents);
filter.addEventListener("change",showStudents);
form.addEventListener("reset",function(){
    setTimeout(function(){
        counter.textContent="0 / 200";
    },0);
});
updateStats();

