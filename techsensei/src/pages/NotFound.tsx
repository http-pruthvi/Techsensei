import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
            <AlertTriangle size={64} className="text-yellow-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Oops! The page you are looking for does not exist or has been moved.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                    <Home size={18} />
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
