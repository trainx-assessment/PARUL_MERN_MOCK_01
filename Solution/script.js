
let form = document.querySelector(".form");
let nameee = document.querySelector("#Name");
let email = document.querySelector("#Email");
let number = document.querySelector("#Number");
let date = document.querySelector("#Date");
let gender = document.querySelector(".gender");
let course = document.querySelector("#Course");
let skills = document.querySelector(".skills");
let about = document. querySelector("#About");
let image = document.querySelector("#Image");
const students = [];

if(nameee.length === null || nameee.length < 3 || nameee.length > 40){
    console.log("Invalid");
}

if(!email.contains("@gmail.com")){
    console.log("Inavlid");
}

if(number.length !== 10){
    console.log("Invalid");
}