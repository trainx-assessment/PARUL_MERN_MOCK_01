None selected 

Skip to content
Using Parul University Mail with screen readers
in:spam 
Enable desktop notifications for Parul University Mail.
   OK  No thanks

1 of 2
Test Batch 10 || 3 September, 2026
External
Spam
Piyali Sarkar <sarkarpiyali0206@gmail.com>
Attachments
8:42 AM (3 minutes ago)
to 2403051260068, 2403051260075, 2503031057091, 2503031057093, 2503031057097, me, 2503031057183, 2503031057231, 2503031087022, 2503031087026, 2503031087028, 2503031087030, 2503031247001, 2503031267001, 2503031467058, 2503031467076, 2503031597027, 2503051057001, 2503051057041, 2503051057045, 2503051057058, 2503051057110, 2503051057117, 2503051057118, 2503051057130, 2503051057132, 2503051057133, 2503051057055, 2403051051211, 2403051050973, 2403051050725

Why is this message in spam? This message is similar to messages that were identified as spam in the past.
Report not spam

 One attachment
  •  Scanned by Gmail
# JavaScript, HTML & CSS Practical Assessment

## Duration
**1 Hour**

## Technologies
- HTML
- CSS
- Vanilla JavaScript

## Instructions

- Complete all 4 tasks.
- Use only HTML, CSS, and Vanilla JavaScript.
- Do not use any external libraries or frameworks.
- Keep your code properly formatted and readable.
- Your final application should work without errors in the browser console.
- Commit and push your completed work to the assigned GitHub repository.

---

# Task 1 — Project Setup & UI Structure

Create the following files inside the repository:

```text
index.html
style.css
script.js
```

Connect:

- `style.css` with `index.html`
- `script.js` with `index.html`

## Problem Statement

Create a **Student Application Manager** interface.

The page should contain:

- A main heading
- A student registration form
- A section to display the total number of students
- A section where submitted students will be displayed as cards

The form must contain:

- Student Name
- Email
- Phone Number
- Date of Birth
- Gender using radio buttons
- Course using a select dropdown
- Skills using checkboxes
- About Student using a textarea
- Profile Photo using a file input
- Submit button

### Course Options

```text
Web Development
UI/UX
Python
Data Analytics
```

### Skill Options

```text
HTML
CSS
JavaScript
Git
```

## UI Requirements

Use CSS to make the application:

- Clean
- Readable
- Properly spaced
- Responsive

The form fields should have proper labels.

Student cards should appear in a responsive layout when they are created later.

Use at least one media query.

---

# Task 2 — Form Handling & Validation

Add JavaScript validation to the student form.

When the form is submitted:

1. Prevent the default form submission behaviour.
2. Read the values entered by the user.
3. Validate the form.
4. Display validation messages for incorrect fields.
5. Do not continue if the form contains invalid data.

## Validation Rules

### Student Name

- Required
- Minimum 3 characters
- Only letters and spaces are allowed
- Numbers and special characters are not allowed

Use a **Regular Expression**.

Examples:

```text
Valid:
Rahul Sharma
John
Mary Jane

Invalid:
Jo
John123
12345
John@
```

### Email

- Required
- Must be a valid email format

### Phone Number

- Required
- Must contain exactly 10 digits
- Must contain numbers only

Use a **Regular Expression**.

Examples:

```text
Valid:
9876543210

Invalid:
98765
98765432101
98765abc10
```

### Date of Birth

- Required
- Future dates should not be accepted

### Gender

- One option must be selected

### Course

- A course must be selected

### Skills

- At least one skill must be selected

### About Student

- Required
- Input containing only spaces should not be accepted

### Profile Photo

- A profile photo must be selected

## Important

All invalid fields should show their validation message.

A student must not be added when validation fails.

---

# Task 3 — Student Data & Dynamic Cards

After successful validation:

Create a JavaScript array:

```javascript
const students = [];
```

Create a student object using the submitted form data.

Example:

```javascript
{
    id: 1,
    name: "...",
    email: "...",
    phone: "...",
    dob: "...",
    gender: "...",
    course: "...",
    skills: [...],
    about: "...",
    photo: "..."
}
```

Add the student object to the `students` array.

Each student should have a unique ID.

## Dynamic Student Card

Create the student card using JavaScript.

Do not manually write student cards inside `index.html`.

Use DOM manipulation methods such as:

```javascript
document.createElement()
appendChild()
append()
classList.add()
textContent
```

Each card must display:

- Student Photo
- Student Name
- Email
- Phone Number
- Date of Birth
- Gender
- Course
- Skills
- About Student
- Delete button

Each card must have:

```html
class="student-card"
```

Store the student's ID using a `data-*` attribute.

Example:

```html
<div class="student-card" data-id="1">
```

## Student Count

Display:

```text
Total Students: 0
```

When a student is successfully added, update the count.

Example:

```text
Total Students: 1
Total Students: 2
Total Students: 3
```

## Form Reset

After a student is successfully added:

- Clear text inputs
- Reset radio buttons
- Reset checkboxes
- Reset course
- Clear textarea
- Reset file input
- Clear old validation messages

---

# Task 4 — Delete Functionality & Debugging

## Part A — Delete Student

Use **event delegation** for deleting students.

Add only one click event listener to the student card container.

Do not add a separate click event listener to every Delete button.

When a Delete button is clicked:

1. Identify the clicked button.
2. Use:

```javascript
closest()
```

to find the related `.student-card`.
3. Read the student's ID from the card.
4. Remove the correct student from the `students` array.
5. Remove only the selected student card.
6. Update the total student count.

Deleting one student must not remove or affect the other students.

---

## Part B — Debugging Challenge

The following JavaScript is supposed to add and delete student cards, but it contains several problems.

Fix the code without rewriting the entire program.

### HTML

```html
<form id="studentForm">

    <input
        type="text"
        id="studentName"
        placeholder="Student Name"
    >

    <button type="submit">
        Add Student
    </button>

</form>

<div id="studentContainer"></div>
```

### Buggy JavaScript

```javascript
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
```

## Expected Behaviour

Fix all problems so that:

- The page does not refresh after form submission.
- Empty or space-only names are rejected.
- A card is not created when validation fails.
- Valid names create student cards.
- Multiple cards can be added.
- The Delete button works correctly.
- Only the selected card is deleted.
- Use `closest()` to locate the student card.
- The input should clear after a successful submission.

---

# Final Submission Requirements

Before submitting, make sure:

- `index.html` exists
- `style.css` exists
- `script.js` exists
- All files are connected correctly
- Form validation works
- Regex is used for Name and Phone Number
- Student objects are stored in an array
- Cards are created dynamically
- Delete functionality works
- Student count updates correctly
- Form resets after successful submission
- The browser console has no JavaScript errors
- Your latest code is committed and pushed to GitHub

---

# Assessment Focus

The assessment will evaluate:

- HTML structure
- CSS implementation
- Responsive UI
- DOM manipulation
- Events and event handling
- Form handling
- Form validation
- Regular Expressions
- Arrays and Objects
- Dynamic DOM manipulation
- Event delegation
- DOM traversal
- Debugging
- Code readability
TEST Batch 10.md
Displaying TEST Batch 10.md.