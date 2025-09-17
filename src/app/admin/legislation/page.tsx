'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { LegislationSchema, type Legislation, LegislationCategory } from '@/types/legislation'
import { US_STATES } from '@/lib/states'

interface LegislationFormData extends Omit<Legislation, 'id' | 'law_code' | 'last_verified_at'> {
  id?: string
}

export default function AdminLegislationPage() {
  const [session, setSession] = useState<any>(null)
  const [legislation, setLegislation] = useState<Legislation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLegislation, setEditingLegislation] = useState<Legislation | null>(null)
  const [formData, setFormData] = useState<LegislationFormData>({
    date: '',
    jurisdiction: '',
    title: '',
    summary: '',
    category: 'other',
    notes: null,
    is_published: false
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const sb = supabaseBrowser()
    
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) {
        loadLegislation()
      }
      setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session) {
        loadLegislation()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadLegislation = async () => {
    try {
      const sb = supabaseBrowser()
      const { data, error } = await sb
        .schema('data')
        .from('legislation')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setLegislation(data || [])
    } catch (err) {
      console.error('Error loading legislation:', err)
      setError('Failed to load legislation')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      // Validate form data
      const validatedData = LegislationSchema.parse(formData)
      
      const method = editingLegislation ? 'PUT' : 'POST'
      const body = editingLegislation 
        ? { ...validatedData, id: editingLegislation.id }
        : validatedData

      const response = await fetch('/functions/v1/admin-legislation', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Operation failed')
      }

      setSuccess(editingLegislation ? 'Legislation updated successfully' : 'Legislation created successfully')
      setShowForm(false)
      setEditingLegislation(null)
      resetForm()
      loadLegislation()
    } catch (err) {
      console.error('Error saving legislation:', err)
      setError(err instanceof Error ? err.message : 'Failed to save legislation')
    }
  }

  const handleEdit = (law: Legislation) => {
    setEditingLegislation(law)
    setFormData({
      id: law.id,
      date: law.date,
      jurisdiction: law.jurisdiction,
      title: law.title,
      summary: law.summary,
      category: law.category,
      notes: law.notes,
      is_published: law.is_published
    })
    setShowForm(true)
  }

  const handleDelete = async (law: Legislation) => {
    if (!confirm(`Are you sure you want to delete legislation "${law.title}"?`)) {
      return
    }

    try {
      const response = await fetch('/functions/v1/admin-legislation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ id: law.id })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Delete failed')
      }

      setSuccess('Legislation deleted successfully')
      loadLegislation()
    } catch (err) {
      console.error('Error deleting legislation:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete legislation')
    }
  }

  const handlePublish = async (law: Legislation) => {
    try {
      const response = await fetch('/functions/v1/admin-legislation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          ...law, 
          is_published: !law.is_published 
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Publish failed')
      }

      setSuccess(`Legislation ${law.is_published ? 'unpublished' : 'published'} successfully`)
      loadLegislation()
    } catch (err) {
      console.error('Error publishing legislation:', err)
      setError(err instanceof Error ? err.message : 'Failed to update publish status')
    }
  }

  const resetForm = () => {
    setFormData({
      date: '',
      jurisdiction: '',
      title: '',
      summary: '',
      category: 'other',
      notes: null,
      is_published: false
    })
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

  const publishedCount = legislation.filter(l => l.is_published).length
  const draftCount = legislation.length - publishedCount
  const federalCount = legislation.filter(l => l.jurisdiction.toUpperCase() === 'FEDERAL').length
  const stateCount = legislation.length - federalCount

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manage Legislation</h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingLegislation(null)
              resetForm()
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Legislation
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800">{success}</p>
            <button 
              onClick={() => setSuccess(null)}
              className="text-green-600 hover:text-green-800 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">Total Laws</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{legislation.length}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">All records</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">Published</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{publishedCount}</div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">Live on site</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">Federal</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{federalCount}</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">National laws</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-orange-900 dark:text-orange-100">State</h3>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stateCount}</div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">State laws</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingLegislation ? 'Edit Legislation' : 'Add New Legislation'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Jurisdiction *</label>
                  <select
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Select Jurisdiction</option>
                    <option value="FEDERAL">Federal</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Full title of the legislation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="regulation">General Regulation</option>
                  <option value="rights_expansion">Rights Expansion</option>
                  <option value="background_checks">Background Checks</option>
                  <option value="assault_weapon_ban">Assault Weapon Ban</option>
                  <option value="concealed_carry">Concealed Carry</option>
                  <option value="red_flag">Red Flag Law</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Summary *</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Brief summary of what this legislation does"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value || null})}
                  className="w-full border rounded px-3 py-2 h-20"
                  placeholder="Additional notes, context, or observations"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Legislation requires verification from at least 2 government sources before publishing.
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingLegislation(null)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingLegislation ? 'Update' : 'Create'} Legislation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legislation Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Legislation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {legislation.map((law) => (
                <tr key={law.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {law.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {law.law_code || 'Draft'} • {law.date}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {law.jurisdiction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      law.category === 'regulation' ? 'bg-blue-100 text-blue-800' :
                      law.category === 'rights_expansion' ? 'bg-green-100 text-green-800' :
                      law.category === 'background_checks' ? 'bg-purple-100 text-purple-800' :
                      law.category === 'assault_weapon_ban' ? 'bg-red-100 text-red-800' :
                      law.category === 'red_flag' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {law.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      law.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {law.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(law)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePublish(law)}
                      className={`${
                        law.is_published 
                          ? 'text-yellow-600 hover:text-yellow-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {law.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(law)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {legislation.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No legislation found</p>
            <p className="text-gray-400 text-sm mt-2">Create your first legislation record to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
