const students = [];

const form = document.getElementById("form");
const cards = document.getElementById("cards");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");

const searchInput = document.getElementById("search");
const filterInput = document.getElementById("filter");

let editId = null;

aboutInput.addEventListener("input", function () {
    document.getElementById("count").textContent =
        aboutInput.value.length + " / 200";
});
function clearErrors() {
    document.querySelectorAll("small").forEach(function (item) {
        item.textContent = "";
    });
}
form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    let valid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const course = courseInput.value;
    const about = aboutInput.value.trim();
    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );
    const skills = document.querySelectorAll(
        'input[name="skill"]:checked'
    );

    if (name.length < 3 || name.length > 40) {
        document.getElementById("nameErr").textContent =
            "Name must be 3 to 40 characters";
        valid = false;
    }
    if (!/^[A-Za-z ]+$/.test(name)) {
        document.getElementById("nameErr").textContent =
            "Only letters and spaces allowed";
        valid = false;
    }

    if (!email.includes("@")) {
        document.getElementById("emailErr").textContent =
            "Enter valid email";
        valid = false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
        document.getElementById("phoneErr").textContent =
            "Phone must contain 10 digits";
        valid = false;
    }
    if (!dob) {
        document.getElementById("dobErr").textContent =
            "Date of birth is required";
        valid = false;
    } else {
        const selected = new Date(dob);
        const today = new Date();
        if (selected > today) {
            document.getElementById("dobErr").textContent =
                "Future date is not allowed";
            valid = false;
        }
    }
    if (!gender) {
        document.getElementById("genderErr").textContent =
            "Select gender";
        valid = false;
    }
    if (course === "") {
        document.getElementById("courseErr").textContent =
            "Select course";
        valid = false;
    }
    if (skills.length === 0) {
        document.getElementById("skillErr").textContent =
            "Select at least one skill";
        valid = false;
    }
    if (about.length < 20) {
        document.getElementById("aboutErr").textContent =
            "About must be at least 20 characters";
        valid = false;
    }
    if (!photoInput.files[0] && editId === null) {
        document.getElementById("photoErr").textContent =
            "Select a photo";
        valid = false;
    }
    if (!valid) {
        return;
    }
    let skillList = [];
    skills.forEach(function (skill) {
        skillList.push(skill.value);
    });
    let photo = "";
    if (photoInput.files[0]) {
        photo = URL.createObjectURL(photoInput.files[0]);
    }
    if (editId === null) {
        const student = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender.value,
            course: course,
            skills: skillList,
            about: about,
            photo: photo
        };
        students.push(student);
    } else {
        const student = students.find(function (item) {
            return item.id === editId;
        });

        if (student) {
            student.name = name;
            student.email = email;
            student.phone = phone;
            student.dob = dob;
            student.gender = gender.value;
            student.course = course;
            student.skills = skillList;
            student.about = about;
            if (photo) {
                student.photo = photo;
            }
        }
    }
    render();
    stats();
    form.reset();
    editId = null;
    document.getElementById("save").textContent =
        "Register Student";
    document.getElementById("count").textContent = "0 / 200";
});

function render() {
    cards.innerHTML = "";
    let search = searchInput.value.toLowerCase();
    let filter = filterInput.value;
    let list = students.filter(function (student) {
        return student.name.toLowerCase().includes(search);
    });
    if (filter !== "") {
        list = students.filter(function (student) {
            return student.course === filter;
        });
    }
    if (list.length === 0) {
        cards.innerHTML = "<p>No students found</p>";
        return;
    }
    list.forEach(function (student) {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);
        const img = document.createElement("img");

        if (student.photo) {
            img.src = student.photo;
        }

        img.alt = student.name;

        const title = document.createElement("h3");
        title.textContent = student.name;

        const email = document.createElement("p");
        email.textContent = "Email: " + student.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + student.phone;

        const dob = document.createElement("p");
        dob.textContent = "DOB: " + student.dob;

        const gender = document.createElement("p");
        gender.textContent = "Gender: " + student.gender;

        const course = document.createElement("p");
        course.textContent = "Course: " + student.course;

        const skill = document.createElement("p");
        skill.textContent = "Skills: " + student.skills.join(", ");

        const about = document.createElement("p");
        about.textContent = student.about;

        const buttons = document.createElement("div");
        buttons.classList.add("card-btns");


        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.classList.add("edit");

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.classList.add("del");

        buttons.append(edit);
        buttons.append(del);

        card.append(
            img,
            title,
            email,
            phone,
            dob,
            gender,
            course,
            skill,
            about,
            buttons
        );

        cards.append(card);
    });
}

cards.addEventListener("click", function (e) {

    if (e.target.classList.contains("del")) {
        const card = e.target.closest(".student-card");
        const id = Number(card.dataset.id);
        const index = students.findIndex(function (student) {
            return student.id === id;
        });
        if (index !== -1) {
            students.splice(index, 1);
        }
        render();
        stats();
    }
});

cards.addEventListener("click", function (e) {

    if (!e.target.classList.contains("edit")) {
        return;
    }
    const card = e.target.closest(".student-card");
    const id = Number(card.dataset.id);
    const student = students.find(function (item) {
        return item.id === id;
    });
    if (!student) {
        return;
    }
    editId = student.id;
    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseInput.value = student.course;
    aboutInput.value = student.about;
    document.querySelector(
        'input[name="gender"][value="' + student.gender + '"]'
    ).checked = true;
    document.querySelectorAll('input[name="skill"]').forEach(function (box) {
        if (student.skills.includes(box.value)) {
            box.checked = true;
        }
    });
    document.getElementById("save").textContent =
        "Update Student";
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

searchInput.addEventListener("input", function () {
    render();
});

filterInput.addEventListener("change", function () {
    render();
});

function stats() {

    document.getElementById("total").textContent =
        students.length;

    document.getElementById("mern").textContent =
        students.filter(s => s.course === "MERN").length;

    document.getElementById("java").textContent =
        students.filter(s => s.course === "Java").length;

    document.getElementById("python").textContent =
        students.filter(s => s.course === "Python").length;

    document.getElementById("ai").textContent =
        students.filter(s => s.course === "AI/ML").length;

    document.getElementById("ds").textContent =
        students.filter(s => s.course === "Data Science").length;
}

document.getElementById("reset").addEventListener("click", function () {

    clearErrors();

    document.getElementById("count").textContent =
        "0 / 200";

    document.getElementById("save").textContent =
        "Register Student";
});

render();
stats();