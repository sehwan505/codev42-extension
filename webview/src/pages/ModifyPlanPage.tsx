import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// import { acquireVsCodeApi } from 'vscode'; 를 제거하고 전역 선언 사용
declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

interface ModifyPlanPageProps {
  plan: string;
}

const ModifyPlanPage: React.FC<ModifyPlanPageProps> = ({ plan }) => {

    const parsePlan = (planData: any) => {
        if (!planData || !planData.plan) return [];
        try {
            return planData.plan.map((item: string) => item);
        } catch (error) {
            console.error('계획 데이터 파싱 중 오류 발생:', error);
            return [];
        }
    };
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<string[]>(parsePlan(plan));
    
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
  };

  return (
    <div>
      <h1>개발 계획 페이지</h1>
      <div className="p-5">
        {planData.map((item, index) => (
          <div key={index} className="mb-4">
            <textarea
              value={item}
              onChange={(e) => {
                const newPlanData = [...planData];
                newPlanData[index] = e.target.value;
                setPlanData(newPlanData);
              }}
              className="w-full min-h-[60px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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