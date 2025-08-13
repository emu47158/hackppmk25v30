import React from 'react'
import { ArrowLeft, User, Mail, Calendar, Shield, Building2, Users, Crown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useOrganization } from '../hooks/useOrganization'

interface ProfilePageProps {
  onBack: () => void
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user } = useAuth()
  const { userOrganization } = useOrganization()

  return (
    <div className="min-h-screen relative overflow-hidden font-inter">
      {/* Background with Green Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-24 w-96 h-96 bg-gradient-to-r from-green-300/25 to-teal-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/30 to-emerald-300/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
                <p className="text-gray-600">Manage your account and organization details</p>
              </div>
            </div>
          </div>

          {/* Profile Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-medium text-gray-800 font-mono text-sm">{user?.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-800">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Organization</h2>
              </div>
              
              {userOrganization ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Organization Name</p>
                    <p className="font-medium text-gray-800">{userOrganization.organization.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Organization ID</p>
                    <p className="font-medium text-gray-800 font-mono text-sm">{userOrganization.organization.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Your Role</p>
                    <div className="flex items-center gap-2">
                      {userOrganization.role === 'admin' ? (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Users className="w-4 h-4 text-blue-500" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userOrganization.role === 'admin' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {userOrganization.role === 'admin' ? 'Administrator' : 'Member'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium text-gray-800">
                      {new Date(userOrganization.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No organization found</p>
                  <p className="text-sm text-gray-500">You're not currently part of any organization</p>
                </div>
              )}
            </div>

            {/* Account Status Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Account Status</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.email_confirmed_at 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.email_confirmed_at ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Organization Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userOrganization 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userOrganization ? 'Member' : 'No Organization'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Sign In</span>
                  <span className="text-gray-800 font-medium">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Details Card (if user has organization) */}
          {userOrganization && userOrganization.organization.description && (
            <div className="mt-6 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">About {userOrganization.organization.name}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{userOrganization.organization.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
