import React from 'react'
import { LogOut, User, Search, Home } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useOrganization } from '../hooks/useOrganization'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { userOrganization } = useOrganization()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleProfileClick = () => {
    // TODO: Navigate to profile page
    console.log('Navigate to profile page')
  }

  // Generate initials from email for profile picture placeholder
  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-inter">
      {/* Background with Green Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-24 w-96 h-96 bg-gradient-to-r from-green-300/25 to-teal-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/30 to-emerald-300/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Top Navigation Panel */}
        <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left: App Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 bg-white/20 rounded-md"></div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Rangkai</h1>
              </div>

              {/* Center: Search Bar */}
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl backdrop-blur-sm bg-white/20 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Right: User Profile and Logout */}
              <div className="flex items-center gap-3">
                {/* User Profile Box */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {/* Profile Picture Placeholder */}
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.email ? getInitials(user.email) : 'U'}
                  </div>
                  
                  {/* User Info */}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-600">
                      @{user?.email?.split('@')[0] || 'username'}
                    </p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Organization Home Page Welcome Message */}
            {userOrganization && (
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to <span className="text-emerald-600">{userOrganization.organization.name}</span> Home Page
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    You're now viewing the main dashboard for your organization
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>Organization ID: {userOrganization.organization.id}</span>
                    <span className="mx-2">•</span>
                    <span>Your Role: {userOrganization.role === 'admin' ? 'Administrator' : 'Member'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Message for users without organization */}
            {!userOrganization && (
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to <span className="text-emerald-600">Rangkai</span>
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    Your account is ready! Join an existing organization or create a new one to get started.
                  </p>
                </div>
              </div>
            )}

            {/* Main Dashboard Content - Placeholder for now */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Content</h2>
                <p className="text-gray-600">
                  Main dashboard content will be implemented here. 
                  Detailed profile information has been moved to the profile page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
