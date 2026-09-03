```html
<form id="studentForm">

    <input
        type="text"
        id="studentForm"
        placeholder="Student Name"
    >

    <button type="submit">
        Add Student
    </button>

</form>

<div id="studentContainer"></div>
```
const form =
    document.querySelector("#studentForm");

const studentName =
    document.querySelector("#studentName");

const studentContainer =
    document.querySelector("#studentContainer");

form.addEventListener(
    "submit",
    function (event) {

        const name =
            studentName.value;

        if (name.trim() === "") {
            alert("Name is required");
            //added return
            return;
        }

        const card =
            document.createElement("div");

        card.classList.add("student-card");

        const heading =
            document.createElement("h3");

        heading.textContent =
            name;

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        card.appendChild(heading);
        card.appendChild(deleteButton);

        studentContainer.appendChild(card);
    }
);

studentContainer.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains("delete-btn")
        ) {

            const card =
                event.target.parentElement;

            card.remove();
        }
    }
);