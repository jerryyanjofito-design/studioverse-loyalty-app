export function Topbar({ title, onBack, sticky }) {
  return (
    <div className={`topbar ${sticky ? "sticky" : ""}`}>
      <button className="tb-back" onClick={onBack} aria-label="Kembali">←</button>
      <span>{title}</span>
    </div>
  );
}
