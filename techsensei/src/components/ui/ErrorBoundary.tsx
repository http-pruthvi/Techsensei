import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Card, Button } from './index';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                    <Card className="w-full max-w-md text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            An unexpected error occurred. Our team has been notified.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-6 text-left overflow-auto max-h-40">
                            <code className="text-xs text-red-500 font-mono">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <Button onClick={this.handleReload} className="w-full">
                            Reload Application
                        </Button>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
