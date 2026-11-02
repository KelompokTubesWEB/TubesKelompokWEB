import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/jenis-sampah', label: 'Jenis Sampah' },
  { to: '/bank-sampah', label: 'Bank Sampah' },
  { to: '/pencatatan-setoran', label: 'Setoran' },
  { to: '/riwayat-setoran', label: 'Riwayat' },
  { to: '/dashboard-ekonomi', label: 'Dashboard' },
];

export default function Navbar() {
  return <header className="site-header"><div className="container nav-wrap">
    <Link to="/" className="brand" aria-label="EcoWaste, kembali ke beranda"><span className="brand-mark" aria-hidden="true">↻</span><span>Eco<span className="brand-accent">Waste</span></span></Link>
    <nav className="main-nav" aria-label="Navigasi utama">
      {links.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{link.label}</NavLink>)}
      <Link className="button button-small" to="/penjemputan">Minta Penjemputan</Link>
    </nav>
  </div></header>;
}
