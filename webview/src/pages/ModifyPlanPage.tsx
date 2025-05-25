import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PlanData, Annotation } from '../types/plan';
declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

const ModifyPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { plan?: any } || {};
  
  const parsedData = locationState.plan || { plans: [], language: 'python', devPlanId: '' };
  
  const devPlanId = parsedData.devPlanId;
  const [planData, setPlanData] = useState<PlanData['Plans']>(parsedData.plans || []);
  const [language, setLanguage] = useState<string>(parsedData.language || 'Python');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      
      console.log('메시지 수신:', message); // 디버깅용 로그 추가
      
      if (message.command === 'responseModifyPlan') {
        setLoading(false); // 응답이 오면 로딩 상태 해제
        if (message.data.status === 'Success') {
          vscode.postMessage({
            command: 'showInformationMessage',
            text: '계획 수정이 완료되었습니다.'
          });
        } else {
          vscode.postMessage({
            command: 'showErrorMessage', 
            text: '계획 수정에 실패했습니다.'
          });
        }
      } else if (message.command === 'responseImplementPlan') {
        setLoading(false); // 응답이 오면 로딩 상태 해제
        console.log('message.data', message.data);
        navigate('/implement-plan', { state: { code: message.data.code, diagrams: message.data.diagrams} });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  const handleModifyPlan = () => {
    console.log('계획 수정 시작, 로딩 상태 활성화'); // 디버깅용 로그
    setLoading(true); // 로딩 상태 활성화
    vscode.postMessage({
      command: 'modifyPlan',
      payload: {
        devPlanId: devPlanId,
        language: language,
        modifiedPlan: planData,
      }
    });
  };

  const handleImplementPlan = () => {
    console.log('계획 실행 시작, 로딩 상태 활성화'); // 디버깅용 로그
    setLoading(true); // 로딩 상태 활성화
    vscode.postMessage({
      command: 'implementPlan',
      payload: {
        devPlanId: devPlanId,
      }
    });
  };

  const updateAnnotation = (planIndex: number, annotationIndex: number, field: keyof Annotation, value: string) => {
    const newPlanData = [...planData];
    newPlanData[planIndex].Annotations[annotationIndex][field] = value;
    setPlanData(newPlanData);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-5xl py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">개발 계획 수정</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <label htmlFor="language" className="block text-lg font-medium text-gray-700 mb-2">프로그래밍 언어</label>
            <input 
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="프로그래밍 언어를 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">개발 계획</h2>
            
            {Array.isArray(planData) && planData.map((plan, planIndex) => (
              <div key={planIndex} className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50">
                <div className="mb-5">
                  <label className="block text-lg font-semibold text-gray-700 mb-2">클래스 이름</label>
                  <input
                    type="text"
                    value={plan.ClassName}
                    onChange={(e) => {
                      const newPlanData = [...planData];
                      newPlanData[planIndex].ClassName = e.target.value;
                      setPlanData(newPlanData);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <h3 className="text-lg font-medium text-gray-700 mb-4">메서드</h3>
                <div className="space-y-4">
                  {Array.isArray(plan.Annotations) && plan.Annotations.map((annotation, annotationIndex) => (
                    <div key={annotationIndex} className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
                      <div className="mb-3">
                        <label className="block font-medium text-gray-700 mb-1">메서드 이름</label>
                        <input
                          type="text"
                          value={annotation.Name}
                          onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="block font-medium text-gray-700 mb-1">파라미터</label>
                        <input
                          type="text"
                          value={annotation.Params}
                          onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Params', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="block font-medium text-gray-700 mb-1">반환 타입</label>
                        <input
                          type="text"
                          value={annotation.Returns}
                          onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Returns', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">설명</label>
                        <textarea
                          value={annotation.Description}
                          onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Description', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    const newPlanData = [...planData];
                    newPlanData[planIndex].Annotations.push({
                      Name: '',
                      Params: '',
                      Returns: '',
                      Description: ''
                    });
                    setPlanData(newPlanData);
                  }}
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 font-medium"
                >
                  메서드 추가
                </button>
              </div>
            ))}
            
            <div className="flex justify-center mb-6">
              <button
                onClick={() => {
                  setPlanData([...planData, {
                    ClassName: '',
                    Annotations: []
                  }]);
                }}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200 font-medium"
              >
                클래스 추가
              </button>
            </div>
            
            <div className="mt-6 flex justify-center">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-3"></div>
                  <p className="text-gray-700">처리 중입니다...</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleModifyPlan}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 font-medium text-lg mr-3"
                  >
                    계획 수정하기
                  </button>
                  <button
                    onClick={handleImplementPlan}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 font-medium text-lg"
                  >
                    계획 실행하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPlanPage; 