export const storeSearch = (req, query) => {
    if (!query || typeof query !== "string")
        return;
    const now = Date.now();
    const recentSearches = req.session.recentSearches || [];
    const filteredSearches = recentSearches.filter((item) => item.query !== query);
    filteredSearches.unshift({ query: query, timestamp: now });
    req.session.recentSearches = filteredSearches.slice(0, 10);
};
