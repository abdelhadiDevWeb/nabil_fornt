import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { getApiUrl } from '@/shared/config';

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        
        // Fetch user role to determine redirect
        const response = await fetch(getApiUrl('/api/users/me'));
        const data = await response.json();
        
        if (data.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connexion en cours...</h2>
        <p className="text-gray-600">Veuillez patienter pendant que nous vous connectons.</p>
      </div>
    </div>
  );
}
