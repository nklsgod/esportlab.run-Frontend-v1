import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from "@/components/LandingPage";
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has tokens and is authenticated
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          // Try to get current user to verify token is valid
          await apiClient.getCurrentUser();
          // If successful, redirect to dashboard
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        // Token is invalid or expired, clear it
        apiClient.clearTokens();
        console.log('No valid authentication found');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <CardTitle>Loading</CardTitle>
            <CardDescription>
              Checking your authentication status...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <LandingPage />;
};

export default Index;
