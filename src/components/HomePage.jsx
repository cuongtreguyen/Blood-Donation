import React from 'react';

// Layout Components
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import EmergencyBanner from './layout/EmergencyBanner';

// Homepage Sections
import HeroSection from '../page/homepage/HeroSection';
import StatisticsSection from '../page/homepage/StatisticsSection';
import DonationProcess from '../page/homepage/DonationProcess';
import BloodTypesSection from '../page/homepage/BloodTypesSection';
import LocationsSection from '../page/homepage/LocationsSection';
import AboutSection from '../page/homepage/AboutSection';
import TestimonialsSection from '../page/homepage/TestimonialsSection';
import NewsSection from '../page/homepage/NewsSection';

// Forms
import QuickDonationForm from './forms/QuickDonationForm';

// Custom CSS
const customStyles = `
  .min-vh-75 {
    min-height: 75vh !important;
  }
  
  .bg-gradient-danger {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  }
  
  .card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
  }
  
  .btn {
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .navbar {
    transition: all 0.3s ease;
  }
  
  .hero-section {
    position: relative;
    overflow: hidden;
  }
  
  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
    z-index: 1;
  }
  
  .hero-section > * {
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    .display-4 {
      font-size: 2.5rem;
    }
  }
  
  .alert {
    animation: slideDown 0.5s ease-out;
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

function HomePage() {
  return (
    <div>
      {/* External CSS Links */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      
      <EmergencyBanner />
      <Navbar />
      <HeroSection />
      <StatisticsSection />
      <DonationProcess />
      <BloodTypesSection />
      <QuickDonationForm />
      <LocationsSection />
      <TestimonialsSection />
      <NewsSection />
      <AboutSection />
      <Footer />
      
      {/* Custom Styles */}
      <style jsx="true">{customStyles}</style>
    </div>
  );
}

export default HomePage; 