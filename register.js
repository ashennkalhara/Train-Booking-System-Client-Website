document.addEventListener("DOMContentLoaded", function() {
    const registrationForm = document.getElementById("registrationForm");
    const errorText = document.getElementById("errorText");

    registrationForm.addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const nic = document.getElementById("nic").value;

        if (!username || !password || !nic) {
            errorText.textContent = "Username, password, and NIC are required.";
            return;
        }

        const user = {
            UserName: username,
            Password: password,
            NIC: nic
        };

        try {
            const response = await fetch("https://localhost:7125/api/User", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                alert("User registered successfully.");
                window.location.href = "Booking.html"; 
            } else {
                const data = await response.json();
                errorText.textContent = data.Message || "Failed to register user.";
            }
        } catch (error) {
            console.error("Error:", error);
            errorText.textContent = "An error occurred while processing your request. Please try again later.";
        }
    });
});

