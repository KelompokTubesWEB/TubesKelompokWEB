import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBanks } from "../services/api";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";

export default function BankList() {
  const [banks, setBanks] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadData() {
    setLoading(true);
    setError("");
    try {
      setBanks(await getBanks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, []);
  const filtered = useMemo(
    () =>
      banks.filter((bank) => {
        const matchesQuery = `${bank.name} ${bank.address}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesType =
          type === "Semua" || bank.acceptedTypes.includes(type);
        return matchesQuery && matchesType;
      }),
    [banks, query, type],
  );
  return (
    <main className="container page-main">
      <div className="page-heading">
        <span className="eyebrow">TEMUKAN MITRA DAUR ULANG</span>
        <h1>Direktori bank sampah</h1>
        <p>
          Jelajahi daftar bank sampah demo dan periksa jenis sampah yang mereka
          terima sebelum berkunjung.
        </p>
      </div>
      <div className="filters">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">Cari nama atau alamat bank sampah</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau alamat..."
          />
        </label>
        <label className="filter-select">
          Jenis sampah
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Semua</option>
            <option>Plastik</option>
            <option>Kertas</option>
            <option>Logam</option>
            <option>Kaca</option>
          </select>
        </label>
      </div>
      {loading ? (
        <LoadingMessage text="Memuat direktori bank sampah..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadData} />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span aria-hidden="true">⌕</span>
          <h2>Bank sampah tidak ditemukan</h2>
          <p>Coba ubah kata kunci atau filter jenis sampah.</p>
        </div>
      ) : (
        <div className="bank-grid">
          {filtered.map((bank) => (
            <article className="card bank-card" key={bank.id}>
              <div className="bank-card-top">
                <span className="bank-icon" aria-hidden="true">
                  ⌂
                </span>
                <span className="tag">Data demo</span>
              </div>
              <h2>{bank.name}</h2>
              <p className="bank-address">
                <span aria-hidden="true">⌖</span> {bank.address}
              </p>
              <p className="bank-hours">
                <span aria-hidden="true">◷</span> {bank.hours}
              </p>
              <div className="accepted-list">
                <span className="field-caption">Menerima</span>
                <div className="tag-list">
                  {bank.acceptedTypes.map((item) => (
                    <span className="tag tag-neutral" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                className="button button-outline bank-detail-link"
                to={`/bank-sampah/${bank.id}`}
              >
                Lihat detail <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
      <p className="data-disclaimer">
        Alamat dan informasi bank sampah di halaman ini merupakan data simulasi,
        bukan petunjuk lokasi nyata.
      </p>
    </main>
  );
}
