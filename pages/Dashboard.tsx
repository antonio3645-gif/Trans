import React, { useEffect, useState } from 'react';
import { getFreights, seedData } from '../services/storage';
import { Freight } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [freights, setFreights] = useState<Freight[]>([]);

  useEffect(() => {
    seedData();
    const data = getFreights();
    setFreights(data);
  }, []);

  const totalRevenue = freights.reduce((acc, f) => acc + f.price, 0);
  
  const totalExpenses = freights.reduce((acc, f) => {
    const scannedExpenses = f.expenses.reduce((sum, e) => sum + e.amount, 0);
    const manualExpenses = (f.fuel || 0) + (f.toll || 0) + (f.commission || 0) + (f.misc || 0);
    return acc + scannedExpenses + manualExpenses;
  }, 0);

  const profit = totalRevenue - totalExpenses;

  const data = [
    { name: 'Lucro', value: profit > 0 ? profit : 0, color: '#22c55e' },
    { name: 'Gastos', value: totalExpenses, color: '#ef4444' },
  ];

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, Trans Martins! 👋</h1>
        <p className="text-gray-500">Aqui está o resumo do seu mês.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Receita</p>
            <p className="text-lg font-bold text-gray-900">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-3">
            <TrendingDown size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Despesas</p>
            <p className="text-lg font-bold text-gray-900">R$ {totalExpenses.toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Main Profit Card */}
      <div className="bg-brand-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-500/30 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <p className="text-brand-100 font-medium mb-1">Lucro Líquido</p>
                <h2 className="text-4xl font-bold">R$ {profit.toLocaleString('pt-BR')}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Wallet size={32} />
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Balanço Financeiro</h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => `R$ ${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
            </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
            {data.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-sm font-medium text-gray-600">{d.name}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};