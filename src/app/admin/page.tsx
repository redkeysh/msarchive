'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'

interface DashboardStats {
  publishedIncidents: number
  draftIncidents: number
  publishedLegislation: number
  draftLegislation: number
  totalAdmins: number
  pendingCorrections: number
  recentActivity: any[]
}

export default function Admin() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const sb = supabaseBrowser()
    
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) {
        loadDashboardStats()
      }
      setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session) {
        loadDashboardStats()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const sb = supabaseBrowser()
      
      // Load incidents stats
      const { data: incidents } = await sb.schema('data').from('incidents').select('is_published')
      const publishedIncidents = incidents?.filter(i => i.is_published).length || 0
      const draftIncidents = (incidents?.length || 0) - publishedIncidents

      // Load legislation stats
      const { data: legislation } = await sb.schema('data').from('legislation').select('is_published')
      const publishedLegislation = legislation?.filter(l => l.is_published).length || 0
      const draftLegislation = (legislation?.length || 0) - publishedLegislation

      // Load admin count
      const { data: admins } = await sb.from('admin_allowlist').select('email')
      const totalAdmins = admins?.length || 0

      // Load corrections count
      const { data: corrections } = await sb.schema('data').from('corrections').select('status')
      const pendingCorrections = corrections?.filter(c => c.status === 'pending').length || 0

      // Load recent activity
      const { data: recentActivity } = await sb.schema('data').from('audit_log')
        .select('*')
        .order('at', { ascending: false })
        .limit(10)

      setStats({
        publishedIncidents,
        draftIncidents,
        publishedLegislation,
        draftLegislation,
        totalAdmins,
        pendingCorrections,
        recentActivity: recentActivity || []
      })
    } catch (err) {
      console.error('Error loading dashboard stats:', err)
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
              Please sign in with an authorized admin account to access the dashboard.
            </p>
            <a 
              href="/account/login/" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Manage incidents, legislation, and system settings.
        </p>
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Signed in as:</strong> {session.user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <a href="/admin/incidents/" className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:bg-gray-750 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Incidents</h3>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Create, edit, and manage incident records</p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">CRUD Operations via Edge Functions</div>
        </a>

        <a href="/admin/legislation/" className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:bg-gray-750 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Legislation</h3>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage gun legislation database</p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">CRUD Operations via Edge Functions</div>
        </a>

        <a href="/admin/users/" className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:bg-gray-750 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Users</h3>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage admin allowlist and permissions</p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">Admin Allowlist Management</div>
        </a>

        <a href="/admin/corrections/" className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:bg-gray-750 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Corrections</h3>
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Review and manage submitted corrections</p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">Public Submissions Management</div>
        </a>

        <a href="/admin/audit/" className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:bg-gray-750 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Audit Log</h3>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">View system activity and changes</p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">Read-only Audit Trail</div>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Published Incidents:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stats?.publishedIncidents ?? '...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Draft Incidents:</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {stats?.draftIncidents ?? '...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Published Legislation:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stats?.publishedLegislation ?? '...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Draft Legislation:</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {stats?.draftLegislation ?? '...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Admin Users:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats?.totalAdmins ?? '...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending Corrections:</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {stats?.pendingCorrections ?? '...'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Live statistics from database tables
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
            <a href="/admin/audit/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              View All →
            </a>
          </div>
          
          {!stats?.recentActivity.length ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading recent changes...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.recentActivity.slice(0, 8).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.action === 'insert' ? 'bg-green-400' :
                    activity.action === 'update' ? 'bg-blue-400' :
                    activity.action === 'delete' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      <span className="capitalize">{activity.action}</span> {activity.table_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activity.actor_email || 'System'} • {new Date(activity.at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Recent administrative actions from audit log
          </p>
        </div>
      </div>

    </div>
  )
}
