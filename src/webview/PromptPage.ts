import { GitInfo } from '../service/gitService';

export function getWebviewContent(gitInfo: GitInfo): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backend Tasks</title>
</head>
<body>
  <h1>백엔드 작업 페이지</h1>
  <p>현재 Git 브랜치: ${gitInfo.branch}</p>
  <form>
    <input type="text" id="prompt" placeholder="프롬프트를 입력하세요">
    <button type="submit" id="taskButton">작업 수행</button>
  </form>

  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('taskButton').addEventListener('click', () => {
      fetch('http://localhost:3000/performTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: "${gitInfo.branch}", commit: "${gitInfo.commitInfo}" })
      })
      .then(response => response.json())
      .then(data => {
        vscode.postMessage({ command: 'applyModification', data });
      })
      .catch(error => {
        console.error('에러:', error);
      });
    });
  </script>
</body>
</html>`;
} 