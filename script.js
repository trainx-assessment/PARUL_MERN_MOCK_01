const studentForm = document.getElementById("studentForm");
const aboutField = document.getElementById("about");
const aboutCounter = document.getElementById("aboutCounter");
const formMessage = document.getElementById("formMessage");
const studentCards = document.getElementById("studentCards");
const students = [];
let nextStudentId = 1;

const fields = {
	name: document.getElementById("name"),
	email: document.getElementById("email"),
	phone: document.getElementById("phone"),
	dob: document.getElementById("dob"),
	course: document.getElementById("course"),
	about: aboutField,
	photo: document.getElementById("photo")
};
const messages = {
	name: "Enter 3-40 letters and spaces only.",
	email: "Enter a valid email address.",
	phone: "Enter exactly 10 digits.",
	dob: "Enter a date at least 15 years ago.",
	gender: "Select a gender.",
	course: "Select a course.",
	skill: "Select at least one skill.",
	about: "Enter 20-200 non-space characters.",
	photo: "Choose a JPG, JPEG, or PNG image."
};

function setError(fieldName, message) {
	const errorElement = document.getElementById(`${fieldName}Error`);
	errorElement.textContent = message;
	errorElement.classList.toggle("visible", Boolean(message));
	if (fields[fieldName]) {
		fields[fieldName].setAttribute("aria-invalid", Boolean(message));
	}
	return !message;
}

function isAtLeast15YearsOld(dateValue) {
	const birthDate = new Date(`${dateValue}T00:00:00`);
	const today = new Date();
	const minimumBirthDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
	return birthDate <= minimumBirthDate;
}

function validateField(fieldName) {
	const field = fields[fieldName];
	const value = field.value.trim();
	let valid = true;

	if (fieldName === "name") {
		valid = /^[A-Za-z ]{3,40}$/.test(value);
	} else if (fieldName === "email") {
		valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	} else if (fieldName === "phone") {
		valid = /^\d{10}$/.test(value);
	} else if (fieldName === "dob") {
		valid = Boolean(value) && isAtLeast15YearsOld(value);
	} else if (fieldName === "course") {
		valid = Boolean(value);
	} else if (fieldName === "about") {
		valid = value.length >= 20 && value.length <= 200;
	} else if (fieldName === "photo") {
		const file = field.files[0];
		valid = Boolean(file) && /^(image\/jpeg|image\/png)$/.test(file.type) && /\.(jpe?g|png)$/i.test(file.name);
	}

	return setError(fieldName, valid ? "" : messages[fieldName]);
}

function validateGroups() {
	const genderValid = Boolean(document.querySelector('input[name="gender"]:checked'));
	const skillValid = Boolean(document.querySelector('input[name="skill"]:checked'));
	setError("gender", genderValid ? "" : messages.gender);
	setError("skill", skillValid ? "" : messages.skill);
	return genderValid && skillValid;
}

function updateAboutCounter() {
	aboutCounter.textContent = `${aboutField.value.length} / 200`;
}

studentForm.addEventListener("submit", (event) => {
	event.preventDefault();
	formMessage.textContent = "";
	const fieldsValid = Object.keys(fields).reduce((allValid, fieldName) => {
		return validateField(fieldName) && allValid;
	}, true);
	const groupsValid = validateGroups();

	if (fieldsValid && groupsValid) {
		const selectedGender = document.querySelector('input[name="gender"]:checked').value;
		const selectedSkills = Array.from(document.querySelectorAll('input[name="skill"]:checked'))
			.map((skill) => skill.value);
		const photo = fields.photo.files[0];
		const student = {
			id: nextStudentId++,
			name: fields.name.value.trim(),
			email: fields.email.value.trim(),
			phone: fields.phone.value.trim(),
			dob: fields.dob.value,
			gender: selectedGender,
			course: fields.course.value,
			skills: selectedSkills,
			about: fields.about.value.trim(),
			photo: URL.createObjectURL(photo)
		};
		students.push(student);
		renderStudentCards();
		studentForm.reset();
		formMessage.textContent = "Student application is valid and ready to submit.";
		formMessage.className = "success-message";
	} else {
		formMessage.textContent = "Please fix the highlighted fields.";
		formMessage.className = "error-message visible";
	}
});
Object.keys(fields).forEach((fieldName) => {
	fields[fieldName].addEventListener("input", () => validateField(fieldName));
	fields[fieldName].addEventListener("change", () => validateField(fieldName));
});

document.querySelectorAll('input[name="gender"], input[name="skill"]').forEach((input) => {
	input.addEventListener("change", validateGroups);
});
aboutField.addEventListener("input", updateAboutCounter);
studentForm.addEventListener("reset", () => {
	window.setTimeout(() => {
		Object.keys(fields).forEach((fieldName) => setError(fieldName, ""));
		setError("gender", "");
		setError("skill", "");
		formMessage.textContent = "";
		formMessage.className = "";
		updateAboutCounter();
	}, 0);
});

function addCardText(card, label, value) {
	const paragraph = document.createElement("p");
	const labelElement = document.createElement("strong");
	labelElement.textContent = `${label}: `;
	paragraph.append(labelElement, document.createTextNode(value));
	card.appendChild(paragraph);
}

function renderStudentCards() {
	studentCards.replaceChildren();
	students.forEach((student) => {
		const card = document.createElement("article");
		card.classList.add("student-card");
		card.setAttribute("data-id", student.id);

		const photo = document.createElement("img");
		photo.src = student.photo;
		photo.alt = `${student.name}'s profile photo`;
		card.appendChild(photo);

		const heading = document.createElement("h3");
		heading.textContent = student.name;
		card.appendChild(heading);
		addCardText(card, "Email", student.email);
		addCardText(card, "Phone", student.phone);
		addCardText(card, "DOB", student.dob);
		addCardText(card, "Gender", student.gender);
		addCardText(card, "Course", student.course);
		addCardText(card, "Skills", student.skills.join(", "));
		addCardText(card, "About", student.about);

		const editButton = document.createElement("button");
		editButton.type = "button";
		editButton.classList.add("edit-btn");
		editButton.textContent = "Edit";
		const deleteButton = document.createElement("button");
		deleteButton.type = "button";
		deleteButton.classList.add("delete-btn");
		deleteButton.textContent = "Delete";
		card.append(editButton, deleteButton);
		studentCards.appendChild(card);
	});
}
// # Task 7 — Student Statistics

// ### Suggested Time: 10 Minutes

// Create a statistics section.

// Initially display:

// ```text
// Total Students: 0
// ```

// When students are registered:

// ```text
// Total Students: 1
// Total Students: 2
// Total Students: 3
// ```

// Also display:

// ```text
// Web Development: 0
// UI/UX: 0
// Python: 0
// Data Analytics: 0
// MERN Stack: 0
// Cloud Computing: 0
// ```

// The statistics should update automatically whenever:

// * A student is added
// * A student is deleted
// * A student's course is edited

// ---