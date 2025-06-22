'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { services } from '@/constants/services';
import ReserveButton from './ReserveButton';

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: 'easeOut',
        },
    }),
};

export default function OurServices() {
    return (
        <section className="relative w-full py-20 px-4 text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg/bg1.jpg"
                    alt="Services Background"
                    layout="fill"
                    objectFit="cover"
                    quality={90}
                    className="brightness-[0.3]"
                />
                <div className="absolute inset-0 bg-[#07131F]/60" />
            </div>

            {/* Content Wrapper */}
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-12 max-w-3xl"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-100 underline leading-snug">
                        Our Services
                    </h2>
                    <p className="mt-4 text-base sm:text-lg lg:text-xl text-blue-200 font-light leading-relaxed">
                        Empowering communities through{' '}
                        <span className="font-semibold text-blue-300">compelling storytelling</span>{' '}
                        and <span className="italic text-blue-400">digital innovation</span>. <br />
                        Explore our{' '}
                        <span className="underline underline-offset-4 decoration-blue-400">
                            professional media solutions
                        </span>.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full px-2 md:px-0">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            className="group relative bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden"
                        >
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Icon */}
                            <div className="bg-blue-500 p-3 sm:p-4 rounded-xl w-fit mb-4 transition-transform duration-300 group-hover:scale-110 text-white">
                                {service.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-blue-100 leading-relaxed">
                                {service.description}
                            </p>

                            {/* Hover Indicator */}
                            <div className="absolute bottom-4 right-4 text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition duration-300">
                                Learn more →
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Reserve Button */}
                <ReserveButton />
            </div>
        </section>
    );
}
