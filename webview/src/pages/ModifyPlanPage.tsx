import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();


const ModifyPlanPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = searchParams.get('data');
  console.log('data', data);

  const parsedData = data ? JSON.parse(data) : { Plans: [], Language: 'python' };
  
  const [planData, setPlanData] = useState<string[]>(parsedData.Plans || []);
  const [language, setLanguage] = useState<string>(parsedData.Language || 'Python');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'getPlan') {
        navigate('/devplan', { state: { plan: message.data } });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  const handleModifyPlan = () => {
    vscode.postMessage({
      command: 'modifyPlan',
      payload: {
        modifiedPlan: planData
      }
    });
    navigate(`/devplan?plan=${JSON.stringify(planData)}&language=${language}`);
  };

  return (
    <div>
      <h1>개발 계획 페이지</h1>
      <div className="language-selector mb-4">
        <label htmlFor="language" className="block mb-2">프로그래밍 언어</label>
        <input 
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="프로그래밍 언어를 입력하세요"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="p-5">
        <label htmlFor="plan" className="block mb-2">개발 계획</label>
        {planData.map((item, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">단계 {index + 1}</label>
            <textarea
              value={item}
              onChange={(e) => {
                const newPlanData = [...planData];
                newPlanData[index] = e.target.value;
                setPlanData(newPlanData);
              }}
              className="w-full min-h-[500px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
        <button
          onClick={handleModifyPlan}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          계획 수정하기
        </button>
      </div>
    </div>
  );
};

export default ModifyPlanPage; 