      /* 1. GET HTML ELEMENTS */

      const studentForm = document.getElementById("studentForm");

      const studentName = document.getElementById("studentName");

      const studentEmail = document.getElementById("studentEmail");

      const studentPhone = document.getElementById("studentPhone");

      const studentDob = document.getElementById("studentDob");

      const studentCourse = document.getElementById("studentCourse");

      const studentAbout = document.getElementById("studentAbout");

      const studentPhoto = document.getElementById("studentPhoto");

      const submitBtn = document.getElementById("submitBtn");

      const resetBtn = document.getElementById("resetBtn");

      const characterCounter = document.getElementById("characterCounter");

      const studentContainer = document.getElementById("studentContainer");

      const searchInput = document.getElementById("searchInput");

      const courseFilter = document.getElementById("courseFilter");

      const darkModeBtn = document.getElementById("darkModeBtn");

      /* 2. STUDENT ARRAY */

      let students = [];

      let editingStudentId = null;

      let nextStudentId = 1;

      /* 3. COURSE LIST */

      const courses = [
        "Web Development",
        "UI/UX",
        "Python",
        "Data Analytics",
        "MERN Stack",
        "Cloud Computing",
      ];

      /* 4. LOAD STUDENTS FROM LOCAL STORAGE */

      function loadStudents() {
        const savedStudents = localStorage.getItem("students");

        if (savedStudents) {
          try {
            students = JSON.parse(savedStudents);
          } catch (error) {
            console.error("Unable to load students:", error);

            students = [];
          }
        }

        if (students.length > 0) {
          nextStudentId =
            Math.max(...students.map((student) => student.id)) + 1;
        } else {
          nextStudentId = 1;
        }

        renderStudents();

        updateStatistics();
      }

      /* 5. SAVE STUDENTS */

      function saveStudents() {
        localStorage.setItem("students", JSON.stringify(students));
      }

      /* 6. VALIDATION MESSAGE FUNCTION */

      function showError(elementId, message, inputElement = null) {
        const errorElement = document.getElementById(elementId);

        errorElement.textContent = message;

        if (inputElement) {
          inputElement.classList.add("input-error");

          inputElement.classList.remove("input-success");
        }
      }

      /* 7. CLEAR VALIDATION MESSAGE */

      function clearError(elementId, inputElement = null) {
        const errorElement = document.getElementById(elementId);

        errorElement.textContent = "";

        if (inputElement) {
          inputElement.classList.remove("input-error");

          inputElement.classList.add("input-success");
        }
      }

      /* 8. CLEAR ALL VALIDATION MESSAGE */

      function clearValidationMessages() {
        const messages = document.querySelectorAll(".validation-message");

        messages.forEach((message) => {
          message.textContent = "";
        });

        const inputs = document.querySelectorAll("input, select, textarea");

        inputs.forEach((input) => {
          input.classList.remove("input-error", "input-success");
        });
      }

      /* 9. VALIDATE NAME */

      function validateName() {
        const name = studentName.value.trim();

        if (name === "") {
          showError(
            "studentNameError",
            "Student name is required.",
            studentName,
          );

          return false;
        }

        if (name.length < 3 || name.length > 40) {
          showError(
            "studentNameError",
            "Name must be between 3 and 40 characters.",
            studentName,
          );

          return false;
        }

        /* Only letters and spaces.\p{L} supports letters from many languages. */

        const nameRegex = /^[\p{L}]+(?:[\s]+[\p{L}]+)*$/u;

        if (!nameRegex.test(name)) {
          showError(
            "studentNameError",
            "Name can contain only letters and spaces.",
            studentName,
          );

          return false;
        }

        clearError("studentNameError", studentName);

        return true;
      }

      /* 10. VALIDATE EMAIL */

      function validateEmail() {
        const email = studentEmail.value.trim();

        if (email === "") {
          showError("studentEmailError", "Email is required.", studentEmail);

          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          showError(
            "studentEmailError",
            "Please enter a valid email address.",
            studentEmail,
          );

          return false;
        }

        clearError("studentEmailError", studentEmail);

        return true;
      }

      /* 11. VALIDATE PHONE */

      function validatePhone() {
        const phone = studentPhone.value.trim();

        if (phone === "") {
          showError(
            "studentPhoneError",
            "Phone number is required.",
            studentPhone,
          );

          return false;
        }

        const phoneRegex = /^\d{10}$/;

        if (!phoneRegex.test(phone)) {
          showError(
            "studentPhoneError",
            "Phone number must contain exactly 10 digits.",
            studentPhone,
          );

          return false;
        }

        clearError("studentPhoneError", studentPhone);

        return true;
      }

      /* 12. VALIDATE DATE OF BIRTH */

      function validateDob() {
        const dob = studentDob.value;

        if (dob === "") {
          showError(
            "studentDobError",
            "Date of birth is required.",
            studentDob,
          );

          return false;
        }

        const selectedDate = new Date(dob + "T00:00:00");

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
          showError(
            "studentDobError",
            "Future dates are not allowed.",
            studentDob,
          );

          return false;
        }

        /* Bonus requirement: Student must be at least 15 years old. */

        const minimumAgeDate = new Date(
          today.getFullYear() - 15,
          today.getMonth(),
          today.getDate(),
        );

        if (selectedDate > minimumAgeDate) {
          showError(
            "studentDobError",
            "Student must be at least 15 years old.",
            studentDob,
          );

          return false;
        }

        clearError("studentDobError", studentDob);

        return true;
      }

      /* 13. VALIDATE GENDER */

      function validateGender() {
        const selectedGender = document.querySelector(
          'input[name="gender"]:checked',
        );

        if (!selectedGender) {
          showError("genderError", "Please select a gender.");

          return false;
        }

        clearError("genderError");

        return true;
      }

      /* 14. VALIDATE COURSE */

      function validateCourse() {
        if (studentCourse.value === "") {
          showError(
            "studentCourseError",
            "Please select a course.",
            studentCourse,
          );

          return false;
        }

        clearError("studentCourseError", studentCourse);

        return true;
      }

      /* 15. VALIDATE SKILLS */

      function validateSkills() {
        const selectedSkills = document.querySelectorAll(
          'input[name="skills"]:checked',
        );

        if (selectedSkills.length === 0) {
          showError("skillsError", "Please select at least one skill.");

          return false;
        }

        clearError("skillsError");

        return true;
      }

      /* 16. VALIDATE ABOUT */

      function validateAbout() {
        const about = studentAbout.value.trim();

        if (about === "") {
          showError(
            "studentAboutError",
            "About Student is required.",
            studentAbout,
          );

          return false;
        }

        if (about.length < 20) {
          showError(
            "studentAboutError",
            "About Student must contain at least 20 characters.",
            studentAbout,
          );

          return false;
        }

        if (about.length > 200) {
          showError(
            "studentAboutError",
            "About Student cannot exceed 200 characters.",
            studentAbout,
          );

          return false;
        }

        clearError("studentAboutError", studentAbout);

        return true;
      }

      /* 17. VALIDATE PHOTO */

      function validatePhoto() {
        /* During edit, photo is optional if the student already has a photo. */

        if (editingStudentId !== null && studentPhoto.files.length === 0) {
          clearError("studentPhotoError");

          return true;
        }

        if (studentPhoto.files.length === 0) {
          showError(
            "studentPhotoError",
            "Profile photo is required.",
            studentPhoto,
          );

          return false;
        }

        const file = studentPhoto.files[0];

        const allowedTypes = ["image/jpeg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
          showError(
            "studentPhotoError",
            "Only JPG, JPEG and PNG images are allowed.",
            studentPhoto,
          );

          return false;
        }

        clearError("studentPhotoError", studentPhoto);

        return true;
      }

      /* 18. VALIDATE COMPLETE FORM */

      function validateForm() {
        const nameValid = validateName();

        const emailValid = validateEmail();

        const phoneValid = validatePhone();

        const dobValid = validateDob();

        const genderValid = validateGender();

        const courseValid = validateCourse();

        const skillsValid = validateSkills();

        const aboutValid = validateAbout();

        const photoValid = validatePhoto();

        return (
          nameValid &&
          emailValid &&
          phoneValid &&
          dobValid &&
          genderValid &&
          courseValid &&
          skillsValid &&
          aboutValid &&
          photoValid
        );
      }

      /* 19. UPDATE CHARACTER COUNTER */

      function updateCharacterCounter() {
        const length = studentAbout.value.length;

        characterCounter.textContent = `${length} / 200`;
      }

      /* 20. READ IMAGE AS DATA URL */

      function readImageAsDataURL(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => resolve(reader.result);

          reader.onerror = () => reject(new Error("Unable to read image."));

          reader.readAsDataURL(file);
        });
      }

      /* 21. GET SELECTED GENDER */

      function getSelectedGender() {
        const selected = document.querySelector('input[name="gender"]:checked');

        return selected ? selected.value : "";
      }

      /* 22. GET SELECTED SKILLS */

      function getSelectedSkills() {
        const selected = document.querySelectorAll(
          'input[name="skills"]:checked',
        );

        return Array.from(selected).map((checkbox) => checkbox.value);
      }

      /* 23. HANDLE FORM SUBMISSION */

      studentForm.addEventListener("submit", async function (event) {
        /*
                    Prevent browser from refreshing.
                */

        event.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
          return;
        }

        try {
          let photoData = "";

          /*
                        If a new photo is selected,
                        read it.
                    */

          if (studentPhoto.files.length > 0) {
            photoData = await readImageAsDataURL(studentPhoto.files[0]);
          } else if (editingStudentId !== null) {
            const existingStudent = students.find(
              (student) => student.id === editingStudentId,
            );

            if (existingStudent) {
              photoData = existingStudent.photo;
            }
          }

          /* EDIT EXISTING STUDENT */

          if (editingStudentId !== null) {
            const student = students.find(
              (student) => student.id === editingStudentId,
            );

            if (!student) {
              alert("Student not found.");

              return;
            }

            student.name = studentName.value.trim();

            student.email = studentEmail.value.trim();

            student.phone = studentPhone.value.trim();

            student.dob = studentDob.value;

            student.gender = getSelectedGender();

            student.course = studentCourse.value;

            student.skills = getSelectedSkills();

            student.about = studentAbout.value.trim();

            student.photo = photoData;

            alert("Student updated successfully.");
          } else {

          /* CREATE NEW STUDENT */
            const newStudent = {
              id: nextStudentId,

              name: studentName.value.trim(),

              email: studentEmail.value.trim(),

              phone: studentPhone.value.trim(),

              dob: studentDob.value,

              gender: getSelectedGender(),

              course: studentCourse.value,

              skills: getSelectedSkills(),

              about: studentAbout.value.trim(),

              photo: photoData,
            };

            students.push(newStudent);

            nextStudentId++;

            alert("Student registered successfully.");
          }

          /* SAVE AND UPDATE UI */

          saveStudents();

          renderStudents();

          updateStatistics();

          resetForm();
        } catch (error) {
          console.error("Error saving student:", error);

          alert("Something went wrong while saving the student.");
        }
      });

      /* 24. RENDER STUDENTS */

      function renderStudents() {
        studentContainer.innerHTML = "";

        const searchTerm = searchInput.value.trim().toLowerCase();

        const selectedCourse = courseFilter.value;

        const filteredStudents = students.filter((student) => {
          const matchesSearch = student.name.toLowerCase().includes(searchTerm);

          const matchesCourse =
            selectedCourse === "" || student.course === selectedCourse;

          return matchesSearch && matchesCourse;
        });

        if (filteredStudents.length === 0) {
          const message = document.createElement("div");

          message.classList.add("no-students");

          message.textContent = "No students found";

          studentContainer.appendChild(message);

          return;
        }

        filteredStudents.forEach((student) => {
          const card = createStudentCard(student);

          studentContainer.appendChild(card);
        });
      }

      /* 25. CREATE STUDENT CARD */

      function createStudentCard(student) {
        const card = document.createElement("article");

        card.classList.add("student-card");

        /* Required data-id attribute. */

        card.setAttribute("data-id", student.id);

        /* PHOTO */

        const image = document.createElement("img");

        image.classList.add("student-photo");

        image.setAttribute("alt", `${student.name} profile photo`);

        image.src = student.photo || createPlaceholderImage(student.name);

        /* NAME */

        const heading = document.createElement("h3");

        heading.textContent = student.name;

        /* EMAIL */

        const email = document.createElement("p");

        email.classList.add("student-detail");

        const emailStrong = document.createElement("strong");

        emailStrong.textContent = "Email: ";

        email.appendChild(emailStrong);

        email.append(document.createTextNode(student.email));

        