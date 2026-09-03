const frm = document.getElementById("regForm");

const nmBox = document.getElementById("name");

const mailBox = document.getElementById("email");


const numBox = document.getElementById("phone");
const bdayBox = document.getElementById("dob");


const crsBox = document.getElementById("course");
const abtBox = document.getElementById("about");


const imgBox = document.getElementById("photo");

const cntTag = document.getElementById("aboutCount");



const genderOpts = document.querySelectorAll('input[name="gender"]');
const skillOpts = document.querySelectorAll('input[name="skills"]');


const cardsBox = document.getElementById("cardsBox");
const submitBtn = document.getElementById("submitBtn");
const searchBox = document.getElementById("searchBox");
const filterBox = document.getElementById("filterBox");

const STORE_KEY = "students";

const people = [];
let nextId = 1;
let editingId = null;

function saveData() {
    localStorage.setItem(STORE_KEY, JSON.stringify({ list: people, nextId: nextId }));
}

function loadData() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;

    try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.list)) saved.list.forEach(function (p) { people.push(p); });
        if (typeof saved.nextId === "number") nextId = saved.nextId;
    } catch (err) {
        return;
    }
}

function flag(box, msgId, text) {

    const tag = document.getElementById(msgId);

    if (text) {
        box.classList.add("bad");
        tag.textContent = text;
        return false;


    }

    box.classList.remove("bad");


    tag.textContent = "";


    return true;
}

function checkName() {
    const val = nmBox.value.trim();


    const shape = /^[A-Za-z\s]{3,40}$/;


    if (val === "") 
        return flag(nmBox, "nameMsg", "Name is required");

    if (!shape.test(val)) 
        
        return flag(nmBox, "nameMsg", "Only letters and spaces, 3 to 40 characters");
    
    
        return flag(nmBox, "nameMsg", "");
}

function checkMail() {
    const val = mailBox.value.trim();


    const shape = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val === "") 
        return flag(mailBox, "emailMsg", "Email is required");
    
    if (!shape.test(val)) 
        
        return flag(mailBox, "emailMsg", "Enter a valid email address");
    
    
        return flag(mailBox, "emailMsg", "");
}




function checkNum() {
    const val = numBox.value.trim();

    const shape = /^[0-9]{10}$/;


    if (val === "") 
        return flag(numBox, "phoneMsg", "Phone number is required");

    
    if (!shape.test(val)) 
        
        return flag(numBox, "phoneMsg", "Enter exactly 10 digits");
    
    
        return flag(numBox, "phoneMsg", "");
}




function checkBday() {


    const val = bdayBox.value;
    if (val === "") 
        return flag(bdayBox, "dobMsg", "Date of birth is required");

    const picked = new Date(val);
    const now = new Date();
    if (picked > now) 
        return flag(bdayBox, "dobMsg", "Date of birth cannot be in the future");

    let age = now.getFullYear() - picked.getFullYear();

    const hadBirthday = (now.getMonth() > picked.getMonth()) || (now.getMonth() === picked.getMonth() && now.getDate() >= picked.getDate());
    
    
    if (!hadBirthday) age--;

    if (age < 15) 
        return flag(bdayBox, "dobMsg", "Student must be at least 15 years old");


    return flag(bdayBox, "dobMsg", "");


}

function checkGender() {


    const picked = Array.from(genderOpts).some(function (opt) { 
        return opt.checked; 
    });

    const tag = document.getElementById("genderMsg");

    tag.textContent = picked ? "" : "Please select a gender";


    return picked;
}




function checkCourse() {
    const val = crsBox.value;
    if (val === "" || val === "select") 
        return flag(crsBox, "courseMsg", "Please select a course");


    return flag(crsBox, "courseMsg", "");
}



function checkSkills() {


    const picked = Array.from(skillOpts).some(function (opt) { 
        return opt.checked; 
    });
    const tag = document.getElementById("skillsMsg");

    tag.textContent = picked ? "" : "Select at least one skill";

    return picked;
}

function checkAbout() {
    const val = abtBox.value;
    const trimmed = val.trim();
    
    if (trimmed === "") 
        return flag(abtBox, "aboutMsg", "This field is required");
    
    
    
    if (trimmed.length < 20) 
            return flag(abtBox, "aboutMsg", "Minimum 20 characters required");
        
        if (trimmed.length > 200) 
            return flag(abtBox, "aboutMsg", "Maximum 200 characters allowed");

    
    return flag(abtBox, "aboutMsg", "");

}

function checkImg() {
    const files = imgBox.files;
    const okTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!files || files.length === 0) {
        if (editingId !== null) return flag(imgBox, "photoMsg", "");
        return flag(imgBox, "photoMsg", "Profile photo is required");
    }

    if (!okTypes.includes(files[0].type))
        return flag(imgBox, "photoMsg", "Only jpg, jpeg or png files are allowed");

    return flag(imgBox, "photoMsg", "");
}

function updateCounter() {
    cntTag.textContent = abtBox.value.length + " / 200";
    }

    function line(label, value) {


        const p = document.createElement("p");
        const b = document.createElement("strong");


        b.textContent = label + ": ";
        p.appendChild(b);
        p.append(value);

    return p;
}

function buildCard(person) {


    const card = document.createElement("div");
    card.classList.add("student-card");


    card.setAttribute("data-id", person.id);


        const photo = document.createElement("img");
        photo.classList.add("student-photo");

        photo.src = person.photo;


        photo.alt = person.name;
        card.appendChild(photo);

    const heading = document.createElement("h3");
    heading.textContent = person.name;
    card.appendChild(heading);

    card.appendChild(line("Email", person.email));
    card.appendChild(line("Phone", person.phone));

    card.appendChild(line("DOB", person.dob));
    card.appendChild(line("Gender", person.gender));


      card.appendChild(line("Course", person.course));


      const skillWrap = document.createElement("div");
      skillWrap.classList.add("skill-tags");


      person.skills.forEach(function (item) {
          const tag = document.createElement("span");

        tag.classList.add("skill-tag");
        tag.textContent = item;


        
        skillWrap.appendChild(tag);
    });
    card.appendChild(skillWrap);

    card.appendChild(line("About", person.about));

    const btnRow = document.createElement("div");


    btnRow.classList.add("card-buttons");


    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";



        editBtn.classList.add("edit-btn");


        editBtn.setAttribute("type", "button");

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";


    delBtn.classList.add("delete-btn");


    delBtn.setAttribute("type", "button");

    btnRow.appendChild(editBtn);


    btnRow.appendChild(delBtn);
    card.appendChild(btnRow);

    return card;
}

function showStats() {
    document.getElementById("totalCount").textContent = people.length;

    const tally = {
        "Web Development": 0, "UI/UX": 0,
        "Python": 0,

        "Data Analytics": 0,
        "MERN Stack": 0,


        "Cloud Computing": 0
    };

    people.forEach(function (person) {
        if (tally[person.course] !== undefined) tally[person.course]++;
    });

        document.getElementById("webDevCount").textContent = tally["Web Development"];


        document.getElementById("uiuxCount").textContent = tally["UI/UX"];

        document.getElementById("pythonCount").textContent = tally["Python"];


    document.getElementById("dataAnaCount").textContent = tally["Data Analytics"];
    document.getElementById("mernCount").textContent = tally["MERN Stack"];

    document.getElementById("cloudCount").textContent = tally["Cloud Computing"];
}

function matchingPeople() {
    const term = searchBox.value.trim().toLowerCase();
    const course = filterBox.value;

    return people.filter(function (person) {
        const nameHit = term === "" || person.name.toLowerCase().includes(term);
        const courseHit = course === "" || person.course === course;
        return nameHit && courseHit;
    });
}

function renderCards() {
    cardsBox.innerHTML = "";

    const list = matchingPeople();

    if (list.length === 0) {
        const empty = document.createElement("p");

        empty.classList.add("no-results");

        empty.textContent = "No students found";
        cardsBox.appendChild(empty);
    } else {
        list.forEach(function (person) {


            cardsBox.appendChild(buildCard(person));


        });
    }

    showStats();
}

function startEdit(id) {
    const person = people.find(function (p) { return p.id === id; });
    if (!person) return;

    editingId = id;

    nmBox.value = person.name;
    mailBox.value = person.email;


    numBox.value = person.phone;


    bdayBox.value = person.dob;

    genderOpts.forEach(function (opt) {
        opt.checked = opt.value === person.gender;
    });

    const matchOpt = Array.from(crsBox.options).find(function (opt) {
        return opt.text === person.course;
    });
    if (matchOpt) crsBox.value = matchOpt.value;



    skillOpts.forEach(function (opt) {
        opt.checked = person.skills.includes(opt.value);
    });

    abtBox.value = person.about;
    updateCounter();

    submitBtn.textContent = "Update Student";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function removePerson(id) {
    const idx = people.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return;


    people.splice(idx, 1);


    saveData();
    renderCards();
}

cardsBox.addEventListener("click", function (event) {
    const delBtn = event.target.closest(".delete-btn");
    if (delBtn) {
        const card = delBtn.closest(".student-card");
        const id = Number(card.getAttribute("data-id"));
        if (confirm("Are you sure you want to delete this student?")) removePerson(id);
        return;
    }

    const editBtn = event.target.closest(".edit-btn");
    if (editBtn) {

        
        const card = editBtn.closest(".student-card");


        const id = Number(card.getAttribute("data-id"));
        startEdit(id);
    }
});

function saveStudent() {
    const gender = Array.from(genderOpts).find(function (opt) {

        return opt.checked;

    }).value;


    const skills = Array.from(skillOpts).filter(function (opt) {
        return opt.checked;
    }).map(function (opt) {

        return opt.value;

    });


    const draft = {
        name: nmBox.value.trim(),
        email: mailBox.value.trim(),
        phone: numBox.value.trim(),
        dob: bdayBox.value,
        gender: gender,
        course: crsBox.options[crsBox.selectedIndex].text,
        skills: skills,
        about: abtBox.value.trim()
    };




    if (imgBox.files.length > 0) {
        const reader = new FileReader();


        reader.onload = function () {
            
            finishSave(draft, reader.result);
        };
        reader.readAsDataURL(imgBox.files[0]);
    } else {
        
        finishSave(draft, null);
    }
}

function finishSave(draft, photoData) {
    
    if (editingId !== null) {
        
        const person = people.find(function (p) {
             return p.id === editingId; });
        person.name = draft.name;
        person.email = draft.email;

        person.phone = draft.phone;
        person.dob = draft.dob;


        person.gender = draft.gender;
        person.course = draft.course;

        person.skills = draft.skills;
        person.about = draft.about;
        if (photoData) person.photo = photoData;
        editingId = null;
    } else {
        people.push({
            id: nextId++,
            name: draft.name,

            email: draft.email,
            phone: draft.phone,
            dob: draft.dob,
            
            gender: draft.gender,

            course: draft.course,
            skills: draft.skills,
            about: draft.about,
            photo: photoData
        });
    }

    saveData();

    renderCards();
    frm.reset();

    finishReset();

}
bdayBox.addEventListener("change", checkBday);



    nmBox.addEventListener("input", checkName);

mailBox.addEventListener("input", checkMail);
numBox.addEventListener("input", checkNum);

crsBox.addEventListener("change", checkCourse);



imgBox.addEventListener("change", checkImg);

genderOpts.forEach(function (opt) {
    opt.addEventListener("change", checkGender);
});

skillOpts.forEach(function (opt) {


        opt.addEventListener("change", checkSkills);
});

abtBox.addEventListener("input", function () {


            updateCounter();
        checkAbout();
});

    frm.addEventListener("submit", function (event) {
event.preventDefault();

    const results = [
    checkName(), checkMail(), checkNum(), checkBday(), checkGender(),
    checkCourse(), checkSkills(), checkAbout(), checkImg()
];

    const allGood = results.every(
        function (r) {
            return r; 

        });

    if (!allGood) return;

    saveStudent();
});

function finishReset() {
        editingId = null;
        submitBtn.textContent = "Register Student";
        updateCounter();

    document.querySelectorAll(".msg").forEach(function (el) {
        el.textContent = "";
    });
    document.querySelectorAll(".bad").forEach(function (el) {
        el.classList.remove("bad");
    });
}

frm.addEventListener("reset", finishReset);

searchBox.addEventListener("input", renderCards);
filterBox.addEventListener("change", renderCards);

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

loadData();
renderCards();




