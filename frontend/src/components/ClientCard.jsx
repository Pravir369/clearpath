import { Link } from 'react-router-dom'

const borderMap = {
  red: 'border-red-500',
  yellow: 'border-yellow-500',
  green: 'border-green-500',
}

const badgeMap = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  green: 'bg-green-500 text-white',
}

export default function ClientCard({ client, urgency }) {
  const borderClass = borderMap[urgency] ?? 'border-gray-400'
  const badgeClass = badgeMap[urgency] ?? 'bg-gray-400 text-white'
  const days = Math.floor((Date.now() - new Date(client.release_date)) / 86400000)

  return (
    <Link to={`/clients/${client.id}`} className="block">
      <div className={`relative bg-white rounded-lg shadow-sm p-4 mb-3 border-l-4 ${borderClass} hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-lg text-gray-900">{client.name}</p>
            <p className="text-sm text-gray-500">{client.county}</p>
            <p className="text-sm text-gray-500 capitalize">{client.conviction_type}</p>
            <p className="text-sm text-gray-400 mt-1">Released {days} day{days !== 1 ? 's' : ''} ago</p>
          </div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${badgeClass}`}>
            {urgency}
          </span>
        </div>
      </div>
    </Link>
  )
}
