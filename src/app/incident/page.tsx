'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getIncident } from '@/lib/sb-browser'
import { supabaseBrowser } from '@/lib/supabase'

export default function IncidentPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? ''
  const [data, setData] = useState<any>(null)
  const [suspects, setSuspects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // Load incident data
      getIncident(id).then(({ data, error }) => {
        if (error) {
          console.error('Error loading incident:', error)
          setLoading(false)
        } else {
          setData(data)
          // Load suspects and weapons for this incident
          loadSuspects(id)
        }
      })
    } else {
      setLoading(false)
    }
  }, [id])

  const loadSuspects = async (incidentId: string) => {
    try {
      const sb = supabaseBrowser()
      const { data: suspectsData, error } = await sb
        .from('v_suspects')
        .select(`
          *,
          weapons:v_suspect_weapons(*)
        `)
        .eq('incident_id', incidentId)
      
      if (error) {
        console.error('Error loading suspects:', error)
        setSuspects([])
      } else {
        setSuspects(suspectsData || [])
      }
    } catch (err) {
      console.error('Error loading suspects:', err)
      setSuspects([])
    } finally {
      setLoading(false)
    }
  }

  if (!id) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Missing Incident ID</h1>
        <p className="text-gray-600">Please provide an incident ID in the URL query parameter.</p>
        <p className="text-sm text-gray-500 mt-2">Example: /incident/?id=123e4567-e89b-12d3-a456-426614174000</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Incident Not Found</h1>
        <p className="text-gray-600">The requested incident could not be found or is not published.</p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">← Back to Timeline</a>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{data.incident_code}</h1>
        <p className="text-xl text-gray-600">{data.city}, {data.state} — {data.date}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Incident Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium text-gray-700">Location Type</h3>
                <p className="capitalize">{data.location_type.replace('_', ' ')}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Total Casualties</h3>
                <p>{data.fatalities} killed, {data.injuries} injured</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Context</h3>
              <p className="text-gray-900">{data.context}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900">{data.description}</p>
            </div>

            {data.notes && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Additional Notes</h3>
                <p className="text-gray-900">{data.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Suspects and Weapons */}
          {suspects.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Suspect Information
              </h2>
              <div className="space-y-4">
                {suspects.map((suspect, index) => (
                  <div key={suspect.id} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Suspect #{index + 1}
                      {suspect.suspect_code && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({suspect.suspect_code})
                        </span>
                      )}
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                      {suspect.name && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{suspect.name}</span>
                        </div>
                      )}
                      {suspect.age && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Age:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{suspect.age}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Gender:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">{suspect.gender}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                          {suspect.status.replace('_', ' ')}
                        </span>
                      </div>
                      {suspect.motive && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Motive:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{suspect.motive}</span>
                        </div>
                      )}
                    </div>

                    {/* Weapons */}
                    {suspect.weapons && suspect.weapons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Weapons ({suspect.weapons.length})
                        </h4>
                        <div className="space-y-2">
                          {suspect.weapons.map((weapon: any) => (
                            <div key={weapon.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {weapon.type}
                                </div>
                                {weapon.legally_purchased !== null && (
                                  <div className="text-gray-600 dark:text-gray-400">
                                    Legal Purchase: {weapon.legally_purchased ? 'Yes' : 'No'}
                                  </div>
                                )}
                                {weapon.source && (
                                  <div className="text-gray-600 dark:text-gray-400">
                                    Source: {weapon.source}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Key Facts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fatalities:</span>
                <span className="font-medium">{data.fatalities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Injuries:</span>
                <span className="font-medium">{data.injuries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Children Involved:</span>
                <span className="font-medium">{data.involves_children ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hate Crime:</span>
                <span className="font-medium">{data.hate_crime ? 'Yes' : 'No'}</span>
              </div>
              {data.hate_crime && data.hate_crime_target && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-medium">{data.hate_crime_target}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Data Quality</h3>
            <p className="text-sm text-gray-600">
              Last verified: {data.last_verified_at ? new Date(data.last_verified_at).toLocaleDateString() : 'Not specified'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All incidents require verification from at least 2 independent sources.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">← Back to Timeline</a>
      </div>
    </div>
  )
}
