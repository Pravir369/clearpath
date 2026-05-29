export default function DeadlineBadge({ daysRemaining, status }) {
  const colorMap = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
  }

  const bgClass = colorMap[status] ?? 'bg-gray-500'
  const label = daysRemaining === 0 ? 'Expired' : `${daysRemaining} days left`

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white ${bgClass}`}>
      {label}
    </span>
  )
}
