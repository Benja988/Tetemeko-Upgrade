'use client';

import { FC, useRef, useState } from 'react';
import { events } from '@/constants/events';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EventModal from './EventModal';

const Events: FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; description: string; date: string } | null>(null);

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

  return (
    <section className="bg-blue-950 py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-white text-center mb-14 tracking-tight"
        >
          Upcoming Events
        </motion.h2>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-800 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition z-10"
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-800 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition z-10"
          >
            <FaChevronRight size={18} />
          </button>

          <motion.div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-6 scroll-smooth scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {events.slice(0, 6).map((event) => (
              <motion.div
                key={event.id}
                className="bg-blue-900 rounded-xl shadow-lg border border-blue-800 hover:shadow-2xl transition duration-300 min-w-[300px] scroll-snap-align-start"
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative h-48 w-full">
                  <img
                    src="/prof.jpg"
                    alt={event.name}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white mb-2">{event.name}</h3>
                  <div className="text-blue-300 flex items-center gap-2 mb-4 text-sm">
                    <FaCalendarAlt />
                    <span>{event.date}</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-5 line-clamp-3">{event.description}</p>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm"
                    onClick={() =>
                      setSelectedEvent({ title: event.name, description: event.description, date: event.date })
                    }
                  >
                    <FaInfoCircle />
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Popup Modal */}
      <EventModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || ''}
        description={selectedEvent?.description || ''}
        date={selectedEvent?.date || ''}
      />
    </section>
  );
};

export default Events;
