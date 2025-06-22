'use client';

import Navbar from '@/components/Navbar';
import StepIndicator from '@/components/resquesService/StepIndicator';
import StepOne from '@/components/resquesService/StepOne';
import StepTwo from '@/components/resquesService/StepTwo';
import StepThree from '@/components/resquesService/StepThree';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function RequestServicesPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    description: '',
    date: '',
    time: '',
  });

  const onNext = () => setStep((prev) => prev + 1);
  const onBack = () => setStep((prev) => prev - 1);
  const onSubmit = () => setStep(4);

  return (
    <>
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-black py-16 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Reserve Professional Media Services
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Seamlessly book studio sessions, live event coverage, digital marketing, and more — all in one place.
          </p>
        </div>
      </section>

      {/* Step Form Section */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <StepIndicator step={step} />

        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 transition-all duration-300">
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
            <div className="text-center space-y-5 py-10">
              <h2 className="text-2xl font-bold text-green-600">🎉 Thank you!</h2>
              <p className="text-gray-600">
                Your service request has been received. Our team will get in touch with you shortly.
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              >
                Book Another Service
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Know More About Our Services Section */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Want to Explore More?</h2>
            <p className="text-gray-300 mb-6">
              Discover all the media services we offer — from live broadcasting, social media management, digital branding,
              content production, to post-production services.
            </p>
            <a
              href="/home"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Learn More <FaArrowRight className="ml-2" />
            </a>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border border-blue-700">
            <img
              src="/hero-images/network090.jpg"
              alt="Media Services"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
