let cards = document.querySelector(".cards")
let students = [
    {
    id: 1,
    name: "Nishiraj",
    email: "nishiraj@gmail.com",
    phone: "+91 6268474575",
    dob: "10-10-2005",
    gender: "Male",
    course: "Web Development",
    skills: ["HTML", "CSS"],
    about: "Hi",
    photo: "/photo/nishiraj.png"
},
    {
    id: 2,
    name: "Nishiraj",
    email: "nishiraj@gmail.com",
    phone: "+91 6268474575",
    dob: "10-10-2005",
    gender: "Male",
    course: "Web Development",
    skills: ["HTML", "CSS"],
    about: "Hi",
    photo: "/photo/nishiraj.png"
},
    {
    id: 3,
    name: "Nishiraj",
    email: "nishiraj@gmail.com",
    phone: "+91 6268474575",
    dob: "10-10-2005",
    gender: "Male",
    course: "Web Development",
    skills: ["HTML", "CSS"],
    about: "Hi",
    photo: "/photo/nishiraj.png"
},
    {
    id: 4,
    name: "Nishiraj",
    email: "nishiraj@gmail.com",
    phone: "+91 6268474575",
    dob: "10-10-2005",
    gender: "Male",
    course: "Web Development",
    skills: ["HTML", "CSS"],
    about: "Hi",
    photo: "/photo/nishiraj.png"
}
];

students.forEach((std)=>{
    let student = document.createElement("div");
    student.innerHTML=`
        <img src="${std.photo}">
        <div>
        
        <h2>Name: ${std.name}</h2>
        <p>Id : ${std.id}</p>
        <p>DOB: ${std.dob}</p>
        <p>email: ${std.email}</p>
        <p>Phone: ${std.phone}</p>
        <p>Gender: ${std.gender}</p>
        <p>Course: ${std.course}</p>
        <p>Skills: ${std.skills}</p>
        <p>About: ${std.about}</p>
        </div>
    `
    student.classList.add("card");
    cards.appendChild(student);
})




