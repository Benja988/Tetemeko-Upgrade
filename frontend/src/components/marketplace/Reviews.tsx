import { useState } from 'react';

// Type definitions for the Review object and the new review submission
interface Review {
  username: string;
  rating: number;
  comment: string;
}

const Reviews = ({ reviews, onSubmit }: { reviews: Review[], onSubmit: (review: Review) => void }) => {
  const [newReview, setNewReview] = useState({ username: '', rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.username && newReview.rating > 0 && newReview.comment) {
      setIsSubmitting(true);
      onSubmit(newReview);
      setNewReview({ username: '', rating: 0, comment: '' });
      setIsSubmitting(false);
    }
  };

  // Calculate the average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>

      {/* Display average rating */}
      <div className="flex items-center mt-4">
        <span className="text-yellow-500 text-xl">
          {'★'.repeat(Math.round(averageRating))}
          {'☆'.repeat(5 - Math.round(averageRating))}
        </span>
        <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
      </div>

      {/* Reviews list */}
      <div className="mt-6">
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border-b border-gray-300 py-4">
              <div className="flex items-center">
                <span className="font-semibold">{review.username}</span>
                <div className="ml-2 text-yellow-500">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Review submission form */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Leave a Review</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600">Your Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={newReview.username}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Rating</label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-xl ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-600">Your Review</label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Write your review"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-gray-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
