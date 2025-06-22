import { StepProps } from "@/types/step-props";

const services = [
  "Radio Advertising",
  "Podcast Hosting",
  "Live Event Coverage",
  "Production Services",
];

export default function StepTwo({ onNext, onBack, formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 2: Choose a Service</h2>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-5 border border-gray-200">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Select Service
          </label>
          <select
            id="service"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          >
            <option value="">-- Choose a service --</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Describe Your Needs
          </label>
          <textarea
            id="description"
            placeholder="Briefly describe your requirements"
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
