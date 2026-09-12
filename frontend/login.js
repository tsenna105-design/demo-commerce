const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // ======================================
    // VALIDATION
    // ======================================

    if (email === "" || password === "") {
        message.style.color = "red";
        message.textContent = "Please fill in all fields.";
        return;
    }

    // ======================================
    // LOGIN REQUEST
    // ======================================

    try {

        message.style.color = "black";
        message.textContent = "Logging in...";

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        // ==================================
        // LOGIN FAILED
        // ==================================

        if (!response.ok || !data.success) {
            message.style.color = "red";
            message.textContent = data.message || "Login failed.";
            return;
        }

        // ==================================
        // SAVE LOGIN INFORMATION
        // ==================================

        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        // ==================================
        // SUCCESS
        // ==================================

        message.style.color = "green";
        message.textContent = "Login successful!";

        // ==================================
        // REDIRECT
        // ==================================

        setTimeout(function () {
            window.location.href = "home.html";
        }, 1000);

    } catch (error) {

        console.error("Login Error:", error);

        message.style.color = "red";
        message.textContent =
            "Unable to connect to the server.";
    }

});const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (passwordInput && togglePassword) {

    togglePassword.addEventListener("click", function (event) {

        event.preventDefault();

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "👁️";
        }

        passwordInput.focus();

    });

}
