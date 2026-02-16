import React, { useState } from 'react';
import './IncidentForm.css';

export default function IncidentForm({ service, onCreated }) {
  const [formData, setFormData] = useState({
    short_description: '',
    description: '',
    category: '',
    priority: '3',
    impact: '3',
    urgency: '3',
    caller_id: '',
    assignment_group: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      await service.create(formData);
      setMessage({ type: 'success', text: 'Incident created successfully!' });
      
      // Reset form
      setFormData({
        short_description: '',
        description: '',
        category: '',
        priority: '3',
        impact: '3',
        urgency: '3',
        caller_id: '',
        assignment_group: ''
      });
      
      if (onCreated) onCreated();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create incident. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityDescription = (priority) => {
    const descriptions = {
      '1': 'Critical - Service is completely unavailable',
      '2': 'High - Service is significantly impacted', 
      '3': 'Moderate - Service is partially impacted',
      '4': 'Low - Minor inconvenience or cosmetic issue',
      '5': 'Planning - Future enhancement or non-urgent request'
    };
    return descriptions[priority] || '';
  };

  return (
    <div className="incident-form-container">
      <h2>Create New Incident</h2>
      <p className="form-subtitle">Report an issue or service disruption</p>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form className="incident-form" onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="short_description">
              Short Description<span className="required">*</span>
            </label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              required
              placeholder="Brief summary of the incident (e.g., 'Cannot access email')"
              maxLength="160"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Provide detailed information about the incident, including steps to reproduce, error messages, and any relevant context..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              <option value="inquiry">Inquiry / Help</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="network">Network</option>
              <option value="database">Database</option>
              <option value="security">Security</option>
              <option value="access">Access / Authentication</option>
            </select>
          </div>
        </div>

        {/* Classification Section */}
        <div className="form-section">
          <h3>Classification</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="1">1 - Critical</option>
                <option value="2">2 - High</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Low</option>
                <option value="5">5 - Planning</option>
              </select>
              <div className={`priority-indicator priority-${formData.priority}`}>
                {getPriorityDescription(formData.priority)}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="impact">Impact</label>
              <select
                id="impact"
                name="impact"
                value={formData.impact}
                onChange={handleInputChange}
              >
                <option value="1">1 - High (Multiple users affected)</option>
                <option value="2">2 - Medium (Some users affected)</option>
                <option value="3">3 - Low (Single user affected)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
            >
              <option value="1">1 - High (Immediate action required)</option>
              <option value="2">2 - Medium (Action required soon)</option>
              <option value="3">3 - Low (Action can be delayed)</option>
            </select>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="form-section">
          <h3>Assignment Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="caller_id">Caller ID</label>
              <input
                type="text"
                id="caller_id"
                name="caller_id"
                value={formData.caller_id}
                onChange={handleInputChange}
                placeholder="User ID of the person reporting (e.g., john.doe)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="assignment_group">Assignment Group</label>
              <input
                type="text"
                id="assignment_group"
                name="assignment_group"
                value={formData.assignment_group}
                onChange={handleInputChange}
                placeholder="Group to handle the incident (e.g., IT Support)"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => {
              setFormData({
                short_description: '',
                description: '',
                category: '',
                priority: '3',
                impact: '3',
                urgency: '3',
                caller_id: '',
                assignment_group: ''
              });
              setMessage(null);
            }}
          >
            Clear Form
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Incident...' : 'Create Incident'}
          </button>
        </div>
      </form>
    </div>
  );
}