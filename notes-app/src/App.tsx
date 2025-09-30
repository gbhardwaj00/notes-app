import './App.css'
import { LoginPage } from './pages/LoginPage'
import {AuthGate} from './components/AuthGate'
import {Routes, Route} from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
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
