export class IncidentService {
  constructor() {
    this.tableName = "incident";
  }

  // Get all incidents with display values and expanded field set
  async list(filters = {}) {
    try {
      const searchParams = new URLSearchParams(filters);
      searchParams.set('sysparm_display_value', 'all');
      searchParams.set('sysparm_limit', '100');
      searchParams.set('sysparm_fields', 'sys_id,number,short_description,description,incident_state,priority,impact,urgency,assigned_to,caller_id,assignment_group,sys_created_on,sys_updated_on,opened_by,category,subcategory');
      searchParams.set('sysparm_order', 'ORDERBYDESCsys_updated_on');
      
      const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch incidents');
      }

      const { result } = await response.json();
      return result || [];
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  }

  // Create a new incident
  async create(data) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create incident');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }

  // Update an existing incident
  async update(sysId, data) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update incident');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error updating incident:', error);
      throw error;
    }
  }

  // Delete an incident
  async delete(sysId) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete incident');
      }

      return response.ok;
    } catch (error) {
      console.error('Error deleting incident:', error);
      throw error;
    }
  }

  // Get a single incident by sys_id
  async get(sysId) {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('sysparm_display_value', 'all');
      
      const response = await fetch(`/api/now/table/${this.tableName}/${sysId}?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch incident');
      }

      const { result } = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching incident:', error);
      throw error;
    }
  }
}