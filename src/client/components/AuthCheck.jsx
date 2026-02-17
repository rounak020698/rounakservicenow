import React, { useState, useEffect } from 'react';

export default function AuthCheck({ children, instanceUrl }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!isDev) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    // Check if we can access the API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/now/table/incident?sysparm_limit=1', {
          credentials: 'include'
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isDev]);

  if (!isDev) {
    return children;
  }

  if (isChecking) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Checking authentication...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '40px', 
        maxWidth: '600px', 
        margin: '0 auto',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px',
        marginTop: '40px'
      }}>
        <h2 style={{ color: '#856404' }}>🔐 Authentication Required</h2>
        <p>You need to log into ServiceNow first to use this application locally.</p>
        <ol style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>Open a new tab and go to: <br/>
            <a 
              href={instanceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0073e7', fontWeight: 'bold' }}
            >
              {instanceUrl}
            </a>
          </li>
          <li>Log in with your ServiceNow credentials</li>
          <li>Come back to this tab and refresh the page</li>
        </ol>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0073e7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return children;
}
