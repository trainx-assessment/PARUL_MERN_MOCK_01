let name1=document.querySelector("#sn");
let email=document.querySelector("#e");
let phonenumber=document.querySelector("#pn");
let date=document.querySelector("#dob");
let course=document.querySelector("#co");
let form=document.querySelector("form");
let cardcont=document.querySelector(".cardcontainer");



// let namevalid=function(name1){
//       if(name1.length<3&&name1.length>40){
//         alert("Name is of invalid length");
//       }
//       for(let i=0;i<name1.length;i++){
//         let ch=name1.charAt(i);
//         if(ch>='0' && ch<=9){
//             alert("name should not contain number");
//             break;
//         }
//       }
//     return;
// } 
let arr=[];
//cars fomation
form.addEventListener('submit',(event)=>{
    event.preventDefault();
    let div=document.createElement('div');
    let but1=document.createElement('button');
    let but2=document.createElement('button');
    div.classList.add("card");
    div.innerHTML=`${name1.value}
    ${email.value}
    ${phonenumber.value}
    ${email.value}
    ${date.value}
    ${course.value}
    `
    div.append(but1);
    div.append(but2);
    cardcont.append(div);
})