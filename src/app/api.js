/*
Generic API call helper.
*/
export function apiCall(url, options = {}) {
    return fetch(url, options)
        .then(response => {
            // Check for HTTP errors
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            // Parse JSON
            return response.json();
        });
}
