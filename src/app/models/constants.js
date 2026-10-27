//Firebase Constants
export const USER_COLLECTION = "Users";

// API Constants
// Geoapify key, read from environment variables (see .env.example)
export const GEO_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

// Base API URLs
export const GEO_API_URL = "https://api.geoapify.com/v1/geocode/autocomplete";
export const GEO_PLACES_URL = "https://api.geoapify.com/v2/places";
export const GEO_TILE_URL = "https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png";
export const GEO_PLACE_DETAILS_URL = "https://api.geoapify.com/v2/place-details";

// Wiki data API
export const WIKI_API_URL = "https://{lang}.wikipedia.org/api/rest_v1/page/summary";
export const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&origin=*&entity=";

