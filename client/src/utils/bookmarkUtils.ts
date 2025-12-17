import { Case } from '../App';

// Types for collections
export interface Collection {
    id: string;
    name: string;
    description: string;
    caseIds: string[];
    createdAt: string;
    updatedAt: string;
}

// Storage keys
const BOOKMARKS_KEY = 'scc_bookmarks';
const COLLECTIONS_KEY = 'scc_collections';
const CASES_CACHE_KEY = 'scc_cases_cache';

// Generate unique ID
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ==================== BOOKMARKS ====================

// Get all bookmarked case IDs
export const getBookmarkedCaseIds = (): string[] => {
    try {
        const stored = localStorage.getItem(BOOKMARKS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Check if a case is bookmarked
export const isBookmarked = (caseId: string): boolean => {
    const bookmarks = getBookmarkedCaseIds();
    return bookmarks.includes(caseId);
};

// Toggle bookmark for a case
export const toggleBookmark = (caseId: string): boolean => {
    const bookmarks = getBookmarkedCaseIds();
    const index = bookmarks.indexOf(caseId);

    if (index === -1) {
        bookmarks.push(caseId);
    } else {
        bookmarks.splice(index, 1);
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return index === -1; // Returns true if bookmark was added
};

// Add bookmark
export const addBookmark = (caseId: string): void => {
    const bookmarks = getBookmarkedCaseIds();
    if (!bookmarks.includes(caseId)) {
        bookmarks.push(caseId);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
};

// Remove bookmark
export const removeBookmark = (caseId: string): void => {
    const bookmarks = getBookmarkedCaseIds();
    const filtered = bookmarks.filter(id => id !== caseId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));

    // Also remove from all collections
    const collections = getCollections();
    collections.forEach(collection => {
        if (collection.caseIds.includes(caseId)) {
            removeCaseFromCollection(collection.id, caseId);
        }
    });
};

// Clear all bookmarks
export const clearAllBookmarks = (): void => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]));
};

// ==================== CASE CACHE ====================

// Cache case data for offline access
export const cacheCaseData = (caseItem: Case): void => {
    try {
        const stored = localStorage.getItem(CASES_CACHE_KEY);
        const cache: Record<string, Case> = stored ? JSON.parse(stored) : {};
        cache[caseItem.caseId] = caseItem;
        localStorage.setItem(CASES_CACHE_KEY, JSON.stringify(cache));
    } catch {
        // Silent fail for cache operations
    }
};

// Get cached case data
export const getCachedCase = (caseId: string): Case | null => {
    try {
        const stored = localStorage.getItem(CASES_CACHE_KEY);
        if (!stored) return null;
        const cache: Record<string, Case> = JSON.parse(stored);
        return cache[caseId] || null;
    } catch {
        return null;
    }
};

// Get all cached cases
export const getAllCachedCases = (): Case[] => {
    try {
        const stored = localStorage.getItem(CASES_CACHE_KEY);
        if (!stored) return [];
        const cache: Record<string, Case> = JSON.parse(stored);
        return Object.values(cache);
    } catch {
        return [];
    }
};

// Get bookmarked cases (from cache)
export const getBookmarkedCases = (): Case[] => {
    const bookmarkIds = getBookmarkedCaseIds();
    const allCached = getAllCachedCases();
    return allCached.filter(c => bookmarkIds.includes(c.caseId));
};

// ==================== COLLECTIONS ====================

// Get all collections
export const getCollections = (): Collection[] => {
    try {
        const stored = localStorage.getItem(COLLECTIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Get a single collection by ID
export const getCollection = (collectionId: string): Collection | null => {
    const collections = getCollections();
    return collections.find(c => c.id === collectionId) || null;
};

// Create a new collection
export const createCollection = (name: string, description: string = ''): Collection => {
    const collections = getCollections();
    const now = new Date().toISOString();

    const newCollection: Collection = {
        id: generateId(),
        name,
        description,
        caseIds: [],
        createdAt: now,
        updatedAt: now
    };

    collections.push(newCollection);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));

    return newCollection;
};

// Update collection details
export const updateCollection = (
    collectionId: string,
    updates: Partial<Pick<Collection, 'name' | 'description'>>
): Collection | null => {
    const collections = getCollections();
    const index = collections.findIndex(c => c.id === collectionId);

    if (index === -1) return null;

    collections[index] = {
        ...collections[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    return collections[index];
};

// Delete a collection
export const deleteCollection = (collectionId: string): boolean => {
    const collections = getCollections();
    const filtered = collections.filter(c => c.id !== collectionId);

    if (filtered.length === collections.length) return false;

    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(filtered));
    return true;
};

// Add case to collection
export const addCaseToCollection = (collectionId: string, caseId: string): boolean => {
    const collections = getCollections();
    const collection = collections.find(c => c.id === collectionId);

    if (!collection) return false;
    if (collection.caseIds.includes(caseId)) return true; // Already in collection

    collection.caseIds.push(caseId);
    collection.updatedAt = new Date().toISOString();

    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    return true;
};

// Remove case from collection
export const removeCaseFromCollection = (collectionId: string, caseId: string): boolean => {
    const collections = getCollections();
    const collection = collections.find(c => c.id === collectionId);

    if (!collection) return false;

    collection.caseIds = collection.caseIds.filter(id => id !== caseId);
    collection.updatedAt = new Date().toISOString();

    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    return true;
};

// Get cases in a collection
export const getCasesInCollection = (collectionId: string): Case[] => {
    const collection = getCollection(collectionId);
    if (!collection) return [];

    const allCached = getAllCachedCases();
    return allCached.filter(c => collection.caseIds.includes(c.caseId));
};

// ==================== SHARING ====================

// Export collection data as shareable JSON
export const exportCollectionData = (collectionId: string): string | null => {
    const collection = getCollection(collectionId);
    if (!collection) return null;

    const cases = getCasesInCollection(collectionId);

    const exportData = {
        collection: {
            name: collection.name,
            description: collection.description,
            createdAt: collection.createdAt
        },
        cases: cases.map(c => ({
            caseId: c.caseId,
            title: c.title,
            description: c.description,
            date: c.date,
            citation: c.citation,
            court: c.court,
            majorityOpinion: c.majorityOpinion,
            sourceLabel: c.sourceLabel,
            judges: c.judges,
            articleUrl: c.articleUrl
        })),
        exportedAt: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
};

// Export all bookmarks
export const exportAllBookmarks = (): string => {
    const cases = getBookmarkedCases();

    const exportData = {
        bookmarks: cases.map(c => ({
            caseId: c.caseId,
            title: c.title,
            description: c.description,
            date: c.date,
            citation: c.citation,
            court: c.court,
            majorityOpinion: c.majorityOpinion,
            sourceLabel: c.sourceLabel,
            judges: c.judges,
            articleUrl: c.articleUrl
        })),
        exportedAt: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
};

// Import collection from JSON
export const importCollectionData = (jsonData: string): { success: boolean; message: string } => {
    try {
        const data = JSON.parse(jsonData);

        if (!data.collection || !data.cases) {
            return { success: false, message: 'Invalid import format' };
        }

        // Create collection
        const newCollection = createCollection(
            `${data.collection.name} (Imported)`,
            data.collection.description
        );

        // Cache and add cases
        data.cases.forEach((caseItem: Case) => {
            cacheCaseData(caseItem);
            addBookmark(caseItem.caseId);
            addCaseToCollection(newCollection.id, caseItem.caseId);
        });

        return { success: true, message: `Imported collection "${newCollection.name}" with ${data.cases.length} cases` };
    } catch {
        return { success: false, message: 'Failed to parse import data' };
    }
};

// Download data as file
export const downloadAsFile = (data: string, filename: string): void => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Generate shareable link (base64 encoded)
export const generateShareableLink = (collectionId: string): string | null => {
    const exportData = exportCollectionData(collectionId);
    if (!exportData) return null;

    const encoded = btoa(encodeURIComponent(exportData));
    return `${window.location.origin}?import=${encoded}`;
};

// Parse shareable link
export const parseShareableLink = (encodedData: string): { success: boolean; message: string } => {
    try {
        const decoded = decodeURIComponent(atob(encodedData));
        return importCollectionData(decoded);
    } catch {
        return { success: false, message: 'Invalid share link' };
    }
};
