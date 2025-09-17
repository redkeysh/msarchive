'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'

interface Correction {
  id: number
  incident_id: string | null
  legislation_id: string | null
  correction_type: 'factual_error' | 'missing_info' | 'suggestion'
  description: string
  suggested_correction: string | null
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  submitted_by: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  notes: string | null
  created_at: string
  incidents?: {
    incident_code: string
    date: string
    city: string
    state: string
  } | null
  legislation?: {
    law_code: string
    title: string
    jurisdiction: string
  } | null
}

export default function AdminCorrectionsPage() {
  const [session, setSession] = useState<any>(null)
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const sb = supabaseBrowser()
    
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) {
        loadCorrections()
      }
      setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session) {
        loadCorrections()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadCorrections = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterType !== 'all') params.set('type', filterType)
      params.set('limit', '200')

      const response = await fetch(`/functions/v1/admin-corrections?${params}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load corrections')
      }

      setCorrections(result.data || [])
    } catch (err) {
      console.error('Error loading corrections:', err)
      setError('Failed to load corrections')
    }
  }

  useEffect(() => {
    if (session) {
      loadCorrections()
    }
  }, [filterStatus, filterType, session])

  const handleStatusUpdate = async (correctionId: number, newStatus: string) => {
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/functions/v1/admin-corrections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          id: correctionId,
          status: newStatus,
          notes: reviewNotes.trim() || null,
          reviewed_by: session?.user?.email
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update status')
      }

      setSuccess(`Correction marked as ${newStatus}`)
      setShowModal(false)
      setSelectedCorrection(null)
      setReviewNotes('')
      loadCorrections()
    } catch (err) {
      console.error('Error updating correction:', err)
      setError(err instanceof Error ? err.message : 'Failed to update correction')
    }
  }

  const handleDelete = async (correctionId: number) => {
    if (!confirm('Are you sure you want to permanently delete this correction? This action cannot be undone.')) {
      return
    }

    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/functions/v1/admin-corrections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ id: correctionId })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete correction')
      }

      setSuccess('Correction deleted successfully')
      loadCorrections()
    } catch (err) {
      console.error('Error deleting correction:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete correction')
    }
  }

  const openReviewModal = (correction: Correction, action: string) => {
    setSelectedCorrection(correction)
    setReviewNotes(correction.notes || '')
    setShowModal(true)
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
          <div className="bg-white rounded-lg border p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">
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

  // Calculate statistics
  const totalCorrections = corrections.length
  const pendingCount = corrections.filter(c => c.status === 'pending').length
  const reviewedCount = corrections.filter(c => c.status === 'reviewed').length
  const acceptedCount = corrections.filter(c => c.status === 'accepted').length
  const rejectedCount = corrections.filter(c => c.status === 'rejected').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      case 'reviewed': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      case 'accepted': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      case 'rejected': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'factual_error': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      case 'missing_info': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
      case 'suggestion': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Corrections Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Review and manage submitted corrections from the public.
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">Total</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalCorrections}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">All corrections</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-yellow-900 dark:text-yellow-100">Pending</h3>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">Needs review</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">Reviewed</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{reviewedCount}</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Under review</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">Accepted</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{acceptedCount}</div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">Implemented</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2 text-red-900 dark:text-red-100">Rejected</h3>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-2">Not applicable</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Statuses ({totalCorrections})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="reviewed">Reviewed ({reviewedCount})</option>
              <option value="accepted">Accepted ({acceptedCount})</option>
              <option value="rejected">Rejected ({rejectedCount})</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Types</option>
              <option value="factual_error">Factual Error</option>
              <option value="missing_info">Missing Information</option>
              <option value="suggestion">General Suggestion</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedCorrection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Review Correction</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-medium mb-2">Original Submission:</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedCorrection.description}</p>
              </div>
              
              {selectedCorrection.suggested_correction && (
                <div>
                  <h3 className="font-medium mb-2">Suggested Correction:</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedCorrection.suggested_correction}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Add notes about your review decision..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleStatusUpdate(selectedCorrection.id, 'reviewed')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Mark as Reviewed
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCorrection.id, 'accepted')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCorrection.id, 'rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedCorrection(null)
                  setReviewNotes('')
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corrections List */}
      <div className="space-y-4">
        {corrections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No corrections found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {filterStatus !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your filters to see more entries'
                : 'No corrections have been submitted yet'
              }
            </p>
          </div>
        ) : (
          corrections.map((correction) => (
            <div key={correction.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(correction.status)}`}>
                    {correction.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getTypeColor(correction.correction_type)}`}>
                    {correction.correction_type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {correction.id}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(correction.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {correction.submitted_by || 'Anonymous'}
                  </div>
                </div>
              </div>

              {/* Related Content */}
              {(correction.incidents || correction.legislation) && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <h4 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">Related to:</h4>
                  {correction.incidents && (
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      📊 Incident: {correction.incidents.incident_code} - {correction.incidents.city}, {correction.incidents.state} ({correction.incidents.date})
                    </p>
                  )}
                  {correction.legislation && (
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      📜 Legislation: {correction.legislation.law_code} - {correction.legislation.title} ({correction.legislation.jurisdiction})
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Description:</h4>
                <p className="text-gray-700">{correction.description}</p>
              </div>

              {/* Suggested Correction */}
              {correction.suggested_correction && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Suggested Correction:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{correction.suggested_correction}</p>
                </div>
              )}

              {/* Review Information */}
              {correction.reviewed_at && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm mb-2">Review Information:</h4>
                  <div className="text-sm text-gray-600">
                    <p>Reviewed by: {correction.reviewed_by || 'Unknown'}</p>
                    <p>Reviewed at: {new Date(correction.reviewed_at).toLocaleString()}</p>
                    {correction.notes && (
                      <p className="mt-2">Notes: {correction.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {correction.status === 'pending' && (
                  <>
                    <button
                      onClick={() => openReviewModal(correction, 'review')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => openReviewModal(correction, 'accept')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => openReviewModal(correction, 'reject')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {correction.status !== 'pending' && (
                  <button
                    onClick={() => openReviewModal(correction, 'update')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                )}

                <button
                  onClick={() => handleDelete(correction.id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Correction Management Workflow</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• <strong>Pending:</strong> Newly submitted corrections awaiting initial review</p>
          <p>• <strong>Reviewed:</strong> Corrections that have been examined but need further action</p>
          <p>• <strong>Accepted:</strong> Valid corrections that have been or will be implemented</p>
          <p>• <strong>Rejected:</strong> Corrections that are not applicable or accurate</p>
          <p>• All status changes are logged in the audit trail for accountability</p>
        </div>
      </div>
    </div>
  )
}
