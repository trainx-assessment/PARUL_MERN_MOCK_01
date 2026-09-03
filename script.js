let regst=document.querySelector("#regst");
let reset=document.querySelector("#reset")
let user=document.querySelector("#name");
let email=document.querySelector("#email");
let phone=document.querySelector("#ph");
let dob=document.querySelector("#dob");
let gender=document.querySelector("#gender");
let course=document.querySelector("#course");
let about=document.querySelector("#about");
let skills=document.querySelector("#skills");
const students=[];
let idx=0;
let id=1;

regst.addEventListener((onclick),()=>{
    let st={
        "id":id,
        "name":user.value,
        "email":email.value,
        "phone":phone.value,
        "dob":dob.vlaue,
        "gender":gender.value,
        "about":about.value,    
    };
    students[idx]=st;
    idx++;
    id++;
})

console.log(students)