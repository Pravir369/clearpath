import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import CatchTwoAlert from '../components/CatchTwoAlert'
import BenefitsPanel from '../components/BenefitsPanel'
import ActionItems from '../components/ActionItems'
import ErrorBoundary from '../components/ErrorBoundary'
import { api } from '../lib/api'

const badgeMap = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  green: 'bg-green-500 text-white',
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-32 bg-gray-200 rounded" />
      <div className="h-48 bg-gray-200 rounded" />
    </div>
  )
}

function ClientDetailContent() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAnalysis = useCallback(() => {
    setLoading(true)
    setError(null)
    api.analyzeClient(id)
      .then((data) => {
        setAnalysis(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    loadAnalysis()
  }, [loadAnalysis])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 mb-3">Analysis unavailable — {error}</p>
        <button
          onClick={loadAnalysis}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!analysis) return null

  const { client, urgency, catch_two, benefits, action_items, intake_summary } = analysis
  const days = Math.floor((Date.now() - new Date(client.release_date)) / 86400000)
  const badgeClass = badgeMap[urgency] ?? 'bg-gray-400 text-white'

  return (
    <>
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${badgeClass}`}>
          {urgency}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        {client.county} &middot; {client.conviction_type} &middot; Released {days} day{days !== 1 ? 's' : ''} ago
      </p>
      <CatchTwoAlert catchTwo={catch_two} />
      <BenefitsPanel benefits={benefits} />
      <ActionItems actionItems={action_items} intakeSummary={intake_summary} />
    </>
  )
}

export default function ClientDetail() {
  return (
    <Layout>
      <ErrorBoundary>
        <ClientDetailContent />
      </ErrorBoundary>
    </Layout>
  )
}
