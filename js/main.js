// js/main.js

// Define league categories for filtering
const leagueCategories = ["bundesliga", "la-liga", "premier-league", "serie-a", "ligue-1", "national", "other"]; // Added national here based on filters

document.addEventListener('DOMContentLoaded', () => {
    const jerseyGrid = document.getElementById('jersey-grid');
    const currentPageBody = document.body;

    // --- Determine Base Jerseys for Initial Display ---
    let baseJerseys = jerseys; // Default to all
    const pageCategory = currentPageBody.dataset.category;
    const pageTag = currentPageBody.dataset.tag;

    console.log(`Page context: category='${pageCategory}', tag='${pageTag}'`);

    if (pageCategory === 'leagues') {
        baseJerseys = jerseys.filter(jersey => leagueCategories.includes(jersey.category));
    } else if (pageTag) {
        baseJerseys = jerseys.filter(jersey => jersey.tags.includes(pageTag));
    } else if (pageCategory && pageCategory !== 'all') {
        baseJerseys = jerseys.filter(jersey => jersey.category === pageCategory);
    }
    // else: baseJerseys remains all jerseys for index/all pages

    // --- Initial Display ---
    if (jerseyGrid) {
        displayJerseys(baseJerseys); // Display the initial set for the page
    } else {
        console.log("Jersey grid not found on this page.");
    }

    // --- Setup Category Filters (passing baseJerseys for context checks) ---
    const categoryFiltersContainer = document.getElementById('category-filters');
    if (categoryFiltersContainer && jerseyGrid) {
        setupCategoryFilters(baseJerseys); // Pass the initial set for context checks
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    if (searchInput && jerseyGrid) {
        searchInput.addEventListener('input', () => handleSearch(baseJerseys)); // Pass baseJerseys to search handler
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

    // --- Mobile Menu Toggle ---
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

    jerseyGrid.innerHTML = '';
    const resultsTitleElement = document.querySelector('.featured-products .section-header h2, #category-jerseys .section-header h2');

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
                 } else {
                     const pageCategory = document.body.dataset.category;
                     const pageTag = document.body.dataset.tag;
                     if (pageCategory === 'leagues') resultsTitleElement.textContent = 'League Jerseys';
                     else if (pageTag) resultsTitleElement.textContent = `Jerseys: ${pageTag}`;
                     else if (pageCategory === 'concepts') resultsTitleElement.textContent = 'Concept Jerseys';
                     else if (pageCategory === 'special-editions') resultsTitleElement.textContent = 'Special Edition Jerseys';
                     else resultsTitleElement.textContent = "Featured Jerseys";
                 }
            } else {
                 const pageCategory = document.body.dataset.category;
                 const pageTag = document.body.dataset.tag;
                 if (pageCategory === 'leagues') resultsTitleElement.textContent = 'League Jerseys';
                 else if (pageTag) resultsTitleElement.textContent = `Jerseys: ${pageTag}`;
                 else if (pageCategory === 'concepts') resultsTitleElement.textContent = 'Concept Jerseys';
                 else if (pageCategory === 'special-editions') resultsTitleElement.textContent = 'Special Edition Jerseys';
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


// Modified to accept baseJerseys for context checks
function setupCategoryFilters(baseJerseys) {
    const filterLinks = document.querySelectorAll('#category-filters .category-item');
    if (!filterLinks.length) return;

    const currentPageCategory = document.body.dataset.category;
    const currentPageTag = document.body.dataset.tag;
    let initialActiveFilterFound = false;

    // Define relevant categories for easier checking
    const conceptCategory = "concepts"; // Single value check
    const specialCategory = "special-editions";

    // --- Check if special editions exist within the current context (baseJerseys) ---
    const hasSpecialEditionsInContext = baseJerseys.some(jersey => jersey.category === specialCategory);
    console.log(`Special editions found in current context: ${hasSpecialEditionsInContext}`); // Debugging line

    filterLinks.forEach(link => {
        const linkFilter = link.dataset.filter; // Category filter value (e.g., "premier-league")
        // const linkTag = link.dataset.tag;    // Tag filter value (not used by these filters yet)

        // --- Visibility Logic ---
        let shouldShow = false;

        // Rule 1: Always show the 'All' filter
        if (linkFilter === 'all') {
            shouldShow = true;
        }
        // Rule 2: Special handling for the "Special Editions" filter itself
        else if (linkFilter === specialCategory) {
            // Show if we are ON the special editions page OR
            // if special editions EXIST in the current context AND we are NOT on the concepts page
            if (currentPageCategory === specialCategory || (hasSpecialEditionsInContext && currentPageCategory !== conceptCategory)) {
                 shouldShow = true;
            }
        }
        // Rule 3: On index or 'all' pages, show everything (except potentially special editions if none exist globally?)
        // Let's keep showing all on index/all pages for simplicity for now, respecting Rule 2 for SE visibility.
        else if (!currentPageCategory || currentPageCategory === 'all') {
             if (linkFilter !== specialCategory) { // SE handled by Rule 2
                shouldShow = true;
            } else { // Re-evaluate SE for index/all context
                 shouldShow = jerseys.some(j => j.category === specialCategory); // Show SE filter on index/all only if *any* SE exist
            }
        }
        // Rule 4: On 'Leagues' page, show only league categories
        else if (currentPageCategory === 'leagues') {
            if (leagueCategories.includes(linkFilter)) {
                shouldShow = true;
            }
        }
        // Rule 5: On 'Concepts' page, show only 'concepts' filter
        else if (currentPageCategory === conceptCategory) {
            if (linkFilter === conceptCategory) { // Only show the 'concepts' filter itself
                shouldShow = true;
            }
            // Special Editions are explicitly hidden here by Rule 2 check (currentPageCategory !== conceptCategory)
        }
        // Rule 6: On 'Season' pages, show all relevant category filters
        else if (currentPageTag) {
             if (linkFilter !== specialCategory) { // SE handled by Rule 2
                 shouldShow = true;
             } else { // Re-evaluate SE for the specific season tag context
                 shouldShow = hasSpecialEditionsInContext; // Use the context check
             }
        }
        // Rule 7: Fallback for any other specific category page (e.g., premier-league.html)
        else if (currentPageCategory === linkFilter) {
             shouldShow = true; // Show the filter matching the page category
             // SE visibility handled by Rule 2
        }

        // Apply visibility
        link.style.display = shouldShow ? '' : 'none';


        // --- Click Listener Logic (only for visible links) ---
        if (shouldShow) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const filter = link.getAttribute('data-filter');

                filterLinks.forEach(lnk => lnk.classList.remove('active'));
                link.classList.add('active');

                // Filter within the current page's base set
                let filteredJerseys;
                if (filter === 'all') {
                    filteredJerseys = baseJerseys; // 'All' shows all items relevant to the current page
                } else {
                    // Apply category filter within the base set
                    filteredJerseys = baseJerseys.filter(jersey => jersey.category === filter);
                }
                displayJerseys(filteredJerseys);
            });

            // Set initial active filter based on page context ONLY if visible
            if (linkFilter === currentPageCategory || (currentPageTag && link.dataset.tag === currentPageTag) ) {
                link.classList.add('active');
                initialActiveFilterFound = true;
            }
             // Handle 'Leagues' page default active state maybe?
             if (currentPageCategory === 'leagues' && linkFilter === 'all') { // Example: Highlight 'All' on league page load
                 // link.classList.add('active'); initialActiveFilterFound = true;
             }
        }
    }); // End forEach link

    // Default 'All' to active if no specific filter was found and activated AND 'All' is visible
    const allFilterLink = document.querySelector('#category-filters .category-item[data-filter="all"]');
    if (!initialActiveFilterFound && allFilterLink && allFilterLink.style.display !== 'none') {
        allFilterLink.classList.add('active');
    }

} // End setupCategoryFilters


// Modified Search Handler to accept baseJerseys
function handleSearch(baseJerseys) {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const jerseyGrid = document.getElementById('jersey-grid');
    if (!jerseyGrid) return;

    let filteredJerseys;
    const filterLinks = document.querySelectorAll('#category-filters .category-item');

    if (searchTerm === '') {
        // If search is empty, revert to the initial base set for the page
        filteredJerseys = baseJerseys;

        // Re-apply active class to the corresponding visible filter based on page context
        const pageCategory = document.body.dataset.category;
        const pageTag = document.body.dataset.tag;
        let activeFilterSelector = '#category-filters .category-item[data-filter="all"]'; // Default selector

        if (pageCategory === 'leagues') { /* keep All active? */ }
        else if (pageTag) { activeFilterSelector = `#category-filters .category-item[data-tag="${pageTag}"]`; } // Assumes tag filters exist
        else if (pageCategory && pageCategory !== 'all') { activeFilterSelector = `#category-filters .category-item[data-filter="${pageCategory}"]`; }

        filterLinks.forEach(lnk => lnk.classList.remove('active'));
        const activeFilter = document.querySelector(activeFilterSelector);
        if (activeFilter && activeFilter.style.display !== 'none') { // Check visibility
            activeFilter.classList.add('active');
        } else {
            const allFilterLink = document.querySelector('#category-filters .category-item[data-filter="all"]');
            if (allFilterLink && allFilterLink.style.display !== 'none') allFilterLink.classList.add('active');
        }
    } else {
        // Filter the BASE set based on search term
        filteredJerseys = baseJerseys.filter(jersey => {
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
} // End handleSearch


// Function to load jersey details
function loadJerseyDetails() {
    const detailContent = document.getElementById('jersey-detail-content');
    if (!detailContent) return;

    const orderFormSection = document.getElementById('order-form-section');
    const customizationOptions = document.getElementById('customization-options');
    const jerseyIdField = document.getElementById('jersey-id');
    const jerseyNameField = document.getElementById('jersey-name');
    const urlParams = new URLSearchParams(window.location.search);
    const jerseyId = urlParams.get('id');

    if (!jerseyId) { detailContent.innerHTML = '<p class="error">Error: Jersey ID not provided.</p>'; return; }
    const jersey = jerseys.find(j => j.id === jerseyId);
    if (!jersey) { detailContent.innerHTML = `<p class="error">Error: Jersey ID "${jerseyId}" not found.</p>`; return; }

    document.title = `${jersey.name} - Jersey Details`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute('content', `Details and order form for ${jersey.name}. ${jersey.description || ''}`);

    detailContent.innerHTML = `
        <div class="jersey-image-container"><img src="${jersey.image}" alt="${jersey.name}"></div>
        <div class="jersey-info-container">
            <h2>${jersey.name}</h2><p class="price">${jersey.price}</p>
            <p>${jersey.description || 'No description available.'}</p>
            <div class="tags"><strong>Category:</strong> <span>${jersey.category}</span> <br/>
                <strong>Tags:</strong> ${jersey.tags.map(tag => `<span>${tag}</span>`).join(' ')}</div>
            ${jersey.customizable ? '<p><em>Customization available!</em></p>' : ''}</div>`;

    if (orderFormSection) {
        orderFormSection.style.display = 'block';
        if (jerseyIdField) jerseyIdField.value = jersey.id;
        if (jerseyNameField) jerseyNameField.value = jersey.name;
        if (customizationOptions) {
            customizationOptions.style.display = jersey.customizable ? 'block' : 'none';
        }
    }
    // if (typeof renderPayPalButton === 'function') { renderPayPalButton(jersey.price, jersey.name); }
} // End loadJerseyDetails