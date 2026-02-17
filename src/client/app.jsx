import React, { useState, useMemo, useCallback } from 'react';
import { IncidentService } from './services/IncidentService.js';
import IncidentForm from './components/IncidentForm.jsx';
import IncidentList from './components/IncidentList.jsx';
import SubscriptionPage from './components/SubscriptionPage.jsx';

export default function App() {
  const service = useMemo(() => new IncidentService(), []);
  const [incidents, setIncidents] = useState([]);
  const [activeView, setActiveView] = useState('form');

  const refreshIncidents = useCallback(async () => {
    try {
      const data = await service.list();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to load incidents:', error);
      setIncidents([]);
    }
  }, [service]);

  const handleIncidentCreated = useCallback(() => {
    if (activeView === 'list') {
      refreshIncidents();
    }
  }, [activeView, refreshIncidents]);

  const buttonStyle = (isActive) => ({
    padding: '12px 24px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: isActive ? 'white' : 'transparent',
    color: isActive ? '#0073e7' : 'white',
    borderColor: isActive ? 'white' : 'rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    boxShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ background: 'linear-gradient(135deg, #0073e7 0%, #004c9b 100%)', color: 'white', borderRadius: '8px 8px 0 0', padding: '32px', marginBottom: '0', boxShadow: '0 2px 8px rgba(0, 115, 231, 0.15)' }}>
        <h1 style={{ margin: '0 0 24px 0', fontSize: '36px', fontWeight: '300', letterSpacing: '-0.025em' }}>Incident Management</h1>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={buttonStyle(activeView === 'form')}
            onClick={() => setActiveView('form')}
            onMouseEnter={(e) => {
              if (activeView !== 'form') {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== 'form') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
          >
            Create Incident
          </button>
          <button 
            style={buttonStyle(activeView === 'list')}
            onClick={() => setActiveView('list')}
            onMouseEnter={(e) => {
              if (activeView !== 'list') {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== 'list') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
          >
            View Incidents
          </button>
          <button 
            style={buttonStyle(activeView === 'subscription')}
            onClick={() => setActiveView('subscription')}
            onMouseEnter={(e) => {
              if (activeView !== 'subscription') {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== 'subscription') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
          >
            Subscription
          </button>
        </nav>
      </header>
      
      <main style={{ backgroundColor: 'white', borderRadius: '0 0 8px 8px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)', padding: '0', overflow: 'hidden' }}>
        {activeView === 'form' && (
          <IncidentForm 
            service={service} 
            onCreated={handleIncidentCreated} 
          />
        )}
        {activeView === 'list' && (
          <IncidentList 
            incidents={incidents} 
            service={service} 
            onRefresh={refreshIncidents}
          />
        )}
        {activeView === 'subscription' && <SubscriptionPage />}
      </main>
    </div>
  );
}