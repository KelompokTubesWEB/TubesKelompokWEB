import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBanks, getWasteTypes } from "../services/api";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";
import WasteCard from "../components/WasteCard";

export default function Home() {
  const [wastes, setWastes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [wasteData, bankData] = await Promise.all([
        getWasteTypes(),
        getBanks(),
      ]);
      setWastes(wasteData);
      setBanks(bankData);
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
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">LANGKAH KECIL, DAMPAK BESAR</span>
            <h1>
              Sampah hari ini,
              <br />
              <span>masa depan lebih hijau.</span>
            </h1>
            <p>
              Mulai kebiasaan memilah sampah, temukan bank sampah, dan jadikan
              barang bekas punya nilai baru bersama EcoWaste.
            </p>
            <div className="hero-actions">
              <Link to="/jenis-sampah" className="button">
                Pelajari Jenis Sampah <span aria-hidden="true">→</span>
              </Link>
              <Link to="/bank-sampah" className="button button-outline">
                Temukan Bank Sampah
              </Link>
            </div>
            <div className="hero-note">
              <span aria-hidden="true">✓</span> Pilah dengan benar · Setor
              dengan mudah · Jaga bumi bersama
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="Ilustrasi tanaman tumbuh dari bumi"
            role="img"
          >
            <div className="sun" />
            <div className="plant plant-one">🌱</div>
            <div className="plant plant-two">♻️</div>
            <div className="earth">🌍</div>
            <div className="floating-label label-top">Lebih sedikit sampah</div>
            <div className="floating-label label-bottom">
              Lebih banyak manfaat
            </div>
          </div>
        </div>
      </section>
      <section className="container stats-grid" aria-label="Ringkasan EcoWaste">
        <article className="stat-card">
          <span className="stat-icon">♻</span>
          <div>
            <strong>4</strong>
            <span>Kategori sampah</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon">⌖</span>
          <div>
            <strong>{loading ? "—" : banks.length}</strong>
            <span>Bank sampah demo</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon">◎</span>
          <div>
            <strong>1</strong>
            <span>Langkah untuk mulai</span>
          </div>
        </article>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KENALI SAMPAHMU</span>
            <h2>Pilah sampah dengan tepat</h2>
            <p>Kenali kategori yang umum diterima untuk daur ulang.</p>
          </div>
          <Link className="text-link" to="/jenis-sampah">
            Lihat semua jenis <span aria-hidden="true">→</span>
          </Link>
        </div>
        {loading ? (
          <LoadingMessage text="Memuat kategori sampah..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadData} />
        ) : (
          <div className="waste-grid">
            {wastes.slice(0, 3).map((waste) => (
              <WasteCard key={waste.id} waste={waste} />
            ))}
          </div>
        )}
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow">SIAP MEMULAI?</span>
            <h2>Jangan biarkan sampah kehilangan manfaatnya.</h2>
            <p>
              Temukan bank sampah terdekat dari daftar demo kami atau ajukan
              permintaan penjemputan.
            </p>
          </div>
          <Link to="/penjemputan" className="button button-light">
            Ajukan Penjemputan <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
