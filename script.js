const students = [];

const studentForm = document.getElementById("studentForm");

function showError(input, message) {
	const error = input.parentElement.querySelector(".error-message");
	error.textContent = message;
	error.classList.add("show");
}

function clearErrors() {
	document.querySelectorAll(".error-message").forEach(function (error) {
		error.textContent = "";
		error.classList.remove("show");
	});
}

function updateStats() {
	const stats = document.getElementById("stats");
	const courses = [
		"Web Development",
		"UI/UX",
		"Python",
		"Data Analytics",
		"MERN Stack",
		"Cloud Computing",
	];

	stats.innerHTML = `<div>Total Students: ${students.length}</div>`;
	courses.forEach(function (course) {
		const total = students.filter(function (student) {
			return student.course === course;
		}).length;
		stats.innerHTML += `<div>${course}: ${total}</div>`;
	});
}

function renderStudents(searchText) {
	const studentContainer = document.getElementById("studentContainer");
	studentContainer.innerHTML = "";

	const matchingStudents = students.filter(function (student) {
		return student.name.toLowerCase().includes(searchText.toLowerCase());
	});

	if (matchingStudents.length === 0) {
		studentContainer.innerHTML = '<p class="no-students">No students found</p>';
		return;
	}

	matchingStudents.forEach(function (student) {
		const card = document.createElement("div");
		card.classList.add("student-card");
		card.setAttribute("data-id", student.id);
		card.innerHTML = `
			${student.photo ? `<img src="${student.photo}" alt="Student photo">` : ""}
			<h3>${student.name}</h3>
			<p><strong>Email:</strong> ${student.email}</p>
			<p><strong>Phone:</strong> ${student.phone}</p>
			<p><strong>DOB:</strong> ${student.dob}</p>
			<p><strong>Gender:</strong> ${student.gender}</p>
			<p><strong>Course:</strong> ${student.course}</p>
			<p><strong>Skills:</strong> ${student.skills.join(", ")}</p>
			<p><strong>About:</strong> ${student.about}</p>
			<div class="card-buttons">
				<button class="edit-btn" type="button">Edit</button>
				<button class="delete-btn" type="button">Delete</button>
			</div>
		`;
		studentContainer.appendChild(card);
	});
}

updateStats();

document.getElementById("searchInput").addEventListener("input", function () {
	renderStudents(this.value);
});

studentForm.addEventListener("submit", function (event) {
	event.preventDefault();
	clearErrors();

	const name = document.getElementById("studentName");
	const email = document.getElementById("studentEmail");
	const phone = document.getElementById("studentPhone");
	const course = document.getElementById("studentCourse");
	let hasError = false;

	if (name.value.trim() === "") {
		showError(name, "Name is required");
		hasError = true;
	} else if (name.value.trim().length < 3) {
		showError(name, "Name is too short");
		hasError = true;
	}

	if (email.value.trim() === "" || !email.value.includes("@")) {
		showError(email, "Enter a valid email");
		hasError = true;
	}

	if (phone.value.trim() === "" || phone.value.length !== 10) {
		showError(phone, "Phone should have 10 numbers");
		hasError = true;
	}

	if (course.value === "") {
		showError(course, "Please select a course");
		hasError = true;
	}

	if (hasError) {
		return;
	}

	const selectedGender = document.querySelector(
		'input[name="gender"]:checked',
	);
	const selectedSkills = Array.from(
		document.querySelectorAll('input[name="skills"]:checked'),
	).map(function (skill) {
		return skill.value;
	});

	const student = {
		id: students.length + 1,
		name: document.getElementById("studentName").value,
		email: document.getElementById("studentEmail").value,
		phone: document.getElementById("studentPhone").value,
		dob: document.getElementById("studentDOB").value,
		gender: selectedGender ? selectedGender.value : "",
		course: document.getElementById("studentCourse").value,
		skills: selectedSkills,
		about: document.getElementById("studentAbout").value,
		photo: document.getElementById("studentPhoto").files[0]
			? URL.createObjectURL(document.getElementById("studentPhoto").files[0])
			: "",
	};

	students.push(student);
	updateStats();
	renderStudents(document.getElementById("searchInput").value);
	studentForm.reset();
	console.log(students);
});
