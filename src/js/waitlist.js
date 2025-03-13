document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlist-form');
    
    if (!form) {
        console.error('Form not found');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const company = document.getElementById('company').value;
        const interest = document.getElementById('interest').value;

        // Validate form
        if (!name || !email || !interest) {
            alert('Please fill in all required fields');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }

        try {
            // For local development vs production
            const apiUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000/api/waitlist'
                : '/api/waitlist';
                
            console.log('Submitting to:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    company,
                    interest
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Replace the entire page content with a clean thank you message
            document.body.innerHTML = `
                <div class="thank-you-page">
                    <div class="thank-you-container">
                        <div class="thank-you-content">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="32" cy="32" r="32" fill="#E6F7F1"/>
                                <path d="M27.5 34.5L21 28L18 31L27.5 40.5L46 22L43 19L27.5 34.5Z" fill="#00A67E"/>
                            </svg>
                            <h1>Thank You!</h1>
                            <p>Your submission has been received. We'll be in touch soon.</p>
                            <div class="button-container">
                                <a href="index.html" class="button button-primary">Back to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    .thank-you-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #f8f9fa;
                        padding: 20px;
                    }
                    .thank-you-container {
                        max-width: 600px;
                        width: 100%;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                        padding: 40px;
                        text-align: center;
                    }
                    .thank-you-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .thank-you-content svg {
                        margin-bottom: 24px;
                    }
                    .thank-you-content h1 {
                        font-size: 32px;
                        margin-bottom: 16px;
                        color: #333;
                    }
                    .thank-you-content p {
                        font-size: 18px;
                        margin-bottom: 32px;
                        color: #666;
                    }
                    .button-container {
                        display: flex;
                        justify-content: center;
                        width: 100%;
                    }
                    .button {
                        display: inline-flex;
                        padding: 12px 32px;
                        font-size: 16px;
                        font-weight: 600;
                        text-decoration: none;
                        border-radius: 4px;
                        transition: all 0.3s ease;
                        justify-content: center;
                        align-items: center;
                    }
                    .button-primary {
                        background-color: #00A67E;
                        color: white;
                    }
                    .button-primary:hover {
                        background-color: #008c69;
                    }
                </style>
            `;

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred. Please try again.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });

    // Add input validation feedback
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('invalid');
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('invalid');
        });
    });
});