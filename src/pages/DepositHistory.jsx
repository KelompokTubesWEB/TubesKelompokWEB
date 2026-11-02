import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDeposits } from "../services/api";
import { LoadingMessage } from "../components/StatusMessage";
const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
export default function DepositHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Semua");
  const load = () => {
    setLoading(true);
    setError("");
    getDeposits()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const types = useMemo(
    () => ["Semua", ...new Set(items.map((x) => x.wasteType))],
    [items],
  );
  const filtered = items.filter(
    (x) =>
      (type === "Semua" || x.wasteType === type) &&
      `${x.customerName} ${x.wasteType} ${x.status}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="container page-main">
      <div className="page-heading">
        <span className="eyebrow">DATA TRANSAKSI</span>
        <h1>Riwayat setoran</h1>
        <p>
          Daftar setoran yang telah dicatat beserta berat, nilai ekonomi, dan
          statusnya.
        </p>
      </div>
      <div className="history-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">Cari setoran</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama penyetor atau jenis sampah..."
          />
        </label>
        <label className="filter-select">
          Jenis sampah
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <Link className="button" to="/pencatatan-setoran">
          + Catat setoran
        </Link>
      </div>
      {error && (
        <div className="status-box error-box" role="alert">
          <p>{error}</p>
          <button className="button button-small button-outline" onClick={load}>
            Coba lagi
          </button>
        </div>
      )}
      {loading ? (
        <LoadingMessage text="Memuat riwayat setoran..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span>♻</span>
          <h2>Belum ada data yang cocok</h2>
          <p>Coba ubah pencarian atau catat setoran baru.</p>
          <Link className="button" to="/pencatatan-setoran">
            Catat setoran
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Penyetor</th>
                <th>Jenis sampah</th>
                <th>Berat</th>
                <th>Nilai ekonomi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                      "id-ID",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </td>
                  <td>
                    <strong>{item.customerName}</strong>
                  </td>
                  <td>{item.wasteType}</td>
                  <td>{Number(item.weightKg).toLocaleString("id-ID")} kg</td>
                  <td className="money-cell">{rupiah(item.totalValue)}</td>
                  <td>
                    <span
                      className={`status-pill ${item.status === "Selesai" ? "status-done" : "status-pending"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="data-disclaimer">
        Data transaksi ini merupakan data demonstrasi yang tersimpan pada Mock
        API lokal.
      </p>
    </main>
  );
}
