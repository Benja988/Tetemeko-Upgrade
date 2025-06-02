import { useState, useEffect, ChangeEvent } from "react";
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

  // Local state for file upload preview
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setStreamUrl(initialData.streamUrl || "");
      setLogoUrl(initialData.imageUrl || "");
      setLocation(initialData.location || "");
      setGenres((initialData.genres || []).join(", "));
      setLogoFile(null);
    } else {
      setName("");
      setDescription("");
      setStreamUrl("");
      setLogoUrl("");
      setLocation("");
      setGenres("");
      setLogoFile(null);
    }
  }, [initialData]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Show local preview for uploaded image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Note: Upload logic of logoFile to your backend/cloud is out of scope here
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Station Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Station Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Enter station name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
          />
        </div>

        {/* Stream URL */}
        <div>
          <label htmlFor="streamUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Stream URL
          </label>
          <input
            id="streamUrl"
            type="url"
            placeholder="https://example.com/stream"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Station Logo</label>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Station logo preview"
              className="mb-2 h-28 w-28 object-contain rounded border border-gray-300 shadow-sm"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Genres */}
        <div>
          <label htmlFor="genres" className="block text-sm font-medium text-gray-700 mb-1">
            Genres (comma-separated)
          </label>
          <input
            id="genres"
            type="text"
            placeholder="Rock, Jazz, Hip-hop"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          {initialData ? "Update" : "Add"} Station
        </button>
      </form>
    </Modal>
  );
}
