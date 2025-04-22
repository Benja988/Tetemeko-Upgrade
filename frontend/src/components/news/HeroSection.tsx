'use client';

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection: FC = () => {
    return (
        <section className="bg-gradient-to-br from-[#07131F] to-[#0A1F2B] text-white rounded-2xl shadow-xl px-6 py-16 lg:py-24 lg:px-16 transition-all">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/80">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                    </li>
                    <li className="mx-1">›</li>
                    <li className="font-semibold text-white">News & Blogs</li>
                </ol>
            </nav>

            {/* Hero Content */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
                {/* Text */}
                <div className="text-center lg:text-left flex-1">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Stay Informed with the Latest{' '}
                        <br className="hidden sm:block" />
                        <span className="text-[#8A9A9F]">News & Blogs</span> {/* Replaced yellow with a cool gray */}
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-xl mx-auto lg:mx-0">
                        Dive into expert insights, timely stories, and trending updates — all thoughtfully curated for you.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="#latest"
                            className="inline-block bg-[#3C4A55] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#2C3A45] transition"
                        >
                            Explore Now
                        </Link>
                    </div>
                </div>

                {/* Image */}
                <div className="w-full h-64 sm:h-80 lg:h-[28rem] relative rounded-xl shadow-lg overflow-hidden flex-1">
                    <Image
                        src="/hero-images/image2.jpg" // Replace with your actual image path
                        alt="News and Blogs Hero"
                        fill
                        priority
                        className="object-cover rounded-xl"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
