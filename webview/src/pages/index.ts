import './styles/main.css';

import { DevPlanPage } from './DevPlanPage';


// 웹뷰 초기화
document.addEventListener('DOMContentLoaded', () => {
  // BackendPage 인스턴스 가져오기
  const devPlanPage = DevPlanPage.getInstance();
  
  // DOM 이벤트 리스너 설정
  const fetchDataBtn = document.getElementById('fetchData');
  const performTaskBtn = document.getElementById('performTask');
  
  if (fetchDataBtn) {
    fetchDataBtn.addEventListener('click', () => {
        devPlanPage.postMessageToExtension('requestData');
    });
  }

  if (performTaskBtn) {
    performTaskBtn.addEventListener('click', () => {
      const gitInfo = document.getElementById('gitInfo');
      const branch = gitInfo?.getAttribute('data-branch') || '';
      const commit = gitInfo?.getAttribute('data-commit') || '';
      
      devPlanPage.postMessageToExtension('performTask', {
        branch,
        commit
      });
    });
  }
});
