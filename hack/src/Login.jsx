import React, { useEffect, useState } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

const Auth0Login = () => {
  const [auth0Client, setAuth0Client] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const initializeAuth0 = async () => {
      const auth0 = await createAuth0Client({
        domain: "{dev-5jmtzlok7krwi77v.us.auth0.com}",
        clientId: "{vzUywLFt1sPUkg5mDeEplCLkbVW7cz83}",
        authorizationParams: {
          redirect_uri: window.location.origin
        }
      });
      setAuth0Client(auth0);

      if (window.location.search.includes("state=") && 
          (window.location.search.includes("code=") || 
          window.location.search.includes("error="))) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
      }

      const authenticated = await auth0.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const profile = await auth0.getUser();
        setUserProfile(profile);
      }
    };

    initializeAuth0();
  }, []);

  const handleLogin = async () => {
    await auth0Client.loginWithRedirect();
  };

  const handleLogout = async () => {
    await auth0Client.logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>{userProfile?.name}</p>
          <img src={userProfile?.picture} alt={userProfile?.name} />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default Auth0Login;
