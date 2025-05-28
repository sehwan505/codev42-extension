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
    <div className="bg-gray-50 min-h-screen w-full flex flex-col">
      <div className="flex-1 flex items-start justify-center">
        <div className="max-w-6xl w-full mx-auto py-16 px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-16 text-center">개발 계획 생성</h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-12">
            {gitInfo ? (
              <div className="mb-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-medium text-gray-700 mb-6">프로젝트 정보</h3>
                  <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                    <p className="text-gray-600 text-lg"><span className="font-medium">저장소:</span> {gitInfo.repository}</p>
                    <p className="text-gray-600 text-lg"><span className="font-medium">브랜치:</span> {gitInfo.branch}</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label htmlFor="prompt" className="block text-2xl font-medium text-gray-700 mb-4">
                      개발 요구사항
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="개발하고자 하는 기능에 대한 요구사항을 상세히 입력하세요"
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg leading-relaxed"
                      rows={8}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 font-medium text-xl transform hover:-translate-y-1 hover:shadow-xl"
                    >
                      계획 생성하기
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-red-600 text-xl">Git 정보를 불러올 수 없습니다.</p>
                <p className="text-gray-600 mt-4 text-lg">홈페이지로 돌아가서 다시 시도해주세요.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none transition-all duration-200 font-medium text-lg"
                >
                  홈으로 돌아가기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePlanPage; 