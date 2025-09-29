import { useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import {Routes, Route} from 'react-router-dom'

function App() {

  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)
  console.log('Supabase:', supabase)

  return (
    <>
    </>
  )
}

export default App
