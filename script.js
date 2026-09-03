let form = document.getElementById("studentForm");
let name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let dob = document.getElementById("dob");
let course = document.getElementById("course");
let about = document.getElementById("about");
let photo = document.getElementById("photo");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (name.value == "") {
    alert("Enter your name");
    return;
  }

  if (email.value == "") {
    alert("Enter your email");
    return;
  }

  if (phone.value == "") {
    alert("Enter your phone number");
    return;
  }

  if (dob.value == "") {
    alert("Select date of birth");
    return;
  }

  if (course.value == "") {
    alert("Select course");
    return;
  }

  if (about.value == "") {
    alert("Enter about student");
    return;
  }

  if (photo.value == "") {
    alert("Select photo");
    return;
  }
  alert("Student registered successfully");

  form.reset();
});
