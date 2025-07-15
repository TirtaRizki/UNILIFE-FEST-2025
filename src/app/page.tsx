"use client";

import React from 'react';
import PublicHeader from '@/components/landing/public-header';
import HeroSection from '@/components/landing/hero-section';
import AboutSection from '@/components/landing/about-section';
import BannerSection from '@/components/landing/banner-section';
import EventSection from '@/components/landing/event-section';
import LineupSection from '@/components/landing/lineup-section';
import RecapSection from '@/components/landing/recap-section';
import PublicFooter from '@/components/landing/public-footer';

export default function LandingPage() {
  return (
    <div className="bg-[#0A0A0A] text-white font-body">
      <PublicHeader />
      <main>
        <HeroSection />
        <BannerSection />
        <AboutSection />
        <EventSection />
        <LineupSection />
        <RecapSection />
      </main>
      <PublicFooter />
    </div>
  );
}
