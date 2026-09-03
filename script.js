const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.querySelector('input[placeholder="Enter your Name"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const phone = document.querySelector(
    'input[placeholder="Enter your phone number"]'
  ).value;

  const dob = document.querySelector('input[type="date"]').value;

  const selectedGender = document.querySelector(
    'input[type="radio"]:checked'
  );

  const course = document.querySelector("#course").value;

  const selectedSkills = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  const about = document.querySelector("textarea").value;

  const profilePicture = document.querySelector("#profile-pic").files[0];

  if (!selectedGender) {
    alert("Please select your gender.");
    return;
  }

  if (course === "course") {
    alert("Please select a course.");
    return;
  }

  if (selectedSkills.length === 0) {
    alert("Please select at least one skill.");
    return;
  }

  const skills = Array.from(selectedSkills).map(
    (skill) => skill.parentElement.textContent.trim()
  );

  const student = {
    name: name,
    email: email,
    phone: phone,
    dateOfBirth: dob,
    gender: selectedGender.parentElement.textContent.trim(),
    course: course,
    skills: skills,
    about: about,
    profilePicture: profilePicture ? profilePicture.name : "No image",
  };

  console.log(student);

  alert(
    `Student Registered Successfully!\n\nName: ${student.name}\nEmail: ${student.email}\nCourse: ${student.course}`
  );

  form.reset();
});