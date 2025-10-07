import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Link, Navigate } from "react-router-dom";

export function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        // Check if the user is authenticated
        const checkSession = async () => {
            const {data: {session}} = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }
        checkSession()
    }, [])

    // Show loading while checking
    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const validatePassword = (password: string) => {
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character";
        return null;
    }

    const handlePasswordSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage(passwordError);
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                },
            });

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage("Signup successful! Please check your email for verification.");
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    const handleOAuthSignup = async (provider: 'google' | 'github') => {
        setLoading(true);
        setMessage("");

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin }
            });
            if (error) {
                setMessage(`Error: ${error.message}`);
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Sign Up</h1>
            
            {/* Password Signup Form */}
            <form onSubmit={handlePasswordSignup}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required 
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', marginTop: '10px' }}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            { /* OAuth Signup Form */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>Or</p>
                <button
                    onClick={() => handleOAuthSignup("google")}
                    disabled={loading}
                    style={{margin: '5px', padding: '10px 20px'}}
                >
                    Sign Up with Google
                </button>
                <button
                    onClick={() => handleOAuthSignup("github")}
                    disabled={loading}
                    style={{margin: '5px', padding: '10px 20px'}}
                >
                    Sign Up with GitHub
                </button>
            </div>

            {message && (
                <div style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>
                {message}
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
}