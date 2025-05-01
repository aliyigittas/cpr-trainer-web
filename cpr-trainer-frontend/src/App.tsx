import { Route, Routes } from 'react-router'
import LoginPage from './Login'
import RegisterPage from './Register';
import CPRPerformanceDashboard from './PerformanceHistory';
import ProfilePage from './Profile';

function App() {  
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* TODO: Simple explaination of project */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/performanceHistory/:id?" element={<CPRPerformanceDashboard />} />
      <Route path="/profile" element = {<ProfilePage/>}/>
    </Routes>
  );
}

export default App
