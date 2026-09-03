const students = [];
let nameInput = document.getElementById("name")
let emailInput = document.getElementById("email")
let noInput =   document.getElementById("Phone Number")
let birthInput = document.getElementById("birth")
let genderInput = document.getElementById("Gender")

  form.addEventListener("submit",function (e){
    let name = nameInput.value;
    let email = emailInput.value;
    let no = no.value;
    let birth = birthInput.value;
    let gender = genderInput.value;
    if(name="" || email="" || no="" || birth="" || gender=""){
        alert("please fill required fields.");
        return;
    } 

    let student ={
        name = name;
        email = email;
        no = no;
    }
    students.push(student);

   
   )};