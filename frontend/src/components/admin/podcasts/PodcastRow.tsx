"use client";
import Button from "@/components/ui/Button";
import { Podcast } from "@/interfaces/podcasts";

interface Props {
  podcast: Podcast;
  onEdit: (podcast: Podcast) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function PodcastRow({ podcast, onEdit, onDelete, onToggle }: Props) {
  return (
    <tr className="border-b">
      <td className="p-2">{podcast.title}</td>
      {/* <td className="p-2">{podcast.category}</td> */}
      <td className="p-2">{podcast.isActive ? "Active" : "Inactive"}</td>
      <td className="p-2 flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => onDelete(podcast._id)}>Delete</Button>
        <Button size="sm" onClick={() => onToggle(podcast._id)}>
          {podcast.isActive ? "Deactivate" : "Activate"}
        </Button>
      </td>
    </tr>
  );
}