
const students =
{
    id: 1,
    name: "...",
    email: "...",
    phone: "...",
    dob: "...",
    gender: "...",
    course: "...",
    skills: ["HTML", "CSS"],
    about: "...",
    photo: "..."
}
let studentId = 1;


const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const student = {
    id: studentId++,
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    dob: document.getElementById("dob").value,
    gender: document.querySelector('input[name="Gender"]:checked')?.value || "",
    course: document.getElementById("courses").value,
    skills: Array.from(document.querySelectorAll(".skills input:checked"))
      .map(skill => skill.nextSibling.textContent.trim()),
    about: document.getElementById("about").value.trim(),
    
  };

  students.push(student);
})
