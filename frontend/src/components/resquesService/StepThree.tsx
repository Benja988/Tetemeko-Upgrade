import { useState } from "react";
import { StepProps } from "@/types/step-props";


export default function StepThree({ onBack, onSubmit, formData, setFormData }: StepProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    onSubmit?.()
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Step 3: Schedule</h2>
      <input
        type="date"
        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <input
        type="time"
        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
      />
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
