const form = document.getElementById("student-form");
const students = [];
let studentId = 1;

form.addEventListener("submit", function(event) {
  event.preventDefault();

  // Clear old errors
  document.getElementById("name-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("phone-error").textContent = "";
  document.getElementById("dob-error").textContent = "";
  document.getElementById("gender-error").textContent = "";
  document.getElementById("course-error").textContent = "";
  document.getElementById("skills-error").textContent = "";
  document.getElementById("about-error").textContent = "";
  document.getElementById("photo-error").textContent = "";

  let isValid = true;

  // Validate name
  const name = document.getElementById("name").value.trim();
  if (name === "") {
    document.getElementById("name-error").textContent = "Name is required";
    isValid = false;
  } else if (name.length < 3) {
    document.getElementById("name-error").textContent = "Name must be at least 3 characters";
    isValid = false;
  }

  // Validate email
  const email = document.getElementById("email").value.trim();
  if (email === "") {
    document.getElementById("email-error").textContent = "Email is required";
    isValid = false;
  }

  // Validate phone
  const phone = document.getElementById("phone").value.trim();
  if (phone === "") {
    document.getElementById("phone-error").textContent = "Phone number is required";
    isValid = false;
  } else if (phone.length !== 10 || isNaN(phone)) {
    document.getElementById("phone-error").textContent = "Phone must be exactly 10 digits";
    isValid = false;
  }

  // Validate date of birth
  const dob = document.getElementById("dob").value;
  if (dob === "") {
    document.getElementById("dob-error").textContent = "Date of birth is required";
    isValid = false;
  }

  // Validate gender
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  let genderSelected = false;
  for (let i = 0; i < genderRadios.length; i++) {
    if (genderRadios[i].checked) {
      genderSelected = true;
    }
  }
  if (!genderSelected) {
    document.getElementById("gender-error").textContent = "Please select a gender";
    isValid = false;
  }

  // Validate course
  const course = document.getElementById("course").value;
  if (course === "") {
    document.getElementById("course-error").textContent = "Please select a course";
    isValid = false;
  }

  // Validate skills
  const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
  let skillSelected = false;
  for (let i = 0; i < skillCheckboxes.length; i++) {
    if (skillCheckboxes[i].checked) {
      skillSelected = true;
    }
  }
  if (!skillSelected) {
    document.getElementById("skills-error").textContent = "Select at least one skill";
    isValid = false;
  }

  // Validate about
  const about = document.getElementById("about").value.trim();
  if (about === "") {
    document.getElementById("about-error").textContent = "About is required";
    isValid = false;
  }

  // Validate photo
  const photo = document.getElementById("photo");
  if (photo.files.length === 0) {
    document.getElementById("photo-error").textContent = "Profile photo is required";
    isValid = false;
  }

  // If all valid
  if (isValid) {

    // Get selected gender value
    let selectedGender = "";
    for (let i = 0; i < genderRadios.length; i++) {
      if (genderRadios[i].checked) {
        selectedGender = genderRadios[i].value;
      }
    }

    // Get selected skills values
    const selectedSkills = [];
    for (let i = 0; i < skillCheckboxes.length; i++) {
      if (skillCheckboxes[i].checked) {
        selectedSkills.push(skillCheckboxes[i].value);
      }
    }

    // Get photo as URL
    const photoFile = document.getElementById("photo").files[0];
    const photoURL = URL.createObjectURL(photoFile);

    // Create student object
    const student = {
      id: studentId,
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      dob: document.getElementById("dob").value,
      gender: selectedGender,
      course: document.getElementById("course").value,
      skills: selectedSkills,
      about: document.getElementById("about").value.trim(),
      photo: photoURL
    };

    // Add to array
    students.push(student);
    studentId++;

    // Create card
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    const img = document.createElement("img");
    img.src = student.photo;
    img.alt = "Student Photo";

    const nameEl = document.createElement("h3");
    nameEl.textContent = student.name;

    const emailEl = document.createElement("p");
    emailEl.textContent = "Email: " + student.email;

    const phoneEl = document.createElement("p");
    phoneEl.textContent = "Phone: " + student.phone;

    const dobEl = document.createElement("p");
    dobEl.textContent = "DOB: " + student.dob;

    const genderEl = document.createElement("p");
    genderEl.textContent = "Gender: " + student.gender;

    const courseEl = document.createElement("p");
    courseEl.textContent = "Course: " + student.course;

    const skillsEl = document.createElement("p");
    skillsEl.textContent = "Skills: " + student.skills.join(", ");

    const aboutEl = document.createElement("p");
    aboutEl.textContent = "About: " + student.about;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    card.appendChild(img);
    card.appendChild(nameEl);
    card.appendChild(emailEl);
    card.appendChild(phoneEl);
    card.appendChild(dobEl);
    card.appendChild(genderEl);
    card.appendChild(courseEl);
    card.appendChild(skillsEl);
    card.appendChild(aboutEl);
    card.appendChild(deleteBtn);

    document.getElementById("student-cards-container").appendChild(card);

    // Update total count
    document.getElementById("total-students").textContent = students.length;

    // Reset form
    document.getElementById("student-form").reset();
  }
});

// Delete student using event delegation
const container = document.getElementById("student-cards-container");

container.addEventListener("click", function(event) {

  if (event.target.classList.contains("delete-btn")) {

    // Find the parent card
    const card = event.target.closest(".student-card");

    // Read the student id from the card
    const cardId = Number(card.getAttribute("data-id"));

    // Find that student in the array and remove it
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === cardId) {
        students.splice(i, 1);
        break;
      }
    }

    // Remove the card from the page
    card.remove();

    // Update total count
    document.getElementById("total-students").textContent = students.length;
  }
});
