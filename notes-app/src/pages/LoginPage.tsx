import { Navigate, Link} from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

export function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        // Check if the user is authenticated
        const checkSession = async () => {
            const {data: {session}} = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }
        checkSession()
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session)
        })
    
        return () => subscription.unsubscribe()
    }, [])

    // Show loading while checking
    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleLogin = async(e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password
            })

            if (error) {
                setMessage(`Error: ${error.message}`)
            } else {
                // The auth state change will trigger the redirect to the home page
            }
        } catch (error) {
            setMessage('Error: ' + error)
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        setLoading(true)
        setMessage('')
        try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider,
              options: { redirectTo: window.location.origin }
            })
            if (error) {
                setMessage(`Error: ${error.message}`)
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
            <div style={{ marginBottom: '10px' }}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          { /* OAuth Login Form */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>Or</p>
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              style={{margin: '5px', padding: '10px 20px'}}
            >
              Login with Google
            </button>
            <button
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              style={{margin: '5px', padding: '10px 20px'}}
            >
              Login with GitHub
            </button>
          </div>
          
          {message && (
            <div style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>
              {message}
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/signup">Don't have an account? Sign up</Link>
          </div>
        </div>
        
      )
}