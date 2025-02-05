import { WebviewMessage } from '../types';
import * as vscode from 'vscode';
import * as path from 'path';

export class DevPlanPage {
  private static instance: DevPlanPage;
  private readonly vscode: any;
  private readonly apiBaseUrl: string = 'http://localhost:8080';

  private constructor() {
    this.initializeMessageHandlers();
  }

  static getInstance(): DevPlanPage {
    if (!DevPlanPage.instance) {
      DevPlanPage.instance = new DevPlanPage();
    }
    return DevPlanPage.instance;
  }

  private initializeMessageHandlers() {
    window.addEventListener('message', async (event) => {
      const message: WebviewMessage = event.data;
      switch (message.command) {
        case 'requestData':
          await this.handleDataRequest(message.payload);
          break;
      }
    });
  }

  private async handleDataRequest(payload: any) {
    try {
      const response = await this.fetchFromBackend('/api/data', {
        method: 'GET',
        payload
      });
      this.postMessageToExtension('dataReceived', response);
    } catch (error: any) {
      this.postMessageToExtension('error', { error: error.message });
    }
  }

  private async fetchFromBackend(endpoint: string, options: any) {
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return await response.json();
  }

  public postMessageToExtension(command: string, payload?: any) {
    this.vscode.postMessage({ command, payload });
  }

  public render(gitInfo: any): string {
    return `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Backend Tasks</title>
      </head>
      <body class="bg-vscode-background text-vscode-foreground">
        <div class="container mx-auto px-4 py-8 max-w-3xl">
          <h1 class="text-2xl font-bold mb-6">백엔드 작업 페이지</h1>
          
          <div class="bg-opacity-10 bg-white rounded-lg p-4 mb-6">
            <p class="mb-2">현재 브랜치: ${gitInfo.branch}</p>
            <p>커밋 정보: ${gitInfo.commitInfo}</p>
          </div>

          <div class="space-x-4 mb-6">
            <button id="fetchData" class="vscode-button">
              데이터 가져오기
            </button>
            <button id="performTask" class="vscode-button">
              작업 수행
            </button>
          </div>

          <pre id="result" class="bg-opacity-10 bg-white rounded-lg p-4 hidden"></pre>
        </div>
        <script>
          const devPlanPage = ${DevPlanPage.getInstance()};
          
          document.getElementById('fetchData').addEventListener('click', () => {
            devPlanPage.postMessageToExtension('requestData');
          });

          document.getElementById('performTask').addEventListener('click', () => {
            devPlanPage.postMessageToExtension('performTask', {
              branch: "${gitInfo.branch}",
              commit: "${gitInfo.commitInfo}"
            });
          });
        </script>
      </body>
      </html>
    `;
  }
}