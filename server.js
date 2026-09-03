const form = document.querySelector(".form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phoneNumber");
const courseInput = document.getElementById("course");
const skillsInput = document.getElementById("skills");
const photoInput = document.getElementById("profile-photo");
const aboutInput = document.getElementById("about1");
const genderInputs = document.querySelectorAll('input[name="gender"]');

function validateInput(input, pattern, message) {
    input.addEventListener("input", function () {
        if (this.value.trim() === "") {
            this.setCustomValidity("");
        } else if (!pattern.test(this.value.trim())) {
            this.setCustomValidity(message);
        } else {
            this.setCustomValidity("");
        }
    });
}

validateInput(
    nameInput,
    /^[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/,
    "Please enter a valid name."
);                  
validateInput(
    emailInput,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Please enter a valid email address."
);
validateInput(
    phoneInput,
    /^\d{10}$/,
    "Please enter a valid 10-digit phone number."
);
validateInput(
    courseInput,
    /^[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/,
    "Please enter a valid course."
);
validateInput(
    skillsInput,
    /^[a-zA-Z]+(?:[ ,][a-zA-Z]+)*$/,
    "Please enter valid skills separated by commas."
);

photoInput.addEventListener("change", function () {
    const file = this.files[0];
    this.setCustomValidity(
        file && file.type.startsWith("image/")
            ? ""
            : "Please upload a valid image file."
    );
});

aboutInput.addEventListener("input", function () {
    this.setCustomValidity(
        this.value.length > 200 ? "About must be 200 characters or fewer." : ""
    );
});

form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
    }
});

genderInputs.forEach(function (input) {
    input.addEventListener("change", function () {
        genderInputs.forEach(function (genderInput) {
            genderInput.setCustomValidity("");
        });
    });
});

