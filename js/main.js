// js/main.js

// Wait until the DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the index page by looking for the jersey grid
    const jerseyGrid = document.getElementById('jersey-grid');
    if (jerseyGrid) {
        displayJerseys(jerseys); // Display all jerseys initially
        setupCategoryFilters(); // Set up the filter buttons
    }

    // Check if we are on the jersey detail page
    // Note: loading details is now handled in jersey.html's inline script
    // to ensure data.js is loaded first. We just define the function here.
});

// --- Functions for Index Page (Filtering and Display) ---

// Function to display jerseys on the index page
function displayJerseys(jerseysToDisplay) {
    const jerseyGrid = document.getElementById('jersey-grid');
    if (!jerseyGrid) return; // Exit if not on the index page

    jerseyGrid.innerHTML = ''; // Clear existing jerseys

    if (jerseysToDisplay.length === 0) {
        jerseyGrid.innerHTML = '<p>No jerseys found for this category.</p>';
        return;
    }

    jerseysToDisplay.forEach(jersey => {
        const card = document.createElement('div');
        card.classList.add('jersey-card');
        // Add a data attribute to easily identify the category for filtering styles (optional)
        card.setAttribute('data-category', jersey.category);

        card.innerHTML = `
            <a href="jersey.html?id=${jersey.id}">
                <img src="${jersey.image}" alt="${jersey.name}">
                <h3>${jersey.name}</h3>
                <p class="price">${jersey.price}</p>
            </a>
            <button class="btn btn-secondary" onclick="window.location.href='jersey.html?id=${jersey.id}'">View Details</button>
        `;
        // Note: We wrap the top part in an <a> tag for easier clicking,
        // and provide an explicit button for clarity.
        jerseyGrid.appendChild(card);
    });
}

// Function to set up category filter buttons
function setupCategoryFilters() {
    const filterLinks = document.querySelectorAll('#category-filters .category-item');
    const jerseyGrid = document.getElementById('jersey-grid'); // Get grid reference

    filterLinks.forEach(link => {
        link.addEventListener('click', () => {
            const filter = link.getAttribute('data-filter');

            // Remove active class from all buttons and add to the clicked one
             filterLinks.forEach(lnk => lnk.classList.remove('active'));
             link.classList.add('active');

            // Filter the jerseys
            let filteredJerseys;
            if (filter === 'all') {
                filteredJerseys = jerseys;
                 jerseyGrid.classList.remove('filtering'); // Optional: remove filtering class
            } else {
                filteredJerseys = jerseys.filter(jersey => jersey.category === filter);
                jerseyGrid.classList.add('filtering'); // Optional: add class for styling filtered state
            }

            // Display the filtered jerseys
            displayJerseys(filteredJerseys);
        });
    });
}

// --- Function for Jersey Detail Page ---

// Function to load jersey details (called from jersey.html)
function loadJerseyDetails() {
    const detailContent = document.getElementById('jersey-detail-content');
    const orderFormSection = document.getElementById('order-form-section');
    const customizationOptions = document.getElementById('customization-options');
    const jerseyIdField = document.getElementById('jersey-id');
    const jerseyNameField = document.getElementById('jersey-name');


    if (!detailContent) return; // Exit if not on the detail page

    // Get the jersey ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const jerseyId = urlParams.get('id');

    if (!jerseyId) {
        detailContent.innerHTML = '<p class="error">Error: Jersey ID not provided in URL.</p>';
        return;
    }

    // Find the jersey in our data
    // Use == for comparison in case the ID from URL is treated as a string vs number etc.
    // Or ensure IDs in data.js are strings if using ===
    const jersey = jerseys.find(j => j.id === jerseyId);

    if (!jersey) {
        detailContent.innerHTML = `<p class="error">Error: Jersey with ID "${jerseyId}" not found.</p>`;
        return;
    }

    // Populate the detail content area
    detailContent.innerHTML = `
        <div class="jersey-image-container">
            <img src="${jersey.image}" alt="${jersey.name}">
        </div>
        <div class="jersey-info-container">
            <h2>${jersey.name}</h2>
            <p class="price">${jersey.price}</p>
            <p>${jersey.description || 'No description available.'}</p>
             <div class="tags">
                <strong>Category:</strong> <span>${jersey.category}</span> <br/>
                <strong>Tags:</strong> ${jersey.tags.map(tag => `<span>${tag}</span>`).join(' ')}
            </div>
            ${jersey.customizable ? '<p><em>Customization available!</em></p>' : ''}
             </div>
    `;

    // Show the order form section
    if (orderFormSection) {
        orderFormSection.style.display = 'block';
         // Set hidden form fields
        if(jerseyIdField) jerseyIdField.value = jersey.id;
        if(jerseyNameField) jerseyNameField.value = jersey.name;


        // Show customization options in the form if applicable
        if (customizationOptions && jersey.customizable) {
            customizationOptions.style.display = 'block';
        } else if (customizationOptions) {
             customizationOptions.style.display = 'none';
        }
    }
}