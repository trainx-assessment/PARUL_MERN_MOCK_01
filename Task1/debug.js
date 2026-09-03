const form = document.querySelector("#studentForm");
const studentName = document.querySelector("#studentName");
const studentContainer = document.querySelector("#studentContainer");

form.addEventListener("submit", function(event) {

  // Bug 1: missing event.preventDefault() — page was refreshing on submit
  event.preventDefault();

  const name = studentName.value;

  // Bug 2: missing return — card was still being created even when name was empty
  if (name.trim() === "") {
    alert("Name is required");
    return;
  }

  const card = document.createElement("div");
  card.classList.add("student-card");

  const heading = document.createElement("h3");
  heading.textContent = name;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  // Bug 3: delete button had no class — event delegation was checking for "delete-btn" but button had no class
  deleteButton.classList.add("delete-btn");

  card.appendChild(heading);
  card.appendChild(deleteButton);
  studentContainer.appendChild(card);

  // Bug 4: input was not cleared after submission
  studentName.value = "";

});

studentContainer.addEventListener("click", function(event) {

  if (event.target.classList.contains("delete-btn")) {

    // Bug 5: was using parentElement — replaced with closest() as required
    const card = event.target.closest(".student-card");
    card.remove();

  }

});
