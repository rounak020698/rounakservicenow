import React from 'react';
import './IncidentItem.css';

export default function IncidentItem({ incident, service, onChange }) {
  // Extract primitive values from ServiceNow objects
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
  
  const createdOn = typeof incident.sys_created_on === 'object' 
    ? incident.sys_created_on.display_value 
    : incident.sys_created_on;
  
  const updatedOn = typeof incident.sys_updated_on === 'object' 
    ? incident.sys_updated_on.display_value 
    : incident.sys_updated_on;
  
  const callerName = typeof incident.caller_id === 'object' 
    ? incident.caller_id.display_value 
    : incident.caller_id;
  
  const assignmentGroup = typeof incident.assignment_group === 'object' 
    ? incident.assignment_group.display_value 
    : incident.assignment_group;
  
  const sysId = typeof incident.sys_id === 'object' 
    ? incident.sys_id.value 
    : incident.sys_id;

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

  const handleResolve = async () => {
    try {
      await service.update(sysId, { 
        incident_state: '6',
        resolved_by: 'System',
        resolved_at: new Date().toISOString()
      });
      onChange();
    } catch (error) {
      alert('Failed to resolve incident: ' + error.message);
    }
  };

  const handleClose = async () => {
    try {
      await service.update(sysId, { 
        incident_state: '7',
        close_code: 'Solved (Permanently)',
        close_notes: 'Incident closed via incident management form',
        closed_by: 'System',
        closed_at: new Date().toISOString()
      });
      onChange();
    } catch (error) {
      alert('Failed to close incident: ' + error.message);
    }
  };

  const handleViewIncident = () => {
    // Navigate to ServiceNow incident form in a new tab
    const baseUrl = window.location.origin;
    const incidentUrl = `${baseUrl}/incident.do?sys_id=${sysId}&sysparm_stack=incident_list.do`;
    window.open(incidentUrl, '_blank');
  };

  const isActionable = !['6', '7'].includes(String(stateValue));

  return (
    <div className="incident-item" data-state={stateValue}>
      <div className="incident-header">
        <div className="incident-number-container">
          <span className="incident-number">{number}</span>
          <button 
            className="view-incident-btn-card"
            onClick={handleViewIncident}
            title="View incident details"
          >
            <svg className="magnifying-glass-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
        <div className="incident-badges">
          <div className={`incident-state ${getStateClass(stateValue)}`}>
            {state}
          </div>
          <div className={`incident-priority ${getPriorityClass(priorityValue)}`}>
            P{priorityValue}
          </div>
        </div>
      </div>
      
      <div className="incident-details">
        <h3 className="incident-title">{shortDescription}</h3>
        
        {/* Primary incident information - highlighted */}
        <div className="incident-primary-info">
          <div className="primary-info-item">
            <strong>Assigned To</strong>
            <span className="assigned-to-value">
              {assignedTo || 'Unassigned'}
            </span>
          </div>
          <div className="primary-info-item">
            <strong>Last Updated</strong>
            <span className="last-updated-value">
              {formatDate(updatedOn)}
            </span>
          </div>
          <div className="primary-info-item">
            <strong>Priority Level</strong>
            <span className={`priority-level-value ${getPriorityClass(priorityValue)}`}>
              Priority {priorityValue}
            </span>
          </div>
        </div>
        
        {/* Secondary incident metadata */}
        <div className="incident-meta">
          <div className="meta-item">
            <strong>Created</strong>
            <span>{formatDate(createdOn)}</span>
          </div>
          {callerName && (
            <div className="meta-item">
              <strong>Caller</strong>
              <span>{callerName}</span>
            </div>
          )}
          {assignmentGroup && (
            <div className="meta-item">
              <strong>Assignment Group</strong>
              <span>{assignmentGroup}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="incident-actions">
        <button 
          className="action-btn view-btn"
          onClick={handleViewIncident}
          title="View full incident details"
        >
          <svg className="magnifying-glass-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          View Details
        </button>
        
        {isActionable && (
          <>
            <button 
              className="action-btn resolve-btn"
              onClick={handleResolve}
              title="Mark incident as resolved"
            >
              Resolve
            </button>
            <button 
              className="action-btn close-btn"
              onClick={handleClose}
              title="Close incident permanently"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}