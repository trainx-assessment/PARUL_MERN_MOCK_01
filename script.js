const form = document.querySelector(".student-form");
const aboutStudent = document.querySelector("#aboutStudent");
const counter = document.createElement("small");
const studentCards = document.querySelector("#student-cards");
const registerMainCard = document.querySelector(".register-card");
const totalStudents = document.querySelector("#total-students");
const webDevelopment = document.querySelector("#web-development-count");
const uiUx = document.querySelector("#ui-ux-count");
const python = document.querySelector("#python-count");
const dataAnalytics = document.querySelector("#data-analytics-count");
const mernStack = document.querySelector("#mern-stack-count");
const cloudComputing = document.querySelector("#cloud-computing-count");
const submitButton = document.querySelector("button[type='submit']");
const studentNameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phoneNumber");
const dateOfBirthInput = document.querySelector("#dateOfBirth");
const courseSelect = document.querySelector("#course");


counter.textContent = "0 / 200";
aboutStudent.parentElement.append(counter);

const students = [];
let currID = 1;
let editingStudentId = null;

const statistics = {
  totalStudents: 0,
  webDevelopment: 0,
  uiUx: 0,
  python: 0,
  dataAnalytics: 0,
  mernStack: 0,
  cloudComputing: 0,
};

form.addEventListener("submit", validateForm);

function validateForm(event) {
  event.preventDefault();

  const name = studentNameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;
  const dateOfBirth = dateOfBirthInput.value;
  const course = courseSelect.value;
  const about = aboutStudent.value;
  const photo = document.querySelector("#profilePhoto").files[0];
  const gender = document.querySelector("input[name='gender']:checked");
  const skill = document.querySelector("input[name='skills']:checked");
  const errors = [];
  let nameIsValid = true;

  for (let i = 0; i < name.length; i++) {
    const character = name[i];

    if (
      !(
        (character >= "A" && character <= "Z") ||
        (character >= "a" && character <= "z") ||
        character === " "
      )
    ) {
      nameIsValid = false;
      break;
    }
  }

  if (name.length < 3 || name.length > 40 || !nameIsValid) {
    errors.push(
      "Name must contain 3 to 40 letters and spaces. No special characters are allowed!",
    );
  }
  if (!email.includes("@") || !email.includes(".")) {
    errors.push("Enter a valid email address.");
  }
  if (phone.length !== 10 || isNaN(phone)) {
    errors.push("Phone number must contain exactly 10 digits.");
  }

  const birthDate = new Date(dateOfBirth);
  const curr = new Date();
  const age = curr.getFullYear() - birthDate.getFullYear();

  if (!dateOfBirth || birthDate > curr || age < 15) {
    errors.push("Enter a valid date of birth.");
  }
  if (!gender) {
    errors.push("Select a gender.");
  }
  if (!course) {
    errors.push("Select a course.");
  }
  if (!skill) {
    errors.push("Select at least one skill.");
  }
  if (about.length < 20 || about.length > 200 || !about.trim()) {
    errors.push("About Student must contain 20 to 200 characters.");
  }
  if ((!photo && editingStudentId === null) || (photo && photo.type.indexOf("image/") !== 0)) {
    errors.push("Select an image for the profile photo.");
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }
  //need to SAVE THIS!!! and append to card

  const selectedSkills = document.querySelectorAll(
    "input[name='skills']:checked",
  );

  const skillsArray = Array.from(selectedSkills).map((ele) => ele.value);

  let student = {
    id: currID,
    name: name,
    email: email,
    phone: phone,
    dateOfBirth: dateOfBirth,
    gender: gender.value,
    course: course,
    skills: skillsArray,
    about: about,
    photo: photo,
  };

  if (editingStudentId !== null) {
    for (let i = 0; i < students.length; i++) {

      if (students[i].id === editingStudentId) {
        student.id = editingStudentId;

        if (!photo) {
          student.photo = students[i].photo;
        }

        if (students[i].course !== course) {
          changeCourseCount(students[i].course, -1);
          changeCourseCount(course, 1);
        }

        students[i] = student;
        const oldCard = document.querySelector("[data-id='" + editingStudentId + "']");
        oldCard.remove();
        createStudentCard(student);
        editingStudentId = null;
        submitButton.textContent = "Register Student";
        updateStatistics();
        form.reset();
        return;
      }
    }
  }

  student.id = currID++;
  students.push(student);
  statistics.totalStudents++;

  if (course === "Web Development") {
    statistics.webDevelopment++;
  }
  if (course === "UI/UX") {
    statistics.uiUx++;
  }
  if (course === "Python") {
    statistics.python++;
  }
  if (course === "Data Analytics") {
    statistics.dataAnalytics++;
  }
  if (course === "MERN Stack") {
    statistics.mernStack++;
  }
  if (course === "Cloud Computing") {
    statistics.cloudComputing++;
  }

  registerMainCard.style.display = "flex";
  console.log("Student added:", student);
  createStudentCard(student);
  updateStatistics();
  form.reset();
}

aboutStudent.addEventListener("input", function () {
  counter.textContent = aboutStudent.value.length + " / 200";
});

form.addEventListener("reset", function () {
  counter.textContent = "0 / 200";
  editingStudentId = null;
  submitButton.textContent = "Register Student";
});

function createStudentCard(student) {
  const card = document.createElement("div");

  card.className = "student-card"; //classname of the specific div!
  card.setAttribute("data-id", student.id);

  const image = document.createElement("img");
  image.src = URL.createObjectURL(student.photo);
  image.alt = student.name + " Profile Photo";

  const studentName = document.createElement("h3");
  studentName.textContent = student.name;

  const email = document.createElement("p");
  email.textContent = "Email: " + student.email;

  const phone = document.createElement("p");
  phone.textContent = "Phone: " + student.phone;

  const dob = document.createElement("p");
  dob.textContent = "Date of Birth: " + student.dateOfBirth;

  const gender = document.createElement("p");
  gender.textContent = "Gender: " + student.gender;

  const course = document.createElement("p");
  course.textContent = "Course: " + student.course;

  const skills = document.createElement("p");
  skills.textContent = "Skills: \n " + student.skills.join(", ");

  const about = document.createElement("p");
  about.textContent = "About: \n " + student.about;

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.textContent = "Edit this Student card!";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete this Student card!";

  card.append(
    image,
    studentName,
    email,
    phone,
    dob,
    gender,
    course,
    skills,
    about,
    editButton,
    deleteButton,
  );

  studentCards.append(card);
}

function changeCourseCount(course, amount) {
  if (course === "Web Development") {
    statistics.webDevelopment += amount;
  }
  if (course === "UI/UX") {
    statistics.uiUx += amount;
  }
  if (course === "Python") {
    statistics.python += amount;
  }
  if (course === "Data Analytics") {
    statistics.dataAnalytics += amount;
  }
  if (course === "MERN Stack") {
    statistics.mernStack += amount;
  }
  if (course === "Cloud Computing") {
    statistics.cloudComputing += amount;
  }
}

function updateStatistics() {
  totalStudents.textContent = statistics.totalStudents;
  webDevelopment.textContent = statistics.webDevelopment;
  uiUx.textContent = statistics.uiUx;
  python.textContent = statistics.python;
  dataAnalytics.textContent = statistics.dataAnalytics;
  mernStack.textContent = statistics.mernStack;
  cloudComputing.textContent = statistics.cloudComputing;
}



studentCards.addEventListener("click", function (event) {

    if(event.target.className === "edit-button") {
        editStudentCard(event);
    }

    if(event.target.className === "delete-button") {
        deleteStudentCard(event);
    }

});


deleteStudentCard = (event) => {
    
  const card = event.target.closest(".student-card");
  const studentID = Number(card.getAttribute("data-id"));

  if (!confirm("Are you sure you want to delete this student?")) {
    return;
  }

  for (let i = 0; i < students.length; i++) {
    if (students[i].id === studentID) 
    {
        const delCourse = students[i].course;
        students.splice(i, 1);//remove this one!
        statistics.totalStudents--;

        if (delCourse === "Web Development") {
            statistics.webDevelopment--;
        }
        if (delCourse === "UI/UX") {
            statistics.uiUx--;
        }
        if (delCourse === "Python") {
            statistics.python--;
        }
        if (delCourse === "Data Analytics") {
            statistics.dataAnalytics--;
        }
        if (delCourse === "MERN Stack") {
            statistics.mernStack--;
        }
        if (delCourse === "Cloud Computing") {
            statistics.cloudComputing--;
        }

        card.remove();
        updateStatistics();
        break;
    }
  }
}

editStudentCard = (event) => {
    
  const card = event.target.closest(".student-card");
  const studentID = Number(card.getAttribute("data-id"));


  for (let i = 0; i < students.length; i++) {
    if (students[i].id === studentID) 
    {
        const student = students[i];
        
        studentNameInput.value = student.name;
        emailInput.value= student.email;
        phoneInput.value= student.phone;
        aboutStudent.value= student.about;
        dateOfBirthInput.value= student.dateOfBirth;
        courseSelect.value= student.course;

        const genderInputs = document.querySelectorAll("input[name='gender']");
        genderInputs.forEach((input) => {
            if (input.value === student.gender) {
                input.checked = true;
                
            }
        });

        const skillInputs = document.querySelectorAll("input[name='skills']");
        skillInputs.forEach((sk) => {
          sk.checked = student.skills.includes(sk.value);
        });

        document.querySelector("#profilePhoto").value = "";

        editingStudentId = studentID;
        submitButton.textContent = "Update Student";

        break;
    }
  }
}