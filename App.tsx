import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FreightList } from './pages/FreightList';
import { AddFreight } from './pages/AddFreight';
import { MapPage } from './pages/MapPage';
import { FreightDetail } from './pages/FreightDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/freights" element={<FreightList />} />
          <Route path="/freights/:id" element={<FreightDetail />} />
          <Route path="/add" element={<AddFreight />} />
          {/* MapPage is kept for legacy support if needed, but we will rely on Google Maps links */}
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;