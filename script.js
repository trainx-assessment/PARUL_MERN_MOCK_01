let students = []
let editId = null

const form = document.getElementById("studentForm")
const cards = document.getElementById("studentCards")
const stats = document.getElementById("statistics")
const search = document.getElementById("search")
const filter = document.getElementById("filterCourse")
const about = document.getElementById("about")
const charCount = document.getElementById("charCount")

about.oninput = () => {
  charCount.textContent = about.value.length + " / 200"
}

