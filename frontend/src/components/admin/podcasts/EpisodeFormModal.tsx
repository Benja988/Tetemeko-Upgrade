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
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (episode) {
      setTitle(episode.title);
      setDuration(String(episode.duration));
    } else {
      setTitle("");
      setDuration("");
    }
  }, [episode]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("duration", duration);
    if (file) formData.append("audioFile", file);
    onSave(formData, episode?._id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{episode ? "Edit Episode" : "Add Episode"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            className="border p-2 w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="Duration (mins)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{episode ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
