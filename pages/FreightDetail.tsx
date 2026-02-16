import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFreights, deleteFreight } from '../services/storage';
import { Freight } from '../types';
import { ChevronLeft, MapPin, Calendar, Truck, DollarSign, Wallet, Receipt, Trash2, Map as MapIcon } from 'lucide-react';

export const FreightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [freight, setFreight] = useState<Freight | null>(null);

  useEffect(() => {
    const allFreights = getFreights();
    const found = allFreights.find(f => f.id === id);
    if (found) {
      setFreight(found);
    } else {
      navigate('/freights');
    }
  }, [id, navigate]);

  if (!freight) return null;

  // Financial Calculations
  const scannedExpensesTotal = freight.expenses.reduce((sum, e) => sum + e.amount, 0);
  const manualExpensesTotal = (freight.fuel || 0) + (freight.toll || 0) + (freight.commission || 0) + (freight.misc || 0);
  const totalExpenses = scannedExpensesTotal + manualExpensesTotal;
  const netProfit = freight.price - totalExpenses;
  const balanceDue = freight.price - (freight.advance || 0);

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja apagar este frete permanentemente?")) {
        deleteFreight(freight.id);
        navigate('/freights');
    }
  };

  const handleOpenMap = () => {
    // Open Google Maps natively
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(freight.origin)}&destination=${encodeURIComponent(freight.destination)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-900">Detalhes do Frete</h1>
        <button onClick={handleDelete} className="p-2 -mr-2 text-red-500 hover:bg-red-50 rounded-full">
            <Trash2 size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Route Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    freight.status === 'Pago' ? 'bg-green-100 text-green-700' : 
                    freight.status === 'Entregue' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {freight.status}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(freight.startDate).toLocaleDateString()}
                </span>
            </div>
            
            <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-dashed border-gray-200 ml-1">
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-white"></div>
                    <p className="text-xs text-gray-400 font-medium">ORIGEM</p>
                    <p className="text-gray-900 font-bold text-lg leading-tight">{freight.origin}</p>
                </div>
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    <p className="text-xs text-gray-400 font-medium">DESTINO</p>
                    <p className="text-gray-900 font-bold text-lg leading-tight">{freight.destination}</p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-400">Carga</p>
                    <p className="font-medium text-gray-800">{freight.cargo}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Veículo</p>
                    <p className="font-medium text-gray-800 uppercase">{freight.licensePlate || 'N/A'}</p>
                </div>
            </div>

            <button 
                onClick={handleOpenMap}
                className="mt-4 w-full py-2 bg-brand-50 text-brand-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-100 transition-colors"
            >
                <MapIcon size={16} /> Ver no Google Maps
            </button>
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden relative">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                <Wallet size={16} /> Financeiro da Viagem
            </h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-gray-600">
                    <span>Valor do Frete</span>
                    <span className="font-semibold text-gray-900">+ {freight.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                    <span>Adiantamento Recebido</span>
                    <span>({(freight.advance || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-center text-red-500">
                    <span>Total Custos</span>
                    <span className="font-semibold">- {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
            </div>

            <div className={`${netProfit >= 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'} p-4 rounded-xl border flex justify-between items-center`}>
                <span className="font-bold text-sm">LUCRO LÍQUIDO</span>
                <span className="font-bold text-xl">{netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            {balanceDue > 0 && (
                 <div className="mt-3 text-center">
                    <p className="text-xs text-gray-400 uppercase">Saldo a Receber</p>
                    <p className="text-brand-600 font-bold">{balanceDue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                 </div>
            )}
        </div>

        {/* Detailed Costs */}
        <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase px-1">Detalhamento de Custos</h2>
            
            {/* Manual Costs Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Combustível</p>
                    <p className="font-bold text-gray-800">R$ {freight.fuel || 0}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Pedágio</p>
                    <p className="font-bold text-gray-800">R$ {freight.toll || 0}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Comissão</p>
                    <p className="font-bold text-gray-800">R$ {freight.commission || 0}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Outros</p>
                    <p className="font-bold text-gray-800">R$ {freight.misc || 0}</p>
                </div>
            </div>

            {/* Scanned Expenses List */}
            {freight.expenses.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
                        <Receipt size={14} /> Despesas Adicionais
                    </h3>
                    <div className="space-y-3">
                        {freight.expenses.map(expense => (
                            <div key={expense.id} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                <div>
                                    <p className="font-medium text-gray-800">{expense.description}</p>
                                    <p className="text-xs text-gray-400">{expense.category}</p>
                                </div>
                                <span className="text-red-500 font-medium">- R$ {expense.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};