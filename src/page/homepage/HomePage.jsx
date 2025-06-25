import React, { useRef } from "react";

// Layout Components
import HeroSection from "../../components/layout/HeroSection";
import StatisticsSection from "../../components/layout/StatisticsSection";
import DonationProcess from "../../components/layout/DonationProcess";
import BloodTypesSection from "../../components/layout/BloodTypesSection";
import AboutSection from "../../components/layout/AboutSection";
import TestimonialsSection from "../../components/layout/TestimonialsSection";
import NewsSection from "../../components/layout/NewsSection";
import LearnMoreSection from "../../components/layout/LearnMoreSection";
import DonationLocations from "../../components/sections/DonationLocations";
import EmergencyBanner from "../../components/layout/EmergencyBanner";

function HomePage() {
  const learnMoreRef = useRef(null);

  const scrollToLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      <HeroSection onLearnMoreClick={scrollToLearnMore} />
      <StatisticsSection />
      <DonationProcess />
      <BloodTypesSection />
      <DonationLocations />
      <AboutSection />
      <TestimonialsSection />
      <NewsSection />
      <div ref={learnMoreRef}>
        <LearnMoreSection />
      </div>
    </div>
  );
}

export default HomePage;
