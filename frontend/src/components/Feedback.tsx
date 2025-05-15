'use client';

import { FC, useState } from 'react';
import { feedbacks } from '@/constants/feedback'; // Importing feedbacks from a constants file
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Feedback: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-950 text-center mb-12">What People Say About Us</h2>
        <div className="relative">
          {/* Feedback Card */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 w-full max-w-lg text-center">
              <img
                src={feedbacks[currentIndex].image}
                alt={feedbacks[currentIndex].name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{feedbacks[currentIndex].name}</h3>
              <p className="text-sm text-gray-500 mb-4">{feedbacks[currentIndex].role}</p>
              <p className="text-gray-700 italic">"{feedbacks[currentIndex].feedback}"</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-md hover:bg-blue-950 transition"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-md hover:bg-blue-950 transition"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {feedbacks.map((_, index) => (
            <span
              key={index}
              className={`w-4 h-4 rounded-full ${
                index === currentIndex ? 'bg-blue-950' : 'bg-gray-300'
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;