import './App.css'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import {AuthGate} from './components/AuthGate'
import {Routes, Route} from 'react-router-dom'
import { supabase } from './lib/supabase'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route 
        path ='/' 
        element={
          <AuthGate>
            <div> 
              <h1>
                Welcome! You're logged in
              </h1>
              <button
                onClick={async () => 
                  await supabase.auth.signOut()}
                  // AuthGate will redirect to login if the user is not authenticated
                >
                Logout
              </button>
            </div>
          </AuthGate>} 
        />
    </Routes>
  )
}

export default App
