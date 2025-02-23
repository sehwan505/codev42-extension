import * as vscode from 'vscode';
import { RequestMessage } from '../types';
import { BackendResponse } from '../types/response';
import { handleGeneratePlan } from './Plan';
import { handleModifyPlan } from './Plan';
import { handleGetGitInfo } from './gitService';

export class WebviewService {
  private panel: vscode.WebviewPanel | null = null;
  private readonly context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public createWebviewPanel(viewType: string, title: string, column: vscode.ViewColumn) {
    this.panel = vscode.window.createWebviewPanel(
      viewType,
      title,
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    this.panel.webview.onDidReceiveMessage(
      async (message: RequestMessage) => {
        try {
          await this.handleWebviewMessage(message);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
      },
      undefined,
      this.context.subscriptions
    );

    return this.panel;
  }

  public async handleDataRequest(message: RequestMessage) {
    console.log('handleDataRequest', message);
  }

  private async handleWebviewMessage(message: RequestMessage) {
    switch (message.command) {
      case 'generatePlan':
        await handleGeneratePlan(this.panel!, message.payload);
        break;
      case 'modifyPlan':
        await handleModifyPlan(this.panel!, message.payload);
        break;  
      case 'getGitInfo':
        await handleGetGitInfo(this.panel!);
        break;
      default:
        throw new Error(`Unknown command: ${message.command}`);
    }
  }

} 