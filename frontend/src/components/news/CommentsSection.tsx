'use client';
import { FC, useState } from 'react';

const CommentsSection: FC = () => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<string[]>([]);

    const handleSubmit = () => {
        if (!comment) return;
        setComments([...comments, comment]);
        setComment('');
    };

    return (
        <div className="mt-12">
            <h4 className="text-lg font-semibold mb-4">Comments</h4>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Write your comment..."
                className="w-full border rounded-md p-3 mb-2"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
                Post Comment
            </button>

            <div className="mt-6 space-y-4">
                {comments.map((c, i) => (
                    <div key={i} className="border-t pt-2">
                        <p className="text-gray-800">{c}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
