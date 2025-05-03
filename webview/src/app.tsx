import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage, { GitProvider } from './pages/homePage.tsx';
import GeneratePlanPage from './pages/GeneratePlanPage.tsx';
import ModifyPlanPage from './pages/ModifyPlanPage.tsx';
import ImplementPlanPage from './pages/ImplementPlanPage.tsx';
import PlanListPage from './pages/PlanListPage.tsx';

function App() {
  return (
    <Router>
      <GitProvider>
        <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>홈</Link>
          <Link to="/dev-plan" style={{ marginRight: '1rem' }}>개발 계획</Link>
          <Link to="/plan-list" style={{ marginRight: '1rem' }}>계획 목록</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dev-plan" element={<GeneratePlanPage />} />
          <Route path="/modify-plan" element={<ModifyPlanPage />} />
          <Route path="/implement-plan" element={<ImplementPlanPage />} />
          <Route path="/plan-list" element={<PlanListPage />} />
        </Routes>
      </GitProvider>
    </Router>
  );
}

export default App;
