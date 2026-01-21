import { FirebaseError } from 'firebase/app';

export class AppError extends Error {
    public code: string;
    public originalError?: unknown;

    constructor(message: string, code: string = 'UNKNOWN', originalError?: unknown) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.originalError = originalError;
    }
}

export const handleApiError = (error: unknown): string => {
    console.error('API Error:', error);

    if (error instanceof AppError) {
        return error.message;
    }

    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'permission-denied':
                return 'You do not have permission to perform this action.';
            case 'unauthenticated':
                return 'Please sign in to continue.';
            case 'not-found':
                return 'The requested resource was not found.';
            default:
                return error.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};
