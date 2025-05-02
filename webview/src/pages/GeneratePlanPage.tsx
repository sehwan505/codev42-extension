import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { GitInfo } from '../../../src/types/response';

// import { acquireVsCodeApi } from 'vscode'; 를 제거하고 전역 선언 사용
declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

const GeneratePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const promptInput = document.getElementById('prompt') as HTMLInputElement;
    const prompt = promptInput.value;
    vscode.postMessage({ 
      command: 'generatePlan',
      payload: { prompt: prompt, projectId: gitInfo?.repository, branch: gitInfo?.branch }
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'getGitInfo') {
        if (message.data.error) {
          alert(message.data.error);
        }
        else {
          setGitInfo(message.data);
        }
      } else if (message.command === 'getPlan') {
        navigate('/modify-plan', { state: { plan: message.data } });
      }
    };

    vscode.postMessage({ command: 'getGitInfo' });
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return (
    <div>
      <h1>개발 계획 페이지</h1>
      {gitInfo && (
        <>
          <p>현재 Git 저장소: {gitInfo.repository}</p>
          <p>현재 Git 브랜치: {gitInfo.branch}</p>
        </>
      )}
      <form id="promptForm" onSubmit={handleSubmit}>
        <input type="text" id="prompt" placeholder="프롬프트를 입력하세요" />
        <button type="submit" id="taskButton">작업 수행</button>
      </form>
    </div>
  );
};

export default GeneratePlanPage; 