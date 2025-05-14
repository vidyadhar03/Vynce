import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-12">
      {/* Hero Section */}
      <div className="w-full max-w-5xl text-center mt-16 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Musical Journey</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Connect your Spotify to generate personalized insight cards and share your music story
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/sign-up" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/sign-in" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
      
      {/* Insight Card Preview */}
      <div className="w-full max-w-5xl mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Featured Insight Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Card 1 */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
            <h3 className="font-bold text-xl mb-3">Mood Mirror</h3>
            <p className="mb-4">Your music reflects a thoughtful and energetic mood this week.</p>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">Based on recent listening</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs">🎵</span>
              </div>
            </div>
          </div>
          
          {/* Sample Card 2 */}
          <div className="bg-gradient-to-br from-amber-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
            <h3 className="font-bold text-xl mb-3">Genre Explorer</h3>
            <p className="mb-4">You've been exploring indie rock and lo-fi beats most frequently.</p>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">Top genres this month</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs">🎸</span>
              </div>
            </div>
          </div>
          
          {/* Sample Card 3 */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
            <h3 className="font-bold text-xl mb-3">Artist Connection</h3>
            <p className="mb-4">Your taste is similar to fans of Tame Impala and Glass Animals.</p>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">Based on listening patterns</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs">🎤</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full text-center text-sm text-gray-600 mb-4">
        <Link href="/debug/status" className="underline hover:text-blue-600">System Status</Link>
      </div>
    </main>
  )
} 