const form =
    document.querySelector("#studentForm");

const studentName =
    document.querySelector("#studentName");

const studentContainer =
    document.querySelector("#studentContainer");

form.addEventListener(
    "submit",
    function (event) {

        // FIX 1: preventDefault() was missing, so the form
        // was reloading the page on every submit.
        event.preventDefault();

        const name =
            studentName.value;

        // FIX 2: the original code alerted on an empty/space-only
        // name but never stopped execution, so a card was still
        // created. Added "return" so validation actually blocks it.
        if (name.trim() === "") {
            alert("Name is required");
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

        // FIX 3: the delete listener below looks for the class
        // "delete-btn", but this button never had that class,
        // so delete never worked. Added the missing class.
        deleteButton.classList.add("delete-btn");

        card.appendChild(heading);
        card.appendChild(deleteButton);

        studentContainer.appendChild(card);

        // FIX 4: the input was never cleared after a successful
        // submission, so the old name stayed in the field.
        studentName.value = "";
    }
);

studentContainer.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains("delete-btn")
        ) {

            // FIX 5: event.target.parentElement removed whatever
            // element the button happened to be nested directly in,
            // which breaks the moment the card's markup changes.
            // closest(".student-card") reliably finds the actual
            // card regardless of internal structure, and guarantees
            // only the clicked student's own card is removed.
            const card =
                event.target.closest(".student-card");

            card.remove();
        }
    }
);