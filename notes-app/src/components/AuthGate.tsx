import { supabase } from '../lib/supabase'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface AuthGateProps {
    children: React.ReactNode
}

export function AuthGate({ children }: AuthGateProps){
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        // Check if the user is authenticated
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }
        checkSession()

        // Listen for auth changes
        const { data : {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Wait for the authentication state to be determined
    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    
    // Render the children if the user is authenticated
    return <>{children}</>
}