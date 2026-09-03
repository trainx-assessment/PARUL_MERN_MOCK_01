const storage = "studentApplications";
const courses = ["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"];
let students = JSON.parse(localStorage.getItem(storage) || "[]");

const form=document.querySelector("#student-form");
const studentContainer = document.querySelector("#studentContainer");
const aboutinput = document.querySelector("#about");
const photoinput = document.querySelector("#photo");
const submitbtn = document.querySelector("#submitbtn");
const formstatus = document.querySelector("#formstatus");


function validateForm(){
    const name=form.studentname.value.trim();
    const email=form.email.value.trim();
    const photo=form.phone.value.trim();
    const dob=form.dob.value;
    const gender=form.querySelector("input[name='gender']:checked")
    const skills=[...form.querySelectorAll("input[name='skills']:checked")]
    const about=aboutinput.value.trim();
    const errors={};
    if(!name) errors.studentname="Name is required";
    else if(!/^[A-Za-z ]{3,40}$/.test(name)) errors.studentname="use 3-40 letters and spaces only.";
    if(!email) errors.studentname="Name is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    if (!phone) errors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(phone)) errors.phone = "Enter exactly 10 digits.";
}
validateForm()