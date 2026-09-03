const form=document.querySelector("registeration-form")
const name=document.querySelector('registeration-form input[type:"text"]')
const email=document.querySelector('registeration-form input[type:"email"]')
const number=document.querySelector('registeration-form input[type:"number"]')
const dateofBirth=document.querySelector('registeration-form input[type:"date"]')
const skill=document.querySelector('registeration-form input[type:"checkbox"]')
const submit=document.querySelector("submit")
const reset=document.querySelector("reset")
const students=[];
const id=0;
submit.addEventListener("click",(e)=>{
    const student={
        id:id+1,
        name:name.value,
        email:email.value,
        number:number.value,
        dateofBirth:dateofBirth.value,
        skill:skill.checked
    }
    students.push(student);
})
reset.addEventListener("click",(e)=>{
    name.value="";
    email.value="";
    number.value="";
    dateofBirth.value="";
    skill.checked=false;
})

document.createElement("div")

