export default function MethodologyDocs() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Data Methodology</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Our comprehensive approach to collecting, verifying, and classifying mass shooting incidents.
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Quality Commitment</h3>
              <p className="text-blue-800 dark:text-blue-200">
                All data in MSArchive meets rigorous verification standards. Every incident requires confirmation from 
                at least two independent, credible sources before inclusion in our database.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Definition of Mass Shooting</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              MSArchive defines a mass shooting as an incident where <strong>four or more people are shot</strong> 
              (injured or killed), not including the shooter. This definition aligns with the FBI's criteria and 
              focuses on the scale of gun violence rather than fatality counts alone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Included</h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Public shootings (schools, workplaces, etc.)</li>
                  <li>• Domestic violence incidents</li>
                  <li>• Gang-related violence</li>
                  <li>• Robbery-related shootings</li>
                  <li>• Incidents with 4+ shot victims</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Excluded</h4>
                <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                  <li>• Self-defense shootings</li>
                  <li>• Police-involved shootings</li>
                  <li>• Military combat</li>
                  <li>• Accidents or negligent discharge</li>
                  <li>• Incidents with &lt;4 shot victims</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data Collection Process</h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Source Monitoring</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    We continuously monitor news outlets, police reports, and verified social media accounts for incident reports.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• National and local news organizations</li>
                    <li>• Police department press releases</li>
                    <li>• Court documents and legal filings</li>
                    <li>• Verified social media accounts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Initial Verification</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Each potential incident undergoes preliminary verification to confirm it meets our criteria.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Confirm 4+ shot victims</li>
                    <li>• Verify date, time, and location</li>
                    <li>• Identify primary sources</li>
                    <li>• Check for duplicate reports</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Cross-Reference & Validation</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    We require at least two independent sources to confirm incident details before database entry.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Minimum 2 independent sources</li>
                    <li>• Cross-check victim counts</li>
                    <li>• Verify suspect information</li>
                    <li>• Confirm contextual details</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Entry & Review</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Verified incidents are entered into our database with comprehensive metadata and source attribution.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Structured data entry</li>
                    <li>• Source documentation</li>
                    <li>• Quality assurance review</li>
                    <li>• Publication approval</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data Categories & Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Location Types</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <strong>School:</strong> Educational institutions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <strong>Public Space:</strong> Parks, streets, venues
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <strong>Workplace:</strong> Businesses, offices
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <strong>Private Residence:</strong> Homes, apartments
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <strong>Other:</strong> Miscellaneous locations
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Special Classifications</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <strong>Hate Crime:</strong> Bias-motivated incidents
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <strong>Children Involved:</strong> Victims under 18
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <strong>Domestic Violence:</strong> Family/partner related
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quality Assurance</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Regular Audits</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Monthly data reviews</li>
                  <li>• Source verification checks</li>
                  <li>• Consistency analysis</li>
                  <li>• Error correction protocols</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Update Process</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Real-time monitoring</li>
                  <li>• Weekly data updates</li>
                  <li>• Retroactive corrections</li>
                  <li>• Version control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Transparency</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Public correction system</li>
                  <li>• Source documentation</li>
                  <li>• Methodology disclosure</li>
                  <li>• Data availability</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Limitations & Considerations</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Important Notes</h3>
                <ul className="text-yellow-800 dark:text-yellow-200 space-y-2 text-sm">
                  <li>• <strong>Reporting Delays:</strong> Some incidents may not be immediately reported or verified</li>
                  <li>• <strong>Source Limitations:</strong> Rural or less-covered areas may have delayed reporting</li>
                  <li>• <strong>Evolving Information:</strong> Victim counts and details may change as investigations proceed</li>
                  <li>• <strong>Definition Sensitivity:</strong> Minor changes in criteria can significantly affect totals</li>
                  <li>• <strong>Underreporting:</strong> Some incidents may never receive sufficient media coverage for inclusion</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: September 2025
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/corrections/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Report Issues
              </a>
              <a href="/resources/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Back to Resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


