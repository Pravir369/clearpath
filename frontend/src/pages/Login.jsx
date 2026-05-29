export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-indigo-700">ClearPath</h1>
        <p className="text-gray-500 text-sm">Parole Officer Dashboard</p>
        <button
          disabled
          className="mt-4 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
        >
          Sign in with Google
        </button>
        <p className="text-xs text-gray-400">Authentication coming soon</p>
      </div>
    </div>
  )
}
