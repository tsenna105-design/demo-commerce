document.addEventListener("DOMContentLoaded", function () {

    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
        window.location.href = "login.html";
        return;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("firstName").value =
        user.first_name || "";

    document.getElementById("lastName").value =
        user.last_name || "";

    document.getElementById("email").value =
        user.email || "";

    document.getElementById("phone").value =
        user.phone || "";

    document.getElementById("profileForm")
        .addEventListener("submit", updateProfile);

    document.getElementById("passwordForm")
        .addEventListener("submit", changePassword);


    async function updateProfile(event) {

        event.preventDefault();

        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const message =
            document.getElementById("profileMessage");

        try {

            const response = await fetch(
                `http://localhost:5000/api/users/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to update profile."
                );
            }

            user.first_name = firstName;
            user.last_name = lastName;
            user.phone = phone;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            message.textContent =
                "Profile updated successfully.";

            message.className = "success-message";

        } catch (error) {

            console.error("Profile update error:", error);

            message.textContent = error.message;
            message.className = "error-message";
        }
    }


    async function changePassword(event) {

        event.preventDefault();

        const currentPassword =
            document.getElementById("currentPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("passwordMessage");

        if (newPassword !== confirmPassword) {

            message.textContent =
                "New passwords do not match.";

            message.className = "error-message";

            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/users/password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to change password."
                );
            }

            message.textContent =
                "Password changed successfully.";

            message.className = "success-message";

            document.getElementById("passwordForm").reset();

        } catch (error) {

            console.error("Password change error:", error);

            message.textContent = error.message;
            message.className = "error-message";
        }
    }

});

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", function () {

        const input = document.getElementById(
            this.dataset.target
        );

        if (input.type === "password") {

            input.type = "text";
            this.textContent = "🙈";

        } else {

            input.type = "password";
            this.textContent = "👁️";

        }

    });

});
