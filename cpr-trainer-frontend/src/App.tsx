
import './App.css'
import { Route, Routes } from 'react-router'
import LoginPage from './Login'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
