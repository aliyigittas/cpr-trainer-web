import { Route, Routes } from 'react-router'
import LoginPage from './Login'
import RegisterPage from './Register';
import CPRPerformanceDashboard from './PerformanceHistory';
import CPRPerformanceDetailPopup from './PerformanceDetails';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* TODO: Simple explaination of project */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/performanceHistory" element={<CPRPerformanceDashboard />} />
      <Route path="/performanceDetail" element={<CPRPerformanceDetailPopup performance={{
        id: 0,
        uid: 0,
        feedbackType: '',
        meanDepth: 0,
        meanFreq: 0,
        stdDepth: 0,
        stdFreq: 0,
        highDepthCount: 0,
        highFreqCount: 0,
        lowDepthCount: 0,
        lowFreqCount: 0,
        totalCompression: 0,
        score: 0,
        trainingTime: 0,
        performanceDate: ''
      }} onClose={function (): void {
        throw new Error('Function not implemented.');
      } } />} />

    </Routes>
  );
}

export default App
