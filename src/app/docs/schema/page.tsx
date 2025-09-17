export default function SchemaDocs() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Database Schema</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Complete documentation of MSArchive database structure, relationships, and data types.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Schema Overview</h3>
            <p className="text-blue-800 dark:text-blue-200">
              MSArchive uses PostgreSQL with Supabase. The schema is organized into two main schemas: 
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">public</code> for authentication and admin functions, 
              and <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">data</code> for incident and legislation storage.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Core Tables Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Core Data Tables</h2>
          
          {/* Incidents Table */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">data.incidents</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Core incident data</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Constraints</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">id</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">UUID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">PRIMARY KEY, NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Unique incident identifier</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">incident_code</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">UNIQUE</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Human-readable incident code</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">date</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DATE</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Date of incident occurrence</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">city</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">City where incident occurred</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">state</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">CHAR(2)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Two-letter state code</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">location_type</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">ENUM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">school, public_space, private_residence, workplace, other</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">fatalities</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">INTEGER</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DEFAULT 0, {'>'}= 0</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Number of deaths</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">injuries</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">INTEGER</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DEFAULT 0, {'>'}= 0</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Number of injuries</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">involves_children</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">BOOLEAN</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DEFAULT FALSE</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Children under 18 involved</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">involves_women_and_children</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">BOOLEAN</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DEFAULT FALSE</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Domestic violence indicator</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">hate_crime</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">BOOLEAN</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DEFAULT FALSE</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Hate crime classification</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">hate_crime_target</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Target group if hate crime</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">context</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Brief incident context</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">description</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Detailed description</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">notes</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Additional notes</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">is_published</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">BOOLEAN</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DEFAULT FALSE</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Publication status</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">last_verified_at</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TIMESTAMPTZ</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Last verification timestamp</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Legislation Table */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">data.legislation</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Gun violence legislation data</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Constraints</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">id</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">UUID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">PRIMARY KEY, NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Unique legislation identifier</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">title</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Legislation title</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">jurisdiction</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">State code or 'FEDERAL'</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">category</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Legislation category</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">status</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">ENUM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">enacted, proposed, failed</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">summary</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NOT NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Brief summary</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">enacted_date</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DATE</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Date enacted (if applicable)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">effective_date</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DATE</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">NULL</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Date effective</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">is_published</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">BOOLEAN</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">DEFAULT FALSE</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Publication status</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting Tables */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Supporting Tables</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">data.suspects</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Suspect information linked to incidents via foreign key relationship.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• <code>incident_id</code> → incidents.id</li>
                <li>• <code>name, age, gender, race</code></li>
                <li>• <code>status, motive, notes</code></li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">data.incident_sources</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Source documentation for verification and transparency.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• <code>incident_id</code> → incidents.id</li>
                <li>• <code>url, title, publisher</code></li>
                <li>• <code>accessed_at</code></li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">data.corrections</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Public correction submissions for data quality improvement.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• <code>type, description, status</code></li>
                <li>• <code>submitted_at, reviewed_at</code></li>
                <li>• <code>reviewer_notes</code></li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">data.audit_log</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Complete audit trail of all data modifications for accountability.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• <code>table_name, action, actor_email</code></li>
                <li>• <code>old_values, new_values</code></li>
                <li>• <code>at (timestamp)</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Views and Materialized Views */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Public Views</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            These views provide filtered, aggregated, and optimized access to the underlying data for public consumption.
          </p>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">v_incidents</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">Published incidents only</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Filtered view showing only published incidents with verified data. This is the primary endpoint for public API access.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                <code className="text-xs text-gray-800 dark:text-gray-200">
                  SELECT * FROM data.incidents WHERE is_published = true AND last_verified_at IS NOT NULL
                </code>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">v_legislation</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">Published legislation only</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Filtered view showing only published legislation data.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                <code className="text-xs text-gray-800 dark:text-gray-200">
                  SELECT * FROM data.legislation WHERE is_published = true
                </code>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Materialized Views (mv_*)</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">Pre-computed statistics</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Materialized views for performance optimization of common statistical queries.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• <code>mv_stats_yearly</code> - Annual aggregations and trends</li>
                <li>• <code>mv_stats_by_state</code> - State-level statistics and rankings</li>
                <li>• <code>mv_deadliest_incidents</code> - Top incidents by casualty count</li>
                <li>• <code>mv_monthly_trends</code> - Monthly patterns and seasonality</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Indexes and Performance */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Indexes & Performance</h2>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Indexes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">incidents table</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Primary key: <code>id</code></li>
                  <li>• Unique: <code>incident_code</code></li>
                  <li>• Index: <code>date DESC</code></li>
                  <li>• Index: <code>state, date</code></li>
                  <li>• Index: <code>location_type</code></li>
                  <li>• Index: <code>is_published</code></li>
                  <li>• Composite: <code>state, location_type, date</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">legislation table</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Primary key: <code>id</code></li>
                  <li>• Index: <code>jurisdiction</code></li>
                  <li>• Index: <code>category</code></li>
                  <li>• Index: <code>status</code></li>
                  <li>• Index: <code>enacted_date DESC</code></li>
                  <li>• Index: <code>is_published</code></li>
                  <li>• Composite: <code>jurisdiction, category</code></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Access Control */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Security & Access Control</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Row Level Security (RLS)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                All tables implement PostgreSQL Row Level Security with specific policies for different access levels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Public Access</h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Read published incidents via views</li>
                    <li>• Read published legislation</li>
                    <li>• Submit corrections (insert only)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Admin Access</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Full CRUD on all tables</li>
                    <li>• Access to draft/unpublished data</li>
                    <li>• Audit log access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Admin Authorization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Admin access is controlled via the <code>public.admin_allowlist</code> table.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                <code className="text-xs text-gray-800 dark:text-gray-200">
                  CREATE TABLE public.admin_allowlist (
                    email TEXT PRIMARY KEY,
                    added_at TIMESTAMPTZ DEFAULT NOW(),
                    added_by TEXT
                  );
                </code>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Schema version: 2.1 • Last updated: September 2025
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/docs/api/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              API Documentation
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
