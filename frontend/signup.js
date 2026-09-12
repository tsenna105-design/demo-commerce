// ===============================
// GET ELEMENTS
// ===============================

const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.innerHTML = "🙈";

    } else {

        password.type = "password";
        togglePassword.innerHTML = "👁";

    }

});

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";
        toggleConfirmPassword.innerHTML = "🙈";

    } else {

        confirmPassword.type = "password";
        toggleConfirmPassword.innerHTML = "👁";

    }

});


// ===============================
// SIGN UP
// ===============================

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (
        firstName.value.trim() === "" ||
        lastName.value.trim() === "" ||
        email.value.trim() === "" ||
        phone.value.trim() === "" ||
        password.value === "" ||
        confirmPassword.value === ""
    ) {

        message.style.color = "red";
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (password.value.length < 8) {

        message.style.color = "red";
        message.textContent = "Password must be at least 8 characters.";
        return;
    }

    if (password.value !== confirmPassword.value) {

        message.style.color = "red";
        message.textContent = "Passwords do not match.";
        return;
    }

    try {

        message.style.color = "black";
        message.textContent = "Creating your account...";

        const response = await fetch("http://127.0.0.1:5000/api/auth/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                first_name: firstName.value.trim(),
                last_name: lastName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                password: password.value

            })

        });

        const data = await response.json();

        if (response.ok) {

            message.style.color = "green";
            message.textContent = "Account created successfully!";

            signupForm.reset();

            setTimeout(function () {

                window.location.href = "login.html";

            }, 1500);

        } else {

            message.style.color = "red";
            message.textContent = data.message;

        }

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.textContent = "Unable to connect to the server.";

    }

});