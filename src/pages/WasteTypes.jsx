import { useEffect, useState } from "react";
import WasteCard from "../components/WasteCard";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";
import { getWasteTypes } from "../services/api";

export default function WasteTypes() {
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadData() {
    setLoading(true);
    setError("");
    try {
      setWastes(await getWasteTypes());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, []);
  return (
    <main className="container page-main">
      <div className="page-heading">
        <span className="eyebrow">PANDUAN DAUR ULANG</span>
        <h1>Kenali jenis sampah</h1>
        <p>
          Memilah dari rumah membantu proses daur ulang menjadi lebih mudah.
          Pastikan sampah bersih dan ikuti aturan bank sampah tujuan.
        </p>
      </div>
      <div className="notice">
        <span aria-hidden="true">ⓘ</span>
        <p>
          <strong>Catatan harga:</strong> harga di bawah hanya angka simulasi
          untuk keperluan proyek, bukan penawaran harga aktual dari bank sampah.
        </p>
      </div>
      {loading ? (
        <LoadingMessage text="Memuat informasi jenis sampah..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadData} />
      ) : (
        <div className="waste-grid waste-grid-all">
          {wastes.map((waste) => (
            <WasteCard key={waste.id} waste={waste} />
          ))}
        </div>
      )}
    </main>
  );
}
