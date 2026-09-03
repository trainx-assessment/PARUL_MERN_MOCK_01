const form = document.getElementById("registration");
const sname = document.getElementById("name");
const semail = document.getElementById("email");
const mobilenumber = document.getElementById("number");
const dob = document.getElementById("dateofbirth");
const course = document.getElementById("course");
const about = document.getElementById("about");
const profile = document.getElementById("profile");
const submit = document.getElementById("register");
const reset = document.getElementById("reset");

submit.addEventListener("click", function (e) {
  e.preventDefault();

  if (sname.value.trim() === "") {
    alert("Please enter name");
    return;
  }
  if (sname.value.trim().length < 3) {
    alert("Name must contain at least 3 characters");
    return;
  }
  if (sname.value.trim().length > 40) {
    alert("Name must contain upto 40 characters only");
    return;
  }
  if (semail.value.trim() === "") {
    alert("Please enter email");
    return;
  }
  if (!semail.value.includes("@")) {
    alert("Please enter valid email");
    return;
  }
  if (dob.value === "") {
    alert("Select date of birth");
    return;
  }


  if (about.value.trim() === "") {
    alert("Enter about student");
    return;
  }
  if (about.value.trim().length < 20) {
    alert("About should greater than 20 characters");
    return;
  }
  if (!gender) {
    alert("Select gender");
    return;
  }
  if (course.value === "") {
    alert("Select course");
    return;
  }
  if (skills.length === 0) {
    alert("Select at least one skill");
    return;
  }
  if (profile.files.length === 0) {
    alert("Select profile photo");
    return;
  }

});
