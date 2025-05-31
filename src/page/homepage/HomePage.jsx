import React from 'react';

// Layout Components
import Footer from '../../components/layout/Footer';
import EmergencyBanner from '../../components/layout/EmergencyBanner';

// Homepage Sections
import HeroSection from '../../components/layout/HeroSection';
import StatisticsSection from '../../components/layout/StatisticsSection';
import DonationProcess from '../../components/layout/DonationProcess';
import BloodTypesSection from '../../components/layout/BloodTypesSection';
import LocationsSection from '../../components/layout/LocationsSection';
import AboutSection from '../../components/layout/AboutSection';
import TestimonialsSection from '../../components/layout/TestimonialsSection';
import NewsSection from '../../components/layout/NewsSection';

// Forms
import QuickDonationForm from '../../components/forms/QuickDonationForm';

// Custom CSS


function HomePage() {
  return (
    <div>
      
      <EmergencyBanner />
{/*
      <HeroSection />
      <StatisticsSection />
      <DonationProcess />
      <BloodTypesSection />
      <QuickDonationForm />
      <LocationsSection />
      <TestimonialsSection />
      <NewsSection />
      <AboutSection />
*/}
      {/* Custom Styles */}
    </div>
  );
}

export default HomePage; 