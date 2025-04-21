import { Route, Routes } from 'react-router'
import LoginPage from './Login'
import RegisterPage from './Register';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* TODO: Simple explaination of project */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App
