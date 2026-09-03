const form = document.getElementById("studentForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value;

    const gender = document.querySelector('input[name="gender"]:checked');

    alert(
        "Student Registered!\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + phone + "\n" +
        "DOB: " + dob + "\n" +
        "Gender: " + (gender ? gender.value : "") + "\n" +
        "Course: " + course + "\n" +
        "About: " + about
    );

    form.reset();
});