import './App.css'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import {AuthGate} from './components/AuthGate'
import {Routes, Route} from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route 
        path ='/' 
        element={
          <AuthGate>
            <div>Home Page coming soon</div>
          </AuthGate>} 
        />
    </Routes>
  )
}

export default App
