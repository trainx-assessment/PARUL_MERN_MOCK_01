javascript
const form = document.querySelector(".form");

const nameInput = document.getElementById("student-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("number");
const dob = document.getElementById("dob");
const messageInput = document.getElementById("mess");

const students = [];

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let isValid = true;

  const name = nameInput.value.trim();
  const validn = /^[A-Za-z ]+$/;

  if (name === "") {
    alert("Name is required");
    isValid = false;
  } else if (name.length < 3 || name.length > 40) {
    alert("Name must be between 3 and 40 characters");
    isValid = false;
  } else if (!validn.test(name)) {
    alert("Only letters and spaces allowed");
    isValid = false;
  }

  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    alert("Email is required");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    alert("Enter a valid email");
    isValid = false;
  }

  const phone = phoneInput.value.trim();
  const phoneRegex = /^[0-9]{10}$/;

  if (phone === "") {
    alert("Phone number is required");
    isValid = false;
  } else if (!phoneRegex.test(phone)) {
    alert("Phone must contain exactly 10 digits");
    isValid = false;
  }

  const Dob = dob.value;

  if (Dob === "") {
    alert("Enter Date of Birth");
    isValid = false;
  }

  const message = messageInput.value.trim();

  if (message.length > 0 && message.length < 20) {
    alert("About Student should be at least 20 characters");
    isValid = false;
  }
  

  if (isValid) {
    const student = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      dob: Dob,
      about: message
    };

    students.push(student);

    console.log(students);

    alert("Student registered successfully!");

    form.reset();
  }
});

