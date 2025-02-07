import * as vscode from 'vscode';
import { WebviewMessage, BackendResponse } from '../types';
import { handleSendPrompt } from './generatePlan';
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
      async (message: WebviewMessage) => {
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

  public async handleDataRequest(message: WebviewMessage) {
    console.log('handleDataRequest', message);
  }

  private async handleWebviewMessage(message: WebviewMessage) {
    switch (message.command) {
      case 'performTask':
        await this.handlePerformTask(message.payload);
        break;
      case 'requestData':
        await this.handleDataRequest(message.payload);
        break;
      case 'sendPrompt':
        await handleSendPrompt(this.panel!, message.payload);
        break;
      default:
        throw new Error(`Unknown command: ${message.command}`);
    }
  }

  private async handlePerformTask(payload: any) {
    try {
      // 백엔드 요청 처리
      const response: BackendResponse = await this.makeBackendRequest('/performTask', payload);
      
      if (response.status === 'success' && this.panel) {
        await this.panel.webview.postMessage({
          command: 'taskCompleted',
          payload: response.data
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      throw new Error(`Task execution failed: ${error.message}`);
    }
  }


  private async makeBackendRequest(endpoint: string, data: any): Promise<BackendResponse> {
    // 실제 백엔드 요청 구현
    // axios나 node-fetch 사용 가능
    return {} as BackendResponse;
  }
} 