// js/data.js

const jerseys = [
    {
        id: "jersey001",
        name: "FC Bayern 24/25 Home",
        price: "$69",
        image: "images/bayern-2425.png",
        // Ensure all relevant classifications are tags
        tags: ["24/25", "bundesliga", "home", "fc-bayern", "league"],
        description: "The official home jersey for FC Bayern Munich for the 2024/2025 season. Features Climacool technology.",
        customizable: true
    },
    {
        id: "jersey002",
        name: "Real Madrid 24/25 Away",
        price: "$75",
        image: "images/realmadrid-away-2425.png",
        tags: ["24/25", "la-liga", "away", "real-madrid", "league"],
        description: "Support Los Blancos on the road with the sleek 2024/2025 away jersey.",
        customizable: true
    },
    {
        id: "jersey003",
        name: "Liverpool FC 23/24 Home",
        price: "$65",
        image: "images/liverpool-home-2324.png",
        tags: ["23/24", "premier-league", "home", "liverpool", "league"],
        description: "Classic red home kit for Liverpool FC's 2023/2024 campaign.",
        customizable: true
    },
    {
        id: "jersey004",
        name: "Concept Kit 'Aurora'",
        price: "$80",
        image: "images/concept-aurora.png",
        tags: ["concept", "fantasy", "unique"], // Use 'concept' tag
        description: "A unique concept kit inspired by the Northern Lights. Limited edition design.",
        customizable: false
    },
     {
        id: "jersey005",
        name: "Juventus 24/25 Special Edition",
        price: "$85",
        image: "images/juventus-special-2425.png",
        // Includes league, season, and special-edition tags
        tags: ["24/25", "serie-a", "special-edition", "limited", "juventus", "league"],
        description: "Exclusive special edition Juventus jersey for the 2024/25 season.",
        customizable: false
    },
    // --- ADD ALL YOUR OTHER JERSEYS HERE, MAKING SURE TO USE TAGS CORRECTLY ---
    // Example: Another league jersey
    // {
    //     id: "jersey006",
    //     name: "Manchester City 24/25 Home",
    //     price: "$70",
    //     image: "images/mancity-2425-home.png",
    //     tags: ["24/25", "premier-league", "home", "manchester-city", "league"],
    //     description: "Official home kit for Man City.",
    //     customizable: true
    // }
    // Example: Another concept
    // {
    //     id: "jersey007",
    //     name: "Concept Kit 'Volt'",
    //     price: "$78",
    //     image: "images/concept-volt.png",
    //     tags: ["concept", "bold", "volt"],
    //     description: "A vibrant concept design.",
    //     customizable: false
    // }
];

// --- These definitions should match tags used above ---
const allLeagueTags = ["bundesliga", "la-liga", "premier-league", "serie-a", "ligue-1", "national", "other", "league"];
const conceptTag = "concept";
const specialEditionTag = "special-edition";