import { useState, useEffect, useRef } from "react";
import { PROMOTIONS } from "../data/promotions";

export function PromoPoster({ onPromoClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const trackRef = useRef(null);

  const promotions = PROMOTIONS;
  const itemWidth = 152; // 140px width + 12px gap

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promotions.length]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => Math.min(prev + 1, promotions.length - 1));
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, promotions.length - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!promotions.length) return null;

  return (
    <div className="promo-section">
      <div className="promo-carousel">
        {currentIndex > 0 && (
          <button className="promo-nav prev" onClick={goToPrev}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div
          className="promo-track"
          ref={trackRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: `translateX(-${currentIndex * itemWidth}px)`,
          }}
        >
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="promo-poster"
              onClick={() => onPromoClick && onPromoClick(promo)}
            >
              <img src={promo.image} alt={promo.title} />
              {promo.tag && <div className="promo-tag">{promo.tag}</div>}
              <div className="promo-title">
                <h3>{promo.title}</h3>
                {promo.description && <p>{promo.description}</p>}
              </div>
            </div>
          ))}
        </div>
        {currentIndex < promotions.length - 1 && (
          <button className="promo-nav next" onClick={goToNext}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <div className="promo-dots">
        {promotions.map((_, index) => (
          <div
            key={index}
            className={`promo-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
