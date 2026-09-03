// =========================
// GET HTML ELEMENTS
// =========================

const form = document.getElementById("registrationForm");

const studentCount = document.getElementById("studentCount");

const studentCards = document.getElementById("studentCards");


// =========================
// STUDENT COUNT
// =========================

let totalStudents = 0;


// =========================
// FORM SUBMIT
// =========================

form.addEventListener("submit", function (event) {

    // Stop page from refreshing
    event.preventDefault();


    // =========================
    // GET FORM VALUES
    // =========================

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const phone = document.getElementById("phone").value;

    const dob = document.getElementById("dob").value;

    const gender = document.getElementById("gender").value;

    const course = document.getElementById("course").value;

    const about = document.getElementById("about").value;


    // =========================
    // GET SELECTED SKILLS
    // =========================

    const selectedSkills = [];

    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );


    skills.forEach(function (skill) {

        selectedSkills.push(skill.value);

    });


    // =========================
    // GET PROFILE PHOTO
    // =========================

    const photoInput = document.getElementById("photo");

    let photoURL = "";


    if (photoInput.files.length > 0) {

        photoURL = URL.createObjectURL(
            photoInput.files[0]
        );

    }


    // =========================
    // UPDATE COUNT
    // =========================

    totalStudents++;

    studentCount.textContent = totalStudents;


    // =========================
    // CREATE STUDENT CARD
    // =========================

    createStudentCard(
        name,
        email,
        phone,
        dob,
        gender,
        course,
        selectedSkills,
        about,
        photoURL
    );


    // =========================
    // RESET FORM
    // =========================

    form.reset();

});


// =========================
// CREATE STUDENT CARD
// =========================

function createStudentCard(
    name,
    email,
    phone,
    dob,
    gender,
    course,
    skills,
    about,
    photoURL
) {

    // Create card
    const card = document.createElement("div");

    card.classList.add("student-card");


    // =========================
    // GET INITIALS
    // =========================

    const initials = getInitials(name);


    // =========================
    // CREATE SKILLS
    // =========================

    let skillsHTML = "";


    if (skills.length > 0) {

        skills.forEach(function (skill) {

            skillsHTML += `
                <span class="skill-tag">
                    ${escapeHTML(skill)}
                </span>
            `;

        });

    } else {

        skillsHTML = "No skills added";

    }


    // =========================
    // CREATE AVATAR
    // =========================

    let avatarHTML;


    if (photoURL !== "") {

        avatarHTML = `
            <img
                src="${photoURL}"
                alt="${escapeHTML(name)}"
            >
        `;

    } else {

        avatarHTML = initials;

    }


    // =========================
    // CARD HTML
    // =========================

    card.innerHTML = `

        <div class="student-card-body">


            <!-- Avatar -->

            <div class="student-avatar">

                ${avatarHTML}

            </div>


            <!-- Student Information -->

            <div class="student-info">


                <h3>
                    ${escapeHTML(name)}
                </h3>


                <p class="student-detail">
                    <b>Course:</b>
                    ${escapeHTML(course)}
                </p>


                <p class="student-detail">
                    <b>Email:</b>
                    ${escapeHTML(email)}
                </p>


                <p class="student-detail">
                    <b>Phone:</b>
                    ${escapeHTML(phone)}
                </p>


                <p class="student-detail">
                    <b>Date of Birth:</b>
                    ${escapeHTML(dob)}
                </p>


                <p class="student-detail">
                    <b>Gender:</b>
                    ${escapeHTML(gender)}
                </p>


                <div class="student-skills">

                    <b>Skills:</b>

                    ${skillsHTML}

                </div>


                <p class="student-about">

                    <b>About:</b>

                    ${escapeHTML(
                        about || "Not provided"
                    )}

                </p>


                <div class="student-actions">

                    <button type="button">
                        Message
                    </button>

                    <button type="button">
                        Following
                    </button>

                </div>

            </div>

        </div>


        <div class="student-tabs">

            Posts &nbsp;&nbsp;
            About &nbsp;&nbsp;
            Stats

        </div>

    `;


    // =========================
    // ADD CARD TO LIST
    // =========================

    studentCards.appendChild(card);

}


// =========================
// GET STUDENT INITIALS
// =========================

function getInitials(name) {

    const words = name.trim().split(" ");


    // Single word name

    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    // Multiple word name

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}




function escapeHTML(text) {

    return text

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
