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

export async function handleImplementPlan(panel: vscode.WebviewPanel, message: any) {
  try {
    const response = await fetch('http://localhost:8080/implement-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        DevPlanId: message.devPlanId,
      })
    });
    const data = await response.json();
    if (panel) {
      panel.webview.postMessage({ command: 'responseImplementPlan', 
        data: {
          codes: data.Codes,
          diagram: data.Diagram
        } });
    }
  } catch (error: any) {
    console.error('Error:', error);
  }
}