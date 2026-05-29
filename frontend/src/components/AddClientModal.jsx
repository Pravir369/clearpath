import { useState } from 'react'
import { api } from '../lib/api'

export default function AddClientModal({ isOpen, onClose, onClientAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    release_date: '',
    county: 'Fulton County, GA',
    conviction_type: 'property',
    age: '',
    is_veteran: false,
    has_dependents: false,
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [toast, setToast] = useState('')

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.release_date) newErrors.release_date = 'Release date is required'
    if (new Date(formData.release_date) > new Date()) newErrors.release_date = 'Release date cannot be in the future'
    if (!formData.age) newErrors.age = 'Age is required'
    if (formData.age < 18 || formData.age > 80) newErrors.age = 'Age must be between 18 and 80'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await api.createClient({
        name: formData.name,
        release_date: formData.release_date,
        county: formData.county,
        conviction_type: formData.conviction_type,
        age: parseInt(formData.age),
        is_veteran: formData.is_veteran,
        has_dependents: formData.has_dependents,
      })

      setToast(`${response.name} added — analysis complete`)
      setTimeout(() => setToast(''), 3000)

      onClientAdded(response)
      onClose()
      setFormData({
        name: '',
        release_date: '',
        county: 'Fulton County, GA',
        conviction_type: 'property',
        age: '',
        is_veteran: false,
        has_dependents: false,
      })
      setErrors({})
    } catch (error) {
      setApiError(error.message || 'Failed to create client')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}>
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Client</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {apiError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Marcus Johnson"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Release Date *</label>
                <input
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.release_date && <p className="text-red-500 text-sm mt-1">{errors.release_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">County *</label>
                <select
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Fulton County, GA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conviction Type *</label>
                <select
                  value={formData.conviction_type}
                  onChange={(e) => setFormData({ ...formData, conviction_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="non-violent drug">Non-violent drug</option>
                  <option value="property">Property</option>
                  <option value="violent">Violent</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="18"
                  max="80"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="35"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Veteran?</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.is_veteran ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, is_veteran: !formData.is_veteran })}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        formData.is_veteran ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Has Dependents?</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.has_dependents ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, has_dependents: !formData.has_dependents })}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        formData.has_dependents ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-6 rounded-md font-semibold text-white transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Analyzing...' : 'Add Client + Run AI Analysis'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
