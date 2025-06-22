import AboutUs from "@/components/AboutUs";
import CustomerCareChat from "@/components/CustomerCareChat";
import Events from "@/components/Events";
import FAQs from "@/components/FAQs";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LiveNow from "@/components/LiveNow";
import OurServices from "@/components/OurServices";
import ShopFromUs from "@/components/ShopFromUs";
import TrendingNews from "@/components/TrendingNews";
import TrendingPodcasts from "@/components/TrendingPodcasts";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <AboutUs />
      <OurServices />
      <LiveNow />
      <TrendingPodcasts />
      <TrendingNews />
      <ShopFromUs />
      {/* <FeaturedWork /> */}

      {/* <PodcastProvider>
        <PodcastsAndNews />
      </PodcastProvider> */}

      <Events />
      <FAQs />
      <Feedback />
      <Footer />

      <CustomerCareChat />
    </main>
  )
}
