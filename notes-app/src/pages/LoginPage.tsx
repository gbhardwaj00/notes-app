import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

export function LoginPage(){
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const checkSession = async () => {
            const {data: {session}} = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }
        checkSession()
    }, [])

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (isAuthenticated) {
        return <Navigate to="/" />
    }

    const handleLogin = async(e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await supabase.auth.signInWithOtp({ 
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/`
                }
            })
            if (error) {
                setMessage(`Error: ${error.message}`)
            } else {
                setMessage('Check your email for a login link')
            }
        } catch (error) {
            setMessage('Error: ' + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '10px' }}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
          {message && (
            <div style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>
              {message}
            </div>
          )}
        </div>
      )
}