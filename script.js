const userform = document.querySelector(".studentdetails");
const userdata = document.querySelector(".saveinfo");
const submitbtn = document.querySelector(".submit-btn")
submitbtn.addEventListener('submit', (e)=>{
    let fullname = document.querySelector(".name").textContent;
    let email = document.querySelector(".email").textContent;
    let phone =document.querySelector(".phone").textContent;
    let dob = document.querySelector(".dob").textContent;
    let gender = document.querySelector(".gender").textContent;
    let course = document.querySelector(".course").textContent;
    let skills = document.querySelector("skillsection").textContent;
    let about = document.querySelector(".about").textContent;
    
    let students = {
        id: 1,
        name: 'fullname',
        mail: 'email',
        number: 'phone',
        birthdate: 'dob',
        gender: 'gender',
        courses: 'course',
        skill: 'skills'
    }
    console.log(student1);
    if(fullnamename.length < 3 && fullnamename.length>40 && fullname.includes(Number)){
        throw new Error("enter valid name");
        
    }
    if(!email.includes('@')){
        throw new Error("enter a valid email");
    }
    if(phone.length<10 || !phone.includes(Number)){
        throw new Error("enter a valid number");
    }
    if(gender == ""){
        throw new Error("choose an gender");        
    }
    if(course == "Select Course"){
        throw new Error("select course first")
    }
    if(skills == ""){
        throw new Error("select atleast 1 skill");
        
    }

    let i1 = document.querySelector(".in1").textContent = fullname;
    let i2 = document.querySelector(".in1").textContent = fullname;


})