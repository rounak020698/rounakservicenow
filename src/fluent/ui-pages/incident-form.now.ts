import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import incidentFormPage from '../../client/index.html';

export const incident_management_form = UiPage({
  $id: Now.ID['incident_form_page'], 
  endpoint: 'x_1835748_incident_form.do',
  description: 'Modern incident form interface built with React components for creating and managing ServiceNow incidents',
  category: 'general',
  html: incidentFormPage,
  direct: true
});