'use client'
import { useState } from 'react'

export default function APIDocs() {
  const [activeTab, setActiveTab] = useState('overview')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://msarchive.org'
  const apiUrl = `${baseUrl}/api/supabase`

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">API Documentation</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Access MSArchive data programmatically through our REST API powered by Supabase.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'incidents', label: 'Incidents API' },
            { id: 'legislation', label: 'Legislation API' },
            { id: 'stats', label: 'Statistics API' },
            { id: 'examples', label: 'Code Examples' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">API Access</h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Our API provides read-only access to published data. All endpoints return JSON and support standard HTTP methods.
                  No authentication is required for public data access.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Base URL</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {apiUrl}
              </code>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Available Endpoints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Incidents</h3>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">GET /rest/v1/v_incidents</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access verified mass shooting incident data with filtering and pagination support.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Legislation</h3>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">GET /rest/v1/v_legislation</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access gun violence legislation data by jurisdiction and category.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Statistics</h3>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">GET /rest/v1/mv_stats_*</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pre-computed statistics and aggregated data views for analysis.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">GraphQL</h3>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">POST /graphql/v1</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Flexible GraphQL interface for complex queries and relationships.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Response Format</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`{
  "data": [...],
  "count": 150,
  "error": null
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Rate Limiting</h2>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our API implements reasonable rate limiting to ensure fair usage:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• <strong>100 requests per minute</strong> per IP address</li>
                <li>• <strong>1000 requests per hour</strong> per IP address</li>
                <li>• Large datasets may be paginated (limit 1000 records per request)</li>
                <li>• Contact us for higher limits if needed for research purposes</li>
              </ul>
            </div>
          </section>
        </div>
      )}

      {/* Incidents API Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Incidents Endpoint</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <code className="text-lg font-mono text-gray-800 dark:text-gray-200">
                GET {apiUrl}/rest/v1/v_incidents
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Returns verified mass shooting incident data. All incidents in this endpoint have been verified and published.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Query Parameters</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parameter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">state</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">string</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by state code (2 letters)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?state=eq.CA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">date</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">date</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by date (YYYY-MM-DD)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?date=gte.2024-01-01</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">location_type</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">enum</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by location type</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?location_type=eq.school</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">fatalities</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">integer</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by fatality count</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?fatalities=gte.5</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">limit</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">integer</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Limit results (max 1000)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?limit=50</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">order</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">string</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Sort results</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?order=date.desc</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Response Schema</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`{
  "id": "uuid",
  "incident_code": "string",
  "date": "2024-01-15",
  "city": "string",
  "state": "CA",
  "location_type": "school|public_space|private_residence|workplace|other",
  "fatalities": 4,
  "injuries": 12,
  "involves_children": true,
  "involves_women_and_children": false,
  "hate_crime": false,
  "hate_crime_target": "string|null",
  "context": "Brief description of incident",
  "description": "Detailed description",
  "notes": "Additional notes|null",
  "last_verified_at": "2024-01-16T10:30:00Z"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Example Requests</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Get all incidents in California</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    GET {apiUrl}/rest/v1/v_incidents?state=eq.CA
                  </code>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Get school incidents from 2024</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    GET {apiUrl}/rest/v1/v_incidents?location_type=eq.school&date=gte.2024-01-01&date=lte.2024-12-31
                  </code>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Get deadliest incidents (5+ fatalities)</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    GET {apiUrl}/rest/v1/v_incidents?fatalities=gte.5&order=fatalities.desc
                  </code>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Legislation API Tab */}
      {activeTab === 'legislation' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Legislation Endpoint</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <code className="text-lg font-mono text-gray-800 dark:text-gray-200">
                GET {apiUrl}/rest/v1/v_legislation
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Access gun violence legislation data by jurisdiction, category, and status.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Query Parameters</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parameter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">jurisdiction</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">string</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by jurisdiction (state or FEDERAL)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?jurisdiction=eq.FEDERAL</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">category</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">string</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by legislation category</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?category=eq.background_checks</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">status</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">enum</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by status</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?status=eq.enacted</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">enacted_date</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">date</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Filter by enactment date</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">?enacted_date=gte.2020-01-01</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Response Schema</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`{
  "id": "uuid",
  "title": "Background Check Enhancement Act",
  "jurisdiction": "FEDERAL",
  "category": "background_checks",
  "status": "enacted|proposed|failed",
  "summary": "Brief description of the legislation",
  "enacted_date": "2024-03-15",
  "effective_date": "2024-06-15",
  "bill_number": "HR 1234",
  "sponsor": "Rep. John Doe",
  "vote_count": "245-180",
  "key_provisions": ["Enhanced background checks", "..."],
  "last_updated": "2024-03-16T09:00:00Z"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Legislation Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• <code>background_checks</code> - Background check requirements</li>
                  <li>• <code>assault_weapons</code> - Assault weapon regulations</li>
                  <li>• <code>concealed_carry</code> - Concealed carry laws</li>
                  <li>• <code>red_flag</code> - Extreme risk protection orders</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• <code>safe_storage</code> - Safe storage requirements</li>
                  <li>• <code>waiting_periods</code> - Waiting period laws</li>
                  <li>• <code>licensing</code> - Licensing and permits</li>
                  <li>• <code>other</code> - Other gun-related legislation</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Statistics API Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Statistics Endpoints</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pre-computed statistical views for faster analysis and visualization.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Available Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Yearly Statistics</h4>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">GET /rest/v1/mv_stats_yearly</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aggregated statistics by year including incident counts, casualties, and trends.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">State Statistics</h4>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">GET /rest/v1/mv_stats_by_state</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  State-level aggregations including per-capita rates and rankings.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Deadliest Incidents</h4>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">GET /rest/v1/mv_deadliest_incidents</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Top incidents ranked by casualty count with contextual information.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Monthly Trends</h4>
                <code className="text-sm text-blue-600 dark:text-blue-400 block mb-2">GET /rest/v1/mv_monthly_trends</code>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly incident patterns and seasonal analysis data.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Example: Yearly Statistics</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                GET {apiUrl}/rest/v1/mv_stats_yearly?order=year.desc&limit=5
              </code>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`[
  {
    "year": 2024,
    "total_incidents": 156,
    "total_fatalities": 489,
    "total_injuries": 1234,
    "school_incidents": 23,
    "avg_casualties_per_incident": 11.2,
    "states_affected": 42
  },
  {
    "year": 2023,
    "total_incidents": 142,
    "total_fatalities": 445,
    "total_injuries": 1156,
    "school_incidents": 19,
    "avg_casualties_per_incident": 10.8,
    "states_affected": 39
  }
]`}
              </pre>
            </div>
          </section>
        </div>
      )}

      {/* Code Examples Tab */}
      {activeTab === 'examples' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Code Examples</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ready-to-use code snippets in popular programming languages.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">JavaScript / Node.js</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`// Fetch recent incidents
async function getRecentIncidents() {
  const response = await fetch('${apiUrl}/rest/v1/v_incidents?order=date.desc&limit=10');
  const data = await response.json();
  return data;
}

// Fetch incidents by state
async function getIncidentsByState(stateCode) {
  const response = await fetch(\`${apiUrl}/rest/v1/v_incidents?state=eq.\${stateCode}\`);
  const data = await response.json();
  return data;
}

// Fetch school incidents
async function getSchoolIncidents() {
  const response = await fetch('${apiUrl}/rest/v1/v_incidents?location_type=eq.school');
  const data = await response.json();
  return data;
}

// Usage
getRecentIncidents().then(incidents => {
  console.log(\`Found \${incidents.length} recent incidents\`);
  incidents.forEach(incident => {
    console.log(\`\${incident.date}: \${incident.city}, \${incident.state}\`);
  });
});`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Python</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`import requests
import pandas as pd

# Base URL
BASE_URL = "${apiUrl}/rest/v1"

def get_incidents(state=None, location_type=None, limit=None):
    """Fetch incidents with optional filters"""
    url = f"{BASE_URL}/v_incidents"
    params = {}
    
    if state:
        params['state'] = f'eq.{state}'
    if location_type:
        params['location_type'] = f'eq.{location_type}'
    if limit:
        params['limit'] = limit
    
    response = requests.get(url, params=params)
    return response.json()

def get_yearly_stats():
    """Fetch yearly statistics"""
    url = f"{BASE_URL}/mv_stats_yearly"
    response = requests.get(url, params={'order': 'year.desc'})
    return response.json()

# Usage examples
recent_incidents = get_incidents(limit=10)
california_incidents = get_incidents(state='CA')
school_incidents = get_incidents(location_type='school')

# Convert to pandas DataFrame for analysis
df = pd.DataFrame(recent_incidents)
print(f"Average fatalities per incident: {df['fatalities'].mean():.2f}")

# Get yearly trends
yearly_data = get_yearly_stats()
years_df = pd.DataFrame(yearly_data)
print(years_df[['year', 'total_incidents', 'total_fatalities']])`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">R</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`library(httr)
library(jsonlite)
library(dplyr)

# Base URL
base_url <- "${apiUrl}/rest/v1"

# Function to fetch incidents
get_incidents <- function(state = NULL, location_type = NULL, limit = NULL) {
  url <- paste0(base_url, "/v_incidents")
  query_params <- list()
  
  if (!is.null(state)) {
    query_params$state <- paste0("eq.", state)
  }
  if (!is.null(location_type)) {
    query_params$location_type <- paste0("eq.", location_type)
  }
  if (!is.null(limit)) {
    query_params$limit <- limit
  }
  
  response <- GET(url, query = query_params)
  content(response, "text") %>% fromJSON()
}

# Function to get yearly statistics
get_yearly_stats <- function() {
  url <- paste0(base_url, "/mv_stats_yearly")
  response <- GET(url, query = list(order = "year.desc"))
  content(response, "text") %>% fromJSON()
}

# Usage examples
recent_incidents <- get_incidents(limit = 10)
school_incidents <- get_incidents(location_type = "school")
yearly_stats <- get_yearly_stats()

# Basic analysis
cat("Total incidents loaded:", nrow(recent_incidents), "\\n")
cat("Average fatalities:", mean(recent_incidents$fatalities, na.rm = TRUE), "\\n")

# Create summary by state
state_summary <- recent_incidents %>%
  group_by(state) %>%
  summarise(
    incidents = n(),
    total_fatalities = sum(fatalities, na.rm = TRUE),
    total_injuries = sum(injuries, na.rm = TRUE)
  ) %>%
  arrange(desc(incidents))

print(state_summary)`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">curl (Command Line)</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`# Get all incidents
curl "${apiUrl}/rest/v1/v_incidents"

# Get incidents from California
curl "${apiUrl}/rest/v1/v_incidents?state=eq.CA"

# Get school incidents with casualties >= 5
curl "${apiUrl}/rest/v1/v_incidents?location_type=eq.school&fatalities=gte.5"

# Get recent incidents (last 10)
curl "${apiUrl}/rest/v1/v_incidents?order=date.desc&limit=10"

# Get yearly statistics
curl "${apiUrl}/rest/v1/mv_stats_yearly?order=year.desc"

# Pretty print JSON output (with jq)
curl "${apiUrl}/rest/v1/v_incidents?limit=5" | jq '.'`}
              </pre>
            </div>
          </section>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help or have questions about the API?
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:api@msarchive.org" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              Contact Support
            </a>
            <a href="/resources/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              Back to Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}


