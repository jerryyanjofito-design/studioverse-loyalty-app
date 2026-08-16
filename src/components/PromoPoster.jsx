import { PROMOTIONS } from "../data/promotions";

export function PromoPoster({ onPromoClick }) {
  const promotions = PROMOTIONS;

  if (!promotions.length) return null;

  return (
    <div className="promo-section">
      <div className="promo-track">
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
    </div>
  );
}
