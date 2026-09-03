const aboutTextarea = document.getElementById("studentAbout");
const counterDisplay = document.getElementById("counter");

aboutTextarea.addEventListener("input", function () {
    const currentLength = aboutTextarea.value.length;
    counterDisplay.textContent = currentLength + " / 200";
});
