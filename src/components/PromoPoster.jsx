import { useState } from "react";
import { PROMOTIONS } from "../data/promotions";
import { PromoModal } from "./PromoModal";

export function PromoPoster() {
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Reorder promos: Keychain Bundling → Price List → Promo 17an
  const promoOrder = [2, 1, 3]; // Keychain (id 2), Price List (id 1), 17an (id 3)
  const orderedPromos = promoOrder.map(id => PROMOTIONS.find(p => p.id === id)).filter(Boolean);

  if (!orderedPromos.length) return null;

  return (
    <>
      <div className="promo-section">
        <div className="promo-header">
          <h2>Promo & Special Offers</h2>
          <p>Discover what's happening at Studioverse</p>
        </div>
        <div className="promo-carousel">
          {orderedPromos.map((promo) => (
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
          onClose={() => setSelectedPromo(null)}
        />
      )}
    </>
  );
}
