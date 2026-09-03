const form = document.querySelector("#studentForm");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");

const skillInputs = document.querySelectorAll(
'input[name="skills"]'
);

const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");

const characterCount = document.querySelector(
"#characterCount"
);

const studentContainer = document.querySelector(
"#studentContainer"
);


const totalStudents = document.querySelector(
"#totalStudents"
);

const webDevelopmentCount = document.querySelector(
"#webDevelopmentCount"
);

const uiuxCount = document.querySelector(
"#uiuxCount"
);

const pythonCount = document.querySelector(
"#pythonCount"
);

const dataAnalyticsCount = document.querySelector(
"#dataAnalyticsCount"
);

const mernStackCount = document.querySelector(
"#mernStackCount"
);

const cloudComputingCount = document.querySelector(
"#cloudComputingCount"
);


const students = [];

let studentId = 1;

function showError(input, message) {

removeError(input);

const error = document.createElement("p");

error.classList.add("error-message");

error.textContent = message;

input.parentElement.appendChild(error);

}

function removeError(input) {

const oldError = input.parentElement.querySelector(
    ".error-message"
);

if (oldError) {
    oldError.remove();
}

}

