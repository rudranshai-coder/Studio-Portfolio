/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/portfolioData';
import { PortfolioConfig, CategoryInfo, ProjectItem } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { CreativeAreas } from './components/CreativeAreas';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { CreativeProcess } from './components/CreativeProcess';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CategoryModal } from './components/CategoryModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { QuickCmsModal } from './components/QuickCmsModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { CinematicScrollJourney } from './components/CinematicScrollJourney';
import { SectionDivider } from './components/SectionDivider';
import { EntranceScreen } from './components/EntranceScreen';
import { ScrollToTop } from './components/ScrollToTop';
import { SlidersHorizontal } from 'lucide-react';
import { useAuth } from './context/AuthContext';

export default function App() {
  const [config, setConfig] = useState<PortfolioConfig>(() => {
    try {
      localStorage.removeItem('rudransh_portfolio_config_v24');
      localStorage.removeItem('rudransh_portfolio_config_v25');
      localStorage.removeItem('rudransh_portfolio_config_v26');
      localStorage.removeItem('rudransh_portfolio_config_v27');
      localStorage.removeItem('rudransh_portfolio_config_v28');
      localStorage.removeItem('rudransh_portfolio_config_v29');
      localStorage.removeItem('rudransh_portfolio_config_v30');
      localStorage.removeItem('rudransh_portfolio_config_v31');
      localStorage.removeItem('rudransh_portfolio_config_v32');
      localStorage.removeItem('rudransh_portfolio_config_v33');
      localStorage.removeItem('rudransh_portfolio_config_v34');
      localStorage.removeItem('rudransh_portfolio_config_v35');
      localStorage.removeItem('rudransh_portfolio_config_v36');
      localStorage.removeItem('rudransh_portfolio_config_v37');
      localStorage.removeItem('rudransh_portfolio_config_v38');
      localStorage.removeItem('rudransh_portfolio_config_v39');
      const saved = localStorage.getItem('rudransh_portfolio_config_v43');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.categories &&
          parsed.categories.length >= 8 &&
          parsed.categories.some((c: any) => c.id === 'videos' && c.title === 'AI STORYWORLDS') &&
          parsed.projects &&
          parsed.projects.some((p: any) => p.id === 'campaign-03' && p.videoUrl) &&
          parsed.projects.some((p: any) => p.id === 'campaign-01' && p.videoUrl) &&
          parsed.projects.some((p: any) => p.id === 'campaign-02' && p.videoUrl) &&
          parsed.projects.some((p: any) => p.id === 'jewellery-ads-02' && p.additionalImages && p.additionalImages[0]?.includes('2jxSCKM1'))
        ) {
          if (
            !parsed.profileImageUrl ||
            parsed.profileImageUrl.includes('61824b79-7f65-4bb5-9a98-68f11233d8ba') ||
            parsed.profileImageUrl.includes('8900a93a-f496-496b-9049-62d97bf7aab8') ||
            parsed.profileImageUrl.includes('BZKrWzLD') ||
            parsed.profileImageUrl.includes('Pf02HrGB')
          ) {
            parsed.profileImageUrl = initialPortfolioData.profileImageUrl;
          }
          parsed.socialLinks = initialPortfolioData.socialLinks;
          parsed.contact = initialPortfolioData.contact;

          // Deduplicate projects and categories to ensure unique IDs across components
          const seenCat = new Set<string>();
          parsed.categories = (parsed.categories || []).filter((c: any) => {
            if (!c || !c.id || seenCat.has(c.id)) return false;
            seenCat.add(c.id);
            return true;
          });

          const seenProj = new Set<string>();
          parsed.projects = (parsed.projects || []).filter((p: any) => {
            if (!p || !p.id || seenProj.has(p.id)) return false;
            seenProj.add(p.id);
            return true;
          });

          return parsed;
        }
      }
    } catch {
      // Ignore fallback
    }
    return initialPortfolioData;
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [entranceKey, setEntranceKey] = useState(0);

  const { user } = useAuth();

  // If authenticated as admin (rudranshgoyal44@gmail.com), directly open Admin Portal
  useEffect(() => {
    if (user?.email && user.email.toLowerCase() === 'rudranshgoyal44@gmail.com') {
      setIsAdminPortalOpen(true);
    }
  }, [user?.email]);

  // Check URL hash or open-admin-portal event for direct admin navigation
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminPortalOpen(true);
      }
    };
    const handleAdminOpenEvent = () => {
      setIsAdminPortalOpen(true);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('open-admin-portal', handleAdminOpenEvent);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('open-admin-portal', handleAdminOpenEvent);
    };
  }, []);

  // Sync config updates to localStorage
  const handleSaveConfig = (newConfig: PortfolioConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('rudransh_portfolio_config_v43', JSON.stringify(newConfig));
    } catch {
      // Ignore
    }
  };

  const handleResetConfig = () => {
    setConfig(initialPortfolioData);
    try {
      localStorage.removeItem('rudransh_portfolio_config_v43');
    } catch {
      // Ignore
    }
  };

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll listener for active nav section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'work', 'services', 'process', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation & modal closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null);
        } else if (selectedCategory) {
          setSelectedCategory(null);
        } else if (isCmsOpen) {
          setIsCmsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, selectedCategory, isCmsOpen]);

  // Find category info for selected project
  const currentProjectCategory = selectedProject
    ? config.categories.find((c) => c.id === selectedProject.category)
    : undefined;

  return (
    <div className="min-h-screen bg-[#000811] text-[#F5F3EE] font-['Manrope'] selection:bg-[#38BDF8]/30 selection:text-white relative">
      {/* High-Tech Entrance Screen & Shutter Reveal Animation */}
      <EntranceScreen
        key={entranceKey}
        name={config.name}
        profileImageUrl={config.profileImageUrl}
      />

      {/* Continuous GSAP ScrollTrigger Cinematic Journey Background & Interactive Stage Telemetry */}
      <CinematicScrollJourney
        onNavigateSection={handleNavigate}
        isBackgroundMode={true}
      />

      {/* Top Sticky Minimal Navbar */}
      <Navbar
        name={config.name}
        onOpenCms={() => setIsCmsOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Cinematic Hero with Interactive AI Background & Profile Photo */}
        <Hero
          name={config.name}
          heroIdentity={config.heroIdentity}
          heroHeading={config.heroHeading}
          heroDescription={config.heroDescription}
          profileImageUrl={config.profileImageUrl}
          categories={config.categories}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onExploreClick={() => handleNavigate('work')}
          onCollaborateClick={() => handleNavigate('contact')}
          onEditPhotoClick={() => setIsCmsOpen(true)}
        />

        <SectionDivider />

        {/* 2. Editorial Statement Intro */}
        <Intro
          introTitle={config.introTitle}
          experienceSummary={config.experienceSummary}
        />

        <SectionDivider />

        {/* 3. Creative Areas: 6 Distinct Portfolio Categories with 1-2 Featured Projects each */}
        <CreativeAreas
          categories={config.categories}
          projects={config.projects}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        <SectionDivider />

        {/* 4. About Section */}
        <AboutSection
          name={config.name}
          education={config.education}
          experienceSummary={config.experienceSummary}
          onExploreWork={() => handleNavigate('work')}
        />

        <SectionDivider />

        {/* 5. Specialized Services Section */}
        <ServicesSection
          services={config.services}
          onContactClick={() => handleNavigate('contact')}
        />

        <SectionDivider />

        {/* 6. Creative Process Pipeline */}
        <CreativeProcess steps={config.processSteps} />

        <SectionDivider />

        {/* 7. Contact Section with Direct Channels & Quick Inquiry Dispatch */}
        <ContactSection
          headline={config.contactHeadline}
          contact={config.contact}
          socialLinks={config.socialLinks}
          onOpenAdmin={() => setIsAdminPortalOpen(true)}
        />
      </main>

      <SectionDivider />

      {/* 8. Footer */}
      <Footer
        name={config.name}
        socialLinks={config.socialLinks}
        onNavigate={handleNavigate}
      />

      {/* Category Collection Modal (Opened via EXPLORE NOW) */}
      <CategoryModal
        category={selectedCategory}
        projects={config.projects}
        isOpen={Boolean(selectedCategory)}
        onClose={() => setSelectedCategory(null)}
        onSelectProject={(proj) => {
          setSelectedProject(proj);
        }}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        allProjects={config.projects}
        categoryInfo={currentProjectCategory}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* Centralized Quick Content / URL Configuration Manager */}
      <QuickCmsModal
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetConfig={handleResetConfig}
      />

      {/* Admin Portal Modal (For Rudransh Goyal: View, Accept & Decline Collaborations & Manage Projects) */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => {
          setIsAdminPortalOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        projects={config.projects}
        onUpdateProjects={(updatedProjects) => {
          handleSaveConfig({ ...config, projects: updatedProjects });
        }}
      />

      {/* Floating discreet Config Pill for fast URL pasting & testing */}
      <button
        id="floating-config-pill"
        onClick={() => setIsCmsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#10121A]/90 hover:bg-[#181C28] backdrop-blur-md border border-[#23283B] hover:border-[#FF6A00]/50 text-[#9295A0] hover:text-[#F5F3EE] shadow-2xl font-['IBM_Plex_Mono'] text-[11px] transition-all transform hover:scale-105 active:scale-95"
        title="Open Centralized Portfolio Content & URL Manager"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6A00]" />
        <span className="hidden sm:inline">Config / URLs</span>
      </button>

      {/* Smooth Global Scroll-To-Top Button with Radial Progress Ring */}
      <ScrollToTop className="bottom-18 right-5" />
    </div>
  );
}
