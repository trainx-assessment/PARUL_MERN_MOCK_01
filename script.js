const form = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value;

    const photoInput = document.getElementById("studentPhoto");

    if (photoInput.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function () {
            createStudent(name,  email,phone,dob,gender,course,skills,about,reader.result );
        };

        reader.readAsDataURL(photoInput.files[0]);
    } else {
        createStudent( name, email, phone, dob, gender, course, skills, about,
         ""
        );
    }
});

