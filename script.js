const form = document.getElementById("student-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("student-name").value.trim();
    const email = document.getElementById("student-email").value.trim();
    const phone = document.getElementById("student-phone").value.trim();
    const dob = document.getElementById("student-dob").value;
    const gender = document.querySelector('input[name="studentGender"]:checked');
    const course = document.getElementById("student-course").value;
    const skills = document.getElementById("student-skills").value;
    const about = document.getElementById("student-about").value.trim();
    const photo = document.getElementById("student-photo").files[0];
    let valid = true;

    document.getElementById("name-error").innerText = "";
    document.getElementById("email-error").innerText = "";
    document.getElementById("phone-error").innerText = "";
    document.getElementById("dob-error").innerText = "";
    document.getElementById("gender-error").innerText = "";
    document.getElementById("course-error").innerText = "";
    document.getElementById("skills-error").innerText = "";
    document.getElementById("about-error").innerText = "";
    document.getElementById("photo-error").innerText = "";

    let nameHasInvalidCharacter = false;
    const letters = "abcdefghijklmnopqrstuvwxyz ";
    for (let i = 0; i < name.length; i++) {
        if (!letters.includes(name[i].toLowerCase())) {
            nameHasInvalidCharacter = true;
        }
    }

    if (name === "") {
        document.getElementById("name-error").innerText = "Student name is required.";
        valid = false;
    } else if (name.length < 3 || name.length > 40 || nameHasInvalidCharacter) {
        document.getElementById("name-error").innerText = "Enter 3 to 40 letters and spaces only.";
        valid = false;
    }

    if (email === "") {
        document.getElementById("email-error").innerText = "Email is required.";
        valid = false;
    } else if (!email.includes("@") || !email.includes(".") || email.startsWith("@") || email.endsWith("@")) {
        document.getElementById("email-error").innerText = "Enter a valid email address.";
        valid = false;
    }

    let phoneHasInvalidCharacter = false;
    const numbers = "0123456789";
    for (let i = 0; i < phone.length; i++) {
        if (!numbers.includes(phone[i])) {
            phoneHasInvalidCharacter = true;
        }
    }

    if (phone === "") {
        document.getElementById("phone-error").innerText = "Phone number is required.";
        valid = false;
    } else if (phone.length !== 10 || phoneHasInvalidCharacter) {
        document.getElementById("phone-error").innerText = "Phone number must contain exactly 10 digits.";
        valid = false;
    }

    if (dob === "") {
        document.getElementById("dob-error").innerText = "Date of birth is required.";
        valid = false;
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        if (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate > today) {
            document.getElementById("dob-error").innerText = "Future dates are not allowed.";
            valid = false;
        } else if (age < 15) {
            document.getElementById("dob-error").innerText = "Student must be at least 15 years old.";
            valid = false;
        }
    }

    if (gender === null) {
        document.getElementById("gender-error").innerText = "Select a gender.";
        valid = false;
    }

    if (course === "") {
        document.getElementById("course-error").innerText = "Select a course.";
        valid = false;
    }

    if (skills === "") {
        document.getElementById("skills-error").innerText = "Select at least one skill.";
        valid = false;
    }

    if (about === "") {
        document.getElementById("about-error").innerText = "About student is required.";
        valid = false;
    } else if (about.length < 20 || about.length > 200) {
        document.getElementById("about-error").innerText = "About student must be 20 to 200 characters.";
        valid = false;
    }

    if (photo === undefined) {
        document.getElementById("photo-error").innerText = "Profile photo is required.";
        valid = false;
    } else if (photo.type !== "image/jpeg" && photo.type !== "image/png") {
        document.getElementById("photo-error").innerText = "Select a JPG, JPEG, or PNG image.";
        valid = false;
    }

    if (!valid) {
        return;
    }
});

document.getElementById("student-name").addEventListener("input", () => document.getElementById("name-error").innerText = "");
document.getElementById("student-email").addEventListener("input", () => document.getElementById("email-error").innerText = "");
document.getElementById("student-phone").addEventListener("input", () => document.getElementById("phone-error").innerText = "");
document.getElementById("student-dob").addEventListener("change", () => document.getElementById("dob-error").innerText = "");
document.getElementById("student-male").addEventListener("change", () => document.getElementById("gender-error").innerText = "");
document.getElementById("student-female").addEventListener("change", () => document.getElementById("gender-error").innerText = "");
document.getElementById("student-course").addEventListener("change", () => document.getElementById("course-error").innerText = "");
document.getElementById("student-skills").addEventListener("change", () => document.getElementById("skills-error").innerText = "");
document.getElementById("student-photo").addEventListener("change", () => document.getElementById("photo-error").innerText = "");

document.getElementById("student-about").addEventListener("input", () => {
    const aboutLength = document.getElementById("student-about").value.length;
    document.getElementById("about-counter").innerText = aboutLength + " / 200";
    document.getElementById("about-error").innerText = "";
});

form.addEventListener("reset", () => {
    document.querySelectorAll(".error-message").forEach((error) => error.innerText = "");
    document.getElementById("about-counter").innerText = "0 / 200";
});
