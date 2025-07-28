import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get tokens from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const userStr = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          const errorDescription = searchParams.get('error_description');
          console.error('OAuth Error:', errorParam, errorDescription);
          
          // Check if it's a database error
          if (errorDescription?.includes('table') && errorDescription?.includes('does not exist')) {
            throw new Error('Backend database is not properly initialized. Please contact support.');
          }
          
          throw new Error(decodeURIComponent(errorDescription || 'Authentication failed'));
        }

        if (!accessToken || !refreshToken || !userStr) {
          throw new Error('Missing authentication data');
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userStr));

        // Store tokens
        apiClient.setTokens(accessToken, refreshToken);

        // Store user data (optional)
        localStorage.setItem('user', JSON.stringify(user));

        // Always redirect to dashboard after successful login
        navigate('/dashboard');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <CardTitle>Completing Authentication</CardTitle>
            <CardDescription>
              Please wait while we set up your account...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 text-red-500">
              <AlertCircle size={48} />
            </div>
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-green-500">
            <CheckCircle size={48} />
          </div>
          <CardTitle className="text-green-600">Success!</CardTitle>
          <CardDescription>
            Authentication completed successfully. Redirecting...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}