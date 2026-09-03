let form = document.getElementById("form");
let container = document.querySelector(".container");
let arr= []
let counter = document.getElementById("counter");
let about = document.getElementById("about");
let name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let dob = document.getElementById("dob");
let course = document.getElementById("course");
let editId = null;
let nextId = 1;

function showError(input, msg){
    let span = document.createElement('span');
    span.className = "err";
    span.textContent = msg;
    span.style.color = "red";
    input.after(span);
    input.addEventListener("input", ()=>{
        span.remove();
    }, { once: true });
}

about.addEventListener("input",()=>{
    counter.textContent = about.value.length + " / 200";
})

function updateStats(){
    document.getElementById("total").textContent = "Total Students: " + arr.length;
    let cwd = arr.filter(s=>s.course === "Web Development").length;
    let cux = arr.filter(s=>s.course === "UI/UX").length;
    let cpy = arr.filter(s=>s.course === "Python").length;
    let cda = arr.filter(s=>s.course === "Data Analytics").length;
    let cmern = arr.filter(s=>s.course === "MERN Stack").length;
    let ccld = arr.filter(s=>s.course === "Cloud Computing").length;
    document.getElementById("cwd").textContent = cwd;
    document.getElementById("cux").textContent = cux;
    document.getElementById("cpy").textContent = cpy;
    document.getElementById("cda").textContent = cda;
    document.getElementById("cmern").textContent = cmern;
    document.getElementById("ccld").textContent = ccld;
}

function renderCards(data){
    container.innerHTML = "";
    data.forEach((s)=>{
        let div = document.createElement('div');
        div.className = "student-card";
        div.dataset.id = s.id;
        div.style.border = "1px solid black";
        div.style.padding = "10px";
        div.style.margin = "10px";
        if (s.photo) {
            let img = document.createElement('img');
            img.src = s.photo;
            img.style.width = "100px";
            img.style.height = "100px";
            div.appendChild(img);
        }
        div.innerHTML+=`

           <p>Name: ${s.nameofst}</p>

           <p>Email: ${s.emailofst}</p>

           <p>Phone: ${s.phoneofst}</p>

           <p>DOB: ${s.dobofst}</p>

           <p>Gender: ${s.gender}</p>

           <p>Course: ${s.course}</p>

           <p>Skills: ${s.skills.join(", ")}</p>

           <p>About: ${s.about}</p>

           <button class="edit">Edit</button>
           <button class="delete">Delete</button>

        `;
        container.appendChild(div);
    });
}

container.addEventListener("click",(event)=>{

    let card = event.target.parentElement;
    let st = arr.find(s=>s.id === Number(card.dataset.id));
    if (!st) return;

    if (event.target.classList.contains("delete")) {
        if (confirm("Are you sure you want to delete this student?")) {
            arr = arr.filter(s=>s.id !== st.id);
            renderCards(arr);
            updateStats();
        }
    }

    if (event.target.classList.contains("edit")) {
        editId = st.id;
        name.value = st.nameofst;
        email.value = st.emailofst;
        phone.value = st.phoneofst;
        dob.value = st.dobofst;
        document.querySelectorAll('input[name="gender"]').forEach(r=> r.checked = (r.value === st.gender));
        course.value = st.course;
        document.querySelectorAll('input[type="checkbox"]').forEach(c=> c.checked = st.skills.includes(c.value));
        about.value = st.about;
        counter.textContent = st.about.length + " / 200";
        window.scrollTo(0, 0);
    }
});

form.addEventListener("submit",(e)=>{

    e.preventDefault()
    let gender = document.querySelector('input[name="gender"]:checked');
    let photo = document.getElementById("photo");
    let skills = document.querySelectorAll('input[type="checkbox"]:checked');

    let skillArr = [];
    skills.forEach((s)=>skillArr.push(s.value));

    document.querySelectorAll(".err").forEach(el=>el.remove());

    let valid = true;

    if (name.value.trim().length < 3 || name.value.length > 40) {
        showError(name, "Name must be 3-40 letters only");
        valid = false;
    }

    if (!gender) {
        showError(document.querySelector('#gender'), "Select a gender");
        valid = false;
    }

    if (!course.value) {
        showError(course, "Select a course");
        valid = false;
    }

    if (skillArr.length === 0) {
        document.querySelectorAll('input[type="checkbox"]').forEach(c=>{
            showError(c, "Select at least one skill");
        });
        valid = false;
    }

    if (!about.value.trim() || about.value.trim().length < 20 || about.value.length > 200) {
        showError(about, "About must be 20-200 characters");
        valid = false;
    }

    if (!photo.files[0] && editId === null) {
        showError(photo, "Photo is required");
        valid = false;
    }

    if (!valid) return;

    if (editId !== null) {
        let st = arr.find(s=>s.id === editId);
        st.nameofst = name.value;
        st.emailofst = email.value;
        st.phoneofst = phone.value;
        st.dobofst = dob.value;
        st.gender = gender.value;
        st.course = course.value;
        st.skills = skillArr;
        st.about = about.value;
        if (photo.files[0]) st.photo = URL.createObjectURL(photo.files[0]);
        editId = null;
    } else {
        let obj ={
        id: nextId,
        nameofst: name.value,
        emailofst: email.value,
        phoneofst: phone.value,
        dobofst: dob.value,
        gender: gender ? gender.value : "",
        course: course.value,
        skills: skillArr,
        about: about.value,
        photo: photo.files[0] ? URL.createObjectURL(photo.files[0]) : ""
        };
        nextId++;
        arr.push(obj);
    }

    renderCards(arr);
    updateStats();
    form.reset();
    counter.textContent = "0 / 200";
})
