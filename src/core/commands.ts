import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function registerCommands(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('codev42.openCodevPage', async () => {
    try {
      const panel = vscode.window.createWebviewPanel(
        'reactPage',
        'React SPA',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'webview', 'dist')),
            vscode.Uri.file(path.join(context.extensionPath, 'webview', 'dist', 'assets'))
          ]
        }
      );

      const indexPath = path.join(context.extensionPath, 'webview', 'dist', 'index.html');

      fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
          panel.webview.html = `<h1>React 앱 로딩 중 오류 발생</h1><p>${err}</p>`;
          return;
        }

        const getWebviewUri = (filePath: string) => {
          return panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'webview', 'dist', filePath))
          ).toString();
        };

        // CSP 설정 (필요에 따라 조정)
        const csp = `
          <meta http-equiv="Content-Security-Policy" 
                content="default-src 'self' ${panel.webview.cspSource} 'unsafe-inline' 'unsafe-eval';
                         img-src ${panel.webview.cspSource} https: data:;
                         script-src ${panel.webview.cspSource} 'unsafe-inline' 'unsafe-eval';
                         style-src ${panel.webview.cspSource} 'unsafe-inline';">
        `;

        // 최초에 acquireVsCodeApi() 호출 후 재정의
        // → 이후 React 앱 내부에서 acquireVsCodeApi()를 호출해도 같은 인스턴스를 반환하게 함.
        const vscodeApiScript = `
          <script>
            (function() {
              const vscodeInstance = acquireVsCodeApi();
              window.acquireVsCodeApi = function() { return vscodeInstance; };
              window.vscode = vscodeInstance;
            })();
          </script>
        `;

        // Base 태그 설정 (웹뷰 URI를 기준으로 상대 경로 처리)
        const baseTag = `<base href="${getWebviewUri('')}/">`;

        // 기존 index.html 내용이 있다면 정제하거나 그대로 사용할 수 있습니다.
        // 여기서는 직접 HTML 템플릿을 구성하는 예제로 작성합니다.
        const htmlContent = `
          <!doctype html>
          <html lang="en">
            <head>
              ${csp}
              ${baseTag}
              <meta charset="UTF-8" />
              <link rel="icon" type="image/svg+xml" href="${getWebviewUri('vite.svg')}" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Vite + React + TS</title>
              ${vscodeApiScript}
              <link rel="stylesheet" href="${getWebviewUri('assets/index.css')}">
              <script type="module" crossorigin src="${getWebviewUri('assets/index.js')}"></script>
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `;

        panel.webview.html = htmlContent;

        console.log('Webview HTML content:', htmlContent);
      });
    } catch (err) {
      vscode.window.showErrorMessage(`React 페이지 로드 중 에러 발생: ${err}`);
    }
  });
  context.subscriptions.push(disposable);
} 