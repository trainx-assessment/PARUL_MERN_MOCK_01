# HTML, CSS & JavaScript Practical Assessment

## Duration

**3 Hours- Must be submitted during the class.**

## Technologies

* HTML5
* CSS3
* Vanilla JavaScript

## Instructions

* Complete all tasks.
* Use only HTML, CSS, and Vanilla JavaScript.
* Do not use Bootstrap, Tailwind CSS, React, jQuery, or any external JavaScript/CSS framework.
* Keep your code properly formatted and readable.
* Use meaningful variable, function, class, and ID names.
* Your application must work without errors in the browser console.
* Your UI must be responsive.
* Commit and push the completed project to the assigned GitHub repository.

---

# Project — Student Application Management System

Build a complete **Student Application Management System** where users can register students, validate their information, display applications dynamically, search/filter students, edit/delete records, and preserve the data using Array.

---

# Task 1 — Project Setup & HTML Structure

### Suggested Time: 20 Minutes

Create the following files:

```text
index.html
style.css
script.js
```

Connect:

* `style.css` with `index.html`
* `script.js` with `index.html`

## Page Structure

Create the following main sections:

1. Header
2. Student Registration Form
3. Student Statistics
4. Search and Filter Section
5. Student Cards Container
6. Footer

Use proper semantic HTML elements wherever possible.

Examples:

```html
<header>
<main>
<section>
<form>
<footer>
```

## Header

Display:

```text
Student Application Management System
```

Also add a short subtitle:

```text
Register and manage student applications
```

---

# Task 2 — Student Registration Form

### Suggested Time: 25 Minutes

Create a student registration form containing the following fields.

## Student Name

* Input type: `text`
* Required

## Email

* Input type: `email`
* Required

## Phone Number

* Input type: `text`
* Required

## Date of Birth

* Input type: `date`
* Required

## Gender

Use radio buttons:

```text
Male
Female
Other
```

## Course

Use a select dropdown.

Options:

```text
Select Course
Web Development
UI/UX
Python
Data Analytics
MERN Stack
Cloud Computing
```

## Skills

Use checkboxes:

```text
HTML
CSS
JavaScript
Git
React
Node.js
```

## About Student

Use a textarea.

Add:

```text
Maximum 200 characters
```

## Profile Photo

Use:

```html
<input type="file">
```

Accept image files only.

## Buttons

Add two buttons:

```text
Register Student
Reset Form
```

Every form field must have a proper label.

---

# Task 3 — CSS Design & Responsive Layout

### Suggested Time: 25 Minutes

Create a clean and professional user interface.

## General Requirements

The application should have:

* Proper spacing
* Consistent font sizes
* Proper alignment
* Borders
* Border radius
* Shadows where appropriate
* Hover effects
* Proper button styling
* Good readability

## Registration Form

For desktop screens, display form fields using a **two-column layout** where appropriate.

Example:

```text
Student Name        Email

Phone Number        Date of Birth

Gender              Course
```

Textarea and profile photo can use the complete row.

Use either:

```css
display: grid;
```

or

```css
display: flex;
```

## Student Cards

Student cards must appear in a responsive layout.

Example:

### Desktop

```text
Card 1    Card 2    Card 3
```

### Tablet

```text
Card 1    Card 2
Card 3
```

### Mobile

```text
Card 1
Card 2
Card 3
```

Use **CSS Grid or Flexbox**.

## Responsive Design

Use at least **two media queries**.

Recommended breakpoints:

```css
@media (max-width: 768px)

@media (max-width: 480px)
```

The application should remain readable and usable on mobile devices.

---

# Task 4 — JavaScript Form Validation

### Suggested Time: 30 Minutes

When the form is submitted:

1. Prevent default form submission.
2. Read all form values.
3. Validate every required field.
4. Display validation messages.
5. Stop submission when validation fails.
6. Remove old validation messages when the user fixes the input.

Do not use only browser default validation.

Implement validation using JavaScript.

---

## Student Name Validation

Rules:

* Required
* Minimum 3 characters
* Maximum 40 characters
* Only letters and spaces allowed
* Numbers are not allowed
* Special characters are not allowed

Use a **Regular Expression**.

Valid:

```text
Rahul Sharma
John Smith
Mary Jane
```

Invalid:

```text
Jo
Rahul123
John@
123456
```

---

## Email Validation

Rules:

* Required
* Must contain a valid email address

Examples:

Valid:

```text
student@gmail.com
rahul123@example.com
```

Invalid:

```text
student@
student.com
@gmail.com
```

---

## Phone Number Validation

Rules:

* Required
* Exactly 10 digits
* Numbers only

Use a **Regular Expression**.

Valid:

```text
9876543210
```

Invalid:

```text
98765
98765432101
98765abc10
```

---

## Date of Birth Validation

Rules:

* Required
* Future dates must not be accepted

Bonus validation:

Student age should be at least **15 years**.

---

## Gender Validation

At least one gender option must be selected.

---

## Course Validation

The user must select a course.

The default:

```text
Select Course
```

must not be considered valid.

---

## Skills Validation

At least **one skill** must be selected.

---

## About Student Validation

Rules:

* Required
* Spaces-only input should not be accepted
* Minimum 20 characters
* Maximum 200 characters

Display a character counter:

```text
0 / 200
```

Update the counter while the user types.

---

## Profile Photo Validation

Rules:

* Profile photo is required
* Only image files should be accepted

Accepted examples:

```text
.jpg
.jpeg
.png
```

---

# Task 5 — Create and Store Student Data

### Suggested Time: 20 Minutes

Create a JavaScript array:

```javascript
const students = [];
```

After successful validation, create a student object.

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
    skills: ["HTML", "CSS"],
    about: "...",
    photo: "..."
}
```

Every student must have a unique ID.

Add the student object to the `students` array.

---

# Task 6 — Dynamic Student Cards

### Suggested Time: 20 Minutes

Do not manually write student cards inside `index.html`.

Generate them using JavaScript.

Use DOM manipulation such as:

```javascript
document.createElement()
appendChild()
append()
classList.add()
textContent
setAttribute()
```

Every card must have:

```html
class="student-card"
```

Store the student's ID using:

```html
data-id=""
```

Example:

```html
<div class="student-card" data-id="1">
```

Each card should display:

* Student Photo
* Student Name
* Email
* Phone Number
* Date of Birth
* Gender
* Course
* Skills
* About Student
* Edit button
* Delete button

Example:

```text
----------------------------
Student Photo

Rahul Sharma

Email: rahul@gmail.com
Phone: 9876543210
DOB: 10/05/2003
Gender: Male
Course: Web Development

Skills:
HTML, CSS, JavaScript

About:
Interested in frontend development.

[ Edit ] [ Delete ]
----------------------------
```

---

# Task 7 — Student Statistics

### Suggested Time: 10 Minutes

Create a statistics section.

Initially display:

```text
Total Students: 0
```

When students are registered:

```text
Total Students: 1
Total Students: 2
Total Students: 3
```

Also display:

```text
Web Development: 0
UI/UX: 0
Python: 0
Data Analytics: 0
MERN Stack: 0
Cloud Computing: 0
```

The statistics should update automatically whenever:

* A student is added
* A student is deleted
* A student's course is edited

---

# Task 8 — Delete Student Using Event Delegation

### Suggested Time: 10 Minutes

Use **event delegation**.

Add only one click event listener to the student card container.

Do not create separate click listeners for every Delete button.

When the Delete button is clicked:

1. Detect the clicked Delete button.
2. Use `closest()` to locate the related student card.
3. Read the student's `data-id`.
4. Find the student in the array.
5. Remove the student from the array.
6. Remove the correct card.
7. Update student statistics.

Example:

```javascript
event.target.closest(".student-card");
```

Deleting one student must not affect other students.

Before deleting, show:

```text
Are you sure you want to delete this student?
```

Use:

```javascript
confirm()
```

---

# Task 9 — Edit Student

### Suggested Time: 15 Minutes

Add an **Edit** button to every student card.

When Edit is clicked:

1. Identify the student using the student ID.
2. Find the correct object inside the `students` array.
3. Fill the registration form with the existing student data.
4. Change the Register button text to:

```text
Update Student
```

5. Allow the user to modify the details.
6. Validate the updated information.
7. Update the existing object instead of creating a new student.
8. Update the student card.
9. Update statistics if the course changes.

Do not create a duplicate student while editing.

---

# Task 10 — Search Students

### Suggested Time: 10 Minutes

Add a search input.

Placeholder:

```text
Search student by name...
```

Search students while the user types.

Use the:

```javascript
input
```

event.

Search should be **case-insensitive**.

Example:

Students:

```text
Rahul Sharma
Amit Kumar
Priya Singh
```

Search:

```text
rah
```

Display:

```text
Rahul Sharma
```

Search:

```text
PRI
```

Display:

```text
Priya Singh
```

If no student matches, display:

```text
No students found
```

---

# Task 11 — Filter Students by Course

### Suggested Time: 10 Minutes

Create a course filter dropdown.

Options:

```text
All Courses
Web Development
UI/UX
Python
Data Analytics
MERN Stack
Cloud Computing
```

When a course is selected, display only students from that course.

Example:

If:

```text
Web Development
```

is selected, only Web Development students should appear.

Search and course filter should work together.

Example:

Search:

```text
Rahul
```

Course:

```text
Web Development
```

Display Rahul only if Rahul belongs to Web Development.


---

# Task 12 — Form Reset

After successful registration:

* Clear all text fields
* Clear email
* Clear phone number
* Reset date
* Reset gender
* Reset course
* Reset skills
* Clear textarea
* Reset photo
* Reset character counter
* Remove validation messages

The **Reset Form** button should also perform the same reset.

If the user was editing a student, Reset should cancel edit mode and change:

```text
Update Student
```

back to:

```text
Register Student
```

---

# Task 13 — Debugging Challenge

### Suggested Time: 15 Minutes

The following code is supposed to create and delete students but contains multiple problems.

Fix the code **without rewriting the complete program**.

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

* The page does not refresh after submission.
* Empty names are rejected.
* Space-only names are rejected.
* Cards are not created if validation fails.
* Valid names create cards.
* Multiple students can be added.
* Delete buttons work.
* Only the selected card is removed.
* The Delete button must have the correct class.
* Use `closest()` to locate the card.
* Clear the input after successful submission.

---

# Bonus Task — Dark Mode

Complete this task only after finishing the main requirements.

Add a button:

```text
Dark Mode
```

When clicked:

* Switch between light and dark themes.
* Change button text appropriately.

Example:

```text
Dark Mode
```

changes to:

```text
Light Mode
```

Use JavaScript and CSS classes.

Example:

```javascript
document.body.classList.toggle("dark-mode");
```
# Final Submission Requirements

Before submitting, make sure:

* `index.html` exists
* `style.css` exists
* `script.js` exists
* All three files are connected correctly
* Semantic HTML is used
* Form fields have proper labels
* CSS Grid/Flexbox is used
* At least two media queries are used
* Form validation works
* Regex is used for Student Name
* Regex is used for Phone Number
* JavaScript validation messages are displayed
* Student objects are stored in an array
* Unique student IDs are generated
* Cards are generated dynamically
* Student count updates correctly
* Course statistics update correctly
* Delete functionality works
* Event delegation is used
* `closest()` is used
* Edit functionality works
* Search functionality works
* Course filter works
* Search and filter work together
* Array Storage works
* Data remains after refresh
* Form resets correctly
* There are no JavaScript errors in the browser console
* Code is properly formatted
* Latest code is committed and pushed to GitHub

---

# Assessment Focus

The assessment will evaluate:

### HTML

* Semantic HTML
* Forms
* Input types
* Labels
* Radio buttons
* Checkboxes
* Select dropdown
* Textarea
* File input
* HTML structure

### CSS

* Selectors
* Box model
* Flexbox/Grid
* Responsive design
* Media queries
* Spacing
* Typography
* Buttons
* Cards
* Hover states
* Overall UI quality

### JavaScript

* Variables
* Functions
* Arrays
* Objects
* Regular Expressions
* Form handling
* Form validation
* DOM selection
* DOM manipulation
* `createElement()`
* Events
* Event delegation
* `closest()`
* `data-*` attributes
* Array methods
* Search
* Filtering
* Edit functionality
* Delete functionality
* `JSON.stringify()`
* `JSON.parse()`
* Debugging
* Code readability
