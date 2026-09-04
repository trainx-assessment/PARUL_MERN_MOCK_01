
//# Task number 5 hai ye— Create and Store Student Data

const students = [];
let studentId = 1; 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const totalStudents = document.getElementById("totalStudents");
  const studentCards = document.getElementById("studentCards");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

   
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value.trim();
    const photoInput = document.getElementById("photo");

   
    const skills = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      skills.push(cb.value);
    });

    
    if (!name || !email || !phone || !dob || !gender || !course || !about) {
      alert("Please fill all required fields!");
      return;
    }

    if (about.length > 200) {
      alert("About Student must be max 200 characters.");
      return;
    }

   
    let photoURL = "";
    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];
      photoURL = URL.createObjectURL(file);
    }

   
    const student = {
      id: studentId++,
      name,
      email,
      phone,
      dob,
      gender,
      course,
      skills,
      about,
      photo: photoURL
    };

    
    students.push(student);

    
    totalStudents.textContent = students.length;

   
    displayStudentCard(student);

    
    form.reset();
  });


  function displayStudentCard(student) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${student.name}</h3>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>Phone:</strong> ${student.phone}</p>
      <p><strong>DOB:</strong> ${student.dob}</p>
      <p><strong>Gender:</strong> ${student.gender}</p>
      <p><strong>Course:</strong> ${student.course}</p>
      <p><strong>Skills:</strong> ${student.skills.join(", ")}</p>
      <p><strong>About:</strong> ${student.about}</p>
      ${student.photo ? `<img src="${student.photo}" alt="Profile Photo" style="width:100%;border-radius:6px;margin-top:10px;">` : ""}
    `;

    studentCards.appendChild(card);
  }
});




// # Tasks 6 Hain — Dynamic Student Cards

  
  function displayStudentCard(student) {

    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    
    if (student.photo) {
      const img = document.createElement("img");
      img.src = std.photo;
      img.alt = "Profile Photo";
      img.style.width = "100%";
      img.style.borderRadius = "6px";
      img.style.marginBottom = "10px";
      card.appendChild(img);
    }

    // Ye name ke liye
    const nameEl = document.createElement("h3");
    nameEl.textContent = student.name;
    card.appendChild(nameEl);

    // // Ye email ke liye
    const emailEl = document.createElement("p");
    emailEl.textContent = `Email: ${student.email}`;
    card.appendChild(emailEl);

    // ye Phone number ke liye 
    const phoneEl = document.createElement("p");
    phoneEl.textContent = `Phone: ${student.phone}`;
    card.appendChild(phoneEl);

    // ye dob ke liye 
    const dobEl = document.createElement("p");
    dobEl.textContent = `DOB: ${student.dob}`;
    card.appendChild(dobEl);

    // ye gender ke liye Gender
    const genderEl = document.createElement("p");
    genderEl.textContent = `Gender: ${student.gender}`;
    card.appendChild(genderEl);

    // ye course ke liye 
    const courseEl = document.createElement("p");
    courseEl.textContent = `Course: ${student.course}`;
    card.appendChild(courseEl);

    // ye skil ke liye Skills
    const skillsEl = document.createElement("p");
    skillsEl.textContent = `Skills: ${student.skills.join(", ")}`;
    card.appendChild(skillsEl);

    // ye aboutke liye done
    const aboutEl = document.createElement("p");
    aboutEl.textContent = `About: ${student.about}`;
    card.appendChild(aboutEl);

    // ye button ke liye bhi ho 
    const btn_cont = document.createElement("div");
    btn_cont.style.marginTop = "10px";

    const ebtn = document.createElement("button");
    ebtn.textContent = "Edit";
    ebtn.classList.add("edit-btn");
    ebtn.addEventListener("click", () => editStudent(student.id));

    const dbtn = document.createElement("button");
    dbtn.textContent = "Delete";
    dbtn.classList.add("delete-btn");
    dbtn.addEventListener("click", () => deleteStudent(student.id));

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    card.appendChild(btnContainer);

    studentCards.appendChild(card);
  }

 
  function editStudent(id) {
    alert(`Edit student with ID: ${id}`);
  
  }

  
  function deleteStudent(id) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students.splice(index, 1);
      totalStudents.textContent = students.length;

      
      const card = document.querySelector(`.student-card[data-id="${id}"]`);
      if (card) card.remove();
    }
  }

