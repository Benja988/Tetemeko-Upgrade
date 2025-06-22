type StepProps = {
  step: number;
  onNext: () => void;
  onBack?: () => void;
  formData: any;
  setFormData: any;
};

export default function StepOne({ onNext, formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 1: Your Info</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+254 712 345 678"
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
