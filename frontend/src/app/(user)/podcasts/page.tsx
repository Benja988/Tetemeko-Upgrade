"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import PodCastFooter from "@/components/podcasts/PodCastFooter";
// import PodCastSection1 from "@/components/podcasts/PodCastSection1";
// import PodCastSection2 from "@/components/podcasts/PodCastSection2";
// import PodCastSection3 from "@/components/podcasts/PodCastSection3";
// import PodCastSection4 from "@/components/podcasts/PodCastSection4";


export default function PodcastPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Podcasts" } // current page, no href
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      {/* <PodCastSection1 />
      <PodCastSection2 />
      <PodCastSection3 />
      <PodCastSection4 /> */}
      {/* <PodCastSection5 /> */}
      {/* <PodCastSection6 /> */}
      {/* <PodCastSection7 /> */}
      {/* <PodCastSection8 /> */}
      {/* <PodCastSection9 /> */}
      {/* <PodCastSection10 /> */}
      <PodCastFooter />
    </>
  );
}
