let page2=document.querySelector(".page2");
let main=document.querySelector(".main");
let btn=document.querySelector("#toggle");
let textField=document.querySelector("input")
let age=document.querySelector("age");
let email=document.querySelector(".email");
const students = [];
let isdark=false;

if(isdark==false){
    btn.addEventListener("click",()=>{
        isdark=true;
        document.body.style.backgroundColor="black";
        document.body.style.color="white";
    })}

max.addEventListener("input",()=>{
    if(max.value.length>200){
        alert("Maximum 200 characters allowed");
    }
    
})

no.addEventListener("input",()=>{
    if(no.value.length!=10){
        alert("No more than 10 numbers");
    }
    
})
