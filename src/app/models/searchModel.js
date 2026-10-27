import { apiCall } from "/src/app/api"; 
import { GEO_API_URL, GEO_API_KEY } from "./constants";

/*
Fetches city suggestions from Geoapify.
*/
export function searchCities(text) {
    // Query Parameters
    const params = {
        apiKey: GEO_API_KEY,
        text: text,
        type: "city",
        limit: "5",
        lang: "en"
    };
    // Build proper url
    const url = GEO_API_URL + "?" + new URLSearchParams(params);

    // Fetch and transform data
    return apiCall(url).then(transformCityDataACB);
    
    /*
    Convets GeoJSON response into readable options
    */
    function transformCityDataACB(data) {
        if (!data?.features) return [];

        // Filter: have a valid properties object, a 'formatted' string,
        function isValidCityACB(feature) {
            return feature?.properties?.formatted && feature?.properties?.place_id;
        }

        // Transformer format
        function createCityObjectACB(feature) {
            const props = feature.properties;
            return {
                value: props.formatted, 
                key: props.place_id,           // key is needed by AntD 
                lat: props.lat,
                lon: props.lon
            };
        }
        return data.features.filter(isValidCityACB).map(createCityObjectACB);
    }
}