const students = [];
let nextStudentId = 1;

function addStudent(formData){
    const selectedSkills = Array.from(
        document.querySelectorAll('input[name="skills"]:checked'),
    ).map((checkbox) => checkbox.value);

    const photoInput =document.getElementById('photo');
    const photoUrl = photoInput.files[0]
      ? URL.createObjectURL(photoInput.files[0])
      : "";

      const student = {
        id: nextStudentId++,
        name: formData.getelementbyid('name').value.trim(),
        email: formData.getelementbyid('email').value.trim(),
        phone: formData.getelementbyid('phone').value.trim(),
        dob: formData.getelementbyid('dob').value,
        gender: formData.getelementbyid('input[name="gender"]:checked')?.value,
        course: formData.getelementbyid('course').value,
        skills: selectedSkills,
        about: documement.getelementbyid('about').value.trim(),
        photo: photoUrl
      };

      students.push(student);
      console.log("Student added successfully:", student);
      console.log("updated student array:", students);

      return student;
    }