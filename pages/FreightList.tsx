import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFreights, deleteFreight } from '../services/storage';
import { Freight } from '../types';
import { MapPin, Calendar, DollarSign, Trash2, Wallet, ChevronRight } from 'lucide-react';

export const FreightList: React.FC = () => {
  const [freights, setFreights] = useState<Freight[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFreights(getFreights().reverse()); // Newest first
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja apagar este frete?")) {
        deleteFreight(id);
        setFreights(prev => prev.filter(f => f.id !== id));
    }
  };

  const calculateProfit = (f: Freight) => {
    const scanned = f.expenses.reduce((s, e) => s + e.amount, 0);
    const manual = (f.fuel || 0) + (f.toll || 0) + (f.commission || 0) + (f.misc || 0);
    return f.price - scanned - manual;
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus Fretes</h1>
      
      <div className="space-y-4">
        {freights.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
                <p>Nenhum frete registrado.</p>
                <Link to="/add" className="text-brand-600 font-medium mt-2 inline-block">Começar agora</Link>
            </div>
        ) : (
            freights.map(freight => {
                const profit = calculateProfit(freight);
                return (
                    <div 
                        key={freight.id} 
                        onClick={() => navigate(`/freights/${freight.id}`)}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative group cursor-pointer transition-transform active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                                <Calendar size={16} />
                                <span>{new Date(freight.startDate).toLocaleDateString('pt-BR')}</span>
                                {freight.licensePlate && (
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 border border-gray-200 uppercase tracking-wide">
                                        {freight.licensePlate}
                                    </span>
                                )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                freight.status === 'Pago' ? 'bg-green-100 text-green-700' : 
                                freight.status === 'Entregue' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {freight.status}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 mb-4 relative pl-4 border-l-2 border-dashed border-gray-200">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-white"></div>
                                <p className="text-gray-900 font-semibold">{freight.origin}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                <p className="text-gray-900 font-semibold">{freight.destination}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                            <div>
                                <p className="text-xs text-gray-500">Valor Bruto</p>
                                <p className="text-sm font-medium text-gray-800">R$ {freight.price.toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <p className="text-xs text-gray-500">Lucro Estimado</p>
                                <p className={`text-lg font-bold flex items-center gap-1 ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    <Wallet size={16} /> {profit.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Right Chevron for indication */}
                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-200 opacity-50">
                             <ChevronRight size={24} />
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};