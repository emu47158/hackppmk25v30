import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

interface Organization {
  id: string
  name: string
  description: string
  created_at: string
  created_by: string
}

interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
  organization: Organization
}

export const useOrganization = () => {
  const [userOrganization, setUserOrganization] = useState<OrganizationMember | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchUserOrganization()
  }, [user])

  const fetchUserOrganization = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching organization:', error)
      } else {
        setUserOrganization(data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshOrganization = () => {
    setLoading(true)
    fetchUserOrganization()
  }

  return {
    userOrganization,
    loading,
    refreshOrganization,
    hasOrganization: !!userOrganization
  }
}
