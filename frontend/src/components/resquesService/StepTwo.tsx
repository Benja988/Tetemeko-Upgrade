import { StepProps } from "@/types/step-props";


const services = ["Radio Advertising", "Podcast Hosting", "Live Event Coverage", "Production Services"];

export default function StepTwo({ onNext, onBack, formData, setFormData }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Step 2: Choose Service</h2>
      <select
        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={formData.service}
        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
      >
        <option value="">Select a service</option>
        {services.map((service) => (
          <option key={service} value={service}>{service}</option>
        ))}
      </select>
      <textarea
        placeholder="Describe your needs"
        rows={4}
        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
          Back
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Next
        </button>
      </div>
    </div>
  );
}
