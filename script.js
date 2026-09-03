const students = [];

const form = document.getElementById("form");
const about = document.getElementById("about");

about.oninput = () => {
    document.getElementById("count").textContent =
        about.value.length + " / 200";
};

form.onsubmit = e => {

    e.preventDefault();

    document.querySelectorAll("small").forEach(x => x.textContent = "");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const aboutText = about.value.trim();
    const photo = document.getElementById("photo").files[0];

    const gender =
        document.querySelector('input[name="gender"]:checked')?.value;

    const skills = [
        ...document.querySelectorAll('input[name="skill"]:checked')
    ].map(x => x.value);

    let ok = true;

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        nameError.textContent = "Invalid name";
        ok = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = "Invalid email";
        ok = false;
    }

    if (!/^\d{10}$/.test(phone)) {
        phoneError.textContent = "Enter 10 digits";
        ok = false;
    }

    if (!dob || new Date(dob) > new Date()) {
        dobError.textContent = "Invalid DOB";
        ok = false;
    }

    if (!gender) {
        genderError.textContent = "Select gender";
        ok = false;
    }

    if (!course) {
        courseError.textContent = "Select course";
        ok = false;
    }

    if (!skills.length) {
        skillError.textContent = "Select a skill";
        ok = false;
    }

    if (aboutText.length < 20) {
        aboutError.textContent = "Minimum 20 characters";
        ok = false;
    }

    if (!photo || !photo.type.startsWith("image/")) {
        photoError.textContent = "Select image";
        ok = false;
    }

    if (!ok) return;

    students.push({
        id: Date.now(),
        name,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about: aboutText,
        photo: URL.createObjectURL(photo)
    });

    show(students);

    total.textContent = students.length;

    form.reset();
    count.textContent = "0 / 200";
};

function show(list) {

    studentsBox = document.getElementById("students");
    studentsBox.innerHTML = "";

    list.forEach(s => {

        const card = document.createElement("div");

        card.classList.add("student-card");
        card.setAttribute("data-id", s.id);

        card.innerHTML = `
            <img src="${s.photo}">
            <h3>${s.name}</h3>
            <p>${s.email}</p>
            <p>${s.phone}</p>
            <p>${s.dob}</p>
            <p>${s.gender}</p>
            <p>${s.course}</p>
            <p>${s.skills.join(", ")}</p>
            <p>${s.about}</p>
            <button onclick="edit(${s.id})">Edit</button>
            <button onclick="remove(${s.id})">Delete</button>
        `;

        studentsBox.appendChild(card);
    });
}

function remove(id) {

    const i = students.findIndex(s => s.id === id);

    students.splice(i, 1);

    show(students);

    total.textContent = students.length;
}

function edit(id) {

    const s = students.find(x => x.id === id);

    name.value = s.name;
    email.value = s.email;
    phone.value = s.phone;
    dob.value = s.dob;
    course.value = s.course;
    about.value = s.about;

    students.splice(
        students.findIndex(x => x.id === id),
        1
    );

    show(students);

    total.textContent = students.length;
}

function searchStudents() {

    const text = search.value.toLowerCase();
    const courseName = filter.value;

    show(students.filter(s =>
        s.name.toLowerCase().includes(text) &&
        (!courseName || s.course === courseName)
    ));
}

search.oninput = searchStudents;
filter.onchange = searchStudents;