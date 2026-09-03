let btn = document.querySelector("btn");

let studentcount = document.querySelector("student-statistics")
let studentcard = document.querySelector("student-cards")

btn.addEventListener("click", () => {
    let studentName=document.querySelector("studentName").value;
    let studentEmail=document.querySelector("studentEmail").value;
    let studentPhone=document.querySelector("studentPhone").value;
    let studentDOB=document.querySelector("studentDOB").value;
    let studentGender=document.querySelector("studentGender").value;
    let studentCourse=document.querySelector("studentCourse").value;
    let studentSkills=document.querySelector("studentSkills").value;
    let about=document.querySelector("about").value;
    let extra=document.querySelector("extra").value;

    let card=document.createElement("div");
    card.innerHTML = `
        <h3> ${studentName} </h3>
        <p> ${studentEmail} </p>
        <p> ${studentPhone} </p>
        <p> ${studentDOB} </p>
        <p> ${studentGender} </p>
        <p> ${studentCourse} </p>
        <p> ${studentSkills} </p>
        <p> ${about} </p>
        <p> ${extra} </p>
    `

    student-cards.appendChild(card)
})


