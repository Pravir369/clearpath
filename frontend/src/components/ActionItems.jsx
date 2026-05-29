import { useState, useEffect } from 'react'
import { api } from '../lib/api'

const priorityMap = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function ActionItems({ actionItems, intakeSummary, clientId, onAnalysisComplete }) {
  const [completedItems, setCompletedItems] = useState(new Set())
  const [completions, setCompletions] = useState([])
  const [noteItem, setNoteItem] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [newItems, setNewItems] = useState(null)
  const [expandedCompletions, setExpandedCompletions] = useState(false)

  // Load completions on mount
  useEffect(() => {
    if (clientId) {
      api.getCompletions(clientId)
        .then((data) => {
          setCompletions(data)
          setCompletedItems(new Set(data.map((c) => c.action_text)))
        })
        .catch(() => {})
    }
  }, [clientId])

  const handleCheckboxClick = (item) => {
    if (completedItems.has(item.text)) {
      return
    }
    setNoteItem(item)
    setNoteText('')
  }

  const saveCompletion = async () => {
    if (!clientId || !noteItem) return

    try {
      await api.completeAction(clientId, {
        action_text: noteItem.text,
        officer_note: noteText || null,
      })

      const newCompleted = new Set(completedItems)
      newCompleted.add(noteItem.text)
      setCompletedItems(newCompleted)
      setCompletions([...completions, { action_text: noteItem.text, completed_at: new Date().toISOString() }])
      setNoteItem(null)
      setNoteText('')

      // Check if all items are complete
      if (newCompleted.size === actionItems.length) {
        setIsRegenerating(true)
        const analysis = await api.regenerateAnalysis(clientId)
        setNewItems(analysis.action_items)
        setIsRegenerating(false)
      }
    } catch (error) {
      console.error('Error completing action:', error)
    }
  }

  const handleRegenerate = () => {
    if (newItems) {
      onAnalysisComplete && onAnalysisComplete(newItems)
      setCompletedItems(new Set())
      setCompletions([])
      setNewItems(null)
    }
  }

  const isChecked = (item) => completedItems.has(item.text)

  const displayItems = newItems || actionItems || []

  return (
    <div className="mb-6">
      {intakeSummary && !isRegenerating && !newItems && (
        <div className="bg-gray-100 rounded p-3 mb-4 text-sm text-gray-700">{intakeSummary}</div>
      )}

      {isRegenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 text-center">
          <p className="text-blue-700 text-sm font-semibold">All done for this week — generating next priorities...</p>
        </div>
      )}

      {newItems && !isRegenerating && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
          <p className="text-green-700 text-sm font-semibold mb-3">New priorities generated!</p>
          <button
            onClick={handleRegenerate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md text-sm"
          >
            View New Action Items
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-3">This Week's Action Items</h2>

      {!displayItems || displayItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No action items available</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {displayItems.map((item, i) => {
            const itemCompleted = isChecked(item)
            const badgeClass = priorityMap[item.priority] ?? 'bg-gray-100 text-gray-700'
            return (
              <li
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border shadow-sm transition-all ${
                  itemCompleted
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <button
                  onClick={() => handleCheckboxClick(item)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    itemCompleted
                      ? 'bg-teal-500 border-teal-500'
                      : 'border-gray-300 hover:border-teal-400'
                  }`}
                >
                  {itemCompleted && <span className="text-white text-sm font-bold">✓</span>}
                </button>
                <div className="flex-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase mb-1 ${badgeClass}`}>
                    {item.priority}
                  </span>
                  <p className={`text-sm ${itemCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {item.text}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {completions.length > 0 && (
        <div className="border-t pt-4 mt-6">
          <button
            onClick={() => setExpandedCompletions(!expandedCompletions)}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2"
          >
            {expandedCompletions ? '▼' : '▶'} Completed This Week ({completions.length})
          </button>
          {expandedCompletions && (
            <ul className="space-y-2 mt-3">
              {completions.map((c, i) => (
                <li key={i} className="text-sm text-gray-600 p-2 bg-gray-50 rounded border border-gray-200">
                  <p className="font-medium text-gray-700">✓ {c.action_text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(c.completed_at).toLocaleString()}
                  </p>
                  {c.officer_note && <p className="text-xs text-gray-600 mt-1 italic">Note: {c.officer_note}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {noteItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <p className="text-sm text-gray-600 mb-4">Add a note for this completion (optional):</p>
            <textarea
              autoFocus
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="E.g., 'Contacted SNAP office, appointment scheduled for Tuesday'"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setNoteItem(null)
                  setNoteText('')
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md"
              >
                Skip
              </button>
              <button
                onClick={saveCompletion}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
