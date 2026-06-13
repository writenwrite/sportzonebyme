import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export default function StarRating({ 
  rating, 
  count, 
  size = 16, 
  showCount = true 
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-gold-500 text-gold-500'
                : 'text-gray-500'
            }`}
          />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-400 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}
