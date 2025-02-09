export interface WebviewMessage {
  command: 'performTask' | 'saveData' | 'requestData' | 'generatePlan';
  payload?: any;
}

export interface BackendResponse {
  status: 'success' | 'error';
  data?: any;
  error?: string;
}