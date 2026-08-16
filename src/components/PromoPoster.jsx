import { useState, useEffect } from "react";
import { PROMOTIONS } from "../data/promotions";
import { PromoModal } from "./PromoModal";

export function PromoPoster() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Reorder promos: Keychain Bundling → Price List → Promo 17an
  const promoOrder = [2, 1, 3]; // Keychain (id 2), Price List (id 1), 17an (id 3)
  const orderedPromos = promoOrder.map(id => PROMOTIONS.find(p => p.id === id)).filter(Boolean);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % orderedPromos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [orderedPromos.length]);

  // Get position class for each promo
  const getPositionClass = (index) => {
    if (index === currentIndex) return 'active';
    if (index === (currentIndex - 1 + orderedPromos.length) % orderedPromos.length) return 'prev';
    if (index === (currentIndex + 1) % orderedPromos.length) return 'next';
    return '';
  };

  if (!orderedPromos.length) return null;

  return (
    <>
      <div className="promo-section">
        <div className="promo-header">
          <h2>Promo & Special Offers</h2>
          <p>Discover what's happening at Studioverse</p>
        </div>
        <div className="promo-carousel">
          <div className="promo-track">
            {orderedPromos.map((promo, index) => (
              <div
                key={promo.id}
                className={`promo-poster ${getPositionClass(index)}`}
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
