import { useState, useEffect, ChangeEvent } from "react";
import { Station, StationInput } from "@/interfaces/Station";
import Modal from "./Modal";
import { toBase64 } from "@/utils/toBase64";

interface StationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: StationInput) => Promise<void>;
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
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [genres, setGenres] = useState("");
  const [type, setType] = useState<"Radio Station" | "TV Station">("Radio Station");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [liveShow, setLiveShow] = useState("");
  const [listenerz, setListenerz] = useState<number | string>("");


  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setStreamUrl(initialData.streamUrl || "");
      setImageUrl(initialData.imageUrl || "");
      setLocation(initialData.location || "");
      setGenres((initialData.genre || []).join(", "));
      setType(initialData.type || "Radio Station");
      setIsActive(initialData.isActive ?? true);
      setLiveShow(initialData.liveShow || "");
      setListenerz(initialData.listenerz || "");
    } else {
      setName("");
      setDescription("");
      setStreamUrl("");
      setImageUrl("");
      setLocation("");
      setGenres("");
      setType("Radio Station");
      setIsActive(true);
      setLiveShow("");
      setListenerz("");
    }
  }, [initialData]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await toBase64(file);
        setImageUrl(base64); // this will be sent in request body as imageUrl
      } catch (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image. Please try a different file.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!name || !location || !type) {
      alert("Please fill in required fields: name, location, and type.");
      return;
    }

    const stationData: StationInput = {
      name,
      description,
      streamUrl,
      imageUrl,
      location,
      genre: genres.split(",").map((g) => g.trim()).filter(Boolean),
      type,
      isActive,
      liveShow,
      listenerz: Number(listenerz) || 0,
    };

    try {
      setLoading(true);
      await onSubmit(stationData);
      onClose();
    } catch (error) {
      console.error("Station submission failed:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Station" : "Add New Station"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-5"
      >
        {/* Station Name */}
        <InputField
          label="Station Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. East Radio 92.7"
        />

        {/* Description */}
        <TextAreaField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief station description"
        />

        {/* Stream URL */}
        <InputField
          label="Stream URL"
          type="url"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          placeholder="https://stream.example.com/live"
        />

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo (optional)</label>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mb-2 h-24 w-24 object-contain rounded border"
            />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Location */}
        <InputField
          label="Location"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Nairobi, Kenya"
        />

        {/* Genres */}
        <InputField
          label="Genres"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          placeholder="Comma-separated e.g. Pop, Rock"
        />

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Station Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "Radio Station" | "TV Station")}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="Radio Station">Radio Station</option>
            <option value="TV Station">TV Station</option>
          </select>
        </div>
        {/* Live Show Title */}
        <InputField
          label="Live Show Title"
          value={liveShow}
          onChange={(e) => setLiveShow(e.target.value)}
          placeholder="e.g. The Morning Drive"
        />

        {/* Listenerz */}
        <InputField
          label="Listener Count"
          type="number"
          value={String(listenerz)}
          onChange={(e) => setListenerz(Number(e.target.value))}
          placeholder="e.g. 150"
        />


        {/* Active Status */}
        <div className="flex items-center gap-2 mt-2">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Station" : "Create Station"}
        </button>
      </form>
    </Modal>
  );
}

/* -------------------- Reusable InputField Component -------------------- */
interface InputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

function InputField({ label, value, onChange, placeholder, type = "text", required }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2 resize-none"
      />
    </div>
  );
}
