const form = document.querySelector("form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");

const registerBtn = document.getElementById("reg-btn");
const resetBtn = document.getElementById("reset-form");

form.addEventListener("submit", (event) => {
event.preventDefault();


const name = nameInput.value.trim();
const email = emailInput.value.trim();
const phone = phoneInput.value.trim();
const dob = dobInput.value;

const nameRegex = /^[A-Za-z ]{3,40}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;


if (!nameRegex.test(name)) {
    alert("Name must contain only letters and spaces and should be between 3 to 40 characters.");
    nameInput.focus();
    return;
}


if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
}


if (!phoneRegex.test(phone)) {
    alert("Phone number must contain exactly 10 digits.");
    phoneInput.focus();
    return;
}


if (dob === "") {
    alert("Please select your date of birth.");
    dobInput.focus();
    return;
}

const selectedDate = new Date(dob);
const today = new Date();


if (selectedDate > today) {
    alert("Future date cannot be selected.");
    dobInput.focus();
    return;
}


let age = today.getFullYear() - selectedDate.getFullYear();

const monthDifference = today.getMonth() - selectedDate.getMonth();

if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
        today.getDate() < selectedDate.getDate())
) {
    age--;
}


if (age < 15) {
    alert("Student must be at least 15 years old.");
    dobInput.focus();
    return;
}


alert("Student registered successfully!");

console.log("Student Details:");
console.log("Name:", name);
console.log("Email:", email);
console.log("Phone:", phone);
console.log("Age:", age);


});

resetBtn.addEventListener("click", (event) => {
event.preventDefault();


form.reset();


});
