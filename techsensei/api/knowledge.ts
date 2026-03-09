import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { verifyAuth, handleOptions, errorResponse, successResponse } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return handleOptions(res);
    }

    if (req.method !== 'POST') {
        return errorResponse(res, 'Method not allowed', 405);
    }

    const decodedToken = await verifyAuth(req);
    if (!decodedToken) {
        return errorResponse(res, 'Unauthorized', 401);
    }

    try {
        const { action, ...data } = req.body || {};
        const db = admin.firestore();

        if (action === 'search') {
            const { query } = data;
            const snapshot = await db.collection('knowledge')
                .where('title', '>=', query)
                .where('title', '<=', query + '\uf8ff')
                .limit(10)
                .get();

            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return successResponse(res, { results });
        } else if (action === 'save') {
            const { item } = data;
            const docRef = await db.collection('knowledge').add({
                ...item,
                userId: decodedToken.uid,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            return successResponse(res, { id: docRef.id });
        } else {
            return errorResponse(res, 'Invalid action', 400);
        }
    } catch (error: unknown) {
        console.error('Knowledge Error:', error);
        return errorResponse(res, (error as Error).message || 'Internal Server Error');
    }
}
