function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Username and password are required!");
    return;
  }

  if (username === "admin" && password === "12345") {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
}
