'use client';

import HeroMarketplaceSection from '@/components/marketplace/HeroMarketplaceSection';
import MarketPlaceSection1 from '@/components/marketplace/MarketPlaceSection1';
import MarketPlaceSection2 from '@/components/marketplace/MarketPlaceSection2';
import MarketPlaceSection3 from '@/components/marketplace/MarketPlaceSection3';
import Navbar from '@/components/Navbar';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Hero Section */}
      <HeroMarketplaceSection />

      <MarketPlaceSection1 />
      <MarketPlaceSection2 />
      <MarketPlaceSection3 />
      {/* <MarketPlaceSection4 /> */}
      {/* <MarketPlaceSection5 /> */}
      {/* <MarketPlaceSection6 /> */}
      {/* <MarketPlaceSection7 /> */}
      {/* <MarketPlaceFooter />  */}
    </div>
  );
}