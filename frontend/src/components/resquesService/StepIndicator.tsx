"use client";

import {
  FaInfoCircle,
  FaClipboardList,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  { label: "Basic Info", icon: <FaInfoCircle /> },
  { label: "Service Type", icon: <FaClipboardList /> },
  { label: "Schedule", icon: <FaCalendarAlt /> },
  { label: "Confirmation", icon: <FaCheckCircle /> },
];

export default function StepIndicator({ step }: { step: number }) {
  const getStepStatus = (index: number) => {
    if (index + 1 < step) return "completed";
    if (index + 1 === step) return "active";
    return "pending";
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-blue-600";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 mb-6">
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
        {steps.map((s, index) => {
          const status = getStepStatus(index);
          const colorClass = getStepColor(status);

          return (
            <div key={index} className="flex flex-col items-center text-center w-20 sm:w-24">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl ${colorClass} transition duration-300`}
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </div>
              <span className="text-xs sm:text-sm mt-2 text-gray-700">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2 sm:mt-4">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
