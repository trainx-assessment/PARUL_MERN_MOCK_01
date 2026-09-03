function validateName(name){
    let check = /^[a-zA-Z\s]+$/
    if(!check.test(name.value.trim())){
       alert("name is invalid") 
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

function validatePhone(phone) {
    let phoneValue = phone.value.trim();
    if (phoneValue.length !== 10) {
        alert("Please enter a valid 10-digit phone number");
        return false;
    }
    return true;
}
function validateDOB(dob) {
    let dobValue = dob.value;
    if (!dobValue) {
        alert("Please select a date of birth");
        return false;
    }else if(new Date(dobValue) > new Date()) {
        alert("Date of birth cannot be in the future");
        return false;
    }
    else if(new Date(dobValue) > new Date('2011-09-02')) {
        alert("age should be greater than 15");
        return false;
    }

    
    return true;
}

students = []
const submit = document.querySelector('.lele')
submit.addEventListener('click',(event)=>{
    event.preventDefault();
    let name = document.querySelector('.name')
    if(!validateName(name)){
        return;
    }
    let genderarr = document.getElementsByName('gender')
    let phnno = document.querySelector('.phnno')
    if(!validatePhone(phnno)){
        return;
    }
    let dob = document.querySelector('.dob')
    if(!validateDOB(dob)){
        return;
    }
    let gender=null;
    genderarr.forEach((ele)=>{
        if(ele.checked){
            gender = ele.defaultValue;
        }
    })
    if(gender==null){
        alert("Please select a gender");
        return;
    }
    let course = document.querySelector('.course')
    if(course.value=="null"){
        alert("Please select a course");
        return;
    }
    let skills = []
    let skillarr = document.querySelectorAll(".checkbox")
    console.log(skillarr);
    skillarr.forEach((ele)=>{
        if(ele.checked){
            skills.push(ele.defaultValue);
        }
    })
    const pfp = document.querySelector('.pfp').value
    console.log(pfp)
    let extt = pfp.split(".")
    let ext = extt[extt.length-1]
    if(!(ext==="jpg" || ext==="jpeg" || ext==="png")){
        alert("File Type Wrong")
    }
    students.push(`{
        "name":"${name.value}",
        "gender":"${gender}",
        "phone":"${phnno.value}",
        "dob":"${dob.value}",
        "course":"${course.value}",
        "skills":"${skills}",
        "pfp":"${pfp}"
    }`)
})
