let main = document.querySelector("#main");
let name = document.querySelector("#student-name");
let email = document.querySelector("#student-email");
let phone = document.querySelector("#student-contact");
let course = document.querySelector("#course-enrolled");
let birth = document.querySelector("#birth")
let Student_deatils = document.querySelector(".Student-deatils")


let submit = document.querySelector(".submit");
let reset = document.querySelector(".reset");
let about = document.querySelector(".about p")


// let student = 1;
// let s_name = "";
// let s_email = "";
// let s_phone = "";
// let s_course = "";

const students = [];

let object = {
    // id: student,
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    course: "",
    // skills: [],
    // about: "",
    // photo: ""
}

Student_deatils.addEventListener('submit', (event) => {
        event.preventDefault();
        object.name += event.name;
        object.email += event.email;
        object.phone += event.phone;
        object.course +=  event.course;
        object.dob += event.dob;
        object.gender += event.gender
        alert("Form submitted successfully!");
        event.target.reset();
})

// reset.addEventListener('onclick', (eve) => {

// })


console.log(object);




// document.createElement('submit', (e) => {
    
// })
