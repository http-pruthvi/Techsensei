import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            TechSensei
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your AI-powered learning companion
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};