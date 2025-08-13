import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Dashboard from './components/Dashboard'
import { useAuth } from './hooks/useAuth'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-inter">
      {/* Animated Background with Green Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Primary Floating Elements */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-24 w-96 h-96 bg-gradient-to-r from-green-300/25 to-teal-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/30 to-emerald-300/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Secondary Accent Elements */}
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-lime-200/20 to-green-200/25 rounded-full blur-2xl animate-pulse delay-3000"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-r from-emerald-300/20 to-mint-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Geometric Accent Shapes */}
        <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/15 rounded-3xl rotate-45 blur-xl animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-teal-400/15 to-green-400/10 rounded-2xl rotate-12 blur-lg animate-pulse delay-2500"></div>
        
        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}
        ></div>
        
        {/* Organic Flowing Lines */}
        <div className="absolute inset-0">
          <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 1200 800" fill="none">
            <path 
              d="M0,400 Q300,200 600,400 T1200,400" 
              stroke="url(#greenGradient1)" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M0,300 Q400,100 800,300 T1200,300" 
              stroke="url(#greenGradient2)" 
              strokeWidth="1.5" 
              fill="none"
            />
            <path 
              d="M0,500 Q200,700 400,500 T800,500 T1200,500" 
              stroke="url(#greenGradient3)" 
              strokeWidth="1" 
              fill="none"
            />
            <defs>
              <linearGradient id="greenGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#059669" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#047857" stopOpacity="0.2"/>
              </linearGradient>
              <linearGradient id="greenGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.2"/>
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#059669" stopOpacity="0.1"/>
              </linearGradient>
              <linearGradient id="greenGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.15"/>
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Subtle Radial Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-emerald-50/20 to-green-100/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-inner"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your new account'}
            </p>
          </div>

          {/* Auth Forms */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Built with ❤️ using ChatAndBuild
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
