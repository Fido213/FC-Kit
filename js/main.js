// js/main.js

// Define tag groups (can be expanded)
const allLeagueTags = ["bundesliga", "la-liga", "premier-league", "serie-a", "ligue-1", "national", "other", "league"];
const conceptTag = "concept";
const specialEditionTag = "special-edition";
const pageTypeAttribute = 'data-page-type'; // Using a new attribute for page type like 'leagues'
const pageTagAttribute = 'data-tag';       // Using data-tag for specific filtering contexts

document.addEventListener('DOMContentLoaded', () => {
    const jerseyGrid = document.getElementById('jersey-grid');
    const currentPageBody = document.body;

    // --- Determine Base Jerseys for Initial Display ---
    let baseJerseys = jerseys; // Default to all
    const pageType = currentPageBody.dataset.pageType; // e.g., "leagues"
    const pageTag = currentPageBody.dataset.tag;       // e.g., "concept", "24/25", "premier-league"

    console.log(`Page context: type='${pageType}', tag='${pageTag}'`);

    if (pageType === 'leagues') {
        // Show all items tagged with any league tag OR the generic 'league' tag
        baseJerseys = jerseys.filter(jersey => jersey.tags.some(tag => allLeagueTags.includes(tag)));
    } else if (pageTag && pageTag !== 'all') { // Handle specific tag pages (concepts, seasons, maybe specific leagues)
        baseJerseys = jerseys.filter(jersey => jersey.tags.includes(pageTag));
    }
    // else: baseJerseys remains all jerseys for index/all pages (where no pageType or pageTag is set, or pageTag is 'all')

    // --- Initial Display ---
    if (jerseyGrid) {
        displayJerseys(baseJerseys); // Display the initial set for the page
    } else {
        console.log("Jersey grid not found on this page.");
    }

    // --- Setup Category Filters ---
    const categoryFiltersContainer = document.getElementById('category-filters');
    if (categoryFiltersContainer && jerseyGrid) {
        setupCategoryFilters(baseJerseys); // Pass base set for context checks
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    if (searchInput && jerseyGrid) {
        // Pass the *initial* base set for the page to the search handler
        searchInput.addEventListener('input', () => handleSearch(baseJerseys));
        const filterLinks = document.querySelectorAll('#category-filters .category-item');
        filterLinks.forEach(link => {
            link.addEventListener('click', () => { searchInput.value = ''; }); // Clear search on filter click
        });
    }

    // --- Load Jersey Details ---
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
            const pageType = document.body.dataset.pageType;
            const pageTag = document.body.dataset.tag;

            if (searchTerm) {
                resultsTitleElement.textContent = `Search Results for "${searchTerm}"`;
            } else if (activeFilter && activeFilter.dataset.tag !== 'all') {
                // Title based on active filter link text
                 resultsTitleElement.textContent = activeFilter.querySelector('span')?.textContent || 'Filtered Jerseys';
            } else { // Title based on page context if no filter active or 'All' is active
                 if (pageType === 'leagues') resultsTitleElement.textContent = 'League Jerseys';
                 else if (pageTag === conceptTag) resultsTitleElement.textContent = 'Concept Jerseys';
                 else if (pageTag === specialEditionTag) resultsTitleElement.textContent = 'Special Edition Jerseys';
                 else if (pageTag === '24/25') resultsTitleElement.textContent = '24/25 Season Jerseys'; // Example for season
                 // Add more else if for other specific tag pages if needed
                 else resultsTitleElement.textContent = "Featured Jerseys"; // Default/Index/All
            }
        }

        // Render Jersey Cards
        jerseysToDisplay.forEach(jersey => {
            const card = document.createElement('div');
            card.classList.add('jersey-card');
             card.setAttribute('data-tags', jersey.tags.join(' '));

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


// Modified to work primarily with tags and filter visibility based on context
function setupCategoryFilters(baseJerseys) { // baseJerseys = items loaded initially on the page
    const filterLinks = document.querySelectorAll('#category-filters .category-item');
    if (!filterLinks.length) return;

    const currentPageType = document.body.dataset.pageType; // e.g., 'leagues'
    const currentPageTag = document.body.dataset.tag; // e.g., 'concept', '24/25'
    let initialActiveFilterFound = false;

    // Check if special editions exist within the initial items for this page
    const hasSpecialEditionsInContext = baseJerseys.some(jersey => jersey.tags.includes(specialEditionTag));
    console.log(`Special editions found in current context: ${hasSpecialEditionsInContext}`);

    filterLinks.forEach(link => {
        const linkTag = link.dataset.tag; // Get the tag this filter represents

        // --- Visibility Logic ---
        let shouldShow = false;
        if (!linkTag) { // Skip if filter link has no data-tag
             link.style.display = 'none';
             return; // Go to next link
        }

        // Rule 1: Always show 'All' filter
        if (linkTag === 'all') {
            shouldShow = true;
        }
        // Rule 2: Handle Special Edition filter visibility
        else if (linkTag === specialEditionTag) {
            // Show if on SE page OR (SE exist in context AND current page is not concepts page)
            if (currentPageTag === specialEditionTag || (hasSpecialEditionsInContext && currentPageTag !== conceptTag)) {
                shouldShow = true;
            }
        }
        // Rule 3: On index or 'all' pages (no specific type/tag)
        else if (!currentPageType && !currentPageTag) {
             // Show all filters except SE unless SE actually exist globally
             if (linkTag !== specialEditionTag) {
                 shouldShow = true;
             } else {
                  shouldShow = jerseys.some(j => j.tags.includes(specialEditionTag));
             }
        }
        // Rule 4: On Leagues page, show league-related tags
        else if (currentPageType === 'leagues') {
            if (allLeagueTags.includes(linkTag)) { // Check if the filter tag is a known league tag
                shouldShow = true;
            }
             // SE visibility handled by Rule 2
        }
        // Rule 5: On Concepts page, show only 'concept' tag filter
        else if (currentPageTag === conceptTag) {
            if (linkTag === conceptTag) {
                shouldShow = true;
            }
             // SE visibility handled by Rule 2
        }
        // Rule 6: On Season (or other specific tag) pages
        else if (currentPageTag) {
             // Show most category filters (Leagues, Concepts, etc.)
             if (linkTag !== specialEditionTag) {
                 shouldShow = true;
             } else { // Re-evaluate SE based on context check
                 shouldShow = hasSpecialEditionsInContext;
             }
        }

        // Apply visibility
        link.style.display = shouldShow ? '' : 'none';

        // --- Click Listener & Initial Active State (Only for visible links) ---
        if (shouldShow) {
            // Click Listener
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const clickedTag = link.dataset.tag;

                filterLinks.forEach(lnk => lnk.classList.remove('active'));
                link.classList.add('active');

                // Filter the initial base set for the page based on the clicked tag
                let filteredJerseys;
                if (clickedTag === 'all') {
                    filteredJerseys = baseJerseys; // Show all items initially loaded for this page context
                } else {
                    // Filter base set: show items that INCLUDE the clicked tag
                    filteredJerseys = baseJerseys.filter(jersey => jersey.tags.includes(clickedTag));
                }
                displayJerseys(filteredJerseys);
            });

            // Set initial active state
            if (linkTag === currentPageTag) { // Activate filter matching the page's tag
                link.classList.add('active');
                initialActiveFilterFound = true;
            }
            // Special active state for 'Leagues' page? Maybe 'All' should be active?
            if (currentPageType === 'leagues' && linkTag === 'all') {
                 link.classList.add('active'); initialActiveFilterFound = true; // Default 'All' on leagues page
            }

        } // End if(shouldShow)

    }); // End forEach link

    // Default 'All' to active if no specific filter was activated AND 'All' is visible
    const allFilterLink = document.querySelector('#category-filters .category-item[data-tag="all"]');
    if (!initialActiveFilterFound && allFilterLink && allFilterLink.style.display !== 'none') {
        allFilterLink.classList.add('active');
    }

} // End setupCategoryFilters


// Modified Search Handler to work with tags and baseJerseys
function handleSearch(baseJerseys) { // baseJerseys is the initial set for the current page
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
        const pageType = document.body.dataset.pageType;
        const pageTag = document.body.dataset.tag;
        let activeFilterSelector = '#category-filters .category-item[data-tag="all"]'; // Default selector

        if (pageType === 'leagues') { /* keep 'All' active by default */ }
        else if (pageTag) { activeFilterSelector = `#category-filters .category-item[data-tag="${pageTag}"]`; }

        filterLinks.forEach(lnk => lnk.classList.remove('active'));
        const activeFilter = document.querySelector(activeFilterSelector);
        if (activeFilter && activeFilter.style.display !== 'none') {
            activeFilter.classList.add('active');
        } else {
            const allFilterLink = document.querySelector('#category-filters .category-item[data-tag="all"]');
            if (allFilterLink && allFilterLink.style.display !== 'none') allFilterLink.classList.add('active');
        }
    } else {
        // Filter the BASE set based on search term (name, tags, description)
        filteredJerseys = baseJerseys.filter(jersey => {
            const nameMatch = jersey.name.toLowerCase().includes(searchTerm);
            const tagMatch = jersey.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const descriptionMatch = jersey.description?.toLowerCase().includes(searchTerm);
            return nameMatch || tagMatch || descriptionMatch;
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
            <div class="tags">
                <%-- Display tags --%>
                <strong>Tags:</strong> ${jersey.tags.map(tag => `<span>${tag}</span>`).join(' ')}
            </div>
            ${jersey.customizable ? '<p><em>Customization available!</em></p>' : ''}</div>`;

    if (orderFormSection) {
        orderFormSection.style.display = 'block';
        if (jerseyIdField) jerseyIdField.value = jersey.id;
        if (jerseyNameField) jerseyNameField.value = jersey.name;
        if (customizationOptions) { customizationOptions.style.display = jersey.customizable ? 'block' : 'none'; }
    }
} // End loadJerseyDetails