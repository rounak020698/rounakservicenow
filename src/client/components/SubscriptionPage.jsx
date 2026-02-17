import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionService } from '../services/SubscriptionService.js';

export default function SubscriptionPage() {
  const [service] = useState(() => new SubscriptionService());
  const [formData, setFormData] = useState({
    user: '',
    notification: '',
    channel: ''
  });
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [notificationSearch, setNotificationSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  
  const userRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    loadUsers();
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUsers = async (query = '') => {
    try {
      const data = await service.getUsers(query);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadNotifications = async (query = '') => {
    try {
      const data = await service.getNotifications(query);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      user: formData.user,
      notification: formData.notification,
      device: formData.channel
    };

    try {
      await service.create(payload);
      setMessage({ type: 'success', text: 'Subscription created successfully!' });
      setFormData({ user: '', notification: '', channel: '' });
      setUserSearch('');
      setNotificationSearch('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create subscription. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #0073e7' }}>
        IOP Command Bar
      </h2>

      {message && (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
          
          <div ref={userRef} style={{ position: 'relative', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
              User <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Search and select user..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                loadUsers(e.target.value);
                setShowUserDropdown(true);
              }}
              onFocus={() => setShowUserDropdown(true)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            {showUserDropdown && users.length > 0 && (
              <div style={{ position: 'absolute', zIndex: 10, width: '100%', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
                {users.map((user) => (
                  <div
                    key={user.sys_id}
                    onClick={() => {
                      const userId = user.sys_id?.value || user.sys_id;
                      setFormData({ ...formData, user: userId });
                      setUserSearch(user.name?.display_value || user.user_name?.display_value || user.name || user.user_name);
                      setShowUserDropdown(false);
                    }}
                    style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #e9ecef' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f3ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: '500', color: '#212529' }}>
                      {user.name?.display_value || user.user_name?.display_value}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>{user.email?.display_value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div ref={notificationRef} style={{ position: 'relative', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
              Notification <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Search and select notification..."
              value={notificationSearch}
              onChange={(e) => {
                setNotificationSearch(e.target.value);
                loadNotifications(e.target.value);
                setShowNotificationDropdown(true);
              }}
              onFocus={() => setShowNotificationDropdown(true)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            {showNotificationDropdown && notifications.length > 0 && (
              <div style={{ position: 'absolute', zIndex: 10, width: '100%', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.sys_id}
                    onClick={() => {
                      const notificationId = notification.sys_id?.value || notification.sys_id;
                      setFormData({ ...formData, notification: notificationId });
                      setNotificationSearch(notification.name?.display_value || notification.name);
                      setShowNotificationDropdown(false);
                    }}
                    style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #e9ecef' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f3ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: '500', color: '#212529' }}>
                      {notification.name?.display_value || notification.name}
                    </div>
                    {notification.description?.display_value && (
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>{notification.description.display_value}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
              Channel <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
            >
              <option value="">-- Select Channel --</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button
            type="button"
            onClick={() => {
              setFormData({ user: '', notification: '', channel: '' });
              setUserSearch('');
              setNotificationSearch('');
              setMessage(null);
            }}
            style={{ padding: '12px 24px', border: '2px solid #6c757d', backgroundColor: 'transparent', color: '#6c757d', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.user || !formData.notification || !formData.channel}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0073e7 0%, #004c9b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting || !formData.user || !formData.notification || !formData.channel ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              opacity: isSubmitting || !formData.user || !formData.notification || !formData.channel ? 0.5 : 1,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isSubmitting ? 'Creating...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
