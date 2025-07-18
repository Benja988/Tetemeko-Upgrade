import { Station } from "@/interfaces/Station";

export const stations: Station[] = [
  {
    _id: "1",
    name: "Radio Piny Luo",
    type: "Radio Station",
    description: "The voice of the streets, playing the best hits of the year.",
    genre: ["Music", "Talk"],
    imageUrl: "/logopiny.jpg",
    location: "Kisumu, Kenya",
    liveShow: "The Morning Hustle",
    listenerz: 1264,
    isActive: true,
  },
  {
    _id: "2",
    name: "Piny Luo TV",
    type: "TV Station",
    description: "Live TV broadcasting with daily news, sports, and entertainment.",
    genre: ["News", "Sports", "Entertainment"],
    imageUrl: "/logopiny.jpg",
    location: "Kisumu, Kenya",
    liveShow: "Tetemeko Today",
    listenerz: 849,
    isActive: true,
  },
  {
    _id: "3",
    name: "Tetemeko TV",
    type: "Radio Station",
    description: "All sports, all the time. Never miss the action.",
    genre: ["Sports", "Talk"],
    imageUrl: "/logo.jpg",
    location: "Kisumu, Kenya",
    liveShow: "Sports Central",
    listenerz: 978,
    isActive: false,
  },
];
