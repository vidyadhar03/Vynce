"use client";

import React, { ReactNode, useState, useCallback, useRef } from 'react';
import BottomNav from './BottomNav';
import HomeLayout from './screens/HomeLayout';
import InsightsLayout from './screens/InsightsLayout';
import NewInsightsLayout from './screens/NewInsightsLayout';
import SpotifyDataView from './SpotifyDataView';
import UserProfile from './UserProfile';
import RefreshTestPanel from './debug/RefreshTestPanel';
import { useSpotify } from '../hooks/useSpotify';
import GlobalShareInterface from './GlobalShareInterface';
import { useGlobalShare } from '../hooks/useGlobalShare';

// Dynamic Top Bar Component - Only show when Spotify is connected
const DynamicTopBar = ({ 
  activeTab, 
  onProfileClick, 
  exploreTopBarData,
  onInsightShare
}: { 
  activeTab: string; 
  onProfileClick: () => void;
  exploreTopBarData?: {
    title: string;
    showViewToggle: boolean;
    viewMode: 'list' | 'grid';
    onViewModeToggle: () => void;
    onShareClick: () => void;
  };
  onInsightShare: () => void;
}) => {
  const getTopBarContent = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: 'Vynce',
          showProfile: true,
          titleAlign: 'left' as const
        };
      case 'explore':
        return {
          title: exploreTopBarData?.title || 'Explore',
          showProfile: !exploreTopBarData, // Hide profile when explore data is active
          showExploreControls: !!exploreTopBarData,
          titleAlign: 'left' as const
        };
      case 'insights-plus':
        return {
          title: 'Insights',
          showProfile: false,
          showInsightsShare: true,
          titleAlign: 'left' as const
        };
      default:
        return {
          title: 'Vynce',
          showProfile: true,
          titleAlign: 'left' as const
        };
    }
  };

  const { title, showProfile, showExploreControls, showInsightsShare, titleAlign } = getTopBarContent();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-[60px]"
      style={{
        background: 'rgba(18, 18, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', // For Safari
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center">
          <h1 className={`text-xl text-white ${
            activeTab === 'home' 
              ? 'font-medium tracking-widest' 
              : 'font-semibold tracking-wide'
          }`} style={activeTab === 'home' ? { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' } : {}}>
            {title}
          </h1>
        </div>

        {/* Right side - Profile icon or Explore controls */}
        <div className="flex items-center gap-3">
          {showExploreControls && exploreTopBarData && (
            <>
                             {/* View Mode Toggle */}
               {exploreTopBarData.showViewToggle && (
                 <button
                   onClick={exploreTopBarData.onViewModeToggle}
                   className="p-2 hover:text-white transition-all"
                   title={`Switch to ${exploreTopBarData.viewMode === 'list' ? 'grid' : 'list'} view`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-white transition-colors">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                       exploreTopBarData.viewMode === 'list' 
                         ? "M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"
                         : "M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"
                     } />
                   </svg>
                 </button>
               )}
               
               {/* Share Top Aspects Button */}
               <button
                 onClick={exploreTopBarData.onShareClick}
                 className="p-2 hover:text-[#1ed760] transition-all"
                 title="Share top music data"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[#1DB954] hover:text-[#1ed760] transition-colors">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                 </svg>
               </button>
            </>
          )}

          {/* Insights Share Button */}
          {showInsightsShare && (
            <button
              onClick={onInsightShare}
              className="p-2 hover:text-[#1ed760] transition-all"
              title="Share insights"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[#1DB954] hover:text-[#1ed760] transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          )}
          
          {showProfile && (
            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
              aria-label="Profile" 
              onClick={onProfileClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

interface FrameLayoutProps {
  // Removed unused children prop
}

export default function FrameLayout({}: FrameLayoutProps) {
  // Implement active tab state
  const [activeTab, setActiveTab] = useState('home');
  const [exploreOptions, setExploreOptions] = useState<{ section?: string } | undefined>();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [exploreTopBarData, setExploreTopBarData] = useState<{
    title: string;
    showViewToggle: boolean;
    viewMode: 'list' | 'grid';
    onViewModeToggle: () => void;
    onShareClick: () => void;
  }>();
  
  // Add scroll containers ref for scroll-to-top functionality
  const homeScrollRef = useRef<HTMLDivElement>(null);
  const exploreScrollRef = useRef<HTMLDivElement>(null);
  const insightsScrollRef = useRef<HTMLDivElement>(null);
  
  // Get Spotify connection status and global share functionality
  const { connected } = useSpotify();
  const { 
    isShareOpen, 
    shareDataType, 
    insightData, 
    topAspectData, 
    openInsightShare, 
    openTopAspectShare, 
    closeShare,
    fetchDataForTimeRange,
    prepareTopAspectDataForTimeRange,
    fetchAndPrepareTopAspectData
  } = useGlobalShare();
  
  const handleTabClick = (tab: string, options?: { section?: string }) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      
      // Handle explore tab with specific section
      if (tab === 'explore' && options?.section) {
        setExploreOptions(options);
      } else {
        setExploreOptions(undefined);
      }
    } else {
      // Same tab clicked - scroll to top
      let scrollRef: React.RefObject<HTMLDivElement> | null = null;
      
      switch (tab) {
        case 'home':
          scrollRef = homeScrollRef;
          break;
        case 'explore':
          scrollRef = exploreScrollRef;
          break;
        case 'insights-plus':
          scrollRef = insightsScrollRef;
          break;
      }
      
      if (scrollRef?.current) {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleProfileClick = () => {
    setShowUserProfile(true);
  };

  const handleCloseUserProfile = () => {
    setShowUserProfile(false);
  };

  // Memoize the time range change handler to prevent infinite re-renders
  const handleTimeRangeChange = useCallback(async (timeRange: 'short_term' | 'medium_term' | 'long_term') => {
    return await fetchAndPrepareTopAspectData(timeRange);
  }, [fetchAndPrepareTopAspectData]);

  // Render components without keys to prevent unnecessary remounting
  // Components will handle their own state management and optimization
  // Stable function reference to prevent infinite re-renders
  const handleExploreTopBarUpdate = useCallback((data: {
    title: string;
    showViewToggle: boolean;
    viewMode: 'list' | 'grid';
    onViewModeToggle: () => void;
    onShareClick: () => void;
  }) => {
    setExploreTopBarData({
      ...data,
      onShareClick: openTopAspectShare
    });
  }, [openTopAspectShare]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeLayout onTabClick={handleTabClick} onInsightShare={openInsightShare} scrollContainerRef={homeScrollRef} />;
      case 'explore':
        return <SpotifyDataView initialSection={exploreOptions?.section} onUpdateTopBar={handleExploreTopBarUpdate} scrollContainerRef={exploreScrollRef} />;
      case 'insights-plus':
        return <NewInsightsLayout scrollContainerRef={insightsScrollRef} />;
      default:
        return <HomeLayout onTabClick={handleTabClick} scrollContainerRef={homeScrollRef} />;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#0D0D0F] text-white">
      {/* Dynamic Top Bar - Always show for consistent experience */}
      <DynamicTopBar activeTab={activeTab} onProfileClick={handleProfileClick} exploreTopBarData={exploreTopBarData} onInsightShare={openInsightShare} />
      
      <main className="flex-1 relative overflow-hidden">
        {/* Render the active tab component without forced remounting */}
        {renderActiveTab()}
      </main>
      <BottomNav activeTab={activeTab} onTabClick={handleTabClick} />
      
      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile onClose={handleCloseUserProfile} />
      )}
      
      {/* Debug Panel for Testing Refresh Functionality */}
      <RefreshTestPanel enabled={true} />
      
      {/* Global Share Interface */}
      <GlobalShareInterface
        isOpen={isShareOpen}
        onClose={closeShare}
        dataType={shareDataType}
        insightData={insightData}
        topAspectData={topAspectData}
        onTimeRangeChange={handleTimeRangeChange}
      />
    </div>
  );
} 