import * as vscode from 'vscode';

export async function handleGeneratePlan(panel: vscode.WebviewPanel, message: any) {
  try {
    console.log('handleGeneratePlan', message);
    const response = await fetch('http://localhost:8080/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        Prompt: message.prompt,
        ProjectId: message.projectId,
        Branch: message.branch
      })
    });
    const data = await response.json();
    if (panel) {
      panel.webview.postMessage({ command: 'getPlan', data });
    }
  } catch (error: any) {
    console.error('Error:', error);
  }
}

export async function handleModifyPlan(panel: vscode.WebviewPanel, message: any) {
  try {
    const response = await fetch('http://localhost:8080/modify-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        modifiedPlan: message.modifiedPlan,
      })
    });
    const data = await response.json();
    if (panel) {
      panel.webview.postMessage({ command: 'modifyPlan', data });
    }
  } catch (error: any) {
    console.error('Error:', error);
  }
}