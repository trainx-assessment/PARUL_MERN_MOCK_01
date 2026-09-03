const form = document.getElementById("studentForm");
const about = document.getElementById("about");
const counter = document.getElementById("aboutCounter");
const msg = document.getElementById("formMessage");
const cards = document.getElementById("studentCards");
const total = document.getElementById("totalStudents");
const stats = document.getElementById("courseStats");
const search = document.getElementById("search");
const list = [];
let id = 1;

function error(name, text) {
	const field = document.getElementById(name);
	const message = document.getElementById(`${name}Error`);
	message.textContent = text;
	message.classList.toggle("visible", Boolean(text));
	if (field) field.setAttribute("aria-invalid", Boolean(text));
	return !text;
}

function valid(name) {
	const field = document.getElementById(name);
	const value = field.value.trim();
	let ok = value !== "";

	if (name === "name") ok = /^[A-Za-z ]{3,40}$/.test(value);
	if (name === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	if (name === "phone") ok = /^\d{10}$/.test(value);
	if (name === "about") ok = value.length >= 20 && value.length <= 200;
	if (name === "photo") {
		const file = field.files[0];
		ok = file && /^(image\/jpeg|image\/png)$/.test(file.type);
	}

	return error(name, ok ? "" : name);
}

function groups() {
	const gender = document.querySelector('input[name="gender"]:checked');
	const skills = document.querySelectorAll('input[name="skill"]:checked');
	error("gender", gender ? "" : "gender");
	error("skill", skills.length ? "" : "skill");
	return gender && skills.length;
}

function render() {
	cards.innerHTML = "";
	const text = search.value.toLowerCase();
	const shown = list.filter((student) => student.name.toLowerCase().includes(text));
	shown.forEach((student) => {
		const card = document.createElement("article");
		card.className = "student-card";
		card.innerHTML = `<img src="${student.photo}" alt="${student.name}'s photo"><h3>${student.name}</h3>`;
		["email", "phone", "dob", "gender", "course", "about"].forEach((key) => {
			const p = document.createElement("p");
			p.textContent = `${key}: ${student[key]}`;
			card.appendChild(p);
		});
		const skills = document.createElement("p");
		skills.textContent = `skills: ${student.skills.join(", ")}`;
		card.appendChild(skills);

		const drop = document.createElement("button");
		drop.textContent = "Drop";
		drop.onclick = () => {
			list.splice(list.indexOf(student), 1);
			render();
			updateStats();
		};
		card.appendChild(drop);
		cards.appendChild(card);
	});

	if (!shown.length) cards.innerHTML = "<p>None</p>";
}

function updateStats() {
	total.textContent = list.length;
	stats.replaceChildren();
	["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"].forEach((course) => {
		const p = document.createElement("p");
		p.textContent = `${course}: ${list.filter((student) => student.course === course).length}`;
		stats.appendChild(p);
	});
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const names = ["name", "email", "phone", "dob", "course", "about", "photo"];
	const ok = names.every(valid) && groups();
	if (!ok) {
		msg.textContent = "Fix";
		msg.className = "error-message visible";
		return;
	}

	const file = document.getElementById("photo").files[0];
	list.push({
		id: id++,
		name: document.getElementById("name").value.trim(),
		email: document.getElementById("email").value.trim(),
		phone: document.getElementById("phone").value.trim(),
		dob: document.getElementById("dob").value,
		gender: document.querySelector('input[name="gender"]:checked').value,
		course: document.getElementById("course").value,
		skills: [...document.querySelectorAll('input[name="skill"]:checked')].map((input) => input.value),
		about: about.value.trim(),
		photo: URL.createObjectURL(file)
	});
	form.reset();
	msg.textContent = "Saved";
	msg.className = "success-message";
	render();
	updateStats();
});

form.addEventListener("input", (event) => {
	if (event.target.id) valid(event.target.id);
	counter.textContent = `${about.value.length} / 200`;
});
form.addEventListener("change", () => groups());
form.addEventListener("reset", () => window.setTimeout(() => {
	document.querySelectorAll(".error-message").forEach((item) => item.classList.remove("visible"));
	msg.textContent = "";
	counter.textContent = "0 / 200";
}, 0));
search.addEventListener("input", render);
render();
updateStats();
