import { Station } from "@/interfaces/Station";

export const stations: Station[] = [
  {
    id: 1,
    name: "Radio Piny Luo",
    type: "Radio Station",
    description: "The voice of the streets, playing the best hits of the year.",
    genre: "Music, Talk",
    imageUrl: "/img6.jpg",
    location: "Kisumu, Kenya",
    liveShow: "The Morning Hustle",
    listeners: 1264,
    status: "Live",
    link: "/stations/1",

  },
  {
    id: 2,
    name: "Tetemeko TV",
    type: "TV Station",
    description: "Live TV broadcasting with daily news, sports, and entertainment.",
    genre: "News, Sports, Entertainment",
    imageUrl: "/img6.jpg",
    location: "Dar es Salaam, Tanzania",
    liveShow: "Tetemeko Today",
    listeners: 849,
    status: "Live",
    link: "/stations/2",

  },
  {
    id: 3,
    name: "Tetemeko Sports Radio",
    type: "Radio Station",
    description: "All sports, all the time. Never miss the action.",
    genre: "Sports, Talk",
    imageUrl: "/img6.jpg",
    location: "Arusha, Tanzania",
    liveShow: "Sports Central",
    listeners: 978,
    status: "Offline",
    link: "/stations/3",

  },
  {
    id: 4,
    name: "Youth Wave",
    type: "Radio Station",
    description: "A station for the new generation, bold and fresh.",
    genre: "Urban, Youth",
    imageUrl: "/img6.jpg",
    location: "Nairobi, Kenya",
    liveShow: "Wave Mornings",
    listeners: 1123,
    status: "Live",
    link: "/stations/4",

  },
];
