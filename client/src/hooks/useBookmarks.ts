import { useState, useEffect, useCallback } from 'react';
import { Case } from '../App';
import {
    getBookmarkedCaseIds,
    getBookmarkedCases,
    isBookmarked as checkIsBookmarked,
    toggleBookmark as doToggleBookmark,
    addBookmark as doAddBookmark,
    removeBookmark as doRemoveBookmark,
    clearAllBookmarks as doClearAllBookmarks,
    cacheCaseData,
    getCollections,
    Collection,
    createCollection as doCreateCollection,
    updateCollection as doUpdateCollection,
    deleteCollection as doDeleteCollection,
    addCaseToCollection as doAddCaseToCollection,
    removeCaseFromCollection as doRemoveCaseFromCollection,
    getCasesInCollection as doGetCasesInCollection,
    exportAllBookmarks as doExportAllBookmarks,
    exportCollectionData as doExportCollectionData,
    downloadAsFile,
    generateShareableLink as doGenerateShareableLink
} from '../utils/bookmarkUtils';

// Custom hook for bookmark management
export const useBookmarks = () => {
    const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
    const [bookmarkedCases, setBookmarkedCases] = useState<Case[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);

    // Refresh bookmarks from storage
    const refreshBookmarks = useCallback(() => {
        setBookmarkedIds(getBookmarkedCaseIds());
        setBookmarkedCases(getBookmarkedCases());
    }, []);

    // Refresh collections from storage
    const refreshCollections = useCallback(() => {
        setCollections(getCollections());
    }, []);

    // Initialize on mount
    useEffect(() => {
        refreshBookmarks();
        refreshCollections();

        // Listen for storage changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key?.includes('scc_')) {
                refreshBookmarks();
                refreshCollections();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshBookmarks, refreshCollections]);

    // Check if case is bookmarked
    const isBookmarked = useCallback((caseId: string): boolean => {
        return bookmarkedIds.includes(caseId);
    }, [bookmarkedIds]);

    // Toggle bookmark for a case
    const toggleBookmark = useCallback((caseItem: Case): boolean => {
        cacheCaseData(caseItem);
        const wasAdded = doToggleBookmark(caseItem.caseId);
        refreshBookmarks();
        return wasAdded;
    }, [refreshBookmarks]);

    // Add bookmark
    const addBookmark = useCallback((caseItem: Case): void => {
        cacheCaseData(caseItem);
        doAddBookmark(caseItem.caseId);
        refreshBookmarks();
    }, [refreshBookmarks]);

    // Remove bookmark
    const removeBookmark = useCallback((caseId: string): void => {
        doRemoveBookmark(caseId);
        refreshBookmarks();
        refreshCollections();
    }, [refreshBookmarks, refreshCollections]);

    // Clear all bookmarks
    const clearAllBookmarks = useCallback((): void => {
        doClearAllBookmarks();
        refreshBookmarks();
    }, [refreshBookmarks]);

    // Create collection
    const createCollection = useCallback((name: string, description?: string): Collection => {
        const collection = doCreateCollection(name, description || '');
        refreshCollections();
        return collection;
    }, [refreshCollections]);

    // Update collection
    const updateCollection = useCallback((
        collectionId: string,
        updates: Partial<Pick<Collection, 'name' | 'description'>>
    ): Collection | null => {
        const updated = doUpdateCollection(collectionId, updates);
        refreshCollections();
        return updated;
    }, [refreshCollections]);

    // Delete collection
    const deleteCollection = useCallback((collectionId: string): boolean => {
        const deleted = doDeleteCollection(collectionId);
        refreshCollections();
        return deleted;
    }, [refreshCollections]);

    // Add case to collection
    const addCaseToCollection = useCallback((collectionId: string, caseItem: Case): boolean => {
        cacheCaseData(caseItem);
        doAddBookmark(caseItem.caseId); // Auto-bookmark when adding to collection
        const added = doAddCaseToCollection(collectionId, caseItem.caseId);
        refreshBookmarks();
        refreshCollections();
        return added;
    }, [refreshBookmarks, refreshCollections]);

    // Remove case from collection
    const removeCaseFromCollection = useCallback((collectionId: string, caseId: string): boolean => {
        const removed = doRemoveCaseFromCollection(collectionId, caseId);
        refreshCollections();
        return removed;
    }, [refreshCollections]);

    // Get cases in collection
    const getCasesInCollection = useCallback((collectionId: string): Case[] => {
        return doGetCasesInCollection(collectionId);
    }, []);

    // Export all bookmarks
    const exportAllBookmarks = useCallback((): void => {
        const data = doExportAllBookmarks();
        const filename = `scc_bookmarks_${new Date().toISOString().split('T')[0]}.json`;
        downloadAsFile(data, filename);
    }, []);

    // Export collection
    const exportCollection = useCallback((collectionId: string, collectionName: string): void => {
        const data = doExportCollectionData(collectionId);
        if (data) {
            const safeName = collectionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `scc_collection_${safeName}_${new Date().toISOString().split('T')[0]}.json`;
            downloadAsFile(data, filename);
        }
    }, []);

    // Generate shareable link
    const generateShareableLink = useCallback((collectionId: string): string | null => {
        return doGenerateShareableLink(collectionId);
    }, []);

    return {
        // State
        bookmarkedIds,
        bookmarkedCases,
        collections,

        // Bookmark actions
        isBookmarked,
        toggleBookmark,
        addBookmark,
        removeBookmark,
        clearAllBookmarks,

        // Collection actions
        createCollection,
        updateCollection,
        deleteCollection,
        addCaseToCollection,
        removeCaseFromCollection,
        getCasesInCollection,

        // Export/Share actions
        exportAllBookmarks,
        exportCollection,
        generateShareableLink,

        // Refresh
        refreshBookmarks,
        refreshCollections
    };
};

export default useBookmarks;
