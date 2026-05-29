import DeadlineBadge from './DeadlineBadge'

const rowBgMap = {
  red: 'bg-red-50',
  yellow: 'bg-yellow-50',
  green: 'bg-green-50',
}

export default function BenefitsPanel({ benefits }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Benefit Programs</h2>
      {!benefits || benefits.length === 0 ? (
        <p className="text-gray-500 text-sm">No eligible programs found</p>
      ) : (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {benefits.map((benefit, i) => {
            const rowBg = rowBgMap[benefit.status] ?? 'bg-white'
            const isLast = i === benefits.length - 1
            return (
              <div
                key={benefit.program_name}
                className={`flex items-center justify-between px-4 py-3 ${rowBg} ${!isLast ? 'border-b border-gray-200' : ''}`}
              >
                <span className="font-medium text-gray-800">{benefit.program_name}</span>
                <DeadlineBadge daysRemaining={benefit.days_remaining} status={benefit.status} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
