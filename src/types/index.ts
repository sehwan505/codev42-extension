export interface RequestMessage {
  command: 'performTask' | 'saveData' | 'getGitInfo' | 'generatePlan' | 'modifyPlan';
  payload?: any;
}

export interface ResponseMessage {
  command: 'getPlan' | 'getGitInfo' | 'error';
  payload?: any;
}