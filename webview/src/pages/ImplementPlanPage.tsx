import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import mermaid from 'mermaid';

declare function acquireVsCodeApi(): any;

// mermaid 초기화
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

const ImplementPlanPage: React.FC = () => {
  const location = useLocation();
  const locationState = location.state as { codes?: string[], diagram?: string } || {};
  const { codes = [], diagram = '' } = locationState;
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagram && mermaidRef.current) {
      mermaid.contentLoaded();
      mermaid.render('mermaid-diagram', diagram)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        })
        .catch(error => console.error('Mermaid 렌더링 오류:', error));
    }
  }, [diagram]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">구현 결과</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 코드 섹션 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">생성된 코드</h2>
            <div className="space-y-6">
              {codes.map((code, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* 다이어그램 섹션 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">클래스 다이어그램</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mermaid-diagram" ref={mermaidRef}></div>
            </div>
          </div>
        </div>

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
