import React, { useState, useMemo, useCallback } from 'react';
import { IncidentService } from './services/IncidentService.js';
import IncidentForm from './components/IncidentForm.jsx';
import IncidentList from './components/IncidentList.jsx';
import './app.css';

export default function App() {
  const service = useMemo(() => new IncidentService(), []);
  const [incidents, setIncidents] = useState([]);
  const [activeView, setActiveView] = useState('form');

  // Use useCallback to prevent infinite re-renders
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
    // Only refresh if we're currently viewing the list
    if (activeView === 'list') {
      refreshIncidents();
    }
  }, [activeView, refreshIncidents]);

  return (
    <div className="incident-app">
      <header className="app-header">
        <h1>Incident Management</h1>
        <nav className="app-nav">
          <button 
            className={activeView === 'form' ? 'active' : ''}
            onClick={() => setActiveView('form')}
          >
            Create Incident
          </button>
          <button 
            className={activeView === 'list' ? 'active' : ''}
            onClick={() => setActiveView('list')}
          >
            View Incidents
          </button>
        </nav>
      </header>
      
      <main className="app-content">
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
      </main>
    </div>
  );
}