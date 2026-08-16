import { useState, useRef, useEffect, useCallback } from "react";
import { PROMOTIONS } from "../data/promotions";
import { PromoModal } from "./PromoModal";

export function PromoPoster() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const startPosRef = useRef(0);
  const currentTranslateRef = useRef(0);

  const promotions = PROMOTIONS;
  const cardWidth = 80; // vw - account for gaps
  const gap = 12; // px gap between cards

  const updateTrackPosition = useCallback((index) => {
    if (!trackRef.current) return;
    const viewportWidth = window.innerWidth;
    const activeCardWidth = viewportWidth * 0.8;
    const gapPx = 12;
    const totalWidth = activeCardWidth + gapPx;
    const offset = -(index * totalWidth);
    trackRef.current.style.transform = `translateX(${offset}px)`;
  }, []);

  const goToSlide = useCallback((index) => {
    if (index < 0) index = 0;
    if (index >= promotions.length) index = promotions.length - 1;
    setCurrentIndex(index);
    updateTrackPosition(index);
  }, [promotions.length, updateTrackPosition]);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startPosRef.current = e.touches[0].clientX;
    currentTranslateRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentPos = e.touches[0].clientX;
    const diff = currentPos - startPosRef.current;
    currentTranslateRef.current = diff;

    // Apply visual feedback during drag
    if (trackRef.current) {
      const viewportWidth = window.innerWidth;
      const activeCardWidth = viewportWidth * 0.8;
      const gapPx = 12;
      const baseOffset = -(currentIndex * (activeCardWidth + gapPx));
      trackRef.current.style.transform = `translateX(${baseOffset + diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    const diff = currentTranslateRef.current;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else if (diff < 0 && currentIndex < promotions.length - 1) {
        goToSlide(currentIndex + 1);
      } else {
        updateTrackPosition(currentIndex);
      }
    } else {
      updateTrackPosition(currentIndex);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPosRef.current = e.clientX;
    currentTranslateRef.current = 0;
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentPos = e.clientX;
    const diff = currentPos - startPosRef.current;
    currentTranslateRef.current = diff;

    if (trackRef.current) {
      const viewportWidth = window.innerWidth;
      const activeCardWidth = viewportWidth * 0.8;
      const gapPx = 12;
      const baseOffset = -(currentIndex * (activeCardWidth + gapPx));
      trackRef.current.style.transform = `translateX(${baseOffset + diff}px)`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    const diff = currentTranslateRef.current;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else if (diff < 0 && currentIndex < promotions.length - 1) {
        goToSlide(currentIndex + 1);
      } else {
        updateTrackPosition(currentIndex);
      }
    } else {
      updateTrackPosition(currentIndex);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateTrackPosition(currentIndex);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, updateTrackPosition]);

  // Initialize position
  useEffect(() => {
    updateTrackPosition(currentIndex);
  }, [currentIndex, updateTrackPosition]);

  if (!promotions.length) return null;

  return (
    <>
      <div className="promo-section">
        <div className="promo-header">
          <h2>Promo & Special Offers</h2>
          <p>Discover what's happening at Studioverse</p>
        </div>
        <div className="promo-carousel">
          <div
            className="promo-track"
            ref={trackRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ touchAction: isDragging ? 'none' : 'pan-y' }}
          >
            {promotions.map((promo, index) => (
              <div
                key={promo.id}
                className={`promo-poster ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setSelectedPromo(promo)}
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
      {selectedPromo && (
        <PromoModal
          promo={selectedPromo}
          onClose={() => setSelectedPromo(null)}
        />
      )}
    </>
  );
}
