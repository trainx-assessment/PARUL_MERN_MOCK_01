let add_student = document.querySelector('.add')
let form_wrap = document.querySelector('.form-add')
let cancel = document.querySelector('.cancel')

let delete_all = document.querySelector('.delete-all')

// student card
let student_wrap = document.querySelector('.student-card-wrap')

let nameof = document.querySelector('.name')
let emailof = document.querySelector('.email')
let phoneof = document.querySelector('.phone')

let n = 0

let stud = []

// form
let form = document.getElementsByTagName('form')

add_student.addEventListener('click', ()=>{
    form_wrap.style.display = 'block'
})

cancel.addEventListener('click' , ()=>{
    form_wrap.style = 'none'
})

delete_all.addEventListener('click', ()=>{
    let confirm = prompt("Do you want to delete all the Student data registered ? (Leave empty or cancel if no)")
    
    if(confirm){
        student_wrap.innerHTML = "No Students Registered"
    }
})

form.addEventListener('submit', (e)=>{

    e.preventDefault()
    let nameval = form.querySelector('#name')
    let emailval = form.querySelector('#email')
    let phoneval = form.querySelector('#phone')
    let dateval = form.querySelector('#date')

    let obj = {
        'name' : nameval.value,
        'email' : emailval.value,
        'phone' : phoneval.value,
        'date' : dateval.value
    }

    stud.push(obj)

    stud.map(obj => {
        student_wrap.innerHTML = `
        <div class="card">
                    <div class="student-card">
                        <div class="card-head">
                            <div class="pic">
                                <img src="" alt="profile photo">
                            </div>
                            <div class="card-sub">
                                <div class="name">${obj.name}</div>
                                <div class="card-sub-sub">
                                    <div class="card-left">
                                        <div class="email">${obj.email}</div>
                                        <div class="phone">${obj.phone}</div>
                                    </div>
                                    <div class="card-right">
                                        <div class="dob">23-11-2006</div>
                                        <div class="gender">Male</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="about">about me</div>
                        <div class="course">
                            <label for="">Course : </label>
                            <ul>
                                <li>2</li>
                            </ul>
                        </div>
                        <div class="skills">
                            <label for="">Skills</label>
                            <ul>
                                <li>1</li>
                                <li>1</li>
                            </ul>
                        </div>


                    </div>
                    <button id="update">update</button>
                    <button id="delete">delete</button>
                </div>
        `
    })

})