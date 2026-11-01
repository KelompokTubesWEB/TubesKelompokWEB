import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WasteTypes from './pages/WasteTypes';
import BankList from './pages/BankList';
import BankDetail from './pages/BankDetail';
import PickupRequest from './pages/PickupRequest';
import DepositForm from './pages/DepositForm';
import DepositHistory from './pages/DepositHistory';
import EconomicDashboard from './pages/EconomicDashboard';

export default function App() {
  return <BrowserRouter><div className="app-shell"><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/jenis-sampah" element={<WasteTypes />} />
    <Route path="/bank-sampah" element={<BankList />} />
    <Route path="/bank-sampah/:id" element={<BankDetail />} />
    <Route path="/penjemputan" element={<PickupRequest />} />
    <Route path="/pencatatan-setoran" element={<DepositForm />} />
    <Route path="/riwayat-setoran" element={<DepositHistory />} />
    <Route path="/dashboard-ekonomi" element={<EconomicDashboard />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><Footer /></div></BrowserRouter>;
}
