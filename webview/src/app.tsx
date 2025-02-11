import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {} from './pages/PromptPage';
import DevPlanPage from './pages/DevPlanPage.js';
import PromptPage from "./pages/PromptPage.js"

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>홈</Link>
        <Link to="/dev-plan">개발 계획</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PromptPage />} />
        <Route path="/dev-plan" element={<DevPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
