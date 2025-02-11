import * as vscode from 'vscode';
import { applyModification } from '../../webview/src/service/modificationService';
import { handleGeneratePlan } from '../../webview/src/service/generatePlan';
import * as fs from 'fs';
import * as path from 'path';

export function registerCommands(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('codev42.openCodevPage', async () => {
    try {
      // 웹뷰 패널 생성
      const panel = vscode.window.createWebviewPanel(
        'reactPage',
        'React SPA',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'media', 'build'))
          ]
        }
      );

      // 웹뷰로부터 메시지 수신 (프롬프트 전달 및 수정 적용 처리)
      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === 'generatePlan') {
            await handleGeneratePlan(panel, message);
          } else if (message.command === 'applyModification') {
            applyModification(message.data);
          }
        },
        undefined,
        context.subscriptions
      );

      // React 앱 빌드 결과물의 index.html 파일 로드
      const indexHtmlPath = path.join(context.extensionPath, 'media', 'build', 'index.html');
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

      // webview에 리소스 URI 변환 (필요한 경우, js 및 css 파일 경로를 vscode-webview-resource: 형식으로 변환)
      // 예를 들어, index.html 내 <script src="bundle.js"></script>를 아래와 같이 변환할 수 있습니다.
      const bundleUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', 'build', 'bundle.js'))
      );
      indexHtml = indexHtml.replace(/bundle\.js/g, bundleUri.toString());
      
      panel.webview.html = indexHtml;
    } catch (err) {
      vscode.window.showErrorMessage(`React 페이지 로드 중 에러 발생: ${err}`);
    }
  });
  context.subscriptions.push(disposable);
} 