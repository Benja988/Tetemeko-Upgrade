import { Podcast } from "@/interfaces/podcasts";

export const podcasts: Podcast[] = [
  {
    id: 1,
    title: "Tech Talks Weekly",
    description: "Exploring trends in software development.",
    host: "Jane Doe",
    category: "Technology",
    imageUrl: "https://picsum.photos/id/1011/600/400",
    status: "Published",
    episodes: [
      { id: 1, title: "The Rise of TypeScript", audioUrl: "/audio1.mp3", duration: "24:16" },
      { id: 2, title: "Microservices vs Monolith", audioUrl: "/audio2.mp3", duration: "30:05" },
      { id: 3, title: "AI in Web Development", audioUrl: "/audio3.mp3", duration: "22:42" }
    ]
  },
  {
    id: 2,
    title: "Creative Voices",
    description: "Conversations with creatives from all walks of life.",
    host: "Carlos Rivera",
    category: "Arts",
    imageUrl: "https://picsum.photos/id/1015/600/400",
    status: "Published",
    episodes: [
      { id: 1, title: "The Mind of a Designer", audioUrl: "/audio4.mp3", duration: "28:00" },
      { id: 2, title: "Visual Storytelling", audioUrl: "/audio5.mp3", duration: "25:30" },
      { id: 3, title: "Music & Emotions", audioUrl: "/audio6.mp3", duration: "31:15" }
    ]
  },
  {
    id: 3,
    title: "Startup Pulse",
    description: "Startup news, founder stories, and investor insights.",
    host: "Alina Cheng",
    category: "Business",
    imageUrl: "https://picsum.photos/id/1025/600/400",
    status: "Published",
    episodes: [
      { id: 1, title: "From Idea to Launch", audioUrl: "/audio7.mp3", duration: "18:45" },
      { id: 2, title: "Funding Rounds Demystified", audioUrl: "/audio8.mp3", duration: "27:10" },
      { id: 3, title: "The Pivot that Saved Us", audioUrl: "/audio9.mp3", duration: "34:21" }
    ]
  },
  {
    id: 4,
    title: "Health First",
    description: "Insights on wellness, fitness, and a healthy lifestyle.",
    host: "Dr. Nia Brooks",
    category: "Health",
    imageUrl: "https://picsum.photos/id/1035/600/400",
    status: "Published",
    episodes: [
      { id: 1, title: "The Power of Sleep", audioUrl: "/audio10.mp3", duration: "21:05" },
      { id: 2, title: "Eating for Energy", audioUrl: "/audio11.mp3", duration: "26:55" },
      { id: 3, title: "Mental Fitness", audioUrl: "/audio12.mp3", duration: "19:40" }
    ]
  },
  {
    id: 5,
    title: "History Unfolded",
    description: "Unpacking historical events that shaped our world.",
    host: "Liam Bennett",
    category: "History",
    imageUrl: "https://picsum.photos/id/1045/600/400",
    status: "Published",
    episodes: [
      { id: 1, title: "The Fall of the Roman Empire", audioUrl: "/audio13.mp3", duration: "33:10" },
      { id: 2, title: "World War II in the Pacific", audioUrl: "/audio14.mp3", duration: "36:28" },
      { id: 3, title: "The Industrial Revolution", audioUrl: "/audio15.mp3", duration: "29:03" }
    ]
  }
];
