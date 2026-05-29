const priorityMap = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function ActionItems({ actionItems, intakeSummary }) {
  return (
    <div className="mb-6">
      {intakeSummary && (
        <div className="bg-gray-100 rounded p-3 mb-4 text-sm text-gray-700">
          {intakeSummary}
        </div>
      )}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">This Week's Action Items</h2>
      {!actionItems || actionItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No action items available</p>
      ) : (
        <ul className="space-y-2">
          {actionItems.map((item, i) => {
            const badgeClass = priorityMap[item.priority] ?? 'bg-gray-100 text-gray-700'
            return (
              <li key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase shrink-0 mt-0.5 ${badgeClass}`}>
                  {item.priority}
                </span>
                <span className="text-sm text-gray-800">{item.text}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
