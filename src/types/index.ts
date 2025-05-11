export interface RequestMessage {
  command: 'performTask' | 'saveData' | 'getGitInfo' | 'generatePlan' | 'modifyPlan' | 'implementPlan' | 'getPlanList' | 'getPlanById';
  payload?: any;
}

export interface ResponseMessage {
  command: 'getPlan' | 'getGitInfo' | 'error' | 'responseModifyPlan' | 'responseImplementPlan' | 'responsePlanList' | 'responsePlanById';
  payload?: any;
}