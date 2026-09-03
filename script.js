const form = document.getElementById("studentForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("studentName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value;
    if (name === "") {
        alert("Please enter student name");
        return;
    }
    if (email === "") {
        alert("Please enter email");
        return;
    }
    if (phone === "") {
        alert("Please enter phone number");
        return;
    }
    if (dob === "") {
        alert("Please select date of birth");
        return;
    }
    if (course === "") {
        alert("Please select course");
        return;
    }
    if (about === "") {
        alert("Please enter about student");
        return;
    }
    alert("Student Registered Successfully!");
    form.reset();
});
studentList.innerHTML += ` 
<div class="student-card"> 
<h3>${name}</h3> 
<p><strong>Email:</strong> ${email}</p> 
<p><strong>Phone:</strong> ${phone}</p> 
<p><strong>Date of Birth:</strong> ${dob}</p> 
<p><strong>Course:</strong> ${course}</p> 
<p><strong>About:</strong> ${about}</p> 
</div> `; 
alert("Student Registered Successfully!"); 