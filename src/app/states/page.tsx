'use client'
import { useEffect, useState } from 'react'
import { listIncidents } from '@/lib/sb-browser'
import { US_STATES, STATE_NAMES } from '@/lib/states'

interface StateStats {
  state: string
  totalIncidents: number
  totalFatalities: number
  totalInjuries: number
  schoolIncidents: number
}

export default function StatesPage() {
  const [stateStats, setStateStats] = useState<StateStats[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'incidents' | 'fatalities' | 'alpha'>('incidents')

  useEffect(() => {
    // Load all incidents and calculate stats by state
    listIncidents().then(({ data, error }) => {
      if (error) {
        console.error('Error loading incidents:', error)
        setStateStats([])
      } else {
        const stateCounts: Record<string, StateStats> = {}
        
        // Initialize all states
        US_STATES.forEach(state => {
          stateCounts[state] = {
            state,
            totalIncidents: 0,
            totalFatalities: 0,
            totalInjuries: 0,
            schoolIncidents: 0
          }
        })

        // Count incidents by state
        data?.forEach(incident => {
          const state = incident.state?.toUpperCase()
          if (state && stateCounts[state]) {
            stateCounts[state].totalIncidents++
            stateCounts[state].totalFatalities += incident.fatalities || 0
            stateCounts[state].totalInjuries += incident.injuries || 0
            if (incident.location_type === 'school' || incident.location_type === 'university') {
              stateCounts[state].schoolIncidents++
            }
          }
        })

        setStateStats(Object.values(stateCounts))
      }
      setLoading(false)
    })
  }, [])

  const sortedStates = stateStats.sort((a, b) => {
    switch (sortBy) {
      case 'fatalities':
        return b.totalFatalities - a.totalFatalities
      case 'alpha':
        return STATE_NAMES[a.state].localeCompare(STATE_NAMES[b.state])
      default:
        return b.totalIncidents - a.totalIncidents
    }
  })

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">States Dashboard</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">States Dashboard</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Compare mass shooting incidents and statistics across all US states and territories.
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Total States</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{US_STATES.length}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Including DC</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-semibold text-lg text-red-900 dark:text-red-100">Total Incidents</h3>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {stateStats.reduce((sum, state) => sum + state.totalIncidents, 0).toLocaleString()}
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-2">Across all states</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100">Total Fatalities</h3>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stateStats.reduce((sum, state) => sum + state.totalFatalities, 0).toLocaleString()}
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">Lives lost</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">School Incidents</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stateStats.reduce((sum, state) => sum + state.schoolIncidents, 0).toLocaleString()}
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Educational institutions</p>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <span className="font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          <button
            onClick={() => setSortBy('incidents')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'incidents' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => setSortBy('fatalities')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'fatalities' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Fatalities
          </button>
          <button
            onClick={() => setSortBy('alpha')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'alpha' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Alphabetical
          </button>
        </div>
      </div>

      {/* States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedStates.map((state) => (
          <a
            key={state.state}
            href={`/state/${state.state.toLowerCase()}/`}
            className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{STATE_NAMES[state.state]}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{state.state}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{state.totalIncidents}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">incidents</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-red-600 dark:text-red-400">{state.totalFatalities}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">fatalities</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600 dark:text-orange-400">{state.totalInjuries}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">injuries</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600 dark:text-purple-400">{state.schoolIncidents}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">schools</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click on any state to view detailed analysis and incident data.
        </p>
      </div>
    </div>
  )
}
