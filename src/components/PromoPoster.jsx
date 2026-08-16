import { PROMOTIONS } from "../data/promotions";

export function PromoPoster({ onPromoClick }) {
  // Show the first active promotion
  const promo = PROMOTIONS[0];

  if (!promo) return null;

  return (
    <div className="promo-section">
      <div
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
    </div>
  );
}
