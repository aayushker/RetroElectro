import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import ComparisonPage from './pages/ComparisonPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
