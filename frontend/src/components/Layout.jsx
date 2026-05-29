export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight">ClearPath</h1>
          <p className="text-indigo-200 text-sm">Parole Officer Dashboard</p>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
