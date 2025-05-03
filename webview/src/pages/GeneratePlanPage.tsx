import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useGitInfo } from './homePage';

// import { acquireVsCodeApi } from 'vscode'; 를 제거하고 전역 선언 사용
declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

const GeneratePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { gitInfo } = useGitInfo();
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gitInfo) {
      alert('Git 정보를 불러올 수 없습니다. 홈페이지로 돌아가서 다시 시도해주세요.');
      return;
    }

    vscode.postMessage({ 
      command: 'generatePlan',
      payload: { 
        prompt: prompt, 
        projectId: gitInfo.repository, 
        branch: gitInfo.branch 
      }
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'getPlan') {
        navigate('/modify-plan', { state: { plan: message.data } });
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">개발 계획 생성</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {gitInfo ? (
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">프로젝트 정보</h3>
                <p className="text-gray-600">저장소: {gitInfo.repository}</p>
                <p className="text-gray-600">브랜치: {gitInfo.branch}</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-lg font-medium text-gray-700 mb-2">
                    개발 요구사항
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="개발하고자 하는 기능에 대한 요구사항을 상세히 입력하세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 font-medium text-lg"
                >
                  계획 생성하기
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600">Git 정보를 불러올 수 없습니다.</p>
              <p className="text-gray-600 mt-2">홈페이지로 돌아가서 다시 시도해주세요.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                홈으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePlanPage; 