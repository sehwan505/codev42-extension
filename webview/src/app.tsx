import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GeneratePlanPage from './pages/GeneratePlanPage.tsx';
import ModifyPlanPage from './pages/ModifyPlanPage.tsx';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
        {/* <Link to="/" style={{ marginRight: '1rem' }}>홈</Link> */}
        <Link to="/dev-plan">개발 계획</Link>
        <Link to="/modify-plan">개발 계획 수정</Link>
      </nav>
      <Routes>
        {/* <Route path="/" element={<PromptPage />} /> */}
        <Route path="/dev-plan" element={<GeneratePlanPage />} />
        <Route path="/modify-plan" element={<ModifyPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
