const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export default function WasteCard({ waste }) {
  return (
    <article className="card waste-card">
      <div className="waste-icon" aria-hidden="true">{waste.icon || '♻️'}</div>
      <div className="card-title-row"><h3>{waste.name}</h3><span className="tag">Dapat didaur ulang</span></div>
      <p>{waste.description}</p>
      <div className="price-row"><span>Harga simulasi mulai</span><strong>{rupiah(waste.pricePerKg)}/kg</strong></div>
      {waste.tips && <details className="tips"><summary>Tips memilah</summary><p>{waste.tips}</p></details>}
    </article>
  );
}
