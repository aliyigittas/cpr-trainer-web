import { Route, Routes } from 'react-router'
import LoginPage from './Login'
import RegisterPage from './Register';
import CPRPerformanceDashboard from './PerformanceHistory';
import ProfilePage from './Profile';
import AdminPanel from './AdminPanel';
import NotFound from './NotFound';
import Introduction from './Introduction';

function App() {  
  return (
    <Routes>
      <Route path="/" element={<Introduction />} /> {/* TODO: Simple explaination of project */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/performanceHistory/:id?" element={<CPRPerformanceDashboard />} />
      <Route path="/profile" element = {<ProfilePage/>}/>
      <Route path="/adminPanel" element={<AdminPanel />} />
      <Route path="*" element={<NotFound />} /> {/* Added NotFound route */}
    </Routes>
  );
}

export default App
