const students = [];
function addStudent(name, email, phone, dob, gender, course, skills, about, photo) {
    const id = students.length + 1;
    const student = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about,
        photo: photo
    };
    students.push(student);
    return student;
}