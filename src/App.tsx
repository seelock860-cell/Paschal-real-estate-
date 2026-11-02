import React, { useState, useEffect } from 'react';
import { Property, FilterState } from './types/property';
import { INITIAL_PROPERTIES } from './data/initialProperties';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScheduleViewingModal } from './components/ScheduleViewingModal';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Global Schedule Viewing Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [modalPropertyTarget, setModalPropertyTarget] = useState<Property | null>(null);

  // Filters passed from Home search bar
  const [passedFilters, setPassedFilters] = useState<Partial<FilterState>>({});

  // Sync with URL hash / history for clean navigation (supports #/admin, #admin, etc.)
  useEffect(() => {
    const handleNavigationSync = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      const cleanHash = rawHash.replace(/^\/+|\/+$/g, '');

      if (!cleanHash || cleanHash === 'home') {
        setCurrentPage('home');
        setSelectedPropertyId(null);
      } else if (cleanHash.startsWith('property/')) {
        const id = cleanHash.replace('property/', '');
        setSelectedPropertyId(id);
        setCurrentPage('property-detail');
      } else if (['properties', 'about', 'contact', 'admin'].includes(cleanHash)) {
        setCurrentPage(cleanHash);
        setSelectedPropertyId(null);
      }
    };

    window.addEventListener('popstate', handleNavigationSync);
    window.addEventListener('hashchange', handleNavigationSync);
    handleNavigationSync();

    return () => {
      window.removeEventListener('popstate', handleNavigationSync);
      window.removeEventListener('hashchange', handleNavigationSync);
    };
  }, []);

  // Fetch properties from backend API on mount
  useEffect(() => {
    loadProperties();
    checkAdminAuth();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await api.getProperties();
      if (Array.isArray(data) && data.length > 0) {
        setProperties(data);
      }
    } catch (err) {
      console.warn('Using initial properties fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminAuth = async () => {
    const user = await api.checkAuth();
    setIsAdminLoggedIn(!!user);
  };

  const navigateTo = (page: string, propertyId?: string) => {
    setCurrentPage(page);
    let targetHash = '';
    if (page === 'property-detail' && propertyId) {
      setSelectedPropertyId(propertyId);
      targetHash = `#/property/${propertyId}`;
    } else {
      setSelectedPropertyId(null);
      targetHash = page === 'home' ? '' : `#/${page}`;
    }

    // Update history without triggering native browser anchor jumping
    const newUrl = targetHash ? `${window.location.pathname}${targetHash}` : window.location.pathname;
    window.history.pushState(null, '', newUrl);

    // Instant clean scroll to top to prevent page transition moving jitter
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedPropertyId(property.id);
    navigateTo('property-detail', property.id);
  };

  const handleOpenScheduleModal = (property: Property | null = null) => {
    setModalPropertyTarget(property);
    setIsScheduleModalOpen(true);
  };

  const handleNavigateToPropertiesWithFilter = (filters?: { neighborhood?: string; category?: string; bedrooms?: string }) => {
    if (filters) {
      setPassedFilters({
        neighborhood: filters.neighborhood || 'All Neighborhoods',
        category: filters.category || 'All Types',
        bedrooms: filters.bedrooms || 'all',
      });
    }
    navigateTo('properties');
  };

  // Find active property for detail view
  const currentProperty = selectedPropertyId
    ? properties.find((p) => p.id === selectedPropertyId || p.slug === selectedPropertyId) || properties[0]
    : properties[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-[#EDEDED]">
      {/* 1. Header / Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenScheduleModal={() => handleOpenScheduleModal(null)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1">
        {loading && properties.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Loading Paschal Realty Portfolio...
            </p>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                properties={properties}
                onSelectProperty={handleSelectProperty}
                onOpenSchedule={handleOpenScheduleModal}
                onNavigateToProperties={handleNavigateToPropertiesWithFilter}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'properties' && (
              <PropertiesPage
                properties={properties}
                onSelectProperty={handleSelectProperty}
                onOpenSchedule={handleOpenScheduleModal}
                initialFilters={passedFilters}
              />
            )}

            {currentPage === 'property-detail' && currentProperty && (
              <PropertyDetailPage
                property={currentProperty}
                onBack={() => navigateTo('properties')}
                onSelectProperty={handleSelectProperty}
                allProperties={properties}
                onOpenSchedule={handleOpenScheduleModal}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigate={navigateTo}
                onOpenSchedule={() => handleOpenScheduleModal(null)}
              />
            )}

            {currentPage === 'contact' && <ContactPage />}

            {currentPage === 'admin' && (
              <AdminDashboard
                properties={properties}
                onRefreshProperties={loadProperties}
              />
            )}
          </>
        )}
      </main>

      {/* 3. Footer */}
      <Footer onNavigate={navigateTo} />

      {/* 4. Floating WhatsApp Concierge */}
      <FloatingWhatsApp />

      {/* 5. Schedule Viewing Modal */}
      <ScheduleViewingModal
        property={modalPropertyTarget}
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}
