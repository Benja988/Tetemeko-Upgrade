import { useState, useEffect } from "react";
import { Station } from "@/interfaces/Station";
import Modal from "./Modal";

interface StationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: Partial<Station>) => void;
  initialData?: Station;
}

export default function StationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: StationFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [location, setLocation] = useState("");
  const [genres, setGenres] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setStreamUrl(initialData.streamUrl || "");
      setLogoUrl(initialData.imageUrl || "");
      setLocation(initialData.location || "");
      setGenres((initialData.genres || []).join(", "));
    } else {
      setName("");
      setDescription("");
      setStreamUrl("");
      setLogoUrl("");
      setLocation("");
      setGenres("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({
      name,
      description,
      streamUrl,
      imageUrl: logoUrl,
      location,
      genres: genres.split(",").map((g) => g.trim()),
      
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Station" : "Add Station"}
    >
      <div className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Station Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Stream URL"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Logo URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Genres (comma-separated)"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {initialData ? "Update" : "Add"} Station
        </button>
      </div>
    </Modal>
  );
}
