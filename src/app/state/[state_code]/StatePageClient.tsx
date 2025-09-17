'use client'
import { useEffect, useState } from 'react'
import { US_STATES, STATE_NAMES } from '@/lib/states'
import { listIncidents, listLegislation } from '@/lib/sb-browser'

interface StateData {
  incidents: any[]
  legislation: any[]
  stats: {
    totalIncidents: number
    totalFatalities: number
    totalInjuries: number
    schoolIncidents: number
  }
}

interface StatePageClientProps {
  stateCode: string
  stateName: string
}

export default function StatePageClient({ stateCode, stateName }: StatePageClientProps) {
  const [data, setData] = useState<StateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStateData() {
      try {
        setLoading(true)
        setError(null)

        // Load incidents for this state
        const incidentsResult = await listIncidents({ state: stateCode })
        const incidents = incidentsResult.data || []

        // Load legislation for this state
        const legislationResult = await listLegislation(stateCode.toLowerCase())
        const legislation = legislationResult.data || []

        // Calculate statistics from incidents
        const stats = {
          totalIncidents: incidents.length,
          totalFatalities: incidents.reduce((sum, inc) => sum + (inc.fatalities || 0), 0),
          totalInjuries: incidents.reduce((sum, inc) => sum + (inc.injuries || 0), 0),
          schoolIncidents: incidents.filter(inc => 
            inc.location_type === 'school' || inc.location_type === 'university'
          ).length
        }

        setData({ incidents, legislation, stats })
      } catch (err) {
        console.error('Error loading state data:', err)
        setError('Failed to load state data')
      } finally {
        setLoading(false)
      }
    }

    if (stateCode) {
      loadStateData()
    }
  }, [stateCode])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Error Loading Data</h1>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <a href="/states/" className="text-blue-600 dark:text-blue-400 hover:underline">← View All States</a>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{stateName} ({stateCode})</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Mass shooting incidents and gun legislation analysis for {stateName}.
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Total Incidents</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data?.stats.totalIncidents || 0}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Published incidents</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-semibold text-lg text-red-900 dark:text-red-100">Fatalities</h3>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{data?.stats.totalFatalities || 0}</div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-2">Lives lost</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100">Injuries</h3>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{data?.stats.totalInjuries || 0}</div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">People injured</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">School Incidents</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data?.stats.schoolIncidents || 0}</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Educational institutions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Incidents</h2>
          {data?.incidents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No incidents found for {stateName}</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {data?.incidents
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((incident) => (
                <div key={incident.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <a 
                        href={`/incident/?id=${incident.id}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {incident.incident_code}
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{incident.city} • {incident.date}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">{incident.fatalities} killed</div>
                      <div className="text-gray-600 dark:text-gray-400">{incident.injuries} injured</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{incident.context}</p>
                  <div className="flex gap-2 mt-2">
                    {incident.involves_children && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Children</span>
                    )}
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded capitalize">
                      {incident.location_type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {data?.incidents && data.incidents.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Showing 10 of {data.incidents.length} incidents</p>
            </div>
          )}
        </div>

        {/* Legislation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Gun Legislation</h2>
          {data?.legislation.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No legislation data available</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">This may indicate no published legislation or data not yet available</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {data?.legislation
                .sort((a, b) => new Date(b.date_enacted || b.date_introduced).getTime() - new Date(a.date_enacted || a.date_introduced).getTime())
                .slice(0, 10)
                .map((law) => (
                <div key={law.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{law.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {law.bill_number} • {law.date_enacted || law.date_introduced}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      law.category === 'gun_control' ? 'bg-blue-100 text-blue-800' :
                      law.category === 'rights_expansion' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {law.category?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{law.description}</p>
                </div>
              ))}
            </div>
          )}
          {data?.legislation && data.legislation.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Showing 10 of {data.legislation.length} laws</p>
            </div>
          )}
        </div>
      </div>

      {/* State Comparison */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Compare with Other States</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Compare {stateName} with other high-incident states or view comprehensive data for all states.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['CA', 'TX', 'FL', 'NY'].filter(s => s !== stateCode).slice(0, 3).map(compareState => (
              <a 
                key={compareState}
                href={`/state/${compareState.toLowerCase()}/`}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{STATE_NAMES[compareState]}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{compareState}</div>
              </a>
            ))}
            <a href="/states/" className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-center transition-colors">
              <div className="font-medium text-blue-600 dark:text-blue-400">View All States</div>
              <div className="text-sm text-blue-500 dark:text-blue-400">Compare data</div>
            </a>
          </div>
        </div>
      </div>

      {/* Additional Analysis */}
      {data?.incidents && data.incidents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Incident Analysis</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Most Common Location</h3>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 capitalize">
                  {(() => {
                    const counts = data.incidents.reduce((acc, inc) => {
                      acc[inc.location_type] = (acc[inc.location_type] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0]?.replace('_', ' ') || 'N/A'
                  })()}
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Average Casualties</h3>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {data.stats.totalIncidents > 0 ? 
                    ((data.stats.totalFatalities + data.stats.totalInjuries) / data.stats.totalIncidents).toFixed(1) : 
                    '0'
                  } per incident
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Incidents with Children</h3>
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {data.stats.totalIncidents > 0 ?
                    Math.round((data.incidents.filter(inc => inc.involves_children).length / data.incidents.length) * 100) :
                    0
                  }%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Resources */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href={`/legislation/${stateCode.toLowerCase()}/`} 
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
          >
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">📜 State Legislation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View {stateName} gun violence laws and regulations
            </p>
          </a>
          <a 
            href="/schools/" 
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
          >
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">🏫 School Incidents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter incidents by {stateName} educational institutions
            </p>
          </a>
          <a 
            href="/resources/" 
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
          >
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">🔬 Research Tools</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export data and analysis tools
            </p>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <a href="/states/" className="text-blue-600 dark:text-blue-400 hover:underline">← All States Dashboard</a>
            <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Timeline Home</a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Data updated in real-time from verified sources
          </div>
        </div>
      </div>
    </div>
  )
}
