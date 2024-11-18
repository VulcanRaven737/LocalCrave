'use client'
import React, { useEffect, useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';

// Types for reviews
interface Review {
  id: number;
  name: string;
  rating: number;
  review: string;
  date: string;
}

// Styled components for custom styling
const StyledCard = styled(Card)(({ theme }) => ({
  flexShrink: 0,
  width: 320,
  backgroundColor: '#fff',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const ReviewsInfiniteScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sample reviews data - replace with your actual data
  const reviews: Review[] = [
    {
      id: 1,
      name: "Amit Banerjee",
      rating: 5,
      review: "Absolutely amazing home-cooked meals! The taste reminds me of my grandmother's cooking.",
      date: "2024-03-15"
    },
    {
      id: 2,
      name: "Reena Singh",
      rating: 4,
      review: "Great quality and portion sizes. Really convenient for busy professionals.",
      date: "2024-03-14"
    },
    {
      id: 3,
      name: "Priya Patel",
      rating: 5,
      review: "The authentic flavors are incredible. Best home-cooked food delivery service!",
      date: "2024-03-13"
    },
    {
      id: 4,
      name: "Aman Shekawat",
      rating: 5,
      review: "Fresh ingredients and excellent service. Highly recommended!",
      date: "2024-03-12"
    },
    {
      id: 5,
      name: "Nagarjuna Gowda",
      rating: 4,
      review: "Love the variety of dishes available. Every meal feels special.",
      date: "2024-03-11"
    }
  ];

  // Duplicate reviews to create infinite scroll effect
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scroll = () => {
      setScrollPosition((prevPosition) => {
        const newPosition = prevPosition + 0.5;
        
        // Reset position when reaching the end of original reviews
        if (newPosition >= container.scrollWidth / 3) {
          return 0;
        }
        return newPosition;
      });
    };

    const animationFrame = setInterval(scroll, 30);

    return () => clearInterval(animationFrame);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 4,
            color: 'text.primary'
          }}
        >
          What Our Customers Say
        </Typography>
        <div 
          ref={scrollContainerRef}
          className="overflow-hidden relative"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="flex gap-6 transition-transform duration-300 ease-linear">
            {duplicatedReviews.map((review, index) => (
              <StyledCard key={`${review.id}-${index}`}>
                <CardHeader
                  avatar={
                    <Avatar 
                      sx={{ 
                        bgcolor: '#FC8019',
                        width: 40,
                        height: 40
                      }}
                    >
                      {review.name.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" component="div">
                      {review.name}
                    </Typography>
                  }
                  subheader={
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {review.review}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </StyledCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsInfiniteScroll;