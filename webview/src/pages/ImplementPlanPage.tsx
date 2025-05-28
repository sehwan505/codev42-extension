import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import mermaid from 'mermaid';

declare function acquireVsCodeApi(): any;

interface Diagram {
  Diagram: string;
  Type: string;
}

interface ImplementPlanResponse {
  code: string;
  diagrams: Diagram[];
}

// mermaid 초기화
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

const ImplementPlanPage: React.FC = () => {
  const location = useLocation();
  console.log('location', location.state);
  
  // location.state에서 직접 파싱
  const response = location.state as ImplementPlanResponse;
  
  console.log('response', response);
  // 응답에서 코드와 다이어그램 추출
  const code = response?.code || '';
  const diagrams = response?.diagrams || [];
  
  const [currentDiagramIndex, setCurrentDiagramIndex] = useState(0);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagrams.length > 0 && diagrams[currentDiagramIndex] && mermaidRef.current) {
      // 기존 내용 초기화
      mermaidRef.current.innerHTML = '';
      
      mermaid.contentLoaded();
      mermaid.render(`mermaid-diagram-${currentDiagramIndex}`, diagrams[currentDiagramIndex].Diagram)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        })
        .catch(error => console.error('Mermaid 렌더링 오류:', error));
    }
  }, [currentDiagramIndex, diagrams]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (diagrams.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        setCurrentDiagramIndex((prev) => (prev - 1 + diagrams.length) % diagrams.length);
      } else if (event.key === 'ArrowRight') {
        setCurrentDiagramIndex((prev) => (prev + 1) % diagrams.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [diagrams.length]);

  const nextDiagram = () => {
    setCurrentDiagramIndex((prev) => (prev + 1) % diagrams.length);
  };

  const prevDiagram = () => {
    setCurrentDiagramIndex((prev) => (prev - 1 + diagrams.length) % diagrams.length);
  };

  const goToDiagram = (index: number) => {
    setCurrentDiagramIndex(index);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert('코드가 클립보드에 복사되었습니다.');
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
      });
  };

  // 현재 다이어그램 정보
  const currentDiagram = diagrams[currentDiagramIndex];

  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div className="flex-1 flex items-start justify-center">
        <div className="max-w-7xl w-full mx-auto py-12 px-6 lg:px-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <h1 className="text-5xl font-bold text-gray-800 flex items-center">
              <i className="fas fa-code-branch text-indigo-600 mr-4"></i>
              구현 결과
            </h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={copyCode}
                className="px-6 py-3 bg-transparent border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center font-medium text-lg"
              >
                <i className="far fa-copy mr-3"></i> 코드 복사
              </button>
            </div>
          </header>

          {/* 코드 섹션 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gray-800 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <i className="fas fa-file-code text-indigo-400 mr-4"></i> 생성된 코드
              </h2>
              <div className="flex items-center space-x-3">
                <span className="inline-flex h-4 w-4 rounded-full bg-red-500"></span>
                <span className="inline-flex h-4 w-4 rounded-full bg-yellow-500"></span>
                <span className="inline-flex h-4 w-4 rounded-full bg-green-500"></span>
              </div>
            </div>
            <div className="bg-gray-50 p-2">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-8 overflow-x-auto text-base leading-relaxed" style={{ fontFamily: "'Consolas', 'Monaco', 'Andale Mono', monospace" }}>
                <code>{code}</code>
              </pre>
            </div>
          </div>

          {/* 다이어그램 섹션 */}
          {diagrams.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 transition-all duration-300 hover:shadow-2xl">
              <div className="bg-white px-8 py-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    <i className="fas fa-project-diagram text-indigo-600 mr-4"></i> 다이어그램
                  </h2>
                  {diagrams.length > 1 && (
                    <div className="text-lg text-gray-600 font-medium">
                      {currentDiagramIndex + 1} / {diagrams.length}
                    </div>
                  )}
                </div>
                {currentDiagram && (
                  <p className="text-base text-gray-600">
                    <span className="font-medium">타입:</span> 
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg ml-3 font-medium">{currentDiagram.Type}</span>
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-8 relative min-h-[500px] flex items-center justify-center">
                <div className="mermaid-diagram w-full max-w-5xl" ref={mermaidRef}></div>
                
                {/* 슬라이드 컨트롤 */}
                {diagrams.length > 1 && (
                  <>
                    {/* 이전/다음 버튼 */}
                    <button
                      onClick={prevDiagram}
                      className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 z-10 opacity-90 hover:opacity-100"
                      aria-label="이전 다이어그램"
                    >
                      <i className="fas fa-chevron-left text-gray-700 text-lg"></i>
                    </button>
                    
                    <button
                      onClick={nextDiagram}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 z-10 opacity-90 hover:opacity-100"
                      aria-label="다음 다이어그램"
                    >
                      <i className="fas fa-chevron-right text-gray-700 text-lg"></i>
                    </button>
                    
                    {/* 인디케이터 점들 */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-white bg-opacity-95 py-3 px-4 rounded-full shadow-lg">
                      {diagrams.map((diagram, index) => (
                        <button
                          key={index}
                          onClick={() => goToDiagram(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentDiagramIndex
                              ? 'bg-indigo-600 transform scale-125'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`다이어그램 ${index + 1} (${diagram.Type})로 이동`}
                          title={`${diagram.Type} 다이어그램`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* 다이어그램 타입별 설명 */}
              {diagrams.length > 1 && (
                <div className="bg-white px-8 py-6 flex flex-wrap gap-3 justify-center border-t border-gray-200">
                  {diagrams.map((diagram, index) => (
                    <button
                      key={index}
                      onClick={() => goToDiagram(index)}
                      className={`px-4 py-2 rounded-full text-base transition-all duration-200 font-medium ${
                        index === currentDiagramIndex
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {diagram.Type}
                    </button>
                  ))}
                </div>
              )}
              
              {/* 키보드 단축키 안내 */}
              {diagrams.length > 1 && (
                <div className="bg-white px-8 pb-6 text-base text-gray-500 text-center">
                  <i className="fas fa-keyboard mr-2"></i> 키보드 화살표 키로도 이동할 수 있습니다
                </div>
              )}
            </div>
          )}

          {/* 뒤로가기 버튼 */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 font-medium text-xl flex items-center hover:transform hover:-translate-y-1 hover:shadow-xl"
            >
              <i className="fas fa-arrow-left mr-3"></i> 이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementPlanPage;
