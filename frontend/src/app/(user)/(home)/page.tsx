import AboutUs from "@/components/AboutUs";
import Events from "@/components/Events";
import FeaturedWork from "@/components/FeaturedWork";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OurServices from "@/components/OurServices";
import PodcastsAndNews from "@/components/PodcastsAndNews";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <AboutUs />
      <OurServices />
      <FeaturedWork />

      {/* <PodcastProvider>
        <PodcastsAndNews />
      </PodcastProvider> */}
      
      <Events />
      <Feedback />
      <Footer />
    </main>
  )
}
