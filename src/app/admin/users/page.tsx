'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'

interface AdminUser {
  email: string
  created_at: string
}

export default function AdminUsersPage() {
  const [session, setSession] = useState<any>(null)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const sb = supabaseBrowser()
    
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) {
        loadAdminUsers()
      }
      setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session) {
        loadAdminUsers()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadAdminUsers = async () => {
    try {
      const sb = supabaseBrowser()
      const { data, error } = await sb
        .from('admin_allowlist')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setAdminUsers(data || [])
    } catch (err) {
      console.error('Error loading admin users:', err)
      setError('Failed to load admin users')
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!newUserEmail.trim()) {
      setError('Email is required')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUserEmail.trim())) {
      setError('Please enter a valid email address')
      return
    }

    try {
      const response = await fetch('/functions/v1/admin-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          action: 'add', 
          email: newUserEmail.trim().toLowerCase() 
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add user')
      }

      setSuccess(`Admin access granted to ${newUserEmail}`)
      setNewUserEmail('')
      setShowAddForm(false)
      loadAdminUsers()
    } catch (err) {
      console.error('Error adding admin user:', err)
      setError(err instanceof Error ? err.message : 'Failed to add admin user')
    }
  }

  const handleRemoveUser = async (email: string) => {
    if (!confirm(`Are you sure you want to remove admin access for ${email}?`)) {
      return
    }

    // Prevent removing yourself
    if (email.toLowerCase() === session?.user?.email?.toLowerCase()) {
      setError('You cannot remove your own admin access')
      return
    }

    try {
      const response = await fetch('/functions/v1/admin-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          action: 'remove', 
          email: email 
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove user')
      }

      setSuccess(`Admin access revoked for ${email}`)
      loadAdminUsers()
    } catch (err) {
      console.error('Error removing admin user:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove admin user')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Admin Access Required</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in with an authorized admin account.
            </p>
            <a 
              href="/account/login/" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin User Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Admin User
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Manage the admin allowlist that controls who can access administrative functions.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <p className="text-green-800 dark:text-green-200">{success}</p>
            <button 
              onClick={() => setSuccess(null)}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">Total Admin Users</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{adminUsers.length}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Active admins</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">Current User</h3>
          <div className="text-lg font-bold text-green-600 dark:text-green-400 truncate">
            {session?.user?.email || 'Unknown'}
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">Signed in</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">Recent Additions</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {adminUsers.filter(user => {
              const userDate = new Date(user.created_at)
              const monthAgo = new Date()
              monthAgo.setMonth(monthAgo.getMonth() - 1)
              return userDate >= monthAgo
            }).length}
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Add User Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Admin User</h2>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="admin@example.com"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The user must sign in with this exact email address to gain admin access.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Security Note:</strong> Only add trusted users. Admin access allows full CRUD operations on all data.
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewUserEmail('')
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Admin User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Admin Access Control</h2>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>• Admin access is controlled via the <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">public.admin_allowlist</code> table</p>
          <p>• All admin operations go through Supabase Edge Functions for security</p>
          <p>• All administrative actions are logged in the audit trail</p>
          <p>• Users must sign in with the exact email address listed in the allowlist</p>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Admin Allowlist</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Users authorized to access administrative functions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Added Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {adminUsers.map((user) => {
                const isCurrentUser = user.email.toLowerCase() === session?.user?.email?.toLowerCase()
                return (
                  <tr key={user.email} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.email}
                          </div>
                          {isCurrentUser && (
                            <div className="text-xs text-blue-600 dark:text-blue-400">You</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isCurrentUser ? (
                        <span className="text-gray-400 dark:text-gray-500">Current User</span>
                      ) : (
                        <button
                          onClick={() => handleRemoveUser(user.email)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Remove Access
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {adminUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No admin users found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Add your first admin user to get started</p>
          </div>
        )}
      </div>

      {/* Footer Information */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Admin access is managed through Supabase Row Level Security (RLS) and Edge Functions.
          <br />
          Contact your system administrator if you need help with user management.
        </p>
      </div>
    </div>
  )
}
