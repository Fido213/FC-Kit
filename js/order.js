// js/order.js

document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
});

function handleOrderSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const formStatus = document.getElementById('form-status');
    const submitButton = orderForm.querySelector('button[type="submit"]');

    // Basic Validation (HTML5 'required' handles some)
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !email || !address) {
        showFormStatus('Please fill in all required fields.', 'error');
        return;
    }

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    showFormStatus('Processing your order request...', 'processing'); // Use a neutral color or specific class

    // Prepare data for EmailJS
    // Use the template parameters you set up in your EmailJS template
    const templateParams = {
        jersey_id: document.getElementById('jersey-id').value,
        jersey_name: document.getElementById('jersey-name').value,
        customer_name: name,
        customer_email: email,
        customer_address: address,
        custom_name: document.getElementById('custom-name')?.value || 'N/A', // Use optional chaining or check if element exists
        custom_number: document.getElementById('custom-number')?.value || 'N/A',
        // Add any other fields from your form here that you want in the email
    };

    // --- EmailJS Integration ---
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs from EmailJS
    const serviceID = 'service_doq5b01';
    const templateID = 'template_hmzasyy';

    emailjs.send(serviceID, templateID, templateParams)
        .then((response) => {
           console.log('EmailJS SUCCESS!', response.status, response.text);
           showFormStatus('Order request sent successfully! We will contact you shortly.', 'success');
           orderForm.reset(); // Clear the form
        }, (error) => {
           console.error('EmailJS FAILED...', error);
           showFormStatus(`Failed to send order request. Error: ${error.text || 'Unknown error'}. Please try again later.`, 'error');
        })
        .finally(() => {
            // Re-enable button regardless of success or failure
            submitButton.disabled = false;
            submitButton.textContent = 'Place Order Request';
        });
}

// Helper function to display form status messages
function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = type; // Add class 'success' or 'error' for styling
    }
}