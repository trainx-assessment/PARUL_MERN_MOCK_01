

let students=[];


const form =document.getElementById("studentForm");
const result =document.getElementById("result");


form.addEventListener("submit",function(event){


    event.preventDefault();

    const name=document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

  
    const phone=document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;

    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value.trim();

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

   
    if (name === "") {
        alert("Name is required");
        return;
    }
    if(email=== "") {
        alert("Email is required");
        return;
    }
    if (phone.length!=10){
        alert("Phone must contain 10 digits");
        return;
    }
    if (dob ==="") {
        alert("Date of birth is required");
        return;
    }
    
    
    if (!gender) {
        alert("Select gender");
        return;
     
    }

    if (course === "") {
        alert("Select course");
        return;
    }

    if (about.length<20){
        alert("Must contain at least 20 characters");
        return;
    }
    


  
    const student = {
    id: students.length + 1,
    name: name,
    email: email,   
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        about: about
    };
const student ={
    id:students.length + 1,
    name:name,
    email:email,
    phone:phone,
    dob:dob,
    gender:gender.value,
    course:course,
    about:about,
};


 
    students.push(student);

    console.log(students);

    displayStudents();

    form.reset();
});



function displayStudents() {

    result.innerHTML = "";

    students.forEach(function(student) {

    result.innerHTML +=
    "ID: " + student.id + "<br>" +
    "Name: " + student.name + "<br>" +
    "Email: " + student.email + "<br>" +
    "Phone: " + student.phone + "<br>" +
    "DOB: " + student.dob + "<br>" +
     "Gender: " + student.gender + "<br>" +
    "Course: " + student.course + "<br>" +
    "About: " + student.about +
            "<hr>";
    });
}



document.getElementById("search").addEventListener(
    "input",
    function() {

    const text = this.value.toLowerCase();

     const found = students.filter(function(student) {
 return student.name.toLowerCase().includes(text);
     });

    result.innerHTML = "";

     found.forEach(function(student) {
    result.innerHTML +=
            "Name: " + student.name + "<br>" +
            "Course: " + student.course +
                "<hr>";
        });
      }
);

document.getElementById("filter").addEventListener(
    "change",
    function(){
    const course=this.value;
    const found = students.filter(function(student){
        return course === "" ||
        student.course === course;
    }

)
found.forEach(function(student){
result.innerHtml +=
"Name:"+student.name+"<br>"+
"Course:"+student.course+
"<hr>";
});
}
);




