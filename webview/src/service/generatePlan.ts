import * as vscode from 'vscode';

export async function handleGeneratePlan(panel: vscode.WebviewPanel, message: any) {
  try {
    const response = await fetch('http://localhost:8080/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Prompt: message.prompt })
    });
    const data = await response.json();
    if (panel) {
      panel.webview.postMessage({ command: 'applyModification', data });
    }
  } catch (error: any) {
    console.error('Error:', error);
  }
}