'use client';
import { FC, useState } from 'react';

const NewsletterSignup: FC = () => {
    const [email, setEmail] = useState('');
    const handleSubmit = () => {
        console.log('Subscribed:', email);
    };

    return (
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-12 text-center">
            <h4 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-gray-600 mb-4">Get the latest posts and updates directly in your inbox.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 rounded-md border w-full sm:w-72"
                />
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Subscribe
                </button>
            </div>
        </section>
    );
};

export default NewsletterSignup;
