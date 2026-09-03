  const form = document.getElementById("studentForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const email = document.getElementById("studentEmail").value.trim();
        const phone = document.getElementById("Phone Number").value.trim();
        const dob = document.getElementById("Date of Birth").value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const course = document.getElementById("course").value;

        if (name === "" || email === "" || phone === "" || dob === "") {
            alert("Please fill in all required details.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Phone number must contain 10 digits.");
            return;
        }

        if (!gender || course === "") {
            alert("Please select your gender and course.");
            return;
        }

        document.getElementById("detailName").textContent = name;
        document.getElementById("detailEmail").textContent = email;
        document.getElementById("detailPhone").textContent = phone;
        document.getElementById("detailCourse").textContent = course;
        document.getElementById("registrationDetails").hidden = false;

        alert("Registration successful!");
        form.reset();
    });
