import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ClientCard from '../components/ClientCard'
import ErrorBoundary from '../components/ErrorBoundary'
import AddClientModal from '../components/AddClientModal'
import { api } from '../lib/api'

function clientUrgency(client) {
  const days = Math.floor((Date.now() - new Date(client.release_date)) / 86400000)
  if (days <= 3 || days >= 27) return 'red'
  if (days <= 14) return 'yellow'
  return 'green'
}

const urgencyOrder = { red: 0, yellow: 1, green: 2 }

function DashboardContent() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    api.getClients()
      .then((data) => {
        setClients(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500 text-lg">Loading clients...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-red-600">Failed to load clients. Is the backend running?</p>
      </div>
    )
  }

  const handleClientAdded = (newClient) => {
    setClients([...clients, newClient])
  }

  const sorted = [...clients]
    .map((c) => ({ client: c, urgency: clientUrgency(c) }))
    .sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])

  return (
    <>
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onClientAdded={handleClientAdded} />

      <div className="flex justify-between items-center mb-4">
        <div className="bg-indigo-600 text-white text-center py-2 text-sm rounded flex-1">
          Demo Mode — {clients.length} clients loaded
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          + Add New Client
        </button>
      </div>

      {sorted.map(({ client, urgency }) => (
        <ClientCard key={client.id} client={client} urgency={urgency} />
      ))}
    </>
  )
}

export default function Dashboard() {
  return (
    <Layout>
      <ErrorBoundary>
        <DashboardContent />
      </ErrorBoundary>
    </Layout>
  )
}
