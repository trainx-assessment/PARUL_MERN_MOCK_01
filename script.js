const students = [
    {
        id: 1,
        name: "dhruv",
        email: "dhruv@gmail.com",
        phone: "123456789",
        dob: "2004-03-23",
        gender: "male",
        course: "Web development",
        skills: ["HTML", "CSS"],
        about: "ai student",
        photo: ""
    },
    {
        id: 2,
        name: "dhyey",
        email: "dhyey@gmail.com",
        phone: "123456789",
        dob: "2004-03-23",
        gender: "male",
        course: "Web development",
        skills: ["HTML", "CSS"],
        about: "ai student",
        photo: ""
    },
    {
        id: 3,
        name: "arsh",
        email: "arsh@gmail.com",
        phone: "123456789",
        dob: "2004-03-23",
        gender: "male",
        course: "Web development",
        skills: ["HTML", "CSS"],
        about: "ai student",
        photo: ""
    }
    
];

let cards = document.querySelector(".cards");

students.forEach(function(student) {

    let card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h2>${student.id}</h2>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Email:</strong>${student.email}</p>
        <p><strong>Phone:</strong> ${student.phone}</p>
        <p><strong>DOB: </strong>${student.dob}</p>
        <p><strong>Gender:</strong> ${student.gender}</p>
        <p><strong>Course: </strong>${student.course}</p>
    `;

    cards.appendChild(card);
});