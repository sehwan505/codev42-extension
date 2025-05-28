import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router';

// GitInfo 타입 정의
export interface GitInfo {
  branch: string;
  repository: string;
}

// Git 컨텍스트 생성
export const GitContext = createContext<{
  gitInfo: GitInfo | null;
  setGitInfo: React.Dispatch<React.SetStateAction<GitInfo | null>>;
  loading: boolean;
}>({
  gitInfo: null,
  setGitInfo: () => {},
  loading: true
});

// Git 정보 제공자 컴포넌트
export const GitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // vscode API 초기화
    const vscode = acquireVsCodeApi();

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = event.data;
        if (message.command === 'getGitInfo') {
          if (message.data.error) {
            console.error('Git 정보 오류:', message.data.error);
            setLoading(false);
          } else {
            setGitInfo(message.data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('메시지 처리 중 오류 발생:', error);
        setLoading(false);
      }
    };

    // Git 정보 요청
    vscode.postMessage({ command: 'getGitInfo' });

    // 메시지 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <GitContext.Provider value={{ gitInfo, setGitInfo, loading }}>
      {children}
    </GitContext.Provider>
  );
};

// Git 정보 사용을 위한 커스텀 훅
export const useGitInfo = () => useContext(GitContext);

// 홈페이지 컴포넌트
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { gitInfo, loading } = useGitInfo();

  const goToGeneratePlan = () => {
    navigate('/dev-plan');
  };

  const goToPlanList = () => {
    navigate('/plan-list');
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col">
      <div className="flex-1 flex items-start justify-center">
        <div className="max-w-7xl w-full mx-auto py-16 px-6 lg:px-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-16 text-center">코드 개발 도우미</h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">프로젝트 정보</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-xl">Git 정보를 불러오는 중...</p>
              </div>
            ) : gitInfo ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-medium text-gray-700 mb-4">저장소</h3>
                  <p className="text-gray-800 font-mono bg-gray-100 p-4 rounded-lg text-lg">{gitInfo.repository}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-medium text-gray-700 mb-4">브랜치</h3>
                  <p className="text-gray-800 font-mono bg-gray-100 p-4 rounded-lg text-lg">{gitInfo.branch}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-red-600 text-xl">Git 정보를 불러올 수 없습니다.</p>
                <p className="text-gray-600 mt-3 text-lg">프로젝트가 Git 저장소인지 확인해주세요.</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              onClick={goToGeneratePlan}
              className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">새 개발 계획 만들기</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">새로운 개발 계획을 생성하여 프로젝트 개발을 시작합니다.</p>
              <div className="mt-6 text-blue-600 font-medium text-xl">시작하기 →</div>
            </div>
            
            <div 
              onClick={goToPlanList}
              className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-green-200 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">저장된 계획 불러오기</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">이전에 저장한 개발 계획 목록을 확인하고 작업을 계속합니다.</p>
              <div className="mt-6 text-green-600 font-medium text-xl">목록 보기 →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
