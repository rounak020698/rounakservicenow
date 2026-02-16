import React, { useEffect, useState } from 'react';
import IncidentItem from './IncidentItem.jsx';
import './IncidentList.css';

export default function IncidentList({ incidents, service, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load incidents only once when component mounts or when explicitly refreshed
  useEffect(() => {
    if (!hasLoaded) {
      const loadIncidents = async () => {
        setLoading(true);
        try {
          await onRefresh();
          setHasLoaded(true);
        } catch (error) {
          console.error('Failed to load incidents:', error);
        } finally {
          setLoading(false);
        }
      };
      loadIncidents();
    }
  }, [hasLoaded, onRefresh]);

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    
    const state = typeof incident.incident_state === 'object' 
      ? incident.incident_state.value 
      : incident.incident_state;
    
    switch (filter) {
      case 'active':
        return state === '1' || state === '2' || state === '3';
      case 'resolved':
        return state === '6';
      case 'closed':
        return state === '7';
      default:
        return true;
    }
  });

  const getStatusCounts = () => {
    return {
      active: incidents.filter(i => {
        const state = typeof i.incident_state === 'object' ? i.incident_state.value : i.incident_state;
        return state === '1' || state === '2' || state === '3';
      }).length,
      resolved: incidents.filter(i => {
        const state = typeof i.incident_state === 'object' ? i.incident_state.value : i.incident_state;
        return state === '6';
      }).length,
      closed: incidents.filter(i => {
        const state = typeof i.incident_state === 'object' ? i.incident_state.value : i.incident_state;
        return state === '7';
      }).length
    };
  };

  const statusCounts = getStatusCounts();

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityClass = (priorityValue) => {
    switch (String(priorityValue)) {
      case '1': return 'priority-critical';
      case '2': return 'priority-high';
      case '3': return 'priority-moderate';
      case '4': return 'priority-low';
      case '5': return 'priority-planning';
      default: return 'priority-moderate';
    }
  };

  const getStateClass = (stateValue) => {
    switch (String(stateValue)) {
      case '1': return 'state-new';
      case '2': return 'state-progress';
      case '3': return 'state-progress';
      case '6': return 'state-resolved';
      case '7': return 'state-closed';
      default: return 'state-new';
    }
  };

  const handleViewIncident = (sysId) => {
    // Navigate to ServiceNow incident form in a new tab
    const baseUrl = window.location.origin;
    const incidentUrl = `${baseUrl}/incident.do?sys_id=${sysId}&sysparm_stack=incident_list.do`;
    window.open(incidentUrl, '_blank');
  };

  const handleRefreshClick = async () => {
    setLoading(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Failed to refresh incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncidentChange = async () => {
    // Refresh the list after an incident is updated
    await handleRefreshClick();
  };

  if (loading && !hasLoaded) {
    return (
      <div className="incident-list-container">
        <div className="loading">Loading incidents...</div>
      </div>
    );
  }

  return (
    <div className="incident-list-container">
      <div className="list-header">
        <div>
          <h2>Incident Dashboard</h2>
          <div className="list-stats">
            <span className="stat-badge">{incidents.length} Total</span>
            <span className="stat-badge" style={{backgroundColor: '#28a745'}}>{statusCounts.active} Active</span>
            <span className="stat-badge" style={{backgroundColor: '#17a2b8'}}>{statusCounts.resolved} Resolved</span>
            <span className="stat-badge" style={{backgroundColor: '#6c757d'}}>{statusCounts.closed} Closed</span>
          </div>
        </div>
        
        <div className="filter-section">
          <div className="filter-controls">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select 
              id="status-filter"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Incidents ({incidents.length})</option>
              <option value="active">Active ({statusCounts.active})</option>
              <option value="resolved">Resolved ({statusCounts.resolved})</option>
              <option value="closed">Closed ({statusCounts.closed})</option>
            </select>
            
            <div className="list-view-controls">
              <button 
                className="refresh-btn"
                onClick={handleRefreshClick}
                disabled={loading}
                title="Refresh incident list"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <label>View:</label>
              <div className="view-toggle">
                <button 
                  className={viewMode === 'table' ? 'active' : ''}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
                <button 
                  className={viewMode === 'card' ? 'active' : ''}
                  onClick={() => setViewMode('card')}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="empty-state">
          {filter === 'all' ? 'No incidents found.' : `No ${filter} incidents found.`}
          <br />
          <small>Try adjusting your filter or create a new incident.</small>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <div className="incident-table-container">
              <table className="incident-table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Short Description</th>
                    <th>State</th>
                    <th>Priority</th>
                    <th>Assigned To</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.map(incident => {
                    const sysId = typeof incident.sys_id === 'object' 
                      ? incident.sys_id.value 
                      : incident.sys_id;
                    
                    const number = typeof incident.number === 'object' 
                      ? incident.number.display_value 
                      : incident.number;
                    
                    const shortDescription = typeof incident.short_description === 'object' 
                      ? incident.short_description.display_value 
                      : incident.short_description;
                    
                    const state = typeof incident.incident_state === 'object' 
                      ? incident.incident_state.display_value 
                      : incident.incident_state;
                    
                    const stateValue = typeof incident.incident_state === 'object' 
                      ? incident.incident_state.value 
                      : incident.incident_state;
                    
                    const priority = typeof incident.priority === 'object' 
                      ? incident.priority.display_value 
                      : incident.priority;
                    
                    const priorityValue = typeof incident.priority === 'object' 
                      ? incident.priority.value 
                      : incident.priority;
                    
                    const assignedTo = typeof incident.assigned_to === 'object' 
                      ? incident.assigned_to.display_value 
                      : incident.assigned_to;
                    
                    const updatedOn = typeof incident.sys_updated_on === 'object' 
                      ? incident.sys_updated_on.display_value 
                      : incident.sys_updated_on;

                    return (
                      <tr key={sysId}>
                        <td>
                          <span 
                            className="table-incident-number"
                            onClick={() => handleViewIncident(sysId)}
                            title="Click to view incident details"
                          >
                            {number}
                          </span>
                        </td>
                        <td>
                          <div className="table-description" title={shortDescription}>
                            {shortDescription}
                          </div>
                        </td>
                        <td>
                          <span className={`table-state ${getStateClass(stateValue)}`}>
                            {state}
                          </span>
                        </td>
                        <td>
                          <span className={`table-priority ${getPriorityClass(priorityValue)}`}>
                            P{priorityValue}
                          </span>
                        </td>
                        <td>
                          <div className="table-assigned-to">
                            {assignedTo || 'Unassigned'}
                          </div>
                        </td>
                        <td>
                          <div className="table-last-updated">
                            {formatDate(updatedOn)}
                          </div>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="view-incident-btn"
                              onClick={() => handleViewIncident(sysId)}
                              title="View incident details"
                            >
                              <svg className="magnifying-glass-icon" viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                              </svg>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="incident-list">
              {filteredIncidents.map(incident => {
                const sysId = typeof incident.sys_id === 'object' 
                  ? incident.sys_id.value 
                  : incident.sys_id;
                
                return (
                  <IncidentItem 
                    key={sysId}
                    incident={incident}
                    service={service}
                    onChange={handleIncidentChange}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}