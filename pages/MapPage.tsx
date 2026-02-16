import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { ChevronLeft, Navigation } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const originLat = parseFloat(searchParams.get('ol') || '0');
  const originLng = parseFloat(searchParams.get('ola') || '0');
  const destLat = parseFloat(searchParams.get('dl') || '0');
  const destLng = parseFloat(searchParams.get('dla') || '0');
  const originName = searchParams.get('o') || 'Origem';
  const destName = searchParams.get('d') || 'Destino';

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Initialize map if not exists
    if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current).setView([originLat, originLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Custom Icons (using standard markers but ensuring no missing asset issues)
    const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    // Markers
    const m1 = L.marker([originLat, originLng], { icon }).addTo(map).bindPopup(`<b>${originName}</b><br>Início`);
    const m2 = L.marker([destLat, destLng], { icon }).addTo(map).bindPopup(`<b>${destName}</b><br>Fim`);

    // Route Line (Dashed)
    const latlngs = [
        [originLat, originLng],
        [destLat, destLng]
    ];
    const polyline = L.polyline(latlngs as any, { color: '#2563eb', weight: 4, dashArray: '10, 10', opacity: 0.7 }).addTo(map);

    // Fit bounds to show both markers
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    // Open popups
    setTimeout(() => m2.openPopup(), 1000);

    return () => {
        // Cleanup if necessary, though React 18 strict mode double mounts can be tricky with Leaflet
        // map.remove(); 
    };
  }, [originLat, originLng, destLat, destLng]);

  return (
    <div className="h-screen w-full relative bg-gray-100 flex flex-col">
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="text-xs font-bold text-gray-800 truncate">{originName}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <p className="text-xs font-bold text-gray-800 truncate">{destName}</p>
                </div>
            </div>
            <div className="bg-brand-50 p-2 rounded-lg text-brand-600">
                <Navigation size={20} />
            </div>
        </div>

        {/* Map Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />
        
        {/* Bottom info */}
        <div className="absolute bottom-6 left-4 right-4 z-[400] bg-white p-4 rounded-xl shadow-xl border border-gray-100">
             <p className="text-sm text-gray-500 text-center">Visualização aproximada da rota em linha reta.</p>
        </div>
    </div>
  );
};