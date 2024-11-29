document.addEventListener("DOMContentLoaded", () => {
    const formTitle = document.getElementById("form-title");
    const form = document.getElementById("login-signup-form");
    const emailField = document.getElementById("email");
    const confirmPasswordField = document.getElementById("confirm-password");
    const formSubmitButton = document.getElementById("form-submit");
    const toggleButton = document.getElementById("toggle-button");
    const responseMessage = document.getElementById("response-message");

    let isSignup = false;

    // Toggle between login and signup
    toggleButton.addEventListener("click", () => {
        isSignup = !isSignup;

        if (isSignup) {
            // Switch to Signup
            formTitle.textContent = "Create an Account";
            emailField.classList.remove("hidden");
            confirmPasswordField.classList.remove("hidden");
            formSubmitButton.textContent = "Sign Up";
            toggleButton.textContent = "Login";
            toggleButton.parentNode.firstChild.textContent = "Already have an account? ";
        } else {
            // Switch to Login
            formTitle.textContent = "Welcome Back";
            emailField.classList.add("hidden");
            confirmPasswordField.classList.add("hidden");
            formSubmitButton.textContent = "Login";
            toggleButton.textContent = "Sign up";
            toggleButton.parentNode.firstChild.textContent = "Don't have an account? ";
        }
    });

    // Handle form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const email = document.getElementById("email").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (isSignup) {
            // Handle Signup
            if (!email || password !== confirmPassword) {
                responseMessage.textContent = "Error: Ensure all fields are correct!";
                responseMessage.style.color = "red";
                return;
            }

            // Send signup request to the server
            const response = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            responseMessage.textContent = data.message;
            responseMessage.style.color = data.success ? "green" : "red";
        } else {
            // Handle Login
            if (!username || !password) {
                responseMessage.textContent = "Error: Fill in all fields!";
                responseMessage.style.color = "red";
                return;
            }

            // Send login request to the server
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                responseMessage.textContent = data.message;
                responseMessage.style.color = "green";

                // Redirect to the new website
                window.location.href = "http://127.0.0.1:5000"; // Replace "/" with the desired URL if needed
            } else {
                responseMessage.textContent = data.message;
                responseMessage.style.color = "red";
            }
        }

        form.reset();
    });
});

