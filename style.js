
let students = [];
let editStudentId = null;

const studentModal = document.getElementById("studentModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const charCounter = document.getElementById("charCounter");
const aboutInput = document.getElementById("about");
const studentContainer = document.getElementById("studentContainer");
const totalCountEl = document.getElementById("totalCount");
const courseStatsEl = document.getElementById("courseStats");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

openModalBtn?.addEventListener("click", () => {
    studentModal.style.display = "block";
});

closeModalBtn?.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
    if (e.target === studentModal) closeModal();
});

function closeModal() {
    studentModal.style.display = "none";
    resetForm();
}

aboutInput?.addEventListener("input", (e) => {
    const length = e.target.value.length;
    if (charCounter) charCounter.textContent = `${length} / 200`;
});

ata.get("studentName").trim(),
                        email: formData.get("email").trim(),
                        phone: formData.get("phone").trim(),
                        dob: formData.get("dob"),
                        gender: formData.get("gender"),
                        course: formData.get("course"),
                        skills: selectedSkills,
                        about: formData.get("about").trim(),
                        photo: photoUrl || student.photo
                    };
                }
                return student;
            });
            editStudentId = null;
            if (submitBtn) submitBtn.textContent = "Register Student";




    
            