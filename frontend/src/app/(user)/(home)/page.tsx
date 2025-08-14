
'use client';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import { ReactNode, memo } from 'react';
import Hero from "@/components/Hero";
import CustomerCareChat from "@/components/CustomerCareChat";
import Footer from "@/components/Footer";

const AboutUs = dynamic(() => import('@/components/AboutUs'), { ssr: false });
const OurServices = dynamic(() => import('@/components/OurServices'), { ssr: false });
const LiveNow = dynamic(() => import('@/components/LiveNow'), { ssr: false });
const TrendingPodcasts = dynamic(() => import('@/components/TrendingPodcasts'), { ssr: false });
const TrendingNews = dynamic(() => import('@/components/TrendingNews'), { ssr: false });
const ShopFromUs = dynamic(() => import('@/components/ShopFromUs'), { ssr: false });
const Events = dynamic(() => import('@/components/Events'), { ssr: false });
const FAQs = dynamic(() => import('@/components/FAQs'), { ssr: false });
const Feedback = dynamic(() => import('@/components/Feedback'), { ssr: false });

const LazySection = memo(({ children }: { children: ReactNode }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return <div ref={ref}>{inView ? children : null}</div>;
});
LazySection.displayName = "LazySection";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
       <LazySection><AboutUs /></LazySection>
      <LazySection><OurServices /></LazySection>
      <LazySection><LiveNow /></LazySection>
      <LazySection><TrendingPodcasts /></LazySection>
      <LazySection><TrendingNews /></LazySection>
      <LazySection><ShopFromUs /></LazySection>
      <LazySection><Events /></LazySection>
      <LazySection><FAQs /></LazySection>
      <LazySection><Feedback /></LazySection>
      <Footer />
      <CustomerCareChat />
    </main>
  );
}
