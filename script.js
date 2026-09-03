
let students = [];
const studentForm = document.getElementById("studentForm");
const cardsContainer = document.querySelector(".student-cards-container");

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("studentName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value;

});

