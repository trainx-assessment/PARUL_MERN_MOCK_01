let form = document.querySelector("#studentForm");
let container = document.querySelector(".container");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.querySelector(".name").value;
    let email = document.querySelector(".email").value;
    let phone = document.querySelector(".phone").value;
    let date = document.querySelector(".date").value;
    let course = document.querySelector(".course").value;
    let text = document.querySelector(".text").value;

    container.innerHTML = `
        <div class="studentCard">

            <h3>${name}</h3>

            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>DOB: ${date}</p>
            <p>Course: ${course}</p>
            <p>About: ${text}</p>

        </div>
    `;
    
});