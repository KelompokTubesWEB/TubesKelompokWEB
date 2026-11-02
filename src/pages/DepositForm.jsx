import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createDeposit, getWasteTypes } from "../services/api";
import { LoadingMessage } from "../components/StatusMessage";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
export default function DepositForm() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    wasteType: "",
    weightKg: "",
    date: new Date().toISOString().slice(0, 10),
  });
  useEffect(() => {
    getWasteTypes()
      .then((data) => {
        setTypes(data);
        if (data.length) setForm((f) => ({ ...f, wasteType: data[0].name }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const selected = types.find((t) => t.name === form.wasteType);
  const weight = Number(form.weightKg) || 0;
  const total = weight * (selected?.pricePerKg || 0);
  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(null);
  };
  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess(null);
    if (
      !form.customerName.trim() ||
      !form.wasteType ||
      !form.date ||
      weight <= 0 ||
      !Number.isFinite(weight)
    ) {
      setError("Lengkapi semua data dan pastikan berat lebih dari 0 kg.");
      return;
    }
    setSaving(true);
    try {
      const result = await createDeposit({
        customerName: form.customerName.trim(),
        wasteType: form.wasteType,
        weightKg: weight,
        pricePerKg: selected?.pricePerKg || 0,
        totalValue: total,
        date: form.date,
      });
      setSuccess(result);
      setForm({
        customerName: "",
        wasteType: types[0]?.name || "",
        weightKg: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="container page-main pickup-page">
      <div className="page-heading">
        <span className="eyebrow">AREA PENGELOLA</span>
        <h1>Pencatatan setoran sampah</h1>
        <p>
          Catat berat aktual sampah yang disetorkan. Nilai ekonomi dihitung
          otomatis menggunakan harga simulasi dari daftar jenis sampah.
        </p>
      </div>
      {success && (
        <div className="success-box" role="status">
          <strong>Setoran berhasil dicatat.</strong>
          <p>
            {success.wasteType} · {success.weightKg} kg · Nilai setoran{" "}
            <strong>{rupiah(success.totalValue)}</strong>.
          </p>
          <Link className="button button-small" to="/riwayat-setoran">
            Lihat riwayat setoran
          </Link>
        </div>
      )}
      {error && (
        <div className="status-box error-box" role="alert">
          <p>{error}</p>
          <button
            className="button button-small button-outline"
            type="button"
            onClick={() => {
              setError("");
              if (!types.length) {
                setLoading(true);
                getWasteTypes()
                  .then(setTypes)
                  .catch((e) => setError(e.message))
                  .finally(() => setLoading(false));
              }
            }}
          >
            Coba lagi
          </button>
        </div>
      )}
      {loading ? (
        <LoadingMessage text="Memuat daftar jenis sampah..." />
      ) : (
        <form className="form-card" onSubmit={submit} noValidate>
          <div className="form-section-heading">
            <span>01</span>
            <div>
              <h2>Informasi setoran</h2>
              <p>Isi informasi penyetor dan sampah yang diterima.</p>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="customerName">
                Nama penyetor <span>*</span>
              </label>
              <input
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={change}
                placeholder="Nama lengkap"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="depositDate">
                Tanggal setoran <span>*</span>
              </label>
              <input
                id="depositDate"
                type="date"
                name="date"
                value={form.date}
                onChange={change}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="wasteType">
                Jenis sampah <span>*</span>
              </label>
              <select
                id="wasteType"
                name="wasteType"
                value={form.wasteType}
                onChange={change}
                required
              >
                {types.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="weightKg">
                Berat aktual (kg) <span>*</span>
              </label>
              <input
                id="weightKg"
                type="number"
                min="0.1"
                step="0.1"
                name="weightKg"
                value={form.weightKg}
                onChange={change}
                placeholder="Contoh: 2.5"
                required
              />
            </div>
          </div>
          <div className="deposit-summary">
            <div>
              <span>Harga simulasi per kg</span>
              <strong>{rupiah(selected?.pricePerKg || 0)}</strong>
            </div>
            <div>
              <span>Total nilai setoran</span>
              <strong className="summary-total">{rupiah(total)}</strong>
            </div>
          </div>
          <div className="form-actions">
            <p>Pastikan berat sudah ditimbang sebelum menyimpan data.</p>
            <button
              className="button"
              type="submit"
              disabled={saving || loading}
            >
              {saving ? "Menyimpan..." : "Simpan setoran →"}
            </button>
          </div>
        </form>
      )}
      <p className="form-footnote">
        Mode demonstrasi: data disimpan ke JSON Server lokal. Harga bukan
        penawaran resmi bank sampah.
      </p>
    </main>
  );
}
