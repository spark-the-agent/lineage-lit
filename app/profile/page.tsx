'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Network, BookOpen, Users, TrendingUp, Award, 
  Share2, Bookmark, Heart, Edit3, MapPin, Calendar,
  ChevronRight, ExternalLink, UserPlus, UserCheck
} from 'lucide-react';
import { currentUser, getFollowing, getFollowers, saveCreator, unsaveCreator, isCreatorSaved } from '@/lib/social';
import { creators, getCreatorById } from '@/lib/data';
import LineageGraph from '../components/LineageGraph';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'dna'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const following = getFollowing(currentUser.id);
  const followers = getFollowers(currentUser.id);
  const savedCreatorsList = currentUser.savedCreators.map(id => getCreatorById(id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </Link>
          <nav className="flex gap-6 text-sm text-zinc-400">
            <Link href="/explore" className="hover:text-amber-400 transition">Explore</Link>
            <Link href="/community" className="hover:text-amber-400 transition">Community</Link>
            <Link href="/recommendations" className="hover:text-amber-400 transition">For You</Link>
            <Link href="/profile" className="text-amber-400">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 p-1">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.displayName}
                  className="w-full h-full rounded-full bg-zinc-900"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-100">{currentUser.displayName}</h1>
                  <p className="text-zinc-500">@{currentUser.username}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              <p className="text-zinc-400 mt-4 max-w-2xl">{currentUser.bio}</p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Literary Explorer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {currentUser.joinedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{currentUser.readingDNA.totalBooks} books read</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6 pt-6 border-t border-zinc-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{following.length}</div>
                  <div className="text-sm text-zinc-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{followers.length}</div>
                  <div className="text-sm text-zinc-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{savedCreatorsList.length}</div>
                  <div className="text-sm text-zinc-500">Saved Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{currentUser.readWorks.length}</div>
                  <div className="text-sm text-zinc-500">Works Read</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800">
          {(['overview', 'saved', 'dna'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 -mb-[2px] ${
                activeTab === tab 
                  ? 'text-amber-400 border-amber-400' 
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              {tab === 'dna' ? 'Reading DNA' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats Row */}
            <div className="grid md:grid-cols-4 gap-4">
              <QuickStat 
                icon={<TrendingUp className="w-5 h-5" />}
                value={`${currentUser.readingDNA.influenceScore}%`}
                label="Influence Score"
                description="Well-connected reader"
              />
              <QuickStat 
                icon={<Award className="w-5 h-5" />}
                value={currentUser.readingDNA.literaryDNA[0]}
                label="Primary Style"
                description="Based on your reading"
              />
              <QuickStat 
                icon={<BookOpen className="w-5 h-5" />}
                value={String(currentUser.readingDNA.totalAuthors)}
                label="Unique Authors"
                description="Across all genres"
              />
              <QuickStat 
                icon={<Heart className="w-5 h-5" />}
                value={String(currentUser.likedWorks.length)}
                label="Liked Works"
                description="Your favorites"
              />
            </div>

            {/* Literary DNA Preview */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Your Literary DNA
              </h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {currentUser.readingDNA.literaryDNA.map((trait) => (
                  <span
                    key={trait}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                  >
                    {trait}
                  </span>
                ))}
              </div>
              
              {/* Genre Breakdown */}
              <div className="space-y-3">
                {currentUser.readingDNA.favoriteGenres.map((genre) => (
                  <div key={genre.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">{genre.name}</span>
                      <span className="text-zinc-500">{genre.percentage}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Your Top Authors
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentUser.readingDNA.topAuthors.map((authorId) => {
                  const author = getCreatorById(authorId);
                  if (!author) return null;
                  return (
                    <Link
                      key={authorId}
                      href={`/creators/${authorId}`}
                      className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-amber-500/50 transition group"
                    >
                      <h4 className="font-medium text-zinc-200 group-hover:text-amber-400 transition">
                        {author.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">{author.years}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-amber-400" />
                Recently Viewed
              </h3>
              <div className="flex flex-wrap gap-3">
                {currentUser.readingDNA.recentlyViewed.map((creatorId) => {
                  const creator = getCreatorById(creatorId);
                  if (!creator) return null;
                  return (
                    <Link
                      key={creatorId}
                      href={`/creators/${creatorId}`}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {creator.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-8">
            {/* Saved Creators */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                Saved Creators ({savedCreatorsList.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCreatorsList.map((creator) => {
                  if (!creator) return null;
                  return (
                    <div
                      key={creator.id}
                      className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-amber-500/50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <Link href={`/creators/${creator.id}`} className="flex-1">
                          <h4 className="font-medium text-zinc-200 hover:text-amber-400 transition">
                            {creator.name}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">{creator.years}</p>
                          <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{creator.bio}</p>
                        </Link>
                        <button
                          onClick={() => unsaveCreator(creator.id)}
                          className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                          title="Remove from saved"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3 text-xs text-zinc-500">
                        <span>{creator.works.length} works</span>
                        <span>•</span>
                        <span>{creator.influenced.length} influenced</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested Creators to Save */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                You Might Like
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creators
                  .filter(c => !currentUser.savedCreators.includes(c.id))
                  .slice(0, 3)
                  .map((creator) => (
                    <div
                      key={creator.id}
                      className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition"
                    >
                      <div className="flex items-start justify-between">
                        <Link href={`/creators/${creator.id}`} className="flex-1">
                          <h4 className="font-medium text-zinc-200 hover:text-amber-400 transition">
                            {creator.name}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">{creator.years}</p>
                        </Link>
                        <button
                          onClick={() => saveCreator(creator.id)}
                          className="p-2 text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                          title="Save creator"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dna' && (
          <div className="space-y-8">
            {/* Full Reading DNA */}
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    Your Complete Reading DNA
                  </h2>
                  <p className="text-zinc-400 mt-1">Based on {currentUser.readingDNA.totalBooks} books across {currentUser.readingDNA.totalAuthors} authors</p>
                </div>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition"
                >
                  <Share2 className="w-4 h-4" />
                  Share DNA
                </button>
              </div>

              {/* Literary DNA Badges */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Your Literary DNA</h3>
                <div className="flex flex-wrap gap-3">
                  {currentUser.readingDNA.literaryDNA.map((trait, i) => (
                    <span
                      key={trait}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <DNACard
                  icon={<BookOpen className="w-5 h-5" />}
                  value={currentUser.readingDNA.totalBooks}
                  label="Books Read"
                  trend="+12 this year"
                />
                <DNACard
                  icon={<Users className="w-5 h-5" />}
                  value={currentUser.readingDNA.totalAuthors}
                  label="Unique Authors"
                  trend="8 new discoveries"
                />
                <DNACard
                  icon={<Award className="w-5 h-5" />}
                  value={`${currentUser.readingDNA.influenceScore}%`}
                  label="Influence Score"
                  trend="Well-connected"
                />
                <DNACard
                  icon={<TrendingUp className="w-5 h-5" />}
                  value="Top 15%"
                  label="Active Reader"
                  trend="vs. all users"
                />
              </div>

              {/* Genre Breakdown */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">Genre Breakdown</h3>
                <div className="space-y-4">
                  {currentUser.readingDNA.favoriteGenres.map((genre) => (
                    <div key={genre.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-300">{genre.name}</span>
                        <span className="text-zinc-500">{genre.percentage}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                          style={{ width: `${genre.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Era Timeline */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">Reading by Era</h3>
                <div className="flex gap-4">
                  {currentUser.readingDNA.eraBreakdown.map((era) => (
                    <div
                      key={era.era}
                      className="flex-1 bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700 hover:border-amber-500/30 transition"
                    >
                      <div className="text-2xl font-bold text-amber-400">{era.count}</div>
                      <div className="text-xs text-zinc-500 mt-1">{era.era}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Your Influence Network */}
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Network className="w-5 h-5 text-amber-400" />
                Your Influence Network
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Visualize the connections between your favorite creators and discover new ones.
              </p>
              <LineageGraph 
                creators={savedCreatorsList.filter((c): c is NonNullable<typeof c> => c !== undefined)} 
              />
            </div>
          </div>
        )}
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-700">
            <h3 className="text-xl font-semibold mb-4">Share Your Reading DNA</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Share your literary journey with friends and discover new connections.
            </p>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition">
                <Share2 className="w-4 h-4" />
                Copy Link
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition">
                Share on Twitter
              </button>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-3 text-zinc-400 hover:text-zinc-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>Built with ⚡ by Spark & Jeeves</p>
          <p className="mt-2">A prototype for tracking creative lineage</p>
        </div>
      </footer>
    </div>
  );
}

function QuickStat({ 
  icon, 
  value, 
  label, 
  description 
}: { 
  icon: React.ReactNode; 
  value: string | number; 
  label: string; 
  description: string;
}) {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <div className="text-amber-400 mb-2">{icon}</div>
      <div className="text-xl font-bold text-zinc-100">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
      <div className="text-xs text-amber-500/70 mt-1">{description}</div>
    </div>
  );
}

function DNACard({
  icon,
  value,
  label,
  trend,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend: string;
}) {
  return (
    <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-800">
      <div className="text-amber-400 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
      <div className="text-xs text-amber-500/70 mt-1">{trend}</div>
    </div>
  );
}
