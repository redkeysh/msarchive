'use client'
import { useEffect, useState } from 'react'
import { listIncidents } from '@/lib/sb-browser'
import { Incident } from '@/types/incident'

export default function Home() {
  const [count, setCount] = useState<number | null>(null)
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [recentLoading, setRecentLoading] = useState(true)

  useEffect(() => {
    // Fetch all incidents in a single query
    listIncidents().then(({ data, error }) => {
      if (error) {
        console.error('Error loading incidents:', error)
        setCount(0)
        setRecentIncidents([])
      } else {
        const incidents = data || []
        setCount(incidents.length)
        
        // Sort by date descending and take first 10 for recent incidents
        const sorted = incidents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setRecentIncidents(sorted.slice(0, 10))
      }
      setLoading(false)
      setRecentLoading(false)
    })
  }, [])

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <section className="flex-1">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Mass Shooting & Gun Violence Archive</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Interactive view of mass shooting incidents and gun legislation in the United States.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          This is a static application with live data from Supabase. All data is sourced from verified public records and news sources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Total Incidents</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {loading ? '...' : count?.toLocaleString() ?? '0'}
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Published incidents in database</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-lg text-green-900 dark:text-green-100">Data Sources</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">Verified</div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">All incidents require ≥2 sources</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">Updates</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Live</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Real-time data from Supabase</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Explore Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/schools/" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">School Incidents</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Filter incidents by school locations</p>
          </a>
          <a href="/legislation/" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Legislation</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Federal and state gun violence laws</p>
          </a>
          <a href="/states/" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">State Analysis</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Compare states and jurisdictions</p>
          </a>
          <a href="/resources/" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Resources</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Research tools and data exports</p>
          </a>
        </div>
      </div>
      </section>

      {/* Recent Incidents Side Panel */}
      <aside className="lg:w-80 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Incidents</h2>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : recentIncidents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent incidents available</p>
            ) : (
              recentIncidents.map((incident) => (
                <div key={incident.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {incident.city}, {incident.state}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(incident.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {incident.location_type === 'school' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          School
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{incident.fatalities} killed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{incident.injuries} injured</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {incident.context}
                  </p>
                  
                  {(incident.involves_children || incident.involves_women_and_children || incident.hate_crime) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {incident.involves_children && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                          Children Involved
                        </span>
                      )}
                      {incident.involves_women_and_children && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200">
                          Women & Children
                        </span>
                      )}
                      {incident.hate_crime && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                          Hate Crime
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {!recentLoading && recentIncidents.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a 
                href="/incident/" 
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                View All Incidents
              </a>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}