import { US_STATES, STATE_NAMES } from '@/lib/states'
import StatePageClient from './StatePageClient'

export async function generateStaticParams() {
  // Generate both uppercase and lowercase paths for case insensitivity
  const params = []
  for (const state of US_STATES) {
    params.push({ state_code: state.toLowerCase() })
    params.push({ state_code: state.toUpperCase() })
  }
  return params
}

export default async function StatePage({ params }: { params: Promise<{ state_code: string }> }) {
  const { state_code: stateCodeParam } = await params
  const stateCode = stateCodeParam?.toUpperCase()
  
  // Validate state code
  if (!stateCode || !US_STATES.includes(stateCode)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">State Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The state code "{stateCodeParam}" is not recognized.</p>
        <a href="/states/" className="text-blue-600 dark:text-blue-400 hover:underline">← View All States</a>
      </div>
    )
  }
  
  const stateName = STATE_NAMES[stateCode] || stateCode

  return <StatePageClient stateCode={stateCode} stateName={stateName} />
}
