// src/components/podcasts/PodcastFormModal.tsx
"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Podcast } from "@/interfaces/podcasts";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, id?: string) => void;
  podcast?: Podcast | null;
}

export default function PodcastFormModal({ open, onClose, onSave, podcast }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (podcast) {
      setTitle(podcast.title);
    //   setCategory(podcast.category);
    } else {
      setTitle("");
      setCategory("");
    }
  }, [podcast]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    if (file) formData.append("coverImage", file);
    onSave(formData, podcast?._id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{podcast ? "Edit Podcast" : "Add Podcast"}</DialogTitle>
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
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{podcast ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
