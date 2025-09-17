'use client'
import { useState } from 'react'

export default function CorrectionForm() {
  const [form, setForm] = useState({
    correction_type: 'factual_error',
    description: '',
    incident_id: '',
    legislation_id: '',
    suggested_correction: ''
  })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!form.description.trim()) {
      setMsg('Please describe the issue.')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      // In a real implementation, this would call the Edge Function
      const token = (window as any).turnstile?.getResponse?.() // Turnstile CAPTCHA
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-correction`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-turnstile-token': token ?? '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(form)
      })
      
      const result = await res.json()
      
      if (res.ok) {
        setMsg('Thank you! Your correction has been submitted and will be reviewed.')
        setForm({
          correction_type: 'factual_error',
          description: '',
          incident_id: '',
          legislation_id: '',
          suggested_correction: ''
        })
      } else {
        setMsg(result.error || 'Failed to submit correction. Please try again.')
      }
    } catch (error) {
      setMsg('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Submit a Correction</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type of Issue
          </label>
          <select 
            value={form.correction_type} 
            onChange={e => setForm({ ...form, correction_type: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="factual_error">Factual Error</option>
            <option value="missing_info">Missing Information</option>
            <option value="suggestion">General Suggestion</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Incident ID (optional)
          </label>
          <input 
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
            value={form.incident_id} 
            onChange={e => setForm({ ...form, incident_id: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Legislation ID (optional)
          </label>
          <input 
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="e.g., 987fcdeb-51a2-43d1-b456-426614174000"
            value={form.legislation_id} 
            onChange={e => setForm({ ...form, legislation_id: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea 
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            rows={4} 
            placeholder="Please describe the issue in detail..."
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggested Correction (optional)
          </label>
          <textarea 
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            rows={3} 
            placeholder="If you have a specific correction to suggest..."
            value={form.suggested_correction} 
            onChange={e => setForm({ ...form, suggested_correction: e.target.value })}
          />
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🤖 Turnstile CAPTCHA would appear here in production
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Helps prevent spam and automated submissions
          </p>
        </div>

        <button 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Correction'}
        </button>

        {msg && (
          <div className={`p-3 rounded-lg text-sm ${
            msg.includes('Thank you') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {msg}
          </div>
        )}
      </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            All corrections are reviewed by our research team. 
            We typically respond within 5-7 business days.
          </p>
        </div>
    </div>
  )
}
