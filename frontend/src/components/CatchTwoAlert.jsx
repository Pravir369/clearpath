export default function CatchTwoAlert({ catchTwo }) {
  if (!catchTwo || !catchTwo.has_catch_two) return null

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-orange-500 text-lg">⚠️</span>
        <span className="font-bold text-orange-700">ID/Address Catch-22 Detected</span>
      </div>
      <div className="text-sm text-orange-800 space-y-1">
        <p className="font-medium">{catchTwo.agency_name}</p>
        <p>{catchTwo.address}</p>
        <p>{catchTwo.hours}</p>
        {catchTwo.docs_needed && catchTwo.docs_needed.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Documents needed:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              {catchTwo.docs_needed.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
