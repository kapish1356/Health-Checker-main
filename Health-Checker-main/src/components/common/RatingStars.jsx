import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, maxStars = 5, size = 'w-4 h-4', showScore = false, interactive = false, onRate }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);
        return (
          <Star
            key={index}
            className={`${size} ${
              isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate && onRate(starValue)}
          />
        );
      })}
      {showScore && (
        <span className="text-xs font-bold text-slate-700 ml-1">
          {typeof rating === 'number' ? rating.toFixed(1) : rating}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
