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
        setLoading(false);
      } else if (message.command === 'responsePlanById') {
        navigate('/modify-plan', { state: { plan: message.data } });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOpenPlan = (planItem: PlanItem) => {
    vscode.postMessage({
      command: 'getPlanById',
      payload: {
        devPlanId: planItem.DevPlanId
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col">
      <div className="flex-1 flex items-start justify-center">
        <div className="max-w-7xl w-full mx-auto py-16 px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800">저장된 계획 목록</h1>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 font-medium text-lg"
            >
              홈으로 돌아가기
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-xl">계획 목록을 불러오는 중...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-xl">저장된 계획이 없습니다.</p>
              <button
                onClick={() => navigate('/dev-plan')}
                className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none transition-all duration-200 font-medium text-lg"
              >
                새 계획 만들기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleOpenPlan(plan)}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">
                    {plan.Prompt || `계획 ${index + 1}`}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 text-base leading-relaxed">
                    {plan.Prompt || '설명이 없습니다.'}
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>ID: {plan.DevPlanId}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanListPage; 