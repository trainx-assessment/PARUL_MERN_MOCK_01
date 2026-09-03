const form = document.getElementById("studentForm");

// const formData = new FormData({

// });
const students = [];

const aboutStd = document.getElementById("aboutYou");
aboutStd.addEventListener("input", function () {
  const maxLength = 200;
  const currentLength = aboutStd.value.length;
  document.getElementById("charCount").textContent =
    `${currentLength}/${maxLength}`;
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const email = document.getElementById("email").value;
  const course = document.getElementById("course").value;
  const skills = Array.from(
    document.querySelectorAll('input[name="skills"]:checked'),
  ).map((skill) => skill.value);
  const aboutStudent = document.getElementById("aboutYou").value;
  const profilePicture = document.getElementById("profilePicture").files[0];

  if (name.length < 3 || name.length > 40 || !/^[a-zA-Z\s]+$/.test(name)) {
    alert(
      "Name must be between 3 and 40 characters and contain only letters and spaces.",
    );
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must be exactly 10 digits.");
  }

  if (new Date() - new Date(dob).getTime() < 15 * 365 * 24 * 60 * 60 * 1000) {
    alert("You must be at least 15 years old.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address.");
  }

  if (skills.length < 1) {
    alert("Please select at least 1 skill.");
  }

  if (
    !profilePicture.type.startsWith("image/jpeg") &&
    !profilePicture.type.startsWith("image/png") &&
    !profilePicture.type.startsWith("image/gif")
  ) {
    alert("Please upload a valid image file for the profile picture.");
  }

  const studentData = {
    name,
    phone,
    dob,
    gender,
    email,
    course,
    skills,
    aboutStudent,
    profilePicture,
  };

  students.push(studentData);

  renderStudentData();
  console.log(students);
});

function renderStudentData() {
  const studentDataContainer = document.getElementById("studentDataContainer");
  if (students.length === 0) {
    studentDataContainer.innerHTML = "<h2>No student data available.</h2>";
    return;
  } else {
    const studentCardsContainer = document.getElementById(
      "student-card-container",
    );
    studentCardsContainer.innerHTML = students.map(
      (student) => `
                    <div class="card">
                        <div class="card-profile">
                            <img src="${URL.createObjectURL(student.profilePicture)}" alt="Profile Picture" class="card-profile">
                        </div>
                        <div class="card-details">
                            <h2 class="card-name">${student.name}</h2>
                            <p class="card-phone">Phone: ${student.phone}</p>
                            <p class="card-dob">DOB: ${student.dob}</p>
                            <p class="card-gender">Gender: ${student.gender}</p>
                            <p class="card-email">Email: ${student.email}</p>
                            <p class="card-course">Course: ${student.course}</p>
                            <p class="card-skills">Skills: ${student.skills.join(", ")}</p>
                            <p class="card-about">About: ${student.aboutStudent}</p>
                        </div>
                    </div>
                `,
    );
  }
}
