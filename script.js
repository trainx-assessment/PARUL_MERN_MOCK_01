const form = document.querySelector("#registration-form");

const usersDB = localStorage.usersDB
  ? (JSON.parse(localStorage.usersDB) ?? [])
  : [];

const user = {
  id: usersDB.length,
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  course: "",
  skills: [],
  about: "",
  photo: "",
};

const err = {
  nameErr: {
    element: document.querySelector("#name-err"),
    errString: "",
  },

  emailErr: {
    element: document.querySelector("#email-err"),
    errString: "",
  },

  phoneErr: {
    element: document.querySelector("#phone-err"),
    errString: "",
  },

  dobErr: {
    element: document.querySelector("#dob-err"),
    errString: "",
  },
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(e.target);

  const name = data.get("name") ?? "";
  const email = data.get("email") ?? "";
  const phone = data.get("number") ?? "";
  const dob = data.get("dob") ?? "";
  const gender = data.get("gender") ?? "";
  const course = data.get("course") ?? "";

  let htmlSkill = data.get("html") ?? "";
  htmlSkill = htmlSkill == "" || htmlSkill == "off" ? false : true;

  let cssSkill = data.get("css") ?? "";
  cssSkill = cssSkill == "" || cssSkill == "off" ? false : true;

  let javascriptSkill = data.get("javascript") ?? "";
  javascriptSkill =
    javascriptSkill == "" || javascriptSkill == "off" ? false : true;

  let gitSkill = data.get("git") ?? "";
  gitSkill = gitSkill == "" || gitSkill == "off" ? false : true;

  let reactSkill = data.get("react") ?? "";
  reactSkill = reactSkill == "" || reactSkill == "off" ? false : true;

  let nodejsSkill = data.get("nodejs") ?? "";
  nodejsSkill = nodejsSkill == "" || nodejsSkill == "off" ? false : true;

  const about = data.get("about") ?? "";
  const profilePicture = data.get("profile-picture") ?? "";

  let hasErr = false;

  if (!validateName(name)) {
    const { element, errString } = err.nameErr;
    element.textContent = errString;
    hasErr = true;
  } else {
    const { element, errString } = err.nameErr;

    element.textContent = errString;
  }

  if (!validateEmail(email)) {
    const { element, errString } = err.emailErr;
    element.textContent = errString;
    hasErr = true;
  } else {
    const { element, errString } = err.emailErr;

    element.textContent = errString;
  }

  if (!validatePhone(phone)) {
    const { element, errString } = err.phoneErr;
    element.textContent = errString;
    hasErr = true;
  } else {
    const { element, errString } = err.phoneErr;

    element.textContent = errString;
  }

  if (!validateDOB(dob)) {
    const { element, errString } = err.dobErr;
    element.textContent = errString;
    hasErr = true;
  } else {
    const { element, errString } = err.dobErr;

    element.textContent = errString;
  }

  //   skip rest validation, as its taking too much time to implement

  if (hasErr) return;

  user.name = name;
  user.email = email;
  user.phone = phone;
  user.dob = dob;
  user.gender = gender;
  user.course = course;

  if (htmlSkill) user.skills.push("HTML");
  if (cssSkill) user.skills.push("CSS");
  if (javascriptSkill) user.skills.push("Javascript");
  if (gitSkill) user.skills.push("Git");
  if (reactSkill) user.skills.push("React");
  if (nodejsSkill) user.skills.push("Node.js");

  user.about = about;

  usersDB.push(user);

  localStorage.usersDB = JSON.stringify(usersDB);

  renderUsers();
});

function validateName(name) {
  if (!name) err.nameErr.errString = "Name is required.";
  else if (name.length < 3) {
    err.nameErr.errString = "Name must be greater than 3 characters.";
    return false;
  } else if (name.length > 40) {
    err.nameErr.errString = "Name must be less than 40 characters.";
    return false;
  } else {
    err.nameErr.errString = "";
    for (let c of name) {
      if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == " ") {
        continue;
      } else {
        err.nameErr.errString = "Only letters and spaces are allowed.";
        return false;
      }
    }
  }

  return true;
}

function validateEmail(email) {
  if (!email.includes("@") || !email.includes(".")) {
    err.emailErr.errString = "Invalid Email";
    return false;
  } else {
    err.emailErr.errString = "";
  }
  return true;
}

function validatePhone(number) {
  if (number.length < 10 || number.length > 10) {
    err.phoneErr.errString = "Invalid Phone number";
    return false;
  } else {
    err.phoneErr.errString = "";
    for (const c of number) {
      if (c >= "0" || c <= "9") {
        continue;
      } else {
        err.phoneErr.errString = "Invalid phone number";
        return false;
      }
    }
  }

  return true;
}

function validateDOB(dob) {
  const currentDate = new Date();

  const dobDate = new Date(dob);

  if (dobDate.getFullYear() > currentDate.getFullYear() - 15) {
    err.dobErr.errString = "Student must be at least 15 years old.";
    return false;
  } else {
    err.dobErr.errString = "";
  }

  return true;
}

const studentCardHolder = document.querySelector("#student-cards");

function renderUsers() {
  studentCardHolder.innerHTML = "";
  usersDB.forEach((u) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.dataset.id = u.id;

    const n = document.createElement("h2");
    n.textContent = u.name;
    const e = document.createElement("p");
    e.textContent = u.email;
    const p = document.createElement("p");
    p.textContent = u.phone;
    const d = document.createElement("p");
    d.textContent = u.dob;
    const g = document.createElement("p");
    g.textContent = "Gender: " + u.gender;
    const c = document.createElement("p");
    c.textContent = "Course: " + u.course;

    const s = document.createElement("p");
    s.textContent = "Skills: " + u.skills.join(", ");

    const a = document.createElement("p");
    a.textContent = "About Me:  " + u.about;

    card.append(n, e, p, d, g, c, s, a);

    studentCardHolder.append(card);
  });
}

renderUsers();
