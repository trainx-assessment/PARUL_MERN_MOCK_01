let students = JSON.parse(localStorage.getItem("students") || "[]");
let editId = null;

const $ = (id) => document.getElementById(id);

const name = $("name"), email = $("email"), phone = $("phone");
const dob = $("dob"), course = $("course"), about = $("about"), photo = $("photo");
const submitBtn = $("submitBtn"), resetBtn = $("resetBtn"), count = $("count");

const nameRx = /^[A-Za-z ]{3,40}$/;
const phoneRx = /^[0-9]{10}$/;
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const err = (id, msg) => { $(id).textContent = msg; };

const gender = () => document.querySelector('input[name="gender"]:checked')?.value || "";
const skills = () => [...document.querySelectorAll('input[name="skills"]:checked')].map(c => c.value);

about.addEventListener("input", () => {
  if (about.value.length > 200) about.value = about.value.slice(0, 200);
  count.textContent = about.value.length + " / 200";
  if (about.value.trim().length >= 20) err("aboutErr", "");
});

[name, email, phone].forEach((el, i) => {
  el.addEventListener("input", () => {
    const rx = [nameRx, emailRx, phoneRx][i];
    const id = ["nameErr", "emailErr", "phoneErr"][i];
    if (rx.test(el.value)) err(id, "");
  });
});

[dob, course].forEach((el, i) => {
  el.addEventListener("change", () => { if (el.value) err(["dobErr", "courseErr"][i], ""); });
});

document.querySelectorAll('input[name="gender"]').forEach(r =>
  r.addEventListener("change", () => { if (gender()) err("genderErr", ""); }));
document.querySelectorAll('input[name="skills"]').forEach(c =>
  c.addEventListener("change", () => { if (skills().length) err("skillsErr", ""); }));
photo.addEventListener("change", () => { if (photo.files.length) err("photoErr", ""); });

const age = (d) => {
  const b = new Date(d), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a;
};

function validate() {
  let ok = true;
  const set = (id, cond, msg) => { if (!cond) { err(id, msg); ok = false; } else err(id, ""); };

  set("nameErr", nameRx.test(name.value.trim()), "Name must be 3-40 letters/spaces");
  set("emailErr", emailRx.test(email.value.trim()), "Invalid email");
  set("phoneErr", phoneRx.test(phone.value.trim()), "Phone must be 10 digits");
  set("dobErr", dob.value && age(dob.value) >= 15 && new Date(dob.value) <= new Date(), "Must be 15+ and not future");
  set("genderErr", !!gender(), "Select gender");
  set("courseErr", !!course.value, "Select course");
  set("skillsErr", skills().length > 0, "Pick a skill");
  set("aboutErr", about.value.trim().length >= 20, "At least 20 characters");

  const f = photo.files[0];
  const typeRx = /^image\/(jpeg|png|jpg)$/;
  set("photoErr", f && typeRx.test(f.type), "Required JPG/PNG");
  return ok;
}

const save = () => localStorage.setItem("students", JSON.stringify(students));

const readFile = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = rej;
  r.readAsDataURL(file);
});

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;

  readFile(photo.files[0]).then((img) => {
    const data = { name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim(),
      dob: dob.value, gender: gender(), course: course.value, skills: skills(), about: about.value.trim(), photo: img };

    if (editId) {
      Object.assign(students.find(s => s.id === editId), data);
      editId = null;
    } else {
      students.push({ id: Date.now(), ...data });
    }
    save(); render(); stats(); reset();
  });
});

const fmtDate = (d) => d ? d.split("-").reverse().join("/") : "";

function render() {
  const term = $("search").value.trim().toLowerCase();
  const filter = $("filter").value;
  const list = students.filter(s =>
    s.name.toLowerCase().includes(term) && (!filter || s.course === filter));

  const box = $("cards");
  box.innerHTML = "";
  $("none").style.display = list.length ? "none" : "block";

  list.forEach(s => {
    box.innerHTML += `
      <div class="card" data-id="${s.id}">
        <div class="ph">${s.name.charAt(0).toUpperCase()}</div>
        <h3>${s.name}</h3>
        <p><strong>Email:</strong> ${s.email}</p>
        <p><strong>Phone:</strong> ${s.phone}</p>
        <p><strong>DOB:</strong> ${fmtDate(s.dob)}</p>
        <p><strong>Gender:</strong> ${s.gender}</p>
        <p><strong>Course:</strong> ${s.course}</p>
        <div class="tags">${s.skills.map(k => `<span class="tag">${k}</span>`).join("")}</div>
        <p><strong>About:</strong> ${s.about}</p>
        <div class="cardBtns">
          <button class="edit">Edit</button>
          <button class="del">Delete</button>
        </div>
      </div>`;
  });
}

$("cards").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  const id = parseInt(e.target.closest(".card").dataset.id, 10);

  if (btn.classList.contains("del")) {
    if (confirm("Delete this student?")) {
      students = students.filter(s => s.id !== id);
      if (editId === id) reset();
      save(); render(); stats();
    }
  }

  if (btn.classList.contains("edit")) {
    const s = students.find(x => x.id === id);
    editId = id;
    name.value = s.name; email.value = s.email; phone.value = s.phone;
    dob.value = s.dob; course.value = s.course; about.value = s.about;
    count.textContent = s.about.length + " / 200";
    document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = r.value === s.gender);
    document.querySelectorAll('input[name="skills"]').forEach(c => c.checked = s.skills.includes(c.value));
    submitBtn.textContent = "Update Student";
    clearErrs();
    $("regBox").scrollIntoView({ behavior: "smooth" });
  }
});

function clearErrs() {
  ["nameErr","emailErr","phoneErr","dobErr","genderErr","courseErr","skillsErr","aboutErr","photoErr"]
    .forEach(id => err(id, ""));
}

function reset() {
  $("form").reset();
  count.textContent = "0 / 200";
  submitBtn.textContent = "Register Student";
  editId = null;
  clearErrs();
}

resetBtn.addEventListener("click", reset);
$("search").addEventListener("input", render);
$("filter").addEventListener("change", render);

$("dark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  $("dark").textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

function stats() {
  $("total").textContent = students.length;
  const map = {};
  students.forEach(s => map[s.course] = (map[s.course] || 0) + 1);
  document.querySelectorAll(".stat").forEach(el =>
    el.querySelector("span:last-child").textContent = map[el.querySelector("span:first-child").textContent] || 0);
}

render();
stats();
