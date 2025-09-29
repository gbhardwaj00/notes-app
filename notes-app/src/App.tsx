import './App.css'
import { supabase } from './lib/supabase'
import {Routes, Route} from 'react-router-dom'

function App() {

  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)
  console.log('Supabase:', supabase)

  return (
    <Routes>
      <Route path='/login' element={<div>Login Page coming soon</div>} />
      <Route path ='/' element={<div>Home Page coming soon</div>} />
    </Routes>
  )
}

export default App
