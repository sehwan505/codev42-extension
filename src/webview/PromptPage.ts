import { GitInfo } from '../service/gitService';

export function getWebviewContent(gitInfo: GitInfo): string {

  const commitInfoArray = Array.isArray(gitInfo.commitInfo) 
        ? gitInfo.commitInfo 
        : [gitInfo.commitInfo];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src http://localhost:8080;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backend Tasks</title>
</head>
<body>
  <h1>백엔드 작업 페이지</h1>
  <p>현재 Git 브랜치: ${gitInfo.branch}</p>
  <p>현재 Git 커밋: ${commitInfoArray.map(commit => `<li class="commit-item">${commit}</li>`).join('')}</p>
  <form id="promptForm" onsubmit="handleSubmit(event)">
    <input type="text" id="prompt" placeholder="프롬프트를 입력하세요">
    <button type="submit" id="taskButton">작업 수행</button>
  </form>

  <script>
    const vscode = acquireVsCodeApi();
    const handleSubmit = (event) => {
      event.preventDefault();
      const prompt = document.getElementById('prompt').value;
      vscode.postMessage({ 
        command: 'sendPrompt',
        prompt: prompt 
      });
    };
  </script>
</body>
</html>`;
} 