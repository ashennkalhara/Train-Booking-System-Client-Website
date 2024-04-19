document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const errorText = document.getElementById("errorText");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            errorText.textContent = "Username and Password are required.";
            return;
        }

        const user = {
            username: username,
            password: password
        };

        try {
            const response = await fetch("https://localhost:7125/api/User/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                alert("Login successful!"); // Display alert
                window.location.href = "Booking.html"; 

            } else {
                const data = await response.json();
                errorText.textContent = data.message || "Failed to log in. Please try again later.";
            }

        } catch (error) {
            console.error("Error:", error);
            errorText.textContent = "Invalid username password";
        }
    });
});

