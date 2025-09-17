import { US_STATES, STATE_NAMES } from '@/lib/states'
import LegislationPageClient from './LegislationPageClient'

export async function generateStaticParams() {
  return ['federal', ...US_STATES.map(s => s.toLowerCase())].map(j => ({ jurisdiction: j }))
}

export default async function LegislationPage({ params }: { params: Promise<{ jurisdiction: string }> }) {
  const { jurisdiction: jurisdictionParam } = await params
  const jurisdiction = jurisdictionParam.toUpperCase()
  const isFederal = jurisdiction === 'FEDERAL'
  
  // Validate jurisdiction (allow both uppercase and lowercase)
  const upperJurisdiction = jurisdiction.toUpperCase()
  if (!isFederal && !US_STATES.includes(upperJurisdiction)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Jurisdiction Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The jurisdiction "{jurisdictionParam}" is not recognized.</p>
        <a href="/legislation/" className="text-blue-600 dark:text-blue-400 hover:underline">← View All Legislation</a>
      </div>
    )
  }
  
  const displayName = isFederal ? 'Federal' : STATE_NAMES[upperJurisdiction] || upperJurisdiction

  return <LegislationPageClient 
    jurisdiction={upperJurisdiction} 
    displayName={displayName} 
    isFederal={isFederal} 
  />
}
