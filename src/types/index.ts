export interface RequestMessage {
  command: 'performTask' | 'saveData' | 'getGitInfo' | 'generatePlan' | 'modifyPlan' | 'implementPlan' | 'getPlanList' | 'getPlanDetails';
  payload?: any;
}

export interface ResponseMessage {
  command: 'getPlan' | 'getGitInfo' | 'error' | 'responseModifyPlan' | 'responseImplementPlan' | 'responsePlanList' | 'responsePlanDetails';
  payload?: any;
}