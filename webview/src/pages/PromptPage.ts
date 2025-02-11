import { GitInfo } from '../service/gitService.js';
import { acquireVsCodeApi } from 'vscode';


export default function getWebviewContent(gitInfo: GitInfo): string {
  const vscode = acquireVsCodeApi();
    const handleSubmit = (event) => {
      event.preventDefault();
      const prompt = document.getElementById('prompt').value;
      vscode.postMessage({ 
        command: 'generatePlan',
        prompt: prompt 
      });
    };

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.command === 'applyModification') {
        document.getElementById('resultContent').innerText = JSON.stringify(message.data, null, 2);
      }
    });

  const commitInfoArray = Array.isArray(gitInfo.commitInfo) 
        ? gitInfo.commitInfo 
        : [gitInfo.commitInfo];

  return (
    <>
      <h1>백엔드 작업 페이지</h1>
      <p>현재 Git 브랜치: ${gitInfo.branch}</p>
      <p>현재 Git 커밋: ${commitInfoArray.map(commit => `<li class="commit-item">${commit}</li>`).join('')}</p>
      <form id="promptForm" onsubmit="handleSubmit(event)">
        <input type="text" id="prompt" placeholder="프롬프트를 입력하세요">
        <button type="submit" id="taskButton">작업 수행</button>
      </form>

      <div id="resultDisplay" style="margin-top:20px;">
        <h2>작업 결과</h2>
        <pre id="resultContent"></pre>
      </div>
    </>
  );
} 