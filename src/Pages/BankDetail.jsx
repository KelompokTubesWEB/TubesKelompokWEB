import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBankById } from "../services/api";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";

export default function BankDetail() {
  const { id } = useParams();
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const result = await getBankById(id);
      if (!result) throw new Error("Bank sampah tidak ditemukan.");
      setBank(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, [id]);
  if (loading)
    return (
      <main className="container page-main">
        <LoadingMessage text="Memuat detail bank sampah..." />
      </main>
    );
  if (error)
    return (
      <main className="container page-main">
        <ErrorMessage message={error} onRetry={loadData} />
        <Link className="text-link" to="/bank-sampah">
          ← Kembali ke direktori
        </Link>
      </main>
    );
  return (
    <main className="container page-main">
      <Link className="back-link" to="/bank-sampah">
        ← Kembali ke direktori
      </Link>
      <section className="detail-panel">
        <div className="detail-illustration" aria-hidden="true">
          ♻️
        </div>
        <div className="detail-content">
          <span className="eyebrow">DETAIL BANK SAMPAH · DATA DEMO</span>
          <h1>{bank.name}</h1>
          <p>{bank.description}</p>
          <div className="detail-facts">
            <div>
              <span>Alamat</span>
              <strong>{bank.address}</strong>
            </div>
            <div>
              <span>Jam operasional</span>
              <strong>{bank.hours}</strong>
            </div>
            <div>
              <span>Telepon simulasi</span>
              <strong>{bank.phone}</strong>
            </div>
          </div>
          <h2>Jenis sampah yang diterima</h2>
          <div className="tag-list">
            {bank.acceptedTypes.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
          <p className="data-disclaimer">
            Informasi kontak dan lokasi di atas hanya contoh untuk demo, bukan
            informasi layanan nyata.
          </p>
          <Link className="button" to={`/penjemputan?bank=${bank.id}`}>
            Ajukan penjemputan <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
