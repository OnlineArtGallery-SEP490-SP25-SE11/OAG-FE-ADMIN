'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-gray-50 overflow-hidden">

            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-red-600">
                            Authentication Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            {error === 'AccessDenied'
                                ? 'Access denied. This application is for administrators only.'
                                : 'An error occurred during authentication.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}