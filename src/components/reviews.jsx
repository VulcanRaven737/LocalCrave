import React, { useState, useEffect, useRef } from 'react';
import { User, Star } from 'lucide-react';

const sampleReviews = [
  {
    title: 'Delicious home-cooked meal!',
    rating: 4.5,
    content: 'I ordered the chicken teriyaki from LocalCrave and it was absolutely delicious. The portion was generous, and the quality of the ingredients was top-notch. Highly recommend!',
    author: 'John Doe'
  },
  {
    title: 'Great service, average food',
    rating: 3,
    content: 'The service from LocalCrave was excellent, but the food itself was just okay. The flavors were a bit bland, and the presentation could have been better. I might give them another try in the future.',
    author: 'Jane Smith'
  },
  {
    title: 'Satisfying and fresh',
    rating: 4,
    content: 'I ordered the vegetarian curry from LocalCrave and it was fresh, flavorful, and very satisfying. The portion size was perfect, and the delivery was prompt. I will definitely be ordering from them again.',
    author: 'Emily Johnson'
  },
  {
    title: 'Disappointing experience',
    rating: 2,
    content: 'I was really looking forward to trying LocalCrave, but my experience was quite disappointing. The food arrived cold and the portion sizes were smaller than expected. The flavors were also rather bland. I don\'t think I\'ll be ordering from them again.',
    author: 'Michael Lee'
  },
  {
    title: 'Exceeded my expectations',
    rating: 5,
    content: 'I was hesitant to try a new food delivery service, but LocalCrave completely exceeded my expectations. The food was absolutely delicious, the portions were generous, and the delivery was lightning fast. I\'m so glad I gave them a try and will be a repeat customer for sure.',
    author: 'Sarah Thompson'
  },
  {
    title: 'Consistently good',
    rating: 4.2,
    content: 'I\'ve ordered from LocalCrave several times now and have always been satisfied with the quality of the food and the service. The menu has a good variety of options, and the meals are consistently good. I appreciate the convenience of having home-cooked meals delivered to my door.',
    author: 'David Nguyen'
  },
  {
    title: 'Not worth the price',
    rating: 3.5,
    content: 'While the food from LocalCrave was decent, I don\'t think it was worth the price I paid. The portions were a bit small, and the flavors didn\'t wow me. I\'m not sure I\'ll be ordering from them again, as there are other meal delivery services that offer better value.',
    author: 'Jessica Hernandez'
  },
  {
    title: 'Highly recommended',
    rating: 4.8,
    content: 'I\'ve been ordering from LocalCrave for a few months now and I can\'t recommend them enough. The food is always fresh, flavorful, and satisfying. The delivery is fast and reliable, and the customer service has been excellent. If you\'re looking for a reliable and delicious meal delivery service, definitely give LocalCrave a try.',
    author: 'Christopher Martinez'
  }
];

const ReviewsInfiniteScroll = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageRef = useRef(1);
    const containerRef = useRef(null);
  
    useEffect(() => {
      fetchReviews();
    }, []);
  
    const fetchReviews = () => {
      if (!isLoading && hasMore) {
        setIsLoading(true);
        try {
          const startIndex = (pageRef.current - 1) * 10;
          const endIndex = startIndex + 10;
          const paginatedReviews = sampleReviews.slice(startIndex, endIndex);
          setReviews((prevReviews) => [...prevReviews, ...paginatedReviews]);
          setHasMore(endIndex < sampleReviews.length);
          pageRef.current += 1;
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    const handleScroll = () => {
      const container = containerRef.current;
      if (
        container &&
        container.scrollLeft + container.clientWidth >= container.scrollWidth &&
        !isLoading
      ) {
        fetchReviews();
      }
    };
  
    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
      }
      return () => {
        if (container) {
          container.removeEventListener('scroll', handleScroll);
        }
      };
    }, [handleScroll]);
  
    return (
      <div className="flex gap-4 overflow-x-auto pb-4" ref={containerRef}>
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 bg-white rounded-md shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{review.title}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(Math.floor(review.rating))].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500" />
                  ))}
                  {review.rating % 1 !== 0 && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <span className="text-gray-500 text-sm">({review.rating.toFixed(1)})</span>
              </div>
            </div>
            <p className="mt-2 text-gray-700 h-20 overflow-hidden">
              {review.content}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <p>{review.author}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex-shrink-0 w-80 bg-gray-200 animate-pulse rounded-md shadow-md p-4" />
        )}
      </div>
    );
  };
  
  export default ReviewsInfiniteScroll;