export class SubscriptionService {
  constructor() {
    this.tableName = "sys_noti_subscription";
    console.log('[SubscriptionService] Table name:', this.tableName);
  }

  async create(data) {
    console.log('[SubscriptionService] Payload being sent:', JSON.stringify(data, null, 2));
    
    try {
      const response = await fetch(`/api/now/table/${this.tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserToken": window.g_ck || ''
        },
        body: JSON.stringify(data),
      });

      console.log('[SubscriptionService] Response status:', response.status);
      
      const responseText = await response.text();
      console.log('[SubscriptionService] Raw response:', responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        console.error('[SubscriptionService] Error response:', errorData);
        throw new Error(errorData.error?.message || 'Failed to create subscription');
      }

      const result = JSON.parse(responseText);
      console.log('[SubscriptionService] Success response:', result);
      console.log('[SubscriptionService] Created record fields:', result.result);
      return result;
    } catch (error) {
      console.error('[SubscriptionService] Exception:', error);
      throw error;
    }
  }

  async getUsers(query = '') {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('sysparm_display_value', 'all');
      searchParams.set('sysparm_limit', '20');
      searchParams.set('sysparm_fields', 'sys_id,name,email,user_name');
      if (query) {
        searchParams.set('sysparm_query', `nameLIKE${query}^ORuser_nameLIKE${query}`);
      }
      
      const response = await fetch(`/api/now/table/sys_user?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const { result } = await response.json();
      return result || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getNotifications(query = '') {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('sysparm_display_value', 'all');
      searchParams.set('sysparm_limit', '20');
      searchParams.set('sysparm_fields', 'sys_id,name,description,subscribable');
      
      let queryString = 'subscribable=true';
      if (query) {
        queryString += `^nameLIKE${query}`;
      }
      searchParams.set('sysparm_query', queryString);
      
      const response = await fetch(`/api/now/table/sysevent_email_action?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const { result } = await response.json();
      return result || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
}
