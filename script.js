
const arr = [];

const form = document.getElementById("#form")
const name = document.getElementById("#name");
const email = document.getElementById("#email");
const number = document.getElementById("#number");
const birthDate = document.getElementById("#bdate");
const gender = document.getElementsByClassName(".gender");
const course = document.getElementsById("#course");
const skills = document.getElementsByClassName(".skills");
const about = document.getElementsById("#about");
const image = document.getElementsById("#image");
const submit = document.getElementById("#register");
const reset = document.getElementById("#reset");

let err1 = "Your name length atleast 3";
let err2 = "write correct email";
let err3 = "enter valid phone number";

if(name.length()<3){
    return err1;
}
if(!email.contains("@gmail.com")){
    return err2;
}
if(number.length()>11){
    return err3;
}

const div = document.createElement("#card");

submit.addEventListener('onClick',()=>{

    

});

