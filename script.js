const form = document.querySelector("#student-form");
const aboutStudent = document.querySelector("#about-student");
const aboutCounter = document.querySelector("#about-counter");

function showError(id, message) {
	document.querySelector(`#${id}-error`).textContent = message;
}

function clearError(id) {
	document.querySelector(`#${id}-error`).textContent = "";
}

function validateForm() {
	let isValid = true;
	const name = document.querySelector("#student-name").value.trim();
	const email = document.querySelector("#email").value.trim();
	const phone = document.querySelector("#phone").value.trim();
	const dateOfBirth = document.querySelector("#date-of-birth").value;
	const gender = document.querySelector("input[name='gender']:checked");
	const course = document.querySelector("#course").value;
	const skills = document.querySelectorAll("input[name='skills']:checked");
	const about = aboutStudent.value.trim();
	const photo = document.querySelector("#profile-photo").files[0];

	if (!/^[A-Za-z ]{3,40}$/.test(name)) {
		showError("student-name", "Enter 3-40 letters and spaces only.");
		isValid = false;
	} else {
		clearError("student-name");
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		showError("email", "Enter a valid email address.");
		isValid = false;
	} else {
		clearError("email");
	}

	if (!/^\d{10}$/.test(phone)) {
		showError("phone", "Phone number must contain exactly 10 digits.");
		isValid = false;
	} else {
		clearError("phone");
	}

	if (!dateOfBirth || new Date(dateOfBirth) > new Date()) {
		showError("date-of-birth", "Enter a valid date that is not in the future.");
		isValid = false;
	} else {
		clearError("date-of-birth");
	}

	if (!gender) {
		showError("gender", "Select a gender.");
		isValid = false;
	} else {
		clearError("gender");
	}

	if (!course) {
		showError("course", "Select a course.");
		isValid = false;
	} else {
		clearError("course");
	}

	if (skills.length === 0) {
		showError("skills", "Select at least one skill.");
		isValid = false;
	} else {
		clearError("skills");
	}

	if (about.length < 20 || about.length > 200) {
		showError("about-student", "About Student must be 20-200 characters.");
		isValid = false;
	} else {
		clearError("about-student");
	}

	if (!photo || !photo.type.startsWith("image/")) {
		showError("profile-photo", "Select an image file.");
		isValid = false;
	} else {
		clearError("profile-photo");
	}

	return isValid;
}

aboutStudent.addEventListener("input", function () {
	aboutCounter.textContent = `${aboutStudent.value.length} / 200`;
	if (aboutStudent.value.trim().length >= 20) {
		clearError("about-student");
	}
});

form.addEventListener("input", function (event) {
	const fieldId = event.target.id;
	if (fieldId && event.target.value.trim()) {
		clearError(fieldId);
	}
});

form.addEventListener("change", function (event) {
	if (event.target.name === "gender") {
		clearError("gender");
	}
	if (event.target.name === "skills") {
		clearError("skills");
	}
	if (event.target.id === "profile-photo") {
		clearError("profile-photo");
	}
});

form.addEventListener("submit", function (event) {
	event.preventDefault();

	if (validateForm()) {
		alert("Student form submitted successfully.");
	}
});

form.addEventListener("reset", function () {
	document.querySelectorAll("small[id$='-error']").forEach(function (message) {
		message.textContent = "";
	});
	aboutCounter.textContent = "0 / 200";
});
