import { useState } from "react";
import { PROMOTIONS } from "../data/promotions";
import { PromoModal } from "./PromoModal";

export function PromoPoster({ onPromoClick }) {
  const [selectedPromo, setSelectedPromo] = useState(null);
  const promotions = PROMOTIONS;

  if (!promotions.length) return null;

  return (
    <>
      <div className="promo-section">
        <div className="promo-track">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="promo-poster"
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
      {selectedPromo && (
        <PromoModal
          promo={selectedPromo}
          onClose={() => {
            setSelectedPromo(null);
            if (onPromoClick) onPromoClick(selectedPromo);
          }}
        />
      )}
    </>
  );
}
