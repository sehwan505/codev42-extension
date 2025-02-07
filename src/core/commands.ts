import * as vscode from 'vscode';
import { getGitInfo } from '../service/gitService';
import { getWebviewContent } from '../webview/PromptPage';
import { applyModification } from '../service/modificationService';

export function registerCommands(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('codev42.openCodevPage', async () => {
    try {
      const gitInfo = await getGitInfo();
      
      // 웹뷰 패널 생성
      const panel = vscode.window.createWebviewPanel(
        'codevPage',
        'Prompt Tasks',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent(gitInfo);

      // 웹뷰로부터 메시지 수신
      panel.webview.onDidReceiveMessage(
        message => {
          if (message.command === 'applyModification') {
            applyModification(message.data);
          }
        },
        undefined,
        context.subscriptions
      );
    } catch (err) {
      vscode.window.showErrorMessage(`Git 정보를 가져오는 중 에러 발생: ${err}`);
    }
  });
  context.subscriptions.push(disposable);
} 