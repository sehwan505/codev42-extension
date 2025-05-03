import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useGitInfo } from './homePage';
declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

interface PlanItem {
  DevPlanId: string; 
  Prompt: string;
}

const PlanListPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { gitInfo } = useGitInfo();

  useEffect(() => {
    vscode.postMessage({
      command: 'getPlanList',
      payload: {
        projectId: gitInfo!.repository,
        branch: gitInfo!.branch
      }
    });

    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'responsePlanList') {
        setPlans(message.data);
        console.log('plans:', message.data);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOpenPlan = (planItem: PlanItem) => {
    vscode.postMessage({
      command: 'getPlanDetails',
      payload: {
        devPlanId: planItem.DevPlanId
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">저장된 개발 계획 목록</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">불러오는 중...</p>
          </div>
        ) : plans && plans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">저장된 개발 계획이 없습니다.</p>
            <button
              onClick={() => navigate('/dev-plan')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 font-medium"
            >
              새 개발 계획 만들기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {plans && plans.map((plan) => (
                <li key={plan.DevPlanId} className="hover:bg-gray-50">
                  <button
                    onClick={() => handleOpenPlan(plan)}
                    className="w-full text-left p-6 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{plan.Prompt}</h3>
                        <p className="text-xs text-gray-500 mt-1">ID: {plan.DevPlanId}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/dev-plan')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 font-medium"
          >
            새 개발 계획 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanListPage; 