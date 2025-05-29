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
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'class' | 'method';
    indices: { planIndex: number; methodIndex?: number };
  } | null>(null);

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
        navigate('/implement-plan', { state: { code: message.data.code, diagrams: message.data.diagrams, explainedSegments: message.data.explainedSegments } });
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

  const addMethod = (planIndex: number) => {
    const newPlanData = [...planData];
    newPlanData[planIndex].Annotations.push({
      Name: '',
      Params: '',
      Returns: '',
      Description: ''
    });
    setPlanData(newPlanData);
  };

  const removeMethod = (planIndex: number, methodIndex: number) => {
    const newPlanData = [...planData];
    newPlanData[planIndex].Annotations.splice(methodIndex, 1);
    setPlanData(newPlanData);
    setDeleteModalState(null);
  };

  const addClass = () => {
    setPlanData([...planData, {
      ClassName: '',
      Annotations: []
    }]);
  };

  const removeClass = (planIndex: number) => {
    const newPlanData = [...planData];
    newPlanData.splice(planIndex, 1);
    setPlanData(newPlanData);
    setDeleteModalState(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div className="flex-1 flex items-start justify-center">
        <div className="max-w-7xl w-full mx-auto py-16 px-6 lg:px-8">
          {/* Header */}
          <header className="mb-16">
            <h1 className="text-5xl font-bold text-gray-800 text-center flex items-center justify-center">
              <i className="fas fa-tasks text-indigo-600 mr-4"></i>
              개발 계획 수정
            </h1>
          </header>

          <div className="bg-white rounded-2xl shadow-xl p-12 mb-16 transition-all duration-300 hover:shadow-2xl">
            {/* Programming Language Input */}
            <div className="mb-12">
              <label htmlFor="language" className="block text-2xl font-medium text-gray-700 mb-4 flex items-center">
                <i className="fas fa-code text-indigo-600 mr-3"></i> 프로그래밍 언어
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400 text-lg"></i>
                </div>
                <input 
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="프로그래밍 언어를 입력하세요"
                  className="w-full pl-12 px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
                />
              </div>
            </div>

            {/* Development Plan Section */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-10 flex items-center">
                <i className="fas fa-sitemap text-indigo-600 mr-3"></i> 개발 계획
              </h2>
              
              {/* Delete Confirmation Modal */}
              {deleteModalState && deleteModalState.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {deleteModalState.type === 'class' ? '클래스 삭제' : '메소드 삭제'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-8">
                        {deleteModalState.type === 'class' 
                          ? '이 클래스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                          : '이 메소드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            if (deleteModalState.type === 'class') {
                              removeClass(deleteModalState.indices.planIndex);
                            } else {
                              removeMethod(
                                deleteModalState.indices.planIndex,
                                deleteModalState.indices.methodIndex!
                              );
                            }
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setDeleteModalState(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Class Cards */}
              {Array.isArray(planData) && planData.map((plan, planIndex) => (
                <div key={planIndex} className="mb-12 bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                  {/* Class Header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-white p-8 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex-1">
                        <label className="block text-xl font-semibold text-gray-700 mb-4 flex items-center">
                          <i className="fas fa-cube text-indigo-600 mr-3"></i> 클래스 이름
                        </label>
                        <input
                          type="text"
                          value={plan.ClassName}
                          onChange={(e) => {
                            const newPlanData = [...planData];
                            newPlanData[planIndex].ClassName = e.target.value;
                            setPlanData(newPlanData);
                          }}
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
                          placeholder="클래스 이름을 입력하세요"
                        />
                      </div>
                      <button
                        onClick={() => setDeleteModalState({
                          isOpen: true,
                          type: 'class',
                          indices: { planIndex }
                        })}
                        className="ml-4 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="클래스 삭제"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  
                  {/* Methods Section */}
                  <div className="p-8">
                    <h3 className="text-xl font-medium text-gray-700 mb-6 flex items-center">
                      <i className="fas fa-cogs text-indigo-600 mr-3"></i> 메서드
                    </h3>
                    
                    <div className="space-y-6">
                      {Array.isArray(plan.Annotations) && plan.Annotations.map((annotation, annotationIndex) => (
                        <div key={annotationIndex} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                          {/* Method header */}
                          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                            <span className="font-medium text-indigo-800 text-lg">메서드 #{annotationIndex + 1}</span>
                            <button
                              onClick={() => setDeleteModalState({
                                isOpen: true,
                                type: 'method',
                                indices: { planIndex, methodIndex: annotationIndex }
                              })}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="메서드 삭제"
                            >
                              삭제
                            </button>
                          </div>
                          
                          {/* Method name */}
                          <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2 flex items-center text-base">
                              <i className="fas fa-tag text-indigo-600 mr-2"></i> 메서드 이름
                            </label>
                            <input
                              type="text"
                              value={annotation.Name}
                              onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Name', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
                              placeholder="메서드 이름"
                            />
                          </div>

                          {/* Parameters */}
                          <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2 flex items-center text-base">
                              <i className="fas fa-list-ul text-indigo-600 mr-2"></i> 파라미터
                            </label>
                            <input
                              type="text"
                              value={annotation.Params}
                              onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Params', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
                              placeholder="param1: type, param2: type"
                            />
                          </div>

                          {/* Return type */}
                          <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2 flex items-center text-base">
                              <i className="fas fa-reply text-indigo-600 mr-2"></i> 반환 타입
                            </label>
                            <input
                              type="text"
                              value={annotation.Returns}
                              onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Returns', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
                              placeholder="반환 타입"
                            />
                          </div>
                          
                          {/* Description */}
                          <div>
                            <label className="block font-medium text-gray-700 mb-2 flex items-center text-base">
                              <i className="fas fa-align-left text-indigo-600 mr-3"></i> 설명
                            </label>
                            <textarea
                              value={annotation.Description}
                              onChange={(e) => updateAnnotation(planIndex, annotationIndex, 'Description', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base leading-relaxed"
                              rows={4}
                              placeholder="메서드에 대한 설명을 입력하세요"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add method button */}
                    <button
                      onClick={() => addMethod(planIndex)}
                      className="mt-6 px-6 py-4 flex items-center justify-center w-full rounded-xl border-2 border-dashed border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 font-medium text-lg"
                    >
                      <i className="fas fa-plus mr-3"></i> 메서드 추가
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add class button */}
              <div className="flex justify-center mb-12">
                <button
                  onClick={addClass}
                  className="px-8 py-4 flex items-center bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors duration-200 font-medium text-lg"
                >
                  <i className="fas fa-plus-circle mr-3"></i> 클래스 추가
                </button>
              </div>

              {/* Action buttons */}
              <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                    <p className="text-gray-700 text-lg">처리 중입니다...</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                    <button
                      onClick={handleModifyPlan}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 font-medium text-xl flex items-center justify-center hover:transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto"
                    >
                      <i className="fas fa-edit mr-3"></i> 계획 수정하기
                    </button>
                    <button
                      onClick={handleImplementPlan}
                      className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 font-medium text-xl flex items-center justify-center hover:transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto"
                    >
                      <i className="fas fa-play mr-3"></i> 계획 실행하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPlanPage; 