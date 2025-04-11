// js/data.js

const jerseys = [
    {
        id: "jersey001",
        name: "FC Bayern 24/25 Home",
        category: "bundesliga", // Use consistent lowercase category names
        price: "$69",
        image: "images/bayern-2425.png", // Make sure this path is correct
        tags: ["24/25", "bundesliga", "home"],
        description: "The official home jersey for FC Bayern Munich for the 2024/2025 season. Features Climacool technology.",
        customizable: true // Can this jersey be customized?
    },
    {
        id: "jersey002",
        name: "Real Madrid 24/25 Away",
        category: "la-liga",
        price: "$75",
        image: "images/realmadrid-away-2425.png",
        tags: ["24/25", "la liga", "away"],
        description: "Support Los Blancos on the road with the sleek 2024/2025 away jersey.",
        customizable: true
    },
    {
        id: "jersey003",
        name: "Liverpool FC 23/24 Home",
        category: "premier-league",
        price: "$65",
        image: "images/liverpool-home-2324.png",
        tags: ["23/24", "premier league", "home"],
        description: "Classic red home kit for Liverpool FC's 2023/2024 campaign.",
        customizable: true
    },
    {
        id: "jersey004",
        name: "Concept Kit 'Aurora'",
        category: "concepts",
        price: "$80",
        image: "images/concept-aurora.png",
        tags: ["concept", "fantasy", "unique"],
        description: "A unique concept kit inspired by the Northern Lights. Limited edition design.",
        customizable: false // Concept kits might not be customizable
    },
     {
        id: "jersey005",
        name: "Juventus 24/25 Special Edition",
     // --- FIX APPLIED HERE ---
        category: "special-editions", // Set ONE primary category
     // -----------------------
        price: "$85",
        image: "images/juventus-special-2425.png",
        tags: ["24/25", "serie a", "special edition", "limited"], // Keep 'serie a' in tags if relevant
        description: "Exclusive special edition Juventus jersey for the 2024/25 season.",
        customizable: false
    },
    // --- Add more jersey objects here following the same structure ---
    // {
    //     id: "jersey006",
    //     name: "...",
    //     category: "...", // e.g., "ligue-1", "serie-a", "other"
    //     price: "$...",
    //     image: "images/...",
    //     tags: ["...", "..."],
    //     description: "...",
    //     customizable: true_or_false
    // }
];