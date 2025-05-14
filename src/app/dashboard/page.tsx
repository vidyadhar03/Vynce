import { WithAuth } from '@/lib/auth/withAuth'
import { getUser } from '@/lib/auth/getUser'

export default async function DashboardPage() {
  return (
    <WithAuth>
      <DashboardContent />
    </WithAuth>
  )
}

async function DashboardContent() {
  const user = await getUser()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Vynce Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user?.email}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spotify Integration Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Spotify Integration</h2>
          <p className="text-gray-600 mb-4">Connect your Spotify account to analyze your music preferences.</p>
          <button className="bg-[#1DB954] text-white px-6 py-2 rounded-full hover:bg-opacity-90">
            Connect Spotify
          </button>
        </div>

        {/* Instagram Integration Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Instagram Integration</h2>
          <p className="text-gray-600 mb-4">Link your Instagram to discover patterns in your visual content.</p>
          <button className="bg-[#E1306C] text-white px-6 py-2 rounded-full hover:bg-opacity-90">
            Connect Instagram
          </button>
        </div>

        {/* Insights Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Insights</h2>
          <div className="text-gray-600">
            <p className="mb-4">Connect your accounts to start receiving personalized insights about your digital presence.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Discover your music mood patterns</li>
              <li>Analyze your visual aesthetic</li>
              <li>Get AI-powered personality insights</li>
              <li>Generate shareable content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 