'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { IncidentSchema, type Incident, type SuspectWithDetails, type SuspectWeapon } from '@/types/incident'
import { US_STATES } from '@/lib/states'

interface IncidentFormData extends Omit<Incident, 'id' | 'incident_code' | 'last_verified_at'> {
  id?: string
}

export default function AdminIncidentsPage() {
  const [session, setSession] = useState<any>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)
  const [showSuspectsModal, setShowSuspectsModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [suspects, setSuspects] = useState<SuspectWithDetails[]>([])
  const [suspectLoading, setSuspectLoading] = useState(false)
  const [formData, setFormData] = useState<IncidentFormData>({
    date: '',
    city: '',
    state: '',
    location_type: 'other',
    fatalities: 0,
    injuries: 0,
    involves_children: false,
    involves_women_and_children: false,
    hate_crime: false,
    hate_crime_target: null,
    context: '',
    description: '',
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
        loadIncidents()
      }
      setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session) {
        loadIncidents()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadIncidents = async () => {
    try {
      const response = await fetch('/functions/v1/admin-incidents', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load incidents')
      }

      setIncidents(result.data || [])
    } catch (err) {
      console.error('Error loading incidents:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to load incidents: ${errorMessage}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      // Validate form data
      const validatedData = IncidentSchema.parse(formData)
      
      const method = editingIncident ? 'PUT' : 'POST'
      const body = editingIncident 
        ? { ...validatedData, id: editingIncident.id }
        : validatedData

      const response = await fetch('/functions/v1/admin-incidents', {
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

      setSuccess(editingIncident ? 'Incident updated successfully' : 'Incident created successfully')
      setShowForm(false)
      setEditingIncident(null)
      resetForm()
      loadIncidents()
    } catch (err) {
      console.error('Error saving incident:', err)
      setError(err instanceof Error ? err.message : 'Failed to save incident')
    }
  }

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident)
    setFormData({
      id: incident.id,
      date: incident.date,
      city: incident.city,
      state: incident.state,
      location_type: incident.location_type,
      fatalities: incident.fatalities,
      injuries: incident.injuries,
      involves_children: incident.involves_children,
      involves_women_and_children: incident.involves_women_and_children,
      hate_crime: incident.hate_crime,
      hate_crime_target: incident.hate_crime_target,
      context: incident.context,
      description: incident.description,
      notes: incident.notes,
      is_published: incident.is_published
    })
    setShowForm(true)
  }

  const handleDelete = async (incident: Incident) => {
    if (!confirm(`Are you sure you want to delete incident ${incident.incident_code}?`)) {
      return
    }

    try {
      const response = await fetch('/functions/v1/admin-incidents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ id: incident.id })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Delete failed')
      }

      setSuccess('Incident deleted successfully')
      loadIncidents()
    } catch (err) {
      console.error('Error deleting incident:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete incident')
    }
  }

  const handlePublish = async (incident: Incident) => {
    const totalCasualties = incident.fatalities + incident.injuries
    if (totalCasualties < 4) {
      setError('Cannot publish: Incident must have ≥4 total casualties (fatalities + injuries)')
      return
    }

    try {
      const response = await fetch('/functions/v1/admin-incidents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          ...incident, 
          is_published: !incident.is_published 
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Publish failed')
      }

      setSuccess(`Incident ${incident.is_published ? 'unpublished' : 'published'} successfully`)
      loadIncidents()
    } catch (err) {
      console.error('Error publishing incident:', err)
      setError(err instanceof Error ? err.message : 'Failed to update publish status')
    }
  }

  const resetForm = () => {
    setFormData({
      date: '',
      city: '',
      state: '',
      location_type: 'other',
      fatalities: 0,
      injuries: 0,
      involves_children: false,
      involves_women_and_children: false,
      hate_crime: false,
      hate_crime_target: null,
      context: '',
      description: '',
      notes: null,
      is_published: false
    })
  }

  const loadSuspects = async (incidentId: string) => {
    setSuspectLoading(true)
    try {
      const response = await fetch(`/functions/v1/admin-suspects?incident_id=${incidentId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setSuspects(result.data || [])
      } else {
        console.error('Failed to load suspects')
        setSuspects([])
      }
    } catch (err) {
      console.error('Error loading suspects:', err)
      setSuspects([])
    } finally {
      setSuspectLoading(false)
    }
  }

  const handleManageSuspects = (incident: Incident) => {
    setSelectedIncident(incident)
    setShowSuspectsModal(true)
    loadSuspects(incident.id!)
  }

  const handleAddSuspect = async () => {
    if (!selectedIncident) return

    const newSuspect = {
      incident_id: selectedIncident.id,
      name: null,
      age: null,
      gender: 'unknown',
      race: 'Unknown',
      nationality: null,
      status: 'unknown',
      motive: null,
      notes: null,
      weapons: [],
      history: null
    }

    try {
      const response = await fetch('/functions/v1/admin-suspects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(newSuspect)
      })

      if (response.ok) {
        loadSuspects(selectedIncident.id!)
        setSuccess('Suspect added successfully')
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to add suspect')
      }
    } catch (err) {
      console.error('Error adding suspect:', err)
      setError('Failed to add suspect')
    }
  }

  const handleDeleteSuspect = async (suspectId: string) => {
    if (!confirm('Are you sure you want to delete this suspect?')) return

    try {
      const response = await fetch('/functions/v1/admin-suspects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ id: suspectId })
      })

      if (response.ok) {
        loadSuspects(selectedIncident!.id!)
        setSuccess('Suspect deleted successfully')
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to delete suspect')
      }
    } catch (err) {
      console.error('Error deleting suspect:', err)
      setError('Failed to delete suspect')
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

  const publishedCount = incidents.filter(i => i.is_published).length
  const draftCount = incidents.length - publishedCount
  const recentCount = incidents.filter(i => {
    const incidentDate = new Date(i.date)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return incidentDate >= monthAgo
  }).length

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manage Incidents</h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingIncident(null)
              resetForm()
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Incident
          </button>
        </div>
        
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">Total Incidents</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{incidents.length}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">All records</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">Published</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{publishedCount}</div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">Live on site</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-yellow-900 dark:text-yellow-100">Draft</h3>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{draftCount}</div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">Unpublished</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">Recent</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{recentCount}</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingIncident ? 'Edit Incident' : 'Add New Incident'}
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
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Select State</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location Type *</label>
                  <select
                    value={formData.location_type}
                    onChange={(e) => setFormData({...formData, location_type: e.target.value as any})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="school">School</option>
                    <option value="public_space">Public Space</option>
                    <option value="private_residence">Private Residence</option>
                    <option value="workplace">Workplace</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Fatalities</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fatalities}
                    onChange={(e) => setFormData({...formData, fatalities: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Injuries</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.injuries}
                    onChange={(e) => setFormData({...formData, injuries: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Context *</label>
                <textarea
                  value={formData.context}
                  onChange={(e) => setFormData({...formData, context: e.target.value})}
                  className="w-full border rounded px-3 py-2 h-20"
                  placeholder="Brief context of the incident"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Detailed description of the incident"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value || null})}
                  className="w-full border rounded px-3 py-2 h-20"
                  placeholder="Additional notes or observations"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.involves_children}
                    onChange={(e) => setFormData({...formData, involves_children: e.target.checked})}
                    className="mr-2"
                  />
                  Involves Children
                </label>
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.involves_women_and_children}
                    onChange={(e) => setFormData({...formData, involves_women_and_children: e.target.checked})}
                    className="mr-2"
                  />
                  Involves Women and Children
                </label>
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.hate_crime}
                    onChange={(e) => setFormData({...formData, hate_crime: e.target.checked})}
                    className="mr-2"
                  />
                  Hate Crime
                </label>
              </div>

              {formData.hate_crime && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hate Crime Target</label>
                  <input
                    type="text"
                    value={formData.hate_crime_target || ''}
                    onChange={(e) => setFormData({...formData, hate_crime_target: e.target.value || null})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Target group or demographic"
                  />
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Publishing Requirements:</strong> Incidents need ≥4 total casualties (fatalities + injuries) and ≥2 verified sources to be published.
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingIncident(null)
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
                  {editingIncident ? 'Update' : 'Create'} Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incidents Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Incident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Casualties
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
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {incident.incident_code || 'Draft'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{incident.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{incident.city}, {incident.state}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {incident.location_type.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {incident.fatalities} killed, {incident.injuries} injured
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      incident.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(incident)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleManageSuspects(incident)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Suspects
                        </button>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handlePublish(incident)}
                          className={`${
                            incident.is_published 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {incident.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(incident)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {incidents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No incidents found</p>
            <p className="text-gray-400 text-sm mt-2">Create your first incident to get started</p>
          </div>
        )}
      </div>

      {/* Suspects Management Modal */}
      {showSuspectsModal && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Manage Suspects - {selectedIncident.incident_code || 'Draft'}
              </h2>
              <button
                onClick={() => {
                  setShowSuspectsModal(false)
                  setSelectedIncident(null)
                  setSuspects([])
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Suspects</h3>
                <button
                  onClick={handleAddSuspect}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Suspect
                </button>
              </div>

              {suspectLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : suspects.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No suspects added yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click "Add Suspect" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suspects.map((suspect, index) => (
                    <div key={suspect.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Suspect #{index + 1} {suspect.suspect_code && `(${suspect.suspect_code})`}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.name || 'Unknown'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Age:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.age || 'Unknown'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Gender:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                                {suspect.gender}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Race:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.race}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                                {suspect.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Nationality:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.nationality || 'Unknown'}
                              </span>
                            </div>
                          </div>
                          {suspect.motive && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Motive:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.motive}
                              </span>
                            </div>
                          )}
                          {suspect.notes && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Notes:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.notes}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteSuspect(suspect.id!)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-4"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Weapons */}
                      {suspect.weapons && suspect.weapons.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Weapons ({suspect.weapons.length})</h5>
                          <div className="space-y-2">
                            {suspect.weapons.map((weapon) => (
                              <div key={weapon.id} className="bg-white dark:bg-gray-600 rounded p-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">{weapon.type}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Legal Purchase:</span>
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                                      {weapon.legally_purchased === null ? 'Unknown' : weapon.legally_purchased ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Source:</span>
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                                      {weapon.source || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prior History */}
                      {suspect.history && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Prior History</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Criminal Record:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.history.criminal_record === null ? 'Unknown' : suspect.history.criminal_record ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Mental Health Issues:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.history.prior_mental_health_issues === null ? 'Unknown' : suspect.history.prior_mental_health_issues ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Domestic Violence:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {suspect.history.prior_domestic_violence === null ? 'Unknown' : suspect.history.prior_domestic_violence ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowSuspectsModal(false)
                  setSelectedIncident(null)
                  setSuspects([])
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}