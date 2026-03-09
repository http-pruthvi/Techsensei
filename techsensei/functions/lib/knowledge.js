"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveKnowledgeItem = exports.searchKnowledge = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
// Initialize admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.searchKnowledge = functions.https.onCall(async (data, context) => {
    var _a;
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { query, filters } = data;
    const userId = context.auth.uid;
    try {
        // Simple text search implementation (MVP)
        // In a real production app, this would use a Vector DB (Pinecone/Milvus) or Algolia/Elasticsearch
        const knowledgeRef = db.collection('users').doc(userId).collection('knowledge');
        let knowledgeQuery = knowledgeRef.orderBy('updatedAt', 'desc');
        // Apply type filter if exists
        if ((filters === null || filters === void 0 ? void 0 : filters.type) && filters.type.length > 0) {
            knowledgeQuery = knowledgeQuery.where('type', 'in', filters.type);
        }
        const snapshot = await knowledgeQuery.limit(50).get();
        const results = [];
        const searchTerms = query.toLowerCase().split(' ').filter((t) => t.length > 2);
        for (const doc of snapshot.docs) {
            const item = doc.data();
            let score = 0;
            // Basic relevance scoring
            for (const term of searchTerms) {
                if (item.title.toLowerCase().includes(term))
                    score += 5;
                if ((_a = item.tags) === null || _a === void 0 ? void 0 : _a.some((t) => t.toLowerCase().includes(term)))
                    score += 3;
                if (item.content.toLowerCase().includes(term))
                    score += 1;
            }
            // Return items that match perfectly or have a score > 0 (if query exists)
            // If query is empty, return everything (recent items)
            if (!query || score > 0) {
                results.push({
                    item: Object.assign({ id: doc.id }, item),
                    relevanceScore: query ? score : 1,
                    explanation: 'Matched based on keywords',
                    matchedConcepts: [], // Would come from vector search
                    contextSnippet: item.content.substring(0, 150) + '...'
                });
            }
        }
        // Sort by relevance
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        return { results };
    }
    catch (error) {
        console.error('Search error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to search knowledge base');
    }
});
exports.saveKnowledgeItem = functions.https.onCall(async (data, context) => {
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { title, content, type, tags, metadata } = data;
    const userId = context.auth.uid;
    try {
        const item = {
            userId,
            title,
            content,
            type,
            tags: tags || [],
            metadata: metadata || {},
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            accessCount: 0,
            lastAccessed: admin.firestore.FieldValue.serverTimestamp()
        };
        const ref = await db.collection('users').doc(userId).collection('knowledge').add(item);
        return Object.assign({ id: ref.id }, item);
    }
    catch (error) {
        console.error('Save error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to save item');
    }
});
//# sourceMappingURL=knowledge.js.map