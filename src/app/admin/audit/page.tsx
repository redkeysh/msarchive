'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'

interface AuditLogEntry {
  id: number
  table_name: string
  row_id: string
  action: string
  actor_email: string
  at: string
  diff: any
}

export default function AdminAuditPage() {
  const [session, setSession] = useState<any>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterTable, setFilterTable] = useState<string>('all')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterActor, setFilterActor] = useState<string>('all')

  useEffect(() => {
    const sb = supabaseBrowser()
    
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) {
        loadAuditLogs()
      }
      setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session) {
        loadAuditLogs()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadAuditLogs = async () => {
    try {
      const sb = supabaseBrowser()
      const { data, error } = await sb
        .schema('data')
        .from('audit_log')
        .select('*')
        .order('at', { ascending: false })
        .limit(500) // Limit to recent entries for performance
      
      if (error) throw error
      setAuditLogs(data || [])
    } catch (err) {
      console.error('Error loading audit logs:', err)
      setError('Failed to load audit logs')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    if (filterTable !== 'all' && log.table_name !== filterTable) return false
    if (filterAction !== 'all' && log.action !== filterAction) return false
    if (filterActor !== 'all' && log.actor_email !== filterActor) return false
    return true
  })

  // Get unique values for filters
  const uniqueTables = [...new Set(auditLogs.map(log => log.table_name))].sort()
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))].sort()
  const uniqueActors = [...new Set(auditLogs.map(log => log.actor_email).filter(Boolean))].sort()

  const formatDiff = (diff: any) => {
    if (!diff) return null
    try {
      return JSON.stringify(diff, null, 2)
    } catch {
      return String(diff)
    }
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'insert': return 'bg-green-100 text-green-800'
      case 'update': return 'bg-blue-100 text-blue-800'
      case 'delete': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTableColor = (table: string) => {
    switch (table) {
      case 'incidents': return 'bg-red-50 text-red-700'
      case 'legislation': return 'bg-blue-50 text-blue-700'
      case 'admin_allowlist': return 'bg-purple-50 text-purple-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Audit Log</h1>
        <p className="text-gray-600 mb-4">
          Complete trail of all administrative actions and data changes.
        </p>

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
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Total Actions</h3>
          <div className="text-3xl font-bold text-blue-600">{auditLogs.length}</div>
          <p className="text-sm text-gray-600 mt-2">All recorded actions</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Inserts</h3>
          <div className="text-3xl font-bold text-green-600">
            {auditLogs.filter(log => log.action === 'insert').length}
          </div>
          <p className="text-sm text-gray-600 mt-2">Records created</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Updates</h3>
          <div className="text-3xl font-bold text-blue-600">
            {auditLogs.filter(log => log.action === 'update').length}
          </div>
          <p className="text-sm text-gray-600 mt-2">Records modified</p>
        </div>
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Deletes</h3>
          <div className="text-3xl font-bold text-red-600">
            {auditLogs.filter(log => log.action === 'delete').length}
          </div>
          <p className="text-sm text-gray-600 mt-2">Records removed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Table</label>
            <select
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Tables</option>
              {uniqueTables.map(table => (
                <option key={table} value={table}>
                  {table} ({auditLogs.filter(log => log.table_name === table).length})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Action</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {action} ({auditLogs.filter(log => log.action === action).length})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Actor</label>
            <select
              value={filterActor}
              onChange={(e) => setFilterActor(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Users</option>
              {uniqueActors.map(actor => (
                <option key={actor} value={actor}>
                  {actor} ({auditLogs.filter(log => log.actor_email === actor).length})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {(filterTable !== 'all' || filterAction !== 'all' || filterActor !== 'all') && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => {
                setFilterTable('all')
                setFilterAction('all')
                setFilterActor('all')
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear all filters
            </button>
            <span className="text-sm text-gray-500 ml-4">
              Showing {filteredLogs.length} of {auditLogs.length} entries
            </span>
          </div>
        )}
      </div>

      {/* Audit Log Entries */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No audit log entries found</p>
            <p className="text-gray-400 text-sm mt-2">
              {auditLogs.length === 0 
                ? 'No administrative actions have been recorded yet'
                : 'Try adjusting your filters to see more entries'
              }
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                    {log.action.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getTableColor(log.table_name)}`}>
                    {log.table_name}
                  </span>
                  {log.row_id && (
                    <span className="text-xs text-gray-500 font-mono">
                      ID: {log.row_id.slice(0, 8)}...
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {log.actor_email || 'System'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.at).toLocaleString()}
                  </div>
                </div>
              </div>

              {log.diff && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Changes:</h4>
                  <div className="bg-gray-50 rounded p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                      {formatDiff(log.diff)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Timestamp:</span> {new Date(log.at).toISOString()}
                  </div>
                  <div>
                    <span className="font-medium">Log ID:</span> {log.id}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">About Audit Logging</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• All administrative actions are automatically logged for accountability</p>
          <p>• Logs include the actor (user), timestamp, table affected, and changes made</p>
          <p>• Audit logs are immutable and cannot be modified or deleted</p>
          <p>• Showing the most recent 500 entries for performance</p>
        </div>
      </div>
    </div>
  )
}
