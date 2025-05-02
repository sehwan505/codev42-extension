export interface RequestMessage {
  command: 'performTask' | 'saveData' | 'getGitInfo' | 'generatePlan' | 'modifyPlan' | 'implementPlan';
  payload?: any;
}

export interface ResponseMessage {
  command: 'getPlan' | 'getGitInfo' | 'error' | 'responseModifyPlan' | 'responseImplementPlan';
  payload?: any;
}