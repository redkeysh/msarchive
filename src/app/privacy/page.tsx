export default function Privacy() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Last Updated: September 2025</h2>
            <p className="text-blue-800 dark:text-blue-200">
              This privacy policy describes how MSArchive V2 collects, uses, and protects your information.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-gray-100">Public Data</h3>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Mass shooting incident data from verified public sources</li>
              <li>Gun legislation from public records</li>
              <li>News articles and official reports (with proper attribution)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-gray-100">User Data</h3>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Email addresses for admin authentication (magic links only)</li>
              <li>Correction submissions (optional contact information)</li>
              <li>Basic analytics via Supabase (no personal identification)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How We Use Information</h2>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Provide accurate, verified data on gun violence incidents</li>
              <li>Enable research and policy analysis</li>
              <li>Maintain data quality through correction submissions</li>
              <li>Secure admin access for authorized users</li>
              <li>Improve site functionality and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data Protection</h2>
            
            <h3 className="text-xl font-medium mb-3">Security Measures</h3>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Static site deployment with no server-side secrets</li>
              <li>Admin operations secured via Supabase Edge Functions</li>
              <li>Row-level security (RLS) on all database tables</li>
              <li>Magic link authentication (no passwords stored)</li>
              <li>Audit logging for all administrative actions</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Data Retention</h3>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Incident data: Retained indefinitely for historical research</li>
              <li>Correction submissions: Retained until resolved</li>
              <li>Admin sessions: Expire automatically</li>
              <li>Audit logs: Retained for compliance and security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-medium mb-2">Supabase</h3>
              <p className="text-gray-700 mb-2">
                Database, authentication, and Edge Functions hosting.
              </p>
              <p className="text-sm text-gray-600">
                Privacy Policy: <a href="https://supabase.com/privacy" className="text-blue-600 hover:underline">supabase.com/privacy</a>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-medium mb-2">GitHub Pages</h3>
              <p className="text-gray-700 mb-2">
                Static site hosting and deployment.
              </p>
              <p className="text-sm text-gray-600">
                Privacy Policy: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" className="text-blue-600 hover:underline">GitHub Privacy Statement</a>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-medium mb-2">Cloudflare Turnstile</h3>
              <p className="text-gray-700 mb-2">
                CAPTCHA protection for correction submissions.
              </p>
              <p className="text-sm text-gray-600">
                Privacy Policy: <a href="https://www.cloudflare.com/privacypolicy/" className="text-blue-600 hover:underline">cloudflare.com/privacypolicy</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Request information about data we have collected</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of personal information (where applicable)</li>
              <li>Opt out of non-essential data collection</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, contact us at the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Sources & Attribution</h2>
            <p className="text-gray-700 mb-4">
              All incident data is sourced from verified public records, news reports, and official statements. 
              We maintain detailed source attribution and require multiple independent sources for each incident.
            </p>
            <p className="text-gray-700">
              If you believe any data is inaccurate, please use our correction submission form.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                For privacy-related questions or requests:
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@msarchive.org
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Data Corrections:</strong> Use the correction form on our website
              </p>
              <p className="text-gray-700">
                <strong>Response Time:</strong> We aim to respond within 30 days
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibent mb-4">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this privacy policy periodically. Changes will be posted on this page 
              with an updated "Last Updated" date. Continued use of the site constitutes acceptance 
              of any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
