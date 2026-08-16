export function PromoModal({ promo, onClose }) {
  if (!promo) return null;

  return (
    <div className="promo-modal-overlay" onClick={onClose}>
      <div className="promo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="promo-modal-close" onClick={onClose}>✕</button>
        <div className="promo-modal-image">
          <img src={promo.image} alt={promo.title} />
          {promo.tag && <div className="promo-tag large">{promo.tag}</div>}
        </div>
        <div className="promo-modal-info">
          <h2>{promo.title}</h2>
          {promo.description && <p>{promo.description}</p>}
        </div>
      </div>
    </div>
  );
}
