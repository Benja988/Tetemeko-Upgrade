"use client";

import { useState } from "react";
import { StepProps } from "@/types/step-props";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

export default function StepThree({ onBack, onSubmit, formData, setFormData }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.date ? new Date(formData.date) : null
  );
  const [selectedTime, setSelectedTime] = useState<Date | null>(
    formData.time ? new Date(`1970-01-01T${formData.time}`) : null
  );

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time.");
      return;
    }

    const combinedDateTime = new Date(
      `${selectedDate.toISOString().split("T")[0]}T${selectedTime.toTimeString().slice(0, 5)}`
    );

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);

    setFormData({
      ...formData,
      date: combinedDateTime.toISOString().split("T")[0],
      time: combinedDateTime.toTimeString().slice(0, 5),
    });

    toast.success("Service scheduled successfully!");
    setTimeout(() => onSubmit?.(), 1000);
  };

  const today = new Date();
  const isToday = selectedDate?.toDateString() === today.toDateString();

  const getMinTime = () => {
    const now = new Date();
    now.setSeconds(0);
    return isToday ? now : new Date("1970-01-01T00:00:00");
  };

  const getMaxTime = () => new Date("1970-01-01T23:45:00");

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-semibold text-gray-800">Step 3: Schedule a Time</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date Picker Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 space-y-3">
          <h3 className="text-md font-medium text-gray-700">Choose a Date</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            minDate={today}
            placeholderText="Select a date"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        {/* Time Picker Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 space-y-3">
          <h3 className="text-md font-medium text-gray-700">Choose a Time</h3>
          <DatePicker
            selected={selectedTime}
            onChange={(time) => setSelectedTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="Select a time"
            minTime={getMinTime()}
            maxTime={getMaxTime()}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
