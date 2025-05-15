'use client';


import Navbar from '@/components/Navbar';
import StepIndicator from '@/components/resquesService/StepIndicator';
import StepOne from '@/components/resquesService/StepOne';
import StepThree from '@/components/resquesService/StepThree';
import StepTwo from '@/components/resquesService/StepTwo';
import { useState } from 'react';


export default function RequestServicesPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      service: "",
      description: "",
      date: "",
      time: "",
    });
  
    const onNext = () => setStep((prev) => prev + 1);
    const onBack = () => setStep((prev) => prev - 1);
    const onSubmit = () => setStep(4);
  
    return (
        <>
        <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Reserve Media Services</h1>
        <StepIndicator step={step} />
  
        {step === 1 && (
          <StepOne step={step} onNext={onNext} onBack={onBack} formData={formData} setFormData={setFormData} />
        )}
        {step === 2 && (
          <StepTwo step={step} onNext={onNext} onBack={onBack} formData={formData} setFormData={setFormData} />
        )}
        {step === 3 && (
          <StepThree step={step} onSubmit={onSubmit} onBack={onBack} formData={formData} setFormData={setFormData} />
        )}
        {step === 4 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Thank you!</h2>
            <p className="text-gray-700">Your service request has been submitted. We'll get back to you shortly.</p>
            <button
              onClick={() => setStep(1)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit Another Request
            </button>
          </div>
        )}
      </div>
      </>
    );
  }