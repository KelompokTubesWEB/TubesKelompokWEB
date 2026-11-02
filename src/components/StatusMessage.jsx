export function LoadingMessage({ text = 'Memuat data...' }) {
  return <div className="status-box" role="status"><span className="spinner" aria-hidden="true" />{text}</div>;
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-box error-box" role="alert">
      <p>{message || 'Data belum dapat dimuat.'}</p>
      {onRetry && <button className="button button-outline" type="button" onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}
