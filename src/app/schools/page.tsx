'use client'
import { useEffect, useState } from 'react'
import { listIncidents } from '@/lib/sb-browser'

export default function Schools() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listIncidents({ schoolOnly: true }).then(({ data, error }) => {
      if (error) {
        console.error('Error loading school incidents:', error)
        setItems([])
      } else {
        setItems(data ?? [])
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">School Incidents</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">School Incidents</h1>
        <p className="text-xl text-gray-600">
          Mass shooting incidents that occurred at educational institutions.
        </p>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This data includes incidents at K-12 schools, colleges, and universities. 
            Each incident has been verified through multiple independent sources.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">{items.length}</div>
              <div className="text-sm text-gray-600">Total School Incidents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {items.reduce((sum, item) => sum + (item.fatalities || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Fatalities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {items.reduce((sum, item) => sum + (item.injuries || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Injuries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {items.filter(item => item.involves_children).length}
              </div>
              <div className="text-sm text-gray-600">Involving Children</div>
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No school incidents found.</p>
          <p className="text-gray-400 text-sm mt-2">This could mean no data is available or there are no published incidents.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((item) => (
            <div key={item.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    <a href={`/incident/?id=${item.id}`} className="text-blue-600 hover:underline">
                      {item.incident_code}
                    </a>
                  </h3>
                  <p className="text-gray-600">{item.city}, {item.state} • {item.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Casualties</div>
                  <div className="font-semibold">
                    {item.fatalities} killed, {item.injuries} injured
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{item.context}</p>
              
              <div className="flex flex-wrap gap-2">
                {item.involves_children && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    Children Involved
                  </span>
                )}
                {item.hate_crime && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                    Hate Crime
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                  {item.location_type.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Data sourced from verified public records and news reports. 
          <a href="/resources/" className="text-blue-600 hover:underline ml-1">Learn more about our methodology.</a>
        </p>
      </div>
    </div>
  )
}
