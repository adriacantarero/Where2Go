import { apiCall } from "/src/app/api"; 
import { GEO_PLACES_URL, GEO_TILE_URL, GEO_PLACE_DETAILS_URL, GEO_API_KEY, WIKI_API_URL, WIKIDATA_API_URL } from "./constants";

/*
Helper for mapView to get the tile layer URL
*/
export function buildMapTileUrl(){
    const params = { apiKey: GEO_API_KEY };
    return GEO_TILE_URL + "?" + new URLSearchParams(params);
}

/*
Fetches POIs within a bounding box.
*/
export function getPlaces(bounds, categories = []) {

    // Parameters
    const params = {
        apiKey: GEO_API_KEY,
        filter: `rect:${bounds}`,       // Bounding box of our map view
        limit: 500,
        lang: "en"
    };

    // Add categories if provided
    if (Array.isArray(categories) && categories.length > 0) {
        params.categories = categories.join(",");
    }
    // Build proper url
    const url = GEO_PLACES_URL + "?" + new URLSearchParams(params);

    return apiCall(url)
        .then(transformPlacesDataACB)
        .catch(err => {
            throw new Error(`Failed to load places for this area (Status: ${err.message}).`);
        });
    
    function transformPlacesDataACB(data) {
        if (!data?.features) return [];

        // Filter: have valid name, lon and lat
        function isValidPlaceACB(feature) {
            const p = feature?.properties;
            return p && p.name && p.lon && p.lat;
        }
        
        // Transformer format
        function createPlaceObjectACB(feature) {
            // Select info
            const props = feature.properties;

            // Generate description (Address line 2 -> Formatted Address -> Category Name)
            const desc = props.address_line2 || props.formatted || (props.categories && props.categories[0]);

            // Robust classification of places
            const placeCats = props.categories || [];
            const activeFilters = categories || [];

            // Priority for when multiple filters match
            const priority = [
                "entertainment.museum", "catering.restaurant", "catering.bar", "catering.cafe", 
                "leisure.park", "natural.mountain", "commercial.supermarket", 
                "commercial.shopping_mall", "public_transport.train", "entertainment.culture", "tourism.sights"
            ];

            // Helper function to check if a place category matches a priority category
            const hasCategory = (cats, priorityCat) => 
                cats.some(c => c === priorityCat || c.startsWith(priorityCat + '.'));

            // Find matching category based on active filters
            const findCategory = (useFilters) => priority.find(p => 
                hasCategory(placeCats, p) && (!useFilters || hasCategory(activeFilters, p))
            );

            // Main logic
            const mainCat = findCategory(activeFilters.length > 0) || "unknown";

            return {
                id: props.place_id,
                name: props.name,
                description: desc,
                lat: props.lat,
                lon: props.lon,
                categories: props.categories,
                mainCategory: mainCat
            };
        }

        const allPlaces = data.features.filter(isValidPlaceACB).map(createPlaceObjectACB);

        // Variety logic: Group by category and pick round-robin
        const groups = allPlaces.reduce((acc, p) => {
            (acc[p.mainCategory] = acc[p.mainCategory] || []).push(p);
            return acc;
        }, {});

        const variedResults = [];
        const catKeys = Object.keys(groups);
        for (let i = 0; variedResults.length < 50; i++) {
            let addedInPass = false;
            catKeys.forEach(k => {
                if (groups[k][i] && variedResults.length < 50) {
                    variedResults.push(groups[k][i]);
                    addedInPass = true;
                }
            });
            if (!addedInPass) break;
        }
        return variedResults;
    }
}

/*
Fetches specific details for a location.
*/
export function getPlaceDetails(placeId) {
    const params = {
        apiKey: GEO_API_KEY,
        id: placeId,
        lang: "en",
        features: "details"
    };
    // Build proper url
    const url = GEO_PLACE_DETAILS_URL + "?" + new URLSearchParams(params);

    return apiCall(url)
        .then(transformDetailsDataACB)
        .catch(err => {
            throw new Error(`Location details unavailable (Status: ${err.message}).`);
        });

    function transformDetailsDataACB(response) {
        const feature = response?.features?.[0];
        const props = feature?.properties;

        if (!props) return null;

        // Prepare the base object
        const details = {
            id: props.place_id,
            name: props.name || props.address_line1,
            website: props.website || props.url || null,
            phone: props.contact?.phone || null,
            email: props.contact?.email || null,
            description: props.description || props.description_international?.en || null,
            openingHours: props.opening_hours || null,
            address: props.formatted,
            categories: props.categories || [],

            // Specific Details extraction
            cuisine: props.catering?.cuisine || null,
            diet: props.catering?.diet || null,
            facilities: props.facilities || {},
            payment: props.payment_options || null,
            elevation: props.ele || null,
            brand: props.brand || null,
            heritage: props.heritage?.type || null,

            // Image fetching
            image: props.wiki_and_media?.image || null, 
            wikipedia: props.wiki_and_media?.wikipedia || null,
            wikidata: props.wiki_and_media?.wikidata || null
        };
    
        // If we don't have an image yet, try to fetch it
        let imagePromise = Promise.resolve(details.image);

        // Frist try Wikipedia
        if (!details.image && details.wikipedia) {
            imagePromise = fetchWikipediaImage(details.wikipedia);
        }

        return imagePromise.then(img => {
            // If Wikipedia gave us an image, use it
            if (img) {
                details.image = img;
                return details;
            }

            // If Wikipedia failed, try Wikidata
            if (details.wikidata) {
                return fetchWikidataImage(details.wikidata).then(wdImg => {
                    if (wdImg) details.image = wdImg;
                    return details;
                });
            }
            // If both failed, return details with null image
            return details;
        });
    }
}

// Fetch images from Wikipedia
function fetchWikipediaImage(wikiString) {
    // wikiString format is usually "lang:Page_Title"
    if (!wikiString || !wikiString.includes(':')) return Promise.resolve(null);

    const parts = wikiString.split(':');
    const lang = parts[0];
    const title = parts[1];

    // Use the Wikipedia api
    const baseUrl = WIKI_API_URL.replace("{lang}", lang);
    const url = `${baseUrl}/${encodeURIComponent(title)}`;

    return apiCall(url)
        .then(data => {
            // Check for original image (high res)
            if (data?.originalimage?.source) {
                return data.originalimage.source;
            }
            // Check for thumbnail (low res)
            if (data?.thumbnail?.source) {
                return data.thumbnail.source;
            }
            return null;
        })
        .catch(err => {
            console.warn("Wikipedia failed:", err.message);
            return null;
        });
}

// Fetch images from Wikidata
function fetchWikidataImage(wikidataId) {
    if (!wikidataId) return Promise.resolve(null);

    const url = WIKIDATA_API_URL + wikidataId;

    return apiCall(url)
        .then(data => {
            // Traverse JSON: claims -> P18 -> [0] -> mainsnak -> datavalue -> value
            const claims = data?.claims; 
            const imageClaim = claims?.P18?.[0];
            const filename = imageClaim?.mainsnak?.datavalue?.value;

            if (filename) {
                // Construct Wikimedia Commons URL from filename
                return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=800`;
            }
            return null;
        })
        .catch(err => {
            // Non-critical error
            console.warn("Wikidata enrichment failed:", err.message);
            return null;
        });
}