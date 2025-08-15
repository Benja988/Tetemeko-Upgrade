'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { Station } from "@/interfaces/Station";
import Modal from "./Modal";
import { toBase64 } from "@/utils/toBase64";
import { FiRadio, FiTv, FiUpload, FiCheckCircle } from "react-icons/fi";

export interface StationFormData
  extends Omit<Station, "_id" | "genre" | "listenerz"> {
  genres: string; // comma-separated for form
  listenerz: string; // keep as string for input
}

interface StationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: Omit<Station, "_id">) => Promise<void>;
  initialData?: Station;
}

export default function StationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: StationFormModalProps) {
  // Form state
  const [formData, setFormData] = useState<StationFormData>({
    name: "",
    description: "",
    streamUrl: "",
    imageUrl: "",
    location: "",
    genres: "",
    type: "Radio Station",
    isActive: true,
    liveShow: "",
    listenerz: "",
    frequency: null,
    id: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState("");

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        streamUrl: initialData.streamUrl || "",
        imageUrl: initialData.imageUrl || "",
        location: initialData.location || "",
        genres: (initialData.genre || []).join(", "),
        type: initialData.type || "Radio Station",
        isActive: initialData.isActive ?? true,
        liveShow: initialData.liveShow || "",
        listenerz: initialData.listenerz?.toString() || "",
        frequency: initialData.frequency,
        id: initialData.id,
      });
      setImagePreview(initialData.imageUrl || "");
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      streamUrl: "",
      imageUrl: "",
      location: "",
      genres: "",
      type: "Radio Station",
      isActive: true,
      liveShow: "",
      listenerz: "",
      frequency: null,
      id: null,
    });
    setImagePreview("");
    setErrors({});
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrors(prev => ({ ...prev, imageUrl: "Please select an image file" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUrl: "Image must be less than 2MB" }));
      return;
    }

    try {
      const base64 = await toBase64(file);
      setFormData(prev => ({ ...prev, imageUrl: base64 as string }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, imageUrl: "" }));
    } catch (error) {
      console.error("Error converting image:", error);
      setErrors(prev => ({ ...prev, imageUrl: "Failed to process image" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Station name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.streamUrl && !isValidUrl(formData.streamUrl)) {
      newErrors.streamUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const stationData: Omit<Station, "_id"> = {
      ...formData,
      genre: formData.genres.split(",").map(g => g.trim()).filter(Boolean),
      listenerz: Number(formData.listenerz) || 0,
    };

    try {
      setLoading(true);
      await onSubmit(stationData);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Station submission failed:", error);
      setErrors(prev => ({
        ...prev,
        form: "Failed to save station. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title={initialData ? "Edit Station" : "Add New Station"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <InputField
              label="Station Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <TextAreaField
              label="Description"
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              rows={3}
            />

            <InputField
              label="Stream URL"
              name="streamUrl"
              type="url"
              value={formData.streamUrl ?? ""}
              onChange={handleChange}
              error={errors.streamUrl}
              placeholder="https://example.com/stream"
            />

            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Station Logo
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Station logo preview"
                      className="h-24 w-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, imageUrl: "" }));
                        setImagePreview("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <FiCheckCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiRadio size={24} className="text-gray-400" />
                  </div>
                )}
                <label className="flex-1">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <FiUpload size={18} />
                    <span className="text-sm">Upload Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
              )}
            </div>

            <InputField
              label="Genres (comma separated)"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="e.g. Pop, Rock, Jazz"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Station Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="Radio Station"
                    checked={formData.type === "Radio Station"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <div className="flex items-center gap-1">
                    <FiRadio size={18} />
                    <span>Radio Station</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="TV Station"
                    checked={formData.type === "TV Station"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <div className="flex items-center gap-1">
                    <FiTv size={18} />
                    <span>TV Station</span>
                  </div>
                </label>
              </div>
            </div>

            <InputField
              label="Current Show"
              name="liveShow"
              value={formData.liveShow ?? ""}
              onChange={handleChange}
              placeholder="e.g. Morning Show"
            />

            <InputField
              label="Listener Count"
              name="listenerz"
              type="number"
              value={formData.listenerz}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, isActive: e.target.checked }))
              }
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Active Station
            </span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                  Processing...
                </>
              ) : initialData ? (
                "Update Station"
              ) : (
                "Create Station"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

// Reusable InputField Component
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  min?: string;
  rows?: number;
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  required,
  min,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Reusable TextAreaField Component
function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  rows = 3,
}: Omit<InputFieldProps, "type" | "min">) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
