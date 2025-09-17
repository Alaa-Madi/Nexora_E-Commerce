import { useEffect } from 'react';
import { useAuth } from '../store/useAuth';

const AuthInitializer = () => {
  const { validateToken, isAuthenticated, token, user, role } = useAuth();

  useEffect(() => {
    // Temporarily disable token validation to focus on fixing the main auth issue
    // TODO: Re-enable token validation once the main auth flow is working
    /*
    if (isAuthenticated && token) {
      validateToken().then((isValid) => {
        if (!isValid) {
          useAuth.getState().logout();
        }
      }).catch((error) => {
        console.error('Token validation error:', error);
        useAuth.getState().logout();
      });
    }
    */
  }, [validateToken, isAuthenticated, token, user, role]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
