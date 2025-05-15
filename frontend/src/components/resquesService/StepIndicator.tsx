"use client";

import { FaInfoCircle, FaClipboardList, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const steps = [
  { label: "Basic Info", icon: <FaInfoCircle /> },
  { label: "Service Type", icon: <FaClipboardList /> },
  { label: "Schedule", icon: <FaCalendarAlt /> },
  { label: "Confirmation", icon: <FaCheckCircle /> },
];

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div className="w-full flex flex-col items-center gap-4 mb-6">
      <div className="flex items-center justify-center gap-6">
        {steps.map((s, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl transition
                ${index + 1 === step ? "bg-blue-600" : index + 1 < step ? "bg-green-500" : "bg-gray-300"}`}
              title={s.label}
            >
              {s.icon}
            </div>
            <span className="text-sm mt-2 text-gray-700">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full bg-blue-600 transition-all duration-300`} style={{ width: `${(step - 1) * 33.33}%` }} />
      </div>
    </div>
  );
}
