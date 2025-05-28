import * as vscode from 'vscode';

export async function handleGeneratePlan(panel: vscode.WebviewPanel, message: any) {
  try {    
    // API 요청 전송
    const response = await fetch('http://localhost:8080/generate-plan', {
      method: 'POST',
      body: JSON.stringify({ 
        Prompt: message.prompt,
        ProjectId: message.projectId,
        Branch: message.branch
      })
    });

    const data = await response.json();
    if (panel) {
      panel.webview.postMessage({ 
        command: 'getPlan',
        data: {
          devPlanId: data.DevPlanId,
          language: data.Language,
          plans: data.Plans
        }
      });
    }
  } catch (error: any) {
    console.error('Error:', error);
  }
}

export async function handleModifyPlan(panel: vscode.WebviewPanel, message: any) {
  try {
    console.log('handleModifyPlan', message.modifiedPlan);
    const response = await fetch('http://localhost:8080/modify-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        DevPlanId: message.devPlanId,
        Language: message.language,
        Plans: message.modifiedPlan,
      })
    });
    const data = await response.json();
    if (panel) {
      panel.webview.postMessage({ command: 'responseModifyPlan', 
        data: {
          status: data.Status
      } });
    }
  } catch (error: any) {
    console.error('Error:', error);
  }
}

interface Diagram {
  Diagram: string;
  Type: string;
}

interface ExplainedSegment {
  StartLine: number;
  EndLine: number;
  Explanation: string;
}

interface ImplementPlanResponse {
  Code: string;
  Diagrams: Diagram[];
  ExplainedSegments?: ExplainedSegment[];
}

export async function handleImplementPlan(panel: vscode.WebviewPanel, message: { devPlanId: string }) {
  try {
    const response = await fetch('http://localhost:8080/implement-plan', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        DevPlanId: message.devPlanId,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ImplementPlanResponse;
    console.log('data', data);
    panel?.webview.postMessage({ 
      command: 'responseImplementPlan', 
      data: {
        code: data.Code,
        diagrams: data.Diagrams,
        explainedSegments: data.ExplainedSegments || [],
        status: 'success'
      }
    });
  } catch (error) {
    console.error('Plan implementation failed:', error);
    panel?.webview.postMessage({ 
      command: 'responseImplementPlan', 
      data: {
        code: '',
        diagrams: [],
        status: 'error',
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      }
    });
  }
}

export async function getPlanList(panel: vscode.WebviewPanel, message: any) {
  try {
    console.log('getPlanList', message);
    const response = await fetch(`http://localhost:8080/get-plan-list/?ProjectId=${message.projectId}&Branch=${message.branch}`, {
      method: 'GET'
    });
    
    const data = await response.json();
    if (panel) {
      panel.webview.postMessage({ 
        command: 'responsePlanList',
        data: data.DevPlanList
      });
    }
  } catch (error: any) {
    console.error('Error:', error);
    if (panel) {
      panel.webview.postMessage({ 
        command: 'responsePlanList',
        data: {
          plans: []
        } 
      });
    }
  }
}

export async function getPlanById(panel: vscode.WebviewPanel, message: any) {
  try {
    const response = await fetch(`http://localhost:8080/get-plan-by-id?DevPlanId=${message.devPlanId}`, {
      method: 'GET'
    });
    
    const data = await response.json();
    console.log('getPlanById', data);
    if (panel) {
      panel.webview.postMessage({ 
        command: 'responsePlanById',
        data: {
          devPlanId: data.DevPlanId,
          language: data.Language,
          plans: data.Plans
        } 
      });
    }
  } catch (error: any) {
    console.error('Error:', error);
  }
}