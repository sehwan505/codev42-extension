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

  // 현재 다이어그램 정보
  const currentDiagram = diagrams[currentDiagramIndex];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">구현 결과</h1>

        {/* 코드 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">생성된 코드</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* 다이어그램 섹션 */}
        {diagrams.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">다이어그램</h2>
                {currentDiagram && (
                  <p className="text-sm text-gray-600 mt-1">타입: {currentDiagram.Type}</p>
                )}
              </div>
              {diagrams.length > 1 && (
                <div className="text-sm text-gray-600">
                  {currentDiagramIndex + 1} / {diagrams.length}
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 relative min-h-[400px] flex items-center justify-center">
              <div className="mermaid-diagram w-full" ref={mermaidRef}></div>
              
              {/* 슬라이드 컨트롤 */}
              {diagrams.length > 1 && (
                <>
                  {/* 이전/다음 버튼 */}
                  <button
                    onClick={prevDiagram}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-10"
                    aria-label="이전 다이어그램"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={nextDiagram}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-10"
                    aria-label="다음 다이어그램"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* 인디케이터 점들 */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white bg-opacity-80 rounded-full px-3 py-2">
                    {diagrams.map((diagram, index) => (
                      <button
                        key={index}
                        onClick={() => goToDiagram(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentDiagramIndex
                            ? 'bg-blue-600'
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
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {diagrams.map((diagram, index) => (
                  <button
                    key={index}
                    onClick={() => goToDiagram(index)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      index === currentDiagramIndex
                        ? 'bg-blue-600 text-white'
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
              <div className="mt-4 text-sm text-gray-500 text-center">
                키보드 화살표 키로도 이동할 수 있습니다
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 font-medium text-lg"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImplementPlanPage;
