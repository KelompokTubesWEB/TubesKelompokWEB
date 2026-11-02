import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPickupRequest, getBanks, getWasteTypes } from "../services/api";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";

const initialForm = {
  fullName: "",
  phone: "",
  address: "",
  wasteTypeId: "",
  estimatedWeight: "",
  pickupDate: "",
  pickupTime: "",
  notes: "",
  bankId: "",
};
const today = new Date();
const todayLocal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

export default function PickupRequest() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    ...initialForm,
    bankId: searchParams.get("bank") || "",
  });
  const [wastes, setWastes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const [w, b] = await Promise.all([getWasteTypes(), getBanks()]);
        setWastes(w);
        setBanks(b);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setSuccess(null);
  }
  function validate() {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Nama wajib diisi.";
    if (!/^\+?[0-9\s-]{9,16}$/.test(form.phone.trim()))
      errors.phone = "Masukkan nomor telepon 9–16 digit yang valid.";
    if (!form.address.trim() || form.address.trim().length < 10)
      errors.address = "Alamat lengkap minimal 10 karakter.";
    if (!form.wasteTypeId) errors.wasteTypeId = "Pilih jenis sampah.";
    if (!(Number(form.estimatedWeight) > 0))
      errors.estimatedWeight = "Berat harus lebih dari 0 kg.";
    if (!form.pickupDate || form.pickupDate < todayLocal)
      errors.pickupDate = "Pilih tanggal hari ini atau setelahnya.";
    if (!form.pickupTime) errors.pickupTime = "Pilih waktu penjemputan.";
    if (!form.bankId) errors.bankId = "Pilih bank sampah tujuan.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const selectedWaste = wastes.find(
        (w) => String(w.id) === String(form.wasteTypeId),
      );
      const selectedBank = banks.find(
        (b) => String(b.id) === String(form.bankId),
      );
      const saved = await createPickupRequest({
        ...form,
        estimatedWeight: Number(form.estimatedWeight),
        wasteTypeName: selectedWaste?.name,
        bankName: selectedBank?.name,
      });
      setSuccess(saved);
      setForm({ ...initialForm });
      setFieldErrors({});
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (loading)
    return (
      <main className="container page-main">
        <LoadingMessage text="Menyiapkan formulir..." />
      </main>
    );
  return (
    <main className="container page-main pickup-page">
      <div className="page-heading">
        <span className="eyebrow">LAYANAN SIMULASI</span>
        <h1>Permintaan penjemputan</h1>
        <p>
          Isi detail sampah dan waktu yang kamu inginkan. Untuk proyek ini,
          pengajuan disimpan di Mock API dan belum dikirim ke layanan
          penjemputan nyata.
        </p>
      </div>
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="success-box" role="status">
          <strong>✓ Permintaan berhasil disimpan!</strong>
          <p>
            Nomor permintaan: #{success.id}. Status: {success.status}.
          </p>
          <p>
            Ini konfirmasi simulasi; tidak ada petugas yang benar-benar
            dijadwalkan.
          </p>
          <button
            className="button button-outline"
            type="button"
            onClick={() => setSuccess(null)}
          >
            Tutup konfirmasi
          </button>
        </div>
      )}
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-section-heading">
          <span>01</span>
          <div>
            <h2>Informasi pemohon</h2>
            <p>Masukkan informasi kontak untuk permintaan simulasi.</p>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="fullName">
              Nama lengkap <span>*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.fullName)}
              aria-describedby={
                fieldErrors.fullName ? "fullName-error" : undefined
              }
              placeholder="Nama kamu"
            />
            {fieldErrors.fullName && (
              <small id="fullName-error" className="field-error">
                {fieldErrors.fullName}
              </small>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="phone">
              Nomor telepon <span>*</span>
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={updateField}
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
              placeholder="08xxxxxxxxxx"
            />
            {fieldErrors.phone && (
              <small id="phone-error" className="field-error">
                {fieldErrors.phone}
              </small>
            )}
          </div>
          <div className="form-field full-field">
            <label htmlFor="address">
              Alamat penjemputan lengkap <span>*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={updateField}
              rows="3"
              autoComplete="street-address"
              aria-invalid={Boolean(fieldErrors.address)}
              aria-describedby={
                fieldErrors.address ? "address-error" : undefined
              }
              placeholder="Nama jalan, nomor rumah, kelurahan, dan patokan"
            />
            {fieldErrors.address && (
              <small id="address-error" className="field-error">
                {fieldErrors.address}
              </small>
            )}
          </div>
        </div>
        <div className="form-section-heading">
          <span>02</span>
          <div>
            <h2>Detail sampah</h2>
            <p>Pilih jenis sampah dan perkirakan beratnya.</p>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="wasteTypeId">
              Jenis sampah <span>*</span>
            </label>
            <select
              id="wasteTypeId"
              name="wasteTypeId"
              value={form.wasteTypeId}
              onChange={updateField}
              aria-invalid={Boolean(fieldErrors.wasteTypeId)}
            >
              <option value="">Pilih jenis sampah</option>
              {wastes.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            {fieldErrors.wasteTypeId && (
              <small className="field-error">{fieldErrors.wasteTypeId}</small>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="estimatedWeight">
              Perkiraan berat (kg) <span>*</span>
            </label>
            <input
              id="estimatedWeight"
              name="estimatedWeight"
              type="number"
              min="0.1"
              step="0.1"
              value={form.estimatedWeight}
              onChange={updateField}
              aria-invalid={Boolean(fieldErrors.estimatedWeight)}
              placeholder="Contoh: 2.5"
            />
            {fieldErrors.estimatedWeight && (
              <small className="field-error">
                {fieldErrors.estimatedWeight}
              </small>
            )}
          </div>
          <div className="form-field full-field">
            <label htmlFor="bankId">
              Bank sampah tujuan <span>*</span>
            </label>
            <select
              id="bankId"
              name="bankId"
              value={form.bankId}
              onChange={updateField}
              aria-invalid={Boolean(fieldErrors.bankId)}
            >
              <option value="">Pilih bank sampah</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.address}
                </option>
              ))}
            </select>
            {fieldErrors.bankId && (
              <small className="field-error">{fieldErrors.bankId}</small>
            )}
          </div>
        </div>
        <div className="form-section-heading">
          <span>03</span>
          <div>
            <h2>Waktu penjemputan</h2>
            <p>Waktu yang dipilih hanya untuk simulasi permintaan.</p>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="pickupDate">
              Tanggal <span>*</span>
            </label>
            <input
              id="pickupDate"
              name="pickupDate"
              type="date"
              min={todayLocal}
              value={form.pickupDate}
              onChange={updateField}
              aria-invalid={Boolean(fieldErrors.pickupDate)}
            />
            {fieldErrors.pickupDate && (
              <small className="field-error">{fieldErrors.pickupDate}</small>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="pickupTime">
              Waktu <span>*</span>
            </label>
            <select
              id="pickupTime"
              name="pickupTime"
              value={form.pickupTime}
              onChange={updateField}
              aria-invalid={Boolean(fieldErrors.pickupTime)}
            >
              <option value="">Pilih waktu</option>
              <option value="08:00">08.00–10.00</option>
              <option value="10:00">10.00–12.00</option>
              <option value="13:00">13.00–15.00</option>
              <option value="15:00">15.00–17.00</option>
            </select>
            {fieldErrors.pickupTime && (
              <small className="field-error">{fieldErrors.pickupTime}</small>
            )}
          </div>
          <div className="form-field full-field">
            <label htmlFor="notes">Catatan tambahan (opsional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={updateField}
              rows="2"
              placeholder="Contoh: sampah sudah dipisahkan dalam kantong"
            />
          </div>
        </div>
        <div className="form-actions">
          <p>
            <span aria-hidden="true">ⓘ</span> Kolom bertanda * wajib diisi.
          </p>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Kirim permintaan simulasi"}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
      <p className="form-footnote">
        Data kontak pada demo ini disimpan secara lokal pada Mock API
        pengembangan. Gunakan data contoh, bukan informasi pribadi yang
        sensitif.
      </p>
      <div className="bottom-link">
        <Link to="/bank-sampah" className="text-link">
          ← Kembali ke direktori bank sampah
        </Link>
      </div>
    </main>
  );
}
