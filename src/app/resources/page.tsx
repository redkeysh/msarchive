'use client'
import { useState } from 'react'
import { listIncidents } from '@/lib/sb-browser'

export default function Resources() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const { data, error } = await listIncidents()
      
      if (error) {
        alert('Error fetching data: ' + error.message)
        return
      }

      if (!data || data.length === 0) {
        alert('No data available for export')
        return
      }

      // Convert to CSV
      const headers = [
        'ID', 'Date', 'City', 'State', 'Location Type', 
        'Fatalities', 'Injuries', 'Context', 'Description',
        'Involves Children', 'Hate Crime', 'Last Verified'
      ]
      
      const csvContent = [
        headers.join(','),
        ...data.map(incident => [
          incident.id,
          incident.date,
          `"${incident.city}"`,
          incident.state,
          incident.location_type,
          incident.fatalities,
          incident.injuries,
          `"${(incident.context || '').replace(/"/g, '""')}"`,
          `"${(incident.description || '').replace(/"/g, '""')}"`,
          incident.involves_children,
          incident.hate_crime,
          incident.last_verified_at || ''
        ].join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `msarchive_incidents_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Export error:', err)
      alert('Error exporting data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Research Resources</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Tools, documentation, and resources for researchers, journalists, and policymakers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Data Access</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Public API</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Access published data via Supabase REST API
              </p>
              <code className="text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded border border-gray-300 dark:border-gray-600">
                GET /rest/v1/v_incidents
              </code>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">CSV Export</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download complete datasets for analysis
              </p>
              <button 
                onClick={handleExportCSV}
                disabled={isExporting}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? 'Exporting...' : 'Export Incidents'}
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">GraphQL</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Flexible queries via PostgREST auto-generated API
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Documentation</h2>
          </div>
          <div className="space-y-4">
            <a href="/docs/methodology/" className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Data Methodology</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How we collect, verify, and classify incidents
              </p>
            </a>
            <a href="/docs/api/" className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">API Documentation</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete API reference and examples
              </p>
            </a>
            <a href="/docs/schema/" className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Database Schema</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Table structures and relationships
              </p>
            </a>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Research Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Timeline Analysis</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Interactive timeline with filtering and trend analysis
            </p>
            <a href="/incident/" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              View Incidents Timeline
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Geographic Mapping</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              State-by-state analysis with demographic overlays
            </p>
            <a href="/states/" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              View Geographic Analysis
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Correlation Analysis</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Compare incidents with legislation timing
            </p>
            <a href="/legislation/" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              View Legislation Analysis
            </a>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Data Quality</h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Our Standards</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Verification Process</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Minimum 2 independent sources required</li>
                <li>• Cross-reference with official reports</li>
                <li>• Fact-checking against news archives</li>
                <li>• Regular data audits and updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Quality Metrics</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Source reliability scoring</li>
                <li>• Data freshness indicators</li>
                <li>• Completeness percentages</li>
                <li>• Update frequency tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Submit Corrections</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Help us maintain data accuracy by reporting errors or suggesting improvements.
            All submissions are reviewed by our research team.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Correction Form</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Use our dedicated corrections page for a better experience.
            </p>
            <div className="space-y-3">
              <a href="/corrections/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Go to Corrections Page
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Citation Guidelines</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m0 0v16a2 2 0 01-2 2H9a2 2 0 01-2-2V4m0 0V2a1 1 0 011-1h6a1 1 0 011 1v2M9 8h6m-6 4h6m-6 4h6" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">How to Cite MSArchive</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Academic Citation (APA)</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                MSArchive. (2024). Mass Shooting Archive Database. Retrieved from https://msarchive.org
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Journalism Attribution</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-800 dark:text-gray-200">
                "According to data from MSArchive, a comprehensive database of mass shooting incidents..."
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Policy Research</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-800 dark:text-gray-200">
                Include dataset version, access date, and specific query parameters used.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-yellow-900 dark:text-yellow-100">Responsible Use</h3>
            <p className="text-yellow-800 dark:text-yellow-200 mb-2">
              This data represents real tragedies that have affected communities across the United States. 
              Please use this information responsibly and with respect for the victims and their families.
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              For media inquiries or research collaboration, please contact research@msarchive.org
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
