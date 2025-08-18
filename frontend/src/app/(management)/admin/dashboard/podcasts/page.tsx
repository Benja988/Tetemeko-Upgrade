'use client';

import PodcastsList from "@/components/admin/podcasts/PodcastList";
import PodcastsPageLayout from "@/components/admin/podcasts/PodcastsPageLayout";


export default function PodcastsPage() {
  return(
<>
<PodcastsPageLayout heading="Podcasts Management" />;
<PodcastsList />
</>
  ) 
}