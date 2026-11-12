import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function Report() {
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ url: '', reason: '', email: '', details: '' })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    // frontend only — log / bisa diganti endpoint backend nanti
    console.log('report', form)
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-xl mx-auto px-6 pt-8 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Abuse</h1>
        <p className="text-gray-600 mb-8">
          Report content that violates our terms or the law.
        </p>

        {done ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-800 font-medium">Thank you for your report.</p>
            <Link to="/" className="inline-block mt-4 text-gray-900 font-medium hover:underline">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL or ID *</label>
              <input
                name="url"
                required
                value={form.url}
                onChange={onChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Video ID or full URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <select
                name="reason"
                required
                value={form.reason}
                onChange={onChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Select a reason</option>
                <option value="copyright">Copyright</option>
                <option value="illegal">Illegal content</option>
                <option value="harassment">Harassment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea
                name="details"
                rows={4}
                value={form.details}
                onChange={onChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
