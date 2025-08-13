import React, { useState } from 'react'
import { Building2, Users, Plus, Search, ArrowRight, AlertCircle, Check, Crown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface OrganizationSetupProps {
  onComplete: () => void
}

const OrganizationSetup: React.FC<OrganizationSetupProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'choose' | 'join' | 'create'>('choose')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()

  // Join Organization State
  const [organizationId, setOrganizationId] = useState('')
  const [organizationInfo, setOrganizationInfo] = useState<any>(null)

  // Create Organization State
  const [newOrgData, setNewOrgData] = useState({
    id: '',
    name: '',
    description: ''
  })

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // First, check if organization exists
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single()

      if (orgError || !org) {
        setError('Organization not found. Please check the ID and try again.')
        setIsLoading(false)
        return
      }

      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('user_id', user?.id)
        .single()

      if (existingMember) {
        setError('You are already a member of this organization.')
        setIsLoading(false)
        return
      }

      // Join the organization
      const { error: joinError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organizationId,
          user_id: user?.id,
          role: 'member'
        })

      if (joinError) {
        console.error('Join error:', joinError)
        setError('Failed to join organization. Please try again.')
      } else {
        setSuccess(`Successfully joined ${org.name}!`)
        setTimeout(() => onComplete(), 2000)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Creating organization with data:', newOrgData)
      console.log('User ID:', user?.id)

      // Validate organization ID format
      const orgIdRegex = /^[a-z0-9-]+$/
      if (!orgIdRegex.test(newOrgData.id)) {
        setError('Organization ID can only contain lowercase letters, numbers, and hyphens.')
        setIsLoading(false)
        return
      }

      if (newOrgData.id.length < 3 || newOrgData.id.length > 50) {
        setError('Organization ID must be between 3 and 50 characters.')
        setIsLoading(false)
        return
      }

      // Check if organization ID already exists
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', newOrgData.id)
        .single()

      if (existingOrg) {
        setError('Organization ID already exists. Please choose a different ID.')
        setIsLoading(false)
        return
      }

      // Create the organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          id: newOrgData.id,
          name: newOrgData.name,
          description: newOrgData.description || null,
          created_by: user?.id
        })
        .select()
        .single()

      if (orgError) {
        console.error('Organization creation error:', orgError)
        if (orgError.code === '23505') {
          setError('Organization ID already exists. Please choose a different ID.')
        } else if (orgError.code === '23514') {
          setError('Invalid organization ID format. Use only lowercase letters, numbers, and hyphens.')
        } else {
          setError(`Failed to create organization: ${orgError.message}`)
        }
        setIsLoading(false)
        return
      }

      console.log('Organization created:', org)

      // Add creator as admin
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user?.id,
          role: 'admin'
        })

      if (memberError) {
        console.error('Member creation error:', memberError)
        setError('Organization created but failed to add you as admin. Please contact support.')
      } else {
        setSuccess(`Successfully created ${org.name}!`)
        setTimeout(() => onComplete(), 2000)
      }
    } catch (err) {
      console.error('Unexpected error during organization creation:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const searchOrganization = async () => {
    if (!organizationId.trim()) return

    setIsLoading(true)
    try {
      const { data: org, error } = await supabase
        .from('organizations')
        .select('id, name, description')
        .eq('id', organizationId)
        .single()

      if (error || !org) {
        setOrganizationInfo(null)
        setError('Organization not found')
      } else {
        setOrganizationInfo(org)
        setError(null)
      }
    } catch (err) {
      setOrganizationInfo(null)
      setError('Failed to search organization')
    } finally {
      setIsLoading(false)
    }
  }

  const formatOrganizationId = (value: string) => {
    // Convert to lowercase and replace spaces with hyphens
    return value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/\s+/g, '-')
  }

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden font-inter">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-32 right-24 w-96 h-96 bg-gradient-to-r from-green-300/25 to-teal-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-4">{success}</p>
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-inter">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-24 w-96 h-96 bg-gradient-to-r from-green-300/25 to-teal-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/30 to-emerald-300/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg mb-4">
              <Building2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Organization Setup</h1>
            <p className="text-gray-600">Join an existing organization or create a new one</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-200/50 text-red-700 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {mode === 'choose' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Choose Your Path</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Join Organization Card */}
                <button
                  onClick={() => setMode('join')}
                  className="group p-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:border-emerald-400/50 hover:bg-white/30 transition-all duration-200 text-left"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Join Organization</h3>
                  <p className="text-gray-600 mb-4">Enter an organization ID to join an existing team</p>
                  <div className="flex items-center text-blue-600 font-medium">
                    Join Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Create Organization Card */}
                <button
                  onClick={() => setMode('create')}
                  className="group p-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:border-emerald-400/50 hover:bg-white/30 transition-all duration-200 text-left"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Organization</h3>
                  <p className="text-gray-600 mb-4">Start your own organization and invite team members</p>
                  <div className="flex items-center text-emerald-600 font-medium">
                    Create Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {mode === 'join' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setMode('choose')}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800">Join Organization</h2>
              </div>

              <form onSubmit={handleJoinOrganization} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="orgId" className="text-sm font-medium text-gray-700">
                    Organization ID
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="orgId"
                        type="text"
                        value={organizationId}
                        onChange={(e) => setOrganizationId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                        placeholder="Enter organization ID"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={searchOrganization}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {organizationInfo && (
                  <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{organizationInfo.name}</h3>
                        <p className="text-sm text-gray-600">ID: {organizationInfo.id}</p>
                      </div>
                    </div>
                    {organizationInfo.description && (
                      <p className="text-gray-700">{organizationInfo.description}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !organizationId.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Join Organization
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {mode === 'create' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setMode('choose')}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800">Create Organization</h2>
              </div>

              <form onSubmit={handleCreateOrganization} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="orgId" className="text-sm font-medium text-gray-700">
                    Organization ID *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="orgId"
                      type="text"
                      value={newOrgData.id}
                      onChange={(e) => setNewOrgData(prev => ({ ...prev, id: formatOrganizationId(e.target.value) }))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                      placeholder="acme-corp"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">Choose a unique ID for your organization (e.g., acme-corp, tech-startup)</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="orgName" className="text-sm font-medium text-gray-700">
                    Organization Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="orgName"
                      type="text"
                      value={newOrgData.name}
                      onChange={(e) => setNewOrgData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="orgDescription" className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="orgDescription"
                    value={newOrgData.description}
                    onChange={(e) => setNewOrgData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                    placeholder="Brief description of your organization..."
                  />
                </div>

                <div className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-medium text-emerald-800">Admin Privileges</h4>
                      <p className="text-sm text-emerald-700">As the creator, you'll be the organization admin with full management rights.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !newOrgData.name.trim() || !newOrgData.id.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Create Organization
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrganizationSetup
