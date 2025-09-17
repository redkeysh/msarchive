'use client'
import { useEffect, useState } from 'react'
import { listLegislation } from '@/lib/sb-browser'
import { US_STATES, STATE_NAMES } from '@/lib/states'

interface LegislationStats {
  jurisdiction: string
  totalLaws: number
  gunControl: number
  rightsExpansion: number
  recentCount: number
}

export default function LegislationPage() {
  const [federalLegislation, setFederalLegislation] = useState<any[]>([])
  const [stateStats, setStateStats] = useState<LegislationStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllStates, setShowAllStates] = useState(false)

  useEffect(() => {
    async function loadLegislationData() {
      try {
        setLoading(true)
        setError(null)

        // Load federal legislation
        const federalResult = await listLegislation('federal')
        const federal = federalResult.data || []
        setFederalLegislation(federal)

        // Load statistics for all states
        const stateStatsPromises = US_STATES.map(async (state) => {
          const stateResult = await listLegislation(state.toLowerCase())
          const stateLaws = stateResult.data || []
          
          const currentYear = new Date().getFullYear()
          const recentLaws = stateLaws.filter(law => {
            const lawYear = new Date(law.date_enacted || law.date_introduced).getFullYear()
            return lawYear >= currentYear - 2 // Laws from last 2 years
          })

          return {
            jurisdiction: state,
            totalLaws: stateLaws.length,
            gunControl: stateLaws.filter(law => law.category === 'gun_control').length,
            rightsExpansion: stateLaws.filter(law => law.category === 'rights_expansion').length,
            recentCount: recentLaws.length
          }
        })

        const stats = await Promise.all(stateStatsPromises)
        setStateStats(stats.sort((a, b) => b.totalLaws - a.totalLaws))
      } catch (err) {
        console.error('Error loading legislation data:', err)
        setError('Failed to load legislation data')
      } finally {
        setLoading(false)
      }
    }

    loadLegislationData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gun Legislation</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
        <p className="text-red-600 mb-4">{error}</p>
        <a href="/" className="text-blue-600 hover:underline">← Back to Timeline</a>
      </div>
    )
  }

  const totalFederalLaws = federalLegislation.length
  const totalStateLaws = stateStats.reduce((sum, state) => sum + state.totalLaws, 0)
  const totalRecentLaws = stateStats.reduce((sum, state) => sum + state.recentCount, 0)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Gun Legislation</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Comprehensive database of federal and state gun legislation across the United States.
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Federal Laws</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalFederalLaws}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">National legislation</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="font-semibold text-lg text-green-900 dark:text-green-100">State Laws</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalStateLaws}</div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">Across all states</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">Recent Laws</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalRecentLaws}</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Last 2 years</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100">Jurisdictions</h3>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{US_STATES.length + 1}</div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">Federal + States</p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Federal Legislation */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Federal Legislation</h2>
            <a 
              href="/legislation/federal/" 
              className="text-blue-600 hover:underline text-sm"
            >
              View All →
            </a>
          </div>
          
          {federalLegislation.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No federal legislation data available</p>
          ) : (
            <div className="space-y-3">
              {federalLegislation
                .sort((a, b) => new Date(b.date_enacted || b.date_introduced).getTime() - new Date(a.date_enacted || a.date_introduced).getTime())
                .slice(0, 5)
                .map((law) => (
                <div key={law.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{law.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
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
                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{law.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legislation Categories */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Legislation Categories</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-blue-900 dark:text-blue-100">Gun Control</h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">Background checks, waiting periods, licensing</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-green-900 dark:text-green-100">Rights Expansion</h3>
              <p className="text-xs text-green-700 dark:text-green-300">Concealed carry, constitutional carry</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-red-900 dark:text-red-100">Assault Weapon Restrictions</h3>
              <p className="text-xs text-red-700 dark:text-red-300">Bans on specific firearms and accessories</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-yellow-900 dark:text-yellow-100">Red Flag Laws</h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">Extreme risk protection orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* State Legislation Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">State Legislation Overview</h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Laws
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Gun Control
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rights Expansion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Recent (2yr)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(showAllStates ? stateStats : stateStats.slice(0, 15)).map((state) => (
                  <tr key={state.jurisdiction} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {STATE_NAMES[state.jurisdiction]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{state.jurisdiction}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {state.totalLaws}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                      {state.gunControl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                      {state.rightsExpansion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 dark:text-purple-400">
                      {state.recentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a 
                        href={`/legislation/${state.jurisdiction.toLowerCase()}/`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stateStats.length > 15 && (
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {showAllStates ? `Showing all ${stateStats.length} states.` : 'Showing top 15 states by total legislation.'}
                <button 
                  onClick={() => setShowAllStates(!showAllStates)}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  {showAllStates ? 'Show top 15' : 'View all states'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <a 
            href="/legislation/federal/" 
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-center transition-colors bg-white dark:bg-gray-900"
          >
            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Federal</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{totalFederalLaws} laws</div>
          </a>
          {['CA', 'TX', 'FL', 'NY', 'IL'].map(state => {
            const stateData = stateStats.find(s => s.jurisdiction === state)
            return (
              <a 
                key={state}
                href={`/legislation/${state.toLowerCase()}/`}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-center transition-colors bg-white dark:bg-gray-900"
              >
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{STATE_NAMES[state]}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{stateData?.totalLaws || 0} laws</div>
              </a>
            )
          })}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data sourced from verified government records and legislative databases.
          <a href="/resources/" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">Learn more about our methodology.</a>
        </p>
      </div>
    </div>
  )
}
