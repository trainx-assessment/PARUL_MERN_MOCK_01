document.addEventListener("DOMContentLoaded", function () {
	var form = document.querySelector("form");
	if (!form) return;
	const students = [];

	function get(name) {
		return form.querySelector('[name="' + name + '"], #' + name);
	}

	function message(input, text) {
		var old = input.parentElement.querySelector(".error-message");
		if (old) old.remove();
		if (text) {
			var span = document.createElement("small");
			span.className = "error-message";
			span.style.color = "red";
			span.textContent = text;
			input.parentElement.appendChild(span);
		}
	}

	var about = get("about") || get("aboutStudent");
	function resetForm() {
		form.reset();
		form.querySelectorAll(".error-message").forEach(function (error) {
			error.remove();
		});
		if (about) {
			var counter = about.parentElement.querySelector("small:not(.error-message)");
			if (counter) counter.textContent = "0 / 200";
		}
		var submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
		if (submitButton && submitButton.textContent.trim() === "Update Student") {
			submitButton.textContent = "Register Student";
		}
	}

	var resetButton = form.querySelector('button[type="reset"], input[type="reset"]');
	if (resetButton) {
		resetButton.addEventListener("click", function (event) {
			event.preventDefault();
			resetForm();
		});
	}

	if (about) {
		var counter = document.createElement("small");
		counter.textContent = "0 / 200";
		about.parentElement.appendChild(counter);
		about.addEventListener("input", function () {
			counter.textContent = about.value.length + " / 200";
			message(about, "");
		});
	}

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		var valid = true;
		var name = get("studentName") || get("name");
		var email = get("email");
		var phone = get("phone") || get("phoneNumber");
		var dob = get("dob") || get("dateOfBirth");
		var course = get("course");
		var photo = get("photo") || get("profilePhoto");

		if (name && !/^[A-Za-z ]{3,40}$/.test(name.value.trim())) {
			message(name, "Enter a valid name (3-40 letters only)"); valid = false;
		} else if (name) message(name, "");
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
			message(email, "Enter a valid email"); valid = false;
		} else if (email) message(email, "");
		if (phone && !/^\d{10}$/.test(phone.value.trim())) {
			message(phone, "Phone must contain 10 digits"); valid = false;
		} else if (phone) message(phone, "");
		if (dob && (!dob.value || new Date(dob.value) > new Date())) {
			message(dob, "Enter a valid date of birth"); valid = false;
		} else if (dob) message(dob, "");

		var gender = form.querySelector('input[name="gender"]:checked');
		if (!gender) { message(form.querySelector('input[name="gender"]'), "Select a gender"); valid = false; }
		if (course && !course.value) { message(course, "Select a course"); valid = false; }
		var skill = form.querySelector('input[name="skills"]:checked, input[name="skill"]:checked');
		if (!skill) { message(form.querySelector('input[name="skills"], input[name="skill"]'), "Select at least one skill"); valid = false; }
		if (about && (about.value.trim().length < 20 || about.value.trim().length > 200)) {
			message(about, "Write 20 to 200 characters"); valid = false;
		}
		if (photo && (!photo.files.length || !/^image\/(jpeg|png|jpg)$/.test(photo.files[0].type))) {
			message(photo, "Select a JPG, JPEG or PNG image"); valid = false;
		}

		if (valid) {
			var skills = Array.prototype.slice.call(
				form.querySelectorAll('input[name="skills"]:checked, input[name="skill"]:checked')
			).map(function (input) { return input.value; });
			var student = {
				id: students.length ? students[students.length - 1].id + 1 : 1,
				name: name ? name.value.trim() : "",
				email: email ? email.value.trim() : "",
				phone: phone ? phone.value.trim() : "",
				dob: dob ? dob.value : "",
				gender: gender ? gender.value : "",
				course: course ? course.value : "",
				skills: skills,
				about: about ? about.value.trim() : "",
				photo: photo && photo.files.length ? photo.files[0].name : ""
			};
			students.push(student);
			alert("Form submitted successfully");
			resetForm();
		}
	});
});