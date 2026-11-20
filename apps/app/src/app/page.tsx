'use client';

import React, { useState } from 'react';
import { NavigationSidebar, ActiveTab } from '@/components/NavigationSidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { AnnaChatInterface } from '@/components/AnnaChatInterface';
import { AnnaBuildInterface } from '@/components/AnnaBuildInterface';
import { PortalStatusCard } from '@/components/PortalStatusCard';
import { AcademyCatalog } from '@/components/AcademyCatalog';
import { ProjectsTracker } from '@/components/ProjectsTracker';
import { OrgSettings } from '@/components/OrgSettings';

export default function AppHomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [annaMode, setAnnaMode] = useState<'CHAT' | 'BUILD'>('CHAT');
  const [buildInitialPrompt, setBuildInitialPrompt] = useState<string | undefined>();

  const getNavbarTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Overview Dashboard';
      case 'anna':
        return annaMode === 'CHAT' ? 'Anna AI — Chat Mode' : 'Anna AI — Build Mode';
      case 'portals':
        return 'HubSpot Portals';
      case 'academy':
        return 'Learning Academy & Live Classes';
      case 'projects':
        return 'Client Projects';
      case 'settings':
        return 'Settings & Billing';
      default:
        return 'HuboVerse Workspace';
    }
  };

  const getNavbarSubtitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Executive overview of CRM health, AI operations, and learning';
      case 'anna':
        return annaMode === 'CHAT'
          ? 'Enterprise RAG advisor for HubSpot workflows, schemas, and best practices'
          : 'Safe 4-stage execution console with capability check and dry-run schema diff';
      case 'portals':
        return 'Multi-portal connections with encrypted credential storage';
      case 'academy':
        return 'LiveKit cloud workshops and Mux on-demand video masterclasses';
      case 'projects':
        return 'Track implementation roadmaps and expert consultant tasks';
      case 'settings':
        return 'Role-based access matrix and subscription limits';
      default:
        return undefined;
    }
  };

  const handleNavigateFromHome = (tab: ActiveTab, mode?: 'CHAT' | 'BUILD') => {
    setActiveTab(tab);
    if (mode) {
      setAnnaMode(mode);
    }
  };

  const handleSwitchToBuild = (promptText?: string) => {
    setActiveTab('anna');
    setAnnaMode('BUILD');
    if (promptText) {
      setBuildInitialPrompt(promptText);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090D16]">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        annaMode={annaMode}
        setAnnaMode={setAnnaMode}
        portalName="HubSpot Demo Account"
        isPortalConnected={true}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar
          title={getNavbarTitle()}
          subtitle={getNavbarSubtitle()}
          onGoHome={() => setActiveTab('home')}
          isHome={activeTab === 'home'}
        />

        <main className="flex-1 overflow-hidden">
          {activeTab === 'home' && (
            <DashboardOverview onNavigate={handleNavigateFromHome} />
          )}

          {activeTab === 'anna' && annaMode === 'CHAT' && (
            <AnnaChatInterface onSwitchToBuildMode={handleSwitchToBuild} />
          )}

          {activeTab === 'anna' && annaMode === 'BUILD' && (
            <AnnaBuildInterface
              initialPrompt={buildInitialPrompt}
              onSwitchToChatMode={() => setAnnaMode('CHAT')}
            />
          )}

          {activeTab === 'portals' && <PortalStatusCard />}

          {activeTab === 'academy' && <AcademyCatalog />}

          {activeTab === 'projects' && <ProjectsTracker />}

          {activeTab === 'settings' && <OrgSettings />}
        </main>
      </div>
    </div>
  );
}
