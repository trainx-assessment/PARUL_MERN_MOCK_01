const studentForm = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
let students = [];
let studentId = 1;

studentForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const name =
        document.querySelector("#name").value;
    const email =
        document.querySelector("#email").value;
    const phone =
        document.querySelector("#phone-number").value;
    const dob =
        document.querySelector("#DOB").value;
    
    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        ).value;
   
    const course =
        document.querySelector("#courseSelector").value;
   
    const selectedSkills = [];
    const skillCheckboxes =
        document.querySelectorAll(
            '.skills-option input[type="checkbox"]'
        );
    skillCheckboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            selectedSkills.push(checkbox.value);
        }
    });
   
    const about =
        document.querySelector("#about-student").value;
    
    const photoInput =
        document.querySelector("#profile-pic");
    let photo = "";
    if (photoInput.files.length > 0) {
        photo =
            URL.createObjectURL(photoInput.files[0]);
    }
    else {
        photo =
            "https://via.placeholder.com/120";
    }
   
    const student = {
        id: studentId,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: selectedSkills,
        about: about,
        photo: photo
    };
    
    students.push(student);
    studentId++;
   
    displayStudents();
    updateStatistics();
    
    studentForm.reset();
});

function displayStudents() {
    studentContainer.innerHTML = "";
    // Search value
    const searchValue =
        searchInput.value.toLowerCase();
    
    const selectedCourse =
        courseFilter.value;
    students.forEach(function(student) {
        
        const matchesSearch =
            student.name
                .toLowerCase()
                .includes(searchValue);
      
        const matchesCourse =
            selectedCourse === "all" ||
            student.course === selectedCourse;
        if (!matchesSearch || !matchesCourse) {
            return;
        }
        
        const card =
            document.createElement("div");
        card.classList.add("student-card");
      
        card.setAttribute(
            "data-id",
            student.id
        );
       
        const img =
            document.createElement("img");
        img.setAttribute(
            "src",
            student.photo
        );
        img.setAttribute(
            "alt",
            student.name
        );
       
        const name =
            document.createElement("h2");
        name.textContent =
            student.name;
        
        const email =
            document.createElement("p");
        email.textContent =
            "Email: " + student.email;
       
        const phone =
            document.createElement("p");
        phone.textContent =
            "Phone: " + student.phone;
        
        const dob =
            document.createElement("p");
        dob.textContent =
            "DOB: " + student.dob;
       
        const gender =
            document.createElement("p");
        gender.textContent =
            "Gender: " + student.gender;
        
        const course =
            document.createElement("p");
        course.textContent =
            "Course: " + student.course;
       
        const skills =
            document.createElement("p");
        skills.textContent =
            "Skills: " +
            student.skills.join(", ");
        
        const about =
            document.createElement("p");
        about.textContent =
            "About: " + student.about;
        
        const buttonContainer =
            document.createElement("div");
        buttonContainer.classList.add(
            "card-buttons"
        );
        
        const editButton =
            document.createElement("button");
        editButton.textContent =
            "Edit";
        
        const deleteButton =
            document.createElement("button");
        deleteButton.textContent =
            "Delete";
        
        deleteButton.addEventListener(
            "click",
            function() {
                const id =
                    Number(
                        card.getAttribute("data-id")
                    );
                const index =
                    students.findIndex(
                        function(student) {
                            return student.id === id;
                        }
                    );
                students.splice(index, 1);
                displayStudents();
                updateStatistics();
            }
        );
      
        editButton.addEventListener(
            "click",
            function() {
                const id =
                    Number(
                        card.getAttribute("data-id")
                    );
                const student =
                    students.find(
                        function(student) {
                            return student.id === id;
                        }
                    );
                const newName =
                    prompt(
                        "Enter new name:",
                        student.name
                    );
                if (
                    newName !== null &&
                    newName !== ""
                ) {
                    student.name =
                        newName;
                }
                const newCourse =
                    prompt(
                        "Enter new course:",
                        student.course
                    );
                if (
                    newCourse !== null &&
                    newCourse !== ""
                ) {
                    student.course =
                        newCourse;
                }
                displayStudents();
                updateStatistics();
            }
        );
        
        buttonContainer.append(
            editButton,
            deleteButton
        );
        
        card.append(
            img,
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            about,
            buttonContainer
        );
        
        studentContainer.appendChild(card);
    });
}

function updateStatistics() {
    
    document.querySelector(
        "#totalStudents"
    ).textContent =
        students.length;
    
    let webDevelopment = 0;
    let uiux = 0;
    let python = 0;
    let dataAnalytics = 0;
    let mern = 0;
    let cloud = 0;
    
    students.forEach(function(student) {
        if (student.course === "Web Development") {
            webDevelopment++;
        }
        if (student.course === "UI/UX") {
            uiux++;
        }
        if (student.course === "Python") {
            python++;
        }
        if (student.course === "Data Analytics") {
            dataAnalytics++;
        }
        if (student.course === "MERN Stack") {
            mern++;
        }
        if (student.course === "Cloud Computing") {
            cloud++;
        }
    });
    
    document.querySelector(
        "#webDevelopment"
    ).textContent =
        webDevelopment;
    document.querySelector(
        "#uiux"
    ).textContent =
        uiux;
    document.querySelector(
        "#python"
    ).textContent =
        python;
    document.querySelector(
        "#dataAnalytics"
    ).textContent =
        dataAnalytics;
    document.querySelector(
        "#mern"
    ).textContent =
        mern;
    document.querySelector(
        "#cloud"
    ).textContent =
        cloud;
}

searchInput.addEventListener(
    "input",
    function() {
        displayStudents();
    }
);

courseFilter.addEventListener(
    "change",
    function() {
        displayStudents();
    }
);