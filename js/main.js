// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const jerseyGrid = document.getElementById('jersey-grid');
    const currentPageBody = document.body; // Use body for data attribute context

    // --- Initial Display Logic ---
    if (jerseyGrid) {
        let categoryToShow = currentPageBody.dataset.category || 'all'; // Read category from body data attribute
        let initialJerseys;

        if (categoryToShow === 'all') {
            initialJerseys = jerseys;
        } else {
            initialJerseys = jerseys.filter(jersey => jersey.category === categoryToShow);
        }
        displayJerseys(initialJerseys); // Display initial set (all or category-specific)
    }

    // --- Setup Category Filters (if they exist on the page) ---
    const categoryFilters = document.getElementById('category-filters');
    if (categoryFilters && jerseyGrid) { // Check for grid too
        setupCategoryFilters();
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    // Check if grid exists on the page where search is present
    if (searchInput && jerseyGrid) {
        searchInput.addEventListener('input', handleSearch);

        // Optional: Clear search when clicking category filters
        const filterLinks = document.querySelectorAll('#category-filters .category-item');
        filterLinks.forEach(link => {
            link.addEventListener('click', () => {
                 // Delay clearing slightly to allow search handler to potentially finish
                 // or clear it directly if preferred.
                // setTimeout(() => { searchInput.value = ''; }, 50);
                searchInput.value = ''; // Clear search on category click
            });
        });
    }
    // --- End Search Logic ---


    // --- Load Jersey Details (if on detail page) ---
    if (document.getElementById('jersey-detail-content')) {
        // The loadJerseyDetails function needs to be defined
        // Ensure it's either below or this call is wrapped if defined later
        loadJerseyDetails();
    }

}); // End DOMContentLoaded

// === Function Definitions ===

function displayJerseys(jerseysToDisplay) {
    const jerseyGrid = document.getElementById('jersey-grid');
    if (!jerseyGrid) return; // Exit if grid doesn't exist

    jerseyGrid.innerHTML = ''; // Clear previous jerseys

    const resultsTitle = document.querySelector('.featured-products .section-header h2'); // Get title element

    if (jerseysToDisplay.length === 0) {
        jerseyGrid.innerHTML = '<p>No jerseys found matching your criteria.</p>';
         if(resultsTitle) resultsTitle.textContent = "No Results"; // Update title
    } else {
         if(resultsTitle) {
             // Update title based on context (e.g., category or search)
             // This could be more sophisticated based on how filtering/search was triggered
             // For now, let's keep it simple or use a generic title
              const activeFilter = document.querySelector('#category-filters .category-item.active');
              const searchTerm = document.getElementById('search-input')?.value || '';

              if (searchTerm) {
                  resultsTitle.textContent = `Search Results for "${searchTerm}"`;
              } else if (activeFilter && activeFilter.dataset.filter !== 'all') {
                  resultsTitle.textContent = activeFilter.querySelector('span')?.textContent || 'Filtered Jerseys';
              } else {
                   resultsTitle.textContent = "Featured Jerseys"; // Default title
              }
         }

        jerseysToDisplay.forEach(jersey => {
            const card = document.createElement('div');
            card.classList.add('jersey-card');
            card.setAttribute('data-category', jersey.category);

            card.innerHTML = `
                <a href="jersey.html?id=${jersey.id}">
                    <img src="${jersey.image}" alt="${jersey.name}" loading="lazy"> <h3>${jersey.name}</h3>
                    <p class="price">${jersey.price}</p>
                </a>
                <button class="btn btn-secondary" onclick="window.location.href='jersey.html?id=${jersey.id}'">View Details</button>
            `;
            jerseyGrid.appendChild(card);
        });
    }
}

function setupCategoryFilters() {
    const filterLinks = document.querySelectorAll('#category-filters .category-item');
    if (!filterLinks.length) return; // Exit if no filter links found

    const currentPageCategory = document.body.dataset.category || 'all';

    filterLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor jump

            const filter = link.getAttribute('data-filter');

            // Update active state visually
            filterLinks.forEach(lnk => lnk.classList.remove('active'));
            link.classList.add('active');

            let filteredJerseys;
            if (filter === 'all') {
                // If 'All' is clicked, show all jerseys regardless of current page context
                filteredJerseys = jerseys;
                 // Optionally update body data attribute if needed, or clear it
                 // document.body.dataset.category = 'all';
            } else {
                filteredJerseys = jerseys.filter(jersey => jersey.category === filter);
                 // Optionally update body data attribute
                 // document.body.dataset.category = filter;
            }

            displayJerseys(filteredJerseys);
        });

         // Set initial active filter based on page context read from body
         if (link.getAttribute('data-filter') === currentPageCategory) {
            link.classList.add('active');
         }
    });

    // Ensure 'All' is active if no specific category matches or if on index page default
     if (!document.querySelector('#category-filters .category-item.active')) {
         const allFilterLink = document.querySelector('#category-filters .category-item[data-filter="all"]');
         if (allFilterLink) allFilterLink.classList.add('active');
     }
}


// Search Handler Function
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const jerseyGrid = document.getElementById('jersey-grid');

    if (!jerseyGrid) return; // Exit if grid not found

    let filteredJerseys;

    if (searchTerm === '') {
        // If search is empty, revert to the current category context
        const pageCategory = document.body.dataset.category || 'all';
        if (pageCategory === 'all') {
            filteredJerseys = jerseys;
        } else {
            filteredJerseys = jerseys.filter(jersey => jersey.category === pageCategory);
        }
        // Re-apply active class to the corresponding category filter
        const filterLinks = document.querySelectorAll('#category-filters .category-item');
        filterLinks.forEach(lnk => lnk.classList.remove('active'));
        const activeFilter = document.querySelector(`#category-filters .category-item[data-filter="${pageCategory}"]`);
        if (activeFilter) activeFilter.classList.add('active');
        else { // Default to 'All' if no match
             const allFilterLink = document.querySelector('#category-filters .category-item[data-filter="all"]');
             if (allFilterLink) allFilterLink.classList.add('active');
        }

    } else {
        // Filter based on search term in name or tags
        filteredJerseys = jerseys.filter(jersey => {
            const nameMatch = jersey.name.toLowerCase().includes(searchTerm);
            const tagMatch = jersey.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const categoryMatch = jersey.category.toLowerCase().includes(searchTerm); // Also search category name
            const descriptionMatch = jersey.description?.toLowerCase().includes(searchTerm); // Optional: Search description

            return nameMatch || tagMatch || categoryMatch || descriptionMatch;
        });

         // Deactivate category filters visually during search
         const filterLinks = document.querySelectorAll('#category-filters .category-item');
         filterLinks.forEach(lnk => lnk.classList.remove('active'));
    }

    displayJerseys(filteredJerseys);
}


// Function to load jersey details (ensure it's defined)
function loadJerseyDetails() {
    const detailContent = document.getElementById('jersey-detail-content');
    const orderFormSection = document.getElementById('order-form-section');
    const customizationOptions = document.getElementById('customization-options');
    const jerseyIdField = document.getElementById('jersey-id');
    const jerseyNameField = document.getElementById('jersey-name');

    if (!detailContent) return; // Exit if not on the detail page

    const urlParams = new URLSearchParams(window.location.search);
    const jerseyId = urlParams.get('id');

    if (!jerseyId) {
        detailContent.innerHTML = '<p class="error">Error: Jersey ID not provided in URL.</p>';
        return;
    }

    const jersey = jerseys.find(j => j.id === jerseyId);

    if (!jersey) {
        detailContent.innerHTML = `<p class="error">Error: Jersey with ID "${jerseyId}" not found.</p>`;
        return;
    }

     // Update page title and meta description dynamically (Optional but good)
     document.title = `${jersey.name} - Jersey Details`;
     const metaDesc = document.querySelector('meta[name="description"]');
     if(metaDesc) metaDesc.setAttribute('content', `Details and order form for the ${jersey.name}. ${jersey.description || ''}`);


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
        if (jerseyIdField) jerseyIdField.value = jersey.id;
        if (jerseyNameField) jerseyNameField.value = jersey.name;

        if (customizationOptions && jersey.customizable) {
            customizationOptions.style.display = 'block';
        } else if (customizationOptions) {
            customizationOptions.style.display = 'none';
        }
    }

     // --- Trigger potential PayPal button rendering here if using that ---
     // Make sure the renderPayPalButton function is available
     // if (typeof renderPayPalButton === 'function') {
     //     renderPayPalButton(jersey.price, jersey.name);
     // }
} // End loadJerseyDetails