'use client';

import Image from 'next/image';
import { services } from '@/constants/services';


export default function OurServices() {
    return (
        <section className="relative w-full py-20 text-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg/bg1.jpg"
                    alt="Services Background"
                    layout="fill"
                    objectFit="cover"
                    quality={90}
                    className="brightness-[0.4]"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-8 lg:px-24 max-w-screen-xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto text-blue-100 font-serif font-medium leading-relaxed tracking-wide">
                        Empowering communities through <span className="font-bold text-blue-200">compelling storytelling</span> and <span className="italic text-blue-300">digital innovation</span>.
                        <br />
                        Discover the <span className="underline underline-offset-4 decoration-blue-400">professional media solutions</span> we offer.
                    </p>
                </div>


                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/10 backdrop-blur rounded-2xl p-6 flex flex-col items-start gap-4 transition-all duration-300"
                        >
                            <div className="bg-white/10 p-3 rounded-full">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold">{service.title}</h3>
                            <p className="text-gray-200 text-sm">{service.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
