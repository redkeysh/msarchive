'use client'
import { useEffect, useState } from 'react'
import { listLegislation } from '@/lib/sb-browser'
import { US_STATES, STATE_NAMES } from '@/lib/states'

interface LegislationPageClientProps {
  jurisdiction: string
  displayName: string
  isFederal: boolean
}

export default function LegislationPageClient({ jurisdiction, displayName, isFederal }: LegislationPageClientProps) {
  const [legislation, setLegislation] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'category' | 'title'>('date')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    async function loadLegislation() {
      try {
        setLoading(true)
        setError(null)

        const result = await listLegislation(isFederal ? 'federal' : jurisdiction.toLowerCase())
        setLegislation(result.data || [])
      } catch (err) {
        console.error('Error loading legislation:', err)
        setError('Failed to load legislation data')
      } finally {
        setLoading(false)
      }
    }

    loadLegislation()
  }, [jurisdiction, isFederal])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
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
        <a href="/legislation/" className="text-blue-600 dark:text-blue-400 hover:underline">← View All Legislation</a>
      </div>
    )
  }

  // Filter and sort legislation
  const filteredLegislation = legislation.filter(law => 
    filterCategory === 'all' || law.category === filterCategory
  )

  const sortedLegislation = filteredLegislation.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'category':
        return (a.category || '').localeCompare(b.category || '')
      default:
        return new Date(b.date_enacted || b.date_introduced).getTime() - 
               new Date(a.date_enacted || a.date_introduced).getTime()
    }
  })

  // Get category statistics
  const categoryStats = legislation.reduce((acc, law) => {
    const category = law.category || 'other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories = Object.keys(categoryStats).sort()
  const recentLaws = legislation.filter(law => {
    const lawYear = new Date(law.date_enacted || law.date_introduced).getFullYear()
    return lawYear >= new Date().getFullYear() - 2
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {displayName} US Gun Legislation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {isFederal 
            ? 'Federal laws and regulations related to gun in the United States.'
            : `State-level gun legislation for ${displayName}.`
          }
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Total Laws</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{legislation.length}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Published legislation</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="font-semibold text-lg text-green-900 dark:text-green-100">Gun Control</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {categoryStats.gun_control || 0}
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">Restrictive laws</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100">Rights Expansion</h3>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {categoryStats.rights_expansion || 0}
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">Permissive laws</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">Recent (2yr)</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{recentLaws.length}</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Recently enacted</p>
        </div>
      </div>

      {/* Legislation Categories Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Legislation Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Background Checks ({categoryStats.background_check || 0})</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Laws requiring background checks for gun purchases</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="font-medium mb-2 text-red-900 dark:text-red-100">Assault Weapon Restrictions ({categoryStats.assault_weapon || 0})</h3>
            <p className="text-sm text-red-700 dark:text-red-300">Restrictions on assault weapons and high-capacity magazines</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-medium mb-2 text-yellow-900 dark:text-yellow-100">Red Flag Laws ({categoryStats.red_flag || 0})</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Extreme risk protection orders</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-medium mb-2 text-green-900 dark:text-green-100">Concealed Carry ({categoryStats.concealed_carry || 0})</h3>
            <p className="text-sm text-green-700 dark:text-green-300">Laws governing concealed carry permits</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h3 className="font-medium mb-2 text-orange-900 dark:text-orange-100">Rights Expansion ({categoryStats.rights_expansion || 0})</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">Laws expanding gun ownership rights</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Other ({categoryStats.other || 0})</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">General regulatory measures</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ')} ({categoryStats[category]})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'date' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setSortBy('category')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'category' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Category
            </button>
            <button
              onClick={() => setSortBy('title')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'title' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Title
            </button>
          </div>
        </div>
      </div>

      {/* Legislation List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {filterCategory === 'all' ? 'All Legislation' : `${filterCategory.replace('_', ' ')} Laws`}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {sortedLegislation.length} of {legislation.length} laws
          </span>
        </div>

        {sortedLegislation.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              {filterCategory === 'all' 
                ? `No legislation found for ${displayName}` 
                : `No ${filterCategory.replace('_', ' ')} legislation found`
              }
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              This may indicate no published legislation or data not yet available
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLegislation.map((law) => (
              <div key={law.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{law.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>{law.bill_number}</span>
                      <span>•</span>
                      <span>{law.date_enacted || law.date_introduced}</span>
                      {law.sponsor && (
                        <>
                          <span>•</span>
                          <span>Sponsored by {law.sponsor}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{law.description}</p>
                    {law.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{law.summary}</p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      law.category === 'gun_control' ? 'bg-blue-100 text-blue-800' :
                      law.category === 'rights_expansion' ? 'bg-green-100 text-green-800' :
                      law.category === 'assault_weapon' ? 'bg-red-100 text-red-800' :
                      law.category === 'red_flag' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {law.category?.replace('_', ' ') || 'other'}
                    </span>
                    {law.status && (
                      <span className={`px-3 py-1 rounded text-xs ${
                        law.status === 'enacted' ? 'bg-green-100 text-green-800' :
                        law.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {law.status}
                      </span>
                    )}
                  </div>
                </div>
                
                {law.url && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <a 
                      href={law.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View Full Text →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <a href="/legislation/" className="text-blue-600 dark:text-blue-400 hover:underline">← All Legislation</a>
            {!isFederal && (
              <a href="/legislation/federal/" className="text-blue-600 dark:text-blue-400 hover:underline">Federal Laws</a>
            )}
            <a href="/states/" className="text-blue-600 dark:text-blue-400 hover:underline">State Analysis</a>
            <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Timeline Home</a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Data sourced from verified government records
          </div>
        </div>
      </div>
    </div>
  )
}
