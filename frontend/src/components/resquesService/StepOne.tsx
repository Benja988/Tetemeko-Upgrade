type StepProps = {
    step: number;
    onNext: () => void;
    onBack: () => void;
    formData: any;
    setFormData: any;
  };
  
  export default function StepOne({ onNext, formData, setFormData }: StepProps) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Step 1: Your Info</h2>
        <input
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          type="tel"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <div className="flex justify-end">
          <button onClick={onNext} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Next
          </button>
        </div>
      </div>
    );
  }
  