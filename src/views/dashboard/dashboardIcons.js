import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Generate custom pin icon
export function getMarkerIcon(category, categoriesArray = [], isSelected = false) {
    const { color, svg } = getCategoryDetails(category, categoriesArray);
    const outerClass = isSelected ? "pin-outer pin-selected" : "pin-outer";
    const zIndexOffset = isSelected ? 1000 : 0; 

    const html = `
        <div class="${outerClass}" style="background-color: ${color}">
            <div class="pin-inner">
                <svg class="pin-svg" viewBox="0 0 24 24">
                    ${svg}
                </svg>
            </div>
        </div>
    `;

    return L.divIcon({
        className: 'leaf-custom-marker',
        html: html,
        iconSize: [34, 34], 
        iconAnchor: [17, 42], 
        popupAnchor: [0, -38],
        zIndexOffset: zIndexOffset 
    });
}

// SVG paths for different categories
const SVG_PATHS = {
    restaurant: `<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.83 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>`, 
    bar: `<path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z"/>`, 
    cafe: `<path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>`, 
    camera: `<path d="M9.66 8h4.69l.75-1.5h-6.2l.76 1.5zM20 6h-2.3l-1.33-2.67H7.63L6.3 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5 2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>`,
    ticket: `<path d="M15.41 16.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42zM10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17zM20 6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2V6z"/>`,
    museum: `<path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm19-20L1 6v2h22V6L21 2z"/>`, 
    train: `<path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"/>`, 
    cart: `<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>`, 
    bag: `<path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 17c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>`, 
    tree: `<path d="M12 2c-2.1 0-3.9 1.1-4.8 2.7C5.4 5.1 4 6.7 4 8.7c0 2.3 1.9 4.1 4.3 4.3V18H7v4h10v-4h-1.3v-5c2.4-.2 4.3-2 4.3-4.3 0-2-1.4-3.6-3.2-4C15.9 3.1 14.1 2 12 2z"/>`,
    mountain: `<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>`,
    pin: `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`
};

// Category Definitions
export const CATEGORY_DEFINITIONS = [
    { id: "entertainment.museum", label: "Museums", color: "#A349A4", svg: SVG_PATHS.museum },
    { id: "catering.restaurant", label: "Restaurants", color: "#F09C28", svg: SVG_PATHS.restaurant },
    { id: "catering.bar", label: "Bars", color: "#F09C28", svg: SVG_PATHS.bar },
    { id: "catering.cafe", label: "Cafés", color: "#F09C28", svg: SVG_PATHS.cafe },
    { id: "leisure.park", label: "Parks", color: "#1E8E3E", svg: SVG_PATHS.tree }, 
    { id: "natural.mountain", label: "Mountains", color: "#1E8E3E", svg: SVG_PATHS.mountain },
    { id: "commercial.supermarket", label: "Supermarkets", color: "#5F6368", svg: SVG_PATHS.cart },
    { id: "commercial.shopping_mall", label: "Shopping Malls", color: "#4285F4", svg: SVG_PATHS.bag },
    { id: "public_transport.train", label: "Train Stations", color: "#1A73E8", svg: SVG_PATHS.train },
    { id: "entertainment.culture", label: "Entertainment", color: "#A349A4", svg: SVG_PATHS.ticket }, 
    { id: "tourism.sights", label: "Tourism Sights", color: "#EA4335", svg: SVG_PATHS.camera }
];

// Helper to find match based on category string or array
export function getCategoryDetails(categoryInput, categoriesArray = []) {
    const catStr = (categoryInput || "").toLowerCase();
    
    // If the model provided a specific mainCategory, use that definition
    const directMatch = CATEGORY_DEFINITIONS.find(def => 
        catStr === def.id || catStr.startsWith(def.id + '.')
    );
    if (directMatch) return directMatch;

    // If the model sent "unknown", then we try to guess from the array
    const arrStr = (categoriesArray || []).join(' ').toLowerCase();
    for (const def of CATEGORY_DEFINITIONS) {
        const keyword = def.id.split('.')[1] || def.id; 
        if (arrStr.includes(def.id) || arrStr.includes(keyword)) {
            return def;
        }
    }

    return { 
        id: "unknown", 
        label: "Place", 
        color: "#EA4335", 
        svg: SVG_PATHS.pin 
    };
}