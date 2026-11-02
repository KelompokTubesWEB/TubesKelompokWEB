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
export default function EconomicDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
  const stats = useMemo(
    () => ({
      weight: items.reduce((s, x) => s + Number(x.weightKg || 0), 0),
      value: items.reduce((s, x) => s + Number(x.totalValue || 0), 0),
      count: items.length,
    }),
    [items],
  );
  const byType = useMemo(
    () =>
      Object.values(
        items.reduce((acc, x) => {
          const key = x.wasteType || "Lainnya";
          if (!acc[key])
            acc[key] = { name: key, weight: 0, value: 0, count: 0 };
          acc[key].weight += Number(x.weightKg || 0);
          acc[key].value += Number(x.totalValue || 0);
          acc[key].count += 1;
          return acc;
        }, {}),
      ).sort((a, b) => b.weight - a.weight),
    [items],
  );
  const maxWeight = Math.max(1, ...byType.map((x) => x.weight));
  return (
    <main className="container page-main">
      <div className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">RINGKASAN DAMPAK</span>
          <h1>Dashboard nilai ekonomi</h1>
          <p>
            Pantau berat sampah dan nilai ekonomi dari data setoran yang
            tercatat.
          </p>
        </div>
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
        <LoadingMessage text="Menghitung statistik setoran..." />
      ) : (
        <>
          <div className="dashboard-stats">
            <article className="metric-card">
              <span className="metric-icon">♻</span>
              <span className="metric-label">Total berat sampah</span>
              <strong>
                {stats.weight.toLocaleString("id-ID", {
                  maximumFractionDigits: 2,
                })}{" "}
                <small>kg</small>
              </strong>
              <p>Total berat dari seluruh transaksi</p>
            </article>
            <article className="metric-card">
              <span className="metric-icon">↗</span>
              <span className="metric-label">Nilai ekonomi</span>
              <strong>{rupiah(stats.value)}</strong>
              <p>Akumulasi nilai setoran simulasi</p>
            </article>
            <article className="metric-card">
              <span className="metric-icon">▤</span>
              <span className="metric-label">Jumlah transaksi</span>
              <strong>{stats.count}</strong>
              <p>Setoran yang telah tercatat</p>
            </article>
          </div>
          <section className="card analytics-card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">ANALISIS KATEGORI</span>
                <h2>Berat sampah berdasarkan jenis</h2>
                <p>Perbandingan berat tiap kategori dari data setoran.</p>
              </div>
            </div>
            {byType.length === 0 ? (
              <div className="empty-state">
                <h2>Belum ada data setoran</h2>
                <p>Tambahkan transaksi untuk melihat grafik.</p>
              </div>
            ) : (
              <div
                className="bar-chart"
                role="img"
                aria-label="Grafik batang berat sampah berdasarkan jenis"
              >
                {byType.map((row) => (
                  <div className="bar-row" key={row.name}>
                    <div className="bar-label">
                      <strong>{row.name}</strong>
                      <span>
                        {row.weight.toLocaleString("id-ID", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        kg · {rupiah(row.value)}
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.max(4, (row.weight / maxWeight) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="card analytics-card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">TRANSAKSI TERBARU</span>
                <h2>Setoran terbaru</h2>
              </div>
              <Link className="text-link" to="/riwayat-setoran">
                Lihat semua →
              </Link>
            </div>
            <div className="recent-list">
              {items.slice(0, 4).map((x) => (
                <div className="recent-row" key={x.id}>
                  <div className="recent-avatar">
                    {x.wasteType === "Plastik"
                      ? "♻"
                      : x.wasteType === "Kertas"
                        ? "▤"
                        : "◈"}
                  </div>
                  <div className="recent-info">
                    <strong>{x.wasteType}</strong>
                    <span>
                      {x.customerName} · {x.weightKg} kg
                    </span>
                  </div>
                  <strong className="money-cell">{rupiah(x.totalValue)}</strong>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      <p className="data-disclaimer">
        Statistik dihitung dari Mock API lokal. Nilai harga merupakan simulasi
        dan tidak mewakili penawaran resmi.
      </p>
    </main>
  );
}
