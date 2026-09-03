const courseStr = {
  "web_development": "Web Development",
  "ui_ux": "UI/UX",
  "python": "Python",
  "data_analytics": "Data Analytics",
  "mern_stack": "MERN Stack",
  "cloud_computing": "Cloud Computing"
}

const skillsStr = {
  "html": "HTML",
  "css": "CSS",
  "javascript": "JavaScript",
  "react": "React",
  "nodejs": "Node.js",
  "git": "Git"
}

const students = [];

const form = document.querySelector('form');

const about = document.getElementById('about');
const letterCount = document.getElementById('lettercount');
about.addEventListener('input', (e) => {
  letterCount.innerHTML = about.value.trim().length;
})

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const dob = new Date(document.getElementById('dob').value);
  const gender = document.querySelector('input[name="gender"]:checked').value
  const course = document.getElementById('course').value;

  const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(skill => skill.value);
  const about = document.getElementById('about').value;
  const pfp = document.getElementById('pfp').files[0];
  
  const today = new Date();

  if (name.length < 3 || name.length > 40 || !/^[a-zA-Z\s]+$/.test(name)) {
    alert("Please enter a valid name (3-40 characters, letters and spaces only).");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  if (dob >= today) {
    alert("Please enter a valid date of birth.");
    return;
  }

  if (dob > new Date(today.getFullYear() - 15, today.getMonth(), today.getDay())) {
    alert("Student must be atleast 15 years old");
    return;
  }

  if (skills.length === 0) {
    alert("Please select atleast one skill!");
    return;
  }

  if (about.length < 20 || about.length > 200 || about.trim() === "") {
    alert("Please enter a valid 'About Yourself' section (20-200 characters).");
    return;
  }


  const student = {
    id: crypto.randomUUID(),
    name,
    email, 
    phone,
    dob,
    gender,
    course: courseStr[course],
    skills: skills.map(skill => skillsStr[skill]),
    about,
    pfp
  }

  students.push(student);
  console.log(student);
  renderCards();
});

function renderCards() {
  if (students.length === 0) {
    return;
  }

  // <div class="card">
  //                   <div class="card-head">
  //                       <div class="pfp">
  //                           <img src="" alt="pfp">
  //                       </div>
  //                       <div class="details">
  //                           <h3>Dhruv Jain</h3>
  //                           <div class="subdetails">
  //                               <p>Course: UI/UX</p>
  //                               <p>Gender: Male</p>
  //                           </div>
  //                       </div>
  //                   </div>
  //                   <div class="card-body">
  //                       <div class="cardfield">
  //                           <p>Phone Number: </p>
  //                           <p>7405802493</p>
  //                       </div>
  //                       <div class="cardfield">
  //                           <p>DOB: </p>
  //                           <p>10-10-1000</p>
  //                       </div>
  //                       <div class="cardfield">
  //                           <p>Skills: </p>
  //                           <p>A, B, C</p>
  //                       </div>
  //                       <div class="cardfield">
  //                           <p>About:</p>
  //                           <p>About about about about about about</p>
  //                       </div>
  //                   </div>

  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = '';

  students.forEach(student => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardHead = document.createElement('div');
    cardHead.classList.add('card-head');

    const pfpDiv = document.createElement('div');
    pfpDiv.classList.add('pfp');
    const pfpImg = document.createElement('img');
    pfpImg.src = URL.createObjectURL(student.pfp);
    pfpImg.alt = "Profile Picture";
    pfpDiv.appendChild(pfpImg);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');
    const nameH3 = document.createElement('h3');
    nameH3.textContent = student.name;
    const subdetailsDiv = document.createElement('div');
    subdetailsDiv.classList.add('subdetails');
    const courseP = document.createElement('p');
    courseP.textContent = `Course: ${student.course}`;
    const genderP = document.createElement('p');
    genderP.textContent = `Gender: ${student.gender}`;
    subdetailsDiv.appendChild(courseP);
    subdetailsDiv.appendChild(genderP);
    detailsDiv.appendChild(nameH3);
    detailsDiv.appendChild(subdetailsDiv);
    cardHead.appendChild(pfpDiv);
    cardHead.appendChild(detailsDiv);
    card.appendChild(cardHead);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const phoneField = document.createElement('div');
    phoneField.classList.add('cardfield');
    const phoneLabel = document.createElement('p');
    phoneLabel.textContent = "Phone Number: ";
    const phoneValue = document.createElement('p');
    phoneValue.textContent = student.phone;
    phoneField.appendChild(phoneLabel);
    phoneField.appendChild(phoneValue);
    cardBody.appendChild(phoneField);

    // dobField = document.createElement('div');
    // dobField.classList.add('cardfield');
    // const dobLabel = document.createElement('p');
    // dobLabel.textContent = "DOB: ";
    // const dobValue = document.createElement('p');
    // dobValue.textContent = student.dob;
    // dobField.appendChild(dobLabel);
    // dobField.appendChild(dobValue);
    // cardBody.appendChild(dobField);

    skillsStrField = document.createElement('div');
    skillsStrField.classList.add('cardfield');
    const skillsStrLabel = document.createElement('p');
    skillsStrLabel.textContent = "Skills: ";
    const skillsStrValue = document.createElement('p');
    skillsStrValue.textContent = student.skills.join(', ');
    skillsStrField.appendChild(skillsStrLabel);
    skillsStrField.appendChild(skillsStrValue);
    cardBody.appendChild(skillsStrField);

    aboutField = document.createElement('div');
    aboutField.classList.add('cardfield');
    const aboutLabel = document.createElement('p');
    aboutLabel.textContent = "About: ";
    const aboutValue = document.createElement('p');
    aboutValue.textContent = student.about;
    aboutField.appendChild(aboutLabel);
    aboutField.appendChild(aboutValue);
    cardBody.appendChild(aboutField);

    card.appendChild(cardBody);
    cardsContainer.appendChild(card);
  });


}



