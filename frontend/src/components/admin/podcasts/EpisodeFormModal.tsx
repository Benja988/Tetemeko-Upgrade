"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Episode } from "@/interfaces/podcasts";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, id?: string) => void;
  episode?: Episode | null;
}

export default function EpisodeFormModal({ open, onClose, onSave, episode }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    if (episode) {
      setTitle(episode.title || "");
      setDescription(episode.description || "");
      setDuration(String(episode.duration || ""));
      setEpisodeNumber(String(episode.episodeNumber || ""));
      setTags(episode.tags?.join(", ") || "");
      setAudioUrl(episode.audioUrl || "");
    } else {
      setTitle("");
      setDescription("");
      setDuration("");
      setEpisodeNumber("");
      setTags("");
      setAudioUrl("");
      setFile(null);
    }
  }, [episode]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("episodeNumber", episodeNumber);
    formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim())));
    
    if (file) {
      formData.append("audioFile", file); // backend should upload and return audioUrl
    } else if (audioUrl) {
      formData.append("audioUrl", audioUrl); // allow direct URL if no file
    }

    onSave(formData, episode?._id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{episode ? "Edit Episode" : "Add Episode"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Title */}
          <input
            className="border p-2 w-full rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <textarea
            className="border p-2 w-full rounded"
            placeholder="Description"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Duration */}
          <input
            className="border p-2 w-full rounded"
            placeholder="Duration (seconds)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          {/* Episode Number */}
          <input
            className="border p-2 w-full rounded"
            placeholder="Episode Number"
            type="number"
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(e.target.value)}
          />

          {/* Tags */}
          <input
            className="border p-2 w-full rounded"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Audio File Upload */}
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {/* OR Audio URL */}
          <input
            className="border p-2 w-full rounded"
            placeholder="Audio URL (optional if file is uploaded)"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{episode ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
