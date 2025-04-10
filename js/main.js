// js/main.js

// Define league categories for filtering
const leagueCategories = ["bundesliga", "la-liga", "premier-league", "serie-a", "ligue-1", "other"];

document.addEventListener('DOMContentLoaded', () => {
    const jerseyGrid = document.getElementById('jersey-grid');
    const currentPageBody = document.body;

    // --- Initial Display Logic ---
    if (jerseyGrid) {
        let initialJerseys = [];
        const pageCategory = currentPageBody.dataset.category; // e.g., "concepts"
        const pageTag = currentPageBody.dataset.tag; // e.g., "24/25"

        console.log(`Page context: category='${pageCategory}', tag='${pageTag}'`); // Debugging line

        if (pageCategory === 'leagues') {
            initialJerseys = jerseys.filter(jersey => leagueCategories.includes(jersey.category));
            console.log(`Filtering for leagues: ${initialJerseys.length} items`); // Debugging
        } else if (pageTag) {
            initialJerseys = jerseys.filter(jersey => jersey.tags.includes(pageTag));
            console.log(`Filtering for tag '${pageTag}': ${initialJerseys.length} items`); // Debugging
        } else if (pageCategory && pageCategory !== 'all') {
            initialJerseys = jerseys.filter(jersey => jersey.category === pageCategory);
            console.log(`Filtering for category '${pageCategory}': ${initialJerseys.length} items`); // Debugging
        } else { // Default case (like index.html or all-jerseys.html)
            initialJerseys = jerseys; // Show all
            console.log(`Showing all jerseys: ${initialJerseys.length} items`); // Debugging
        }
        displayJerseys(initialJerseys); // Display the initial set
    } else {
        console.log("Jersey grid not found on this page."); // Debugging
    }

    // --- Setup Category Filters (if they exist on the page) ---
    const categoryFilters = document.getElementById('category-filters');
    if (categoryFilters && jerseyGrid) {
        setupCategoryFilters(); // Setup filters below products
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    if (searchInput && jerseyGrid) {
        searchInput.addEventListener('input', handleSearch);
        // Clear search when clicking category filters
        const filterLinks = document.querySelectorAll('#category-filters .category-item');
        filterLinks.forEach(link => {
            link.addEventListener('click', () => { searchInput.value = ''; });
        });
    }
    // --- End Search Logic ---


    // --- Load Jersey Details (if on detail page) ---
    if (document.getElementById('jersey-detail-content')) {
        loadJerseyDetails();
    }

    // --- Mobile Menu Toggle (Should be here or after main-nav is declared) ---
     const menuToggle = document.querySelector('.menu-toggle');
     const mainNav = document.querySelector('.main-nav');
     if (menuToggle && mainNav) {
         menuToggle.addEventListener('click', () => {
             mainNav.classList.toggle('nav-open');
         });
     }

}); // End DOMContentLoaded

// === Function Definitions ===

function displayJerseys(jerseysToDisplay) {
    const jerseyGrid = document.getElementById('jersey-grid');
    if (!jerseyGrid) {
        console.error("Cannot display jerseys: jersey-grid element not found.");
        return;
    }

    jerseyGrid.innerHTML = ''; // Clear previous jerseys
    const resultsTitleElement = document.querySelector('.featured-products .section-header h2'); // Target the title

    if (!jerseysToDisplay || jerseysToDisplay.length === 0) {
        jerseyGrid.innerHTML = '<p>No jerseys found matching your criteria.</p>';
        if (resultsTitleElement) resultsTitleElement.textContent = "No Results Found";
    } else {
        // Update Title Dynamically
        if (resultsTitleElement) {
            const searchInput = document.getElementById('search-input');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            const activeFilter = document.querySelector('#category-filters .category-item.active');

            if (searchTerm) {
                resultsTitleElement.textContent = `Search Results for "${searchTerm}"`;
            } else if (activeFilter) {
                const filterValue = activeFilter.dataset.filter;
                if (filterValue && filterValue !== 'all') {
                     resultsTitleElement.textContent = activeFilter.querySelector('span')?.textContent || 'Filtered Jerseys';
                 } else if (document.body.dataset.category === 'leagues') { // Specific title for leagues page
                     resultsTitleElement.textContent = 'League Jerseys';
                 } else if (document.body.dataset.tag) { // Specific title for tag page
                      resultsTitleElement.textContent = `Jerseys: ${document.body.dataset.tag}`;
                 } else { // Default title for 'All' or index
                    resultsTitleElement.textContent = "Featured Jerseys";
                 }
            } else { // Fallback title if no active filter found initially
                 const pageCategory = document.body.dataset.category;
                 const pageTag = document.body.dataset.tag;
                 if (pageCategory === 'leagues') resultsTitleElement.textContent = 'League Jerseys';
                 else if (pageTag) resultsTitleElement.textContent = `Jerseys: ${pageTag}`;
                 else if (pageCategory && pageCategory !== 'all') resultsTitleElement.textContent = pageCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize
                 else resultsTitleElement.textContent = "Featured Jerseys";
            }
        }

        // Render Jersey Cards
        jerseysToDisplay.forEach(jersey => {
            const card = document.createElement('div');
            card.classList.add('jersey-card');
            card.setAttribute('data-category', jersey.category);

            card.innerHTML = `
                <a href="jersey.html?id=${jersey.id}">
                    <img src="${jersey.image}" alt="${jersey.name}" loading="lazy">
                    <h3>${jersey.name}</h3>
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
    if (!filterLinks.length) return;

    const currentPageCategory = document.body.dataset.category;
    const currentPageTag = document.body.dataset.tag;
    let initialActiveFilterFound = false;

    filterLinks.forEach(link => {
        // Add Click Listener
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const filter = link.getAttribute('data-filter');

            filterLinks.forEach(lnk => lnk.classList.remove('active'));
            link.classList.add('active');

            let filteredJerseys = filter === 'all'
                ? jerseys // 'All' filter always shows all jerseys
                : jerseys.filter(jersey => jersey.category === filter);

            displayJerseys(filteredJerseys);
        });

        // Set initial active filter based on page context
        const linkFilter = link.dataset.filter;
        const linkTag = link.dataset.tag; // Assuming filters might use data-tag too

        if ((linkFilter && linkFilter === currentPageCategory) || (linkTag && linkTag === currentPageTag)) {
             link.classList.add('active');
             initialActiveFilterFound = true;
        }
        // Special case for leagues page - maybe highlight 'All' or a Leagues filter if one exists
         if (currentPageCategory === 'leagues' && linkFilter === 'all') { // Example: Highlight 'All' on league page
             // link.classList.add('active');
             // initialActiveFilterFound = true;
             // Decide if you want 'All' active or none specific on league page load
         }

    });

    // Default to 'All' if no specific filter was activated based on page context
    if (!initialActiveFilterFound) {
        const allFilterLink = document.querySelector('#category-filters .category-item[data-filter="all"]');
        if (allFilterLink) {
            allFilterLink.classList.add('active');
        }
    }
}

// Search Handler Function
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const jerseyGrid = document.getElementById('jersey-grid');
    if (!jerseyGrid) return;

    let filteredJerseys;
    const filterLinks = document.querySelectorAll('#category-filters .category-item'); // Get filters to manage active state

    if (searchTerm === '') {
        // If search is empty, revert to the current page's specific context
        const pageCategory = document.body.dataset.category;
        const pageTag = document.body.dataset.tag;
        let activeFilterSelector = '#category-filters .category-item[data-filter="all"]'; // Default selector

        if (pageCategory === 'leagues') {
            filteredJerseys = jerseys.filter(jersey => leagueCategories.includes(jersey.category));
            // Decide which filter link represents 'leagues' page, keep 'all' active for now
        } else if (pageTag) {
            filteredJerseys = jerseys.filter(jersey => jersey.tags.includes(pageTag));
            activeFilterSelector = `#category-filters .category-item[data-tag="${pageTag}"]`; // Assumes a tag filter exists
        } else if (pageCategory && pageCategory !== 'all') {
            filteredJerseys = jerseys.filter(jersey => jersey.category === pageCategory);
            activeFilterSelector = `#category-filters .category-item[data-filter="${pageCategory}"]`;
        } else { // Default (index/all)
            filteredJerseys = jerseys;
        }

        // Re-apply active class to the corresponding filter
        filterLinks.forEach(lnk => lnk.classList.remove('active'));
        const activeFilter = document.querySelector(activeFilterSelector);
        if (activeFilter) {
            activeFilter.classList.add('active');
        } else { // Fallback to 'All' if specific selector failed
            const allFilterLink = document.querySelector('#category-filters .category-item[data-filter="all"]');
            if (allFilterLink) allFilterLink.classList.add('active');
        }
    } else {
        // Filter based on search term in name, tags, category, description
        filteredJerseys = jerseys.filter(jersey => {
            const nameMatch = jersey.name.toLowerCase().includes(searchTerm);
            const tagMatch = jersey.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const categoryMatch = jersey.category.toLowerCase().includes(searchTerm);
            const descriptionMatch = jersey.description?.toLowerCase().includes(searchTerm);
            return nameMatch || tagMatch || categoryMatch || descriptionMatch;
        });

        // Deactivate category filters visually during search
        filterLinks.forEach(lnk => lnk.classList.remove('active'));
    }

    displayJerseys(filteredJerseys); // Display the results
}


// Function to load jersey details
function loadJerseyDetails() {
    const detailContent = document.getElementById('jersey-detail-content');
    if (!detailContent) return; // Exit if not on the detail page

    const orderFormSection = document.getElementById('order-form-section');
    const customizationOptions = document.getElementById('customization-options');
    const jerseyIdField = document.getElementById('jersey-id');
    const jerseyNameField = document.getElementById('jersey-name');
    const urlParams = new URLSearchParams(window.location.search);
    const jerseyId = urlParams.get('id');

    if (!jerseyId) {
        detailContent.innerHTML = '<p class="error">Error: Jersey ID not provided in URL.</p>'; return;
    }
    const jersey = jerseys.find(j => j.id === jerseyId);
    if (!jersey) {
        detailContent.innerHTML = `<p class="error">Error: Jersey with ID "${jerseyId}" not found.</p>`; return;
    }

    // Update page title and meta description dynamically
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
     // Trigger potential PayPal button rendering here if needed (make sure function exists)
     // if (typeof renderPayPalButton === 'function') { renderPayPalButton(jersey.price, jersey.name); }
} // End loadJerseyDetails