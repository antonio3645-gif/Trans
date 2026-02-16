import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveFreight } from '../services/storage';
import { FreightStatus, Freight, Expense } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Save, Trash2, X, Map as MapIcon, DollarSign, Truck, Plus, Receipt } from 'lucide-react';

export const AddFreight: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Manual Expense State
  const [manualExpenseDesc, setManualExpenseDesc] = useState('');
  const [manualExpenseAmount, setManualExpenseAmount] = useState('');
  const [manualExpenseCategory, setManualExpenseCategory] = useState('Outros');

  const [formData, setFormData] = useState<Omit<Freight, 'id' | 'expenses'> & { expenses: Expense[] }>({
    origin: '',
    destination: '',
    cargo: '',
    licensePlate: '',
    weight: 0,
    price: 0,
    advance: 0,
    commission: 0,
    fuel: 0,
    toll: 0,
    misc: 0,
    startDate: new Date().toISOString().split('T')[0],
    status: FreightStatus.PENDING,
    expenses: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    const newFreight: Freight = {
      ...formData,
      id: crypto.randomUUID(),
      weight: Number(formData.weight),
      price: Number(formData.price),
      advance: Number(formData.advance),
      commission: Number(formData.commission),
      fuel: Number(formData.fuel),
      toll: Number(formData.toll),
      misc: Number(formData.misc),
      expenses: formData.expenses
    };
    saveFreight(newFreight);
    setTimeout(() => {
        setIsLoading(false);
        navigate('/freights');
    }, 500);
  };

  const handleOpenMap = () => {
    if (!formData.origin || !formData.destination) {
        alert("Preencha Origem e Destino para ver o mapa.");
        return;
    }
    // Open Google Maps natively
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(formData.origin)}&destination=${encodeURIComponent(formData.destination)}`;
    window.open(url, '_blank');
  };

  const addManualExpense = () => {
    if(!manualExpenseDesc || !manualExpenseAmount) return;
    
    const newExpense: Expense = {
        id: crypto.randomUUID(),
        category: manualExpenseCategory as any,
        amount: Number(manualExpenseAmount),
        date: new Date().toISOString(),
        description: manualExpenseDesc
    };

    setFormData(prev => ({
        ...prev,
        expenses: [...prev.expenses, newExpense]
    }));

    setManualExpenseDesc('');
    setManualExpenseAmount('');
  };

  const removeExpense = (id: string) => {
    setFormData(prev => ({
        ...prev,
        expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  return (
    <div className="p-6 pt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Frete</h1>
        <button onClick={() => navigate('/')} className="p-2 bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? 'bg-brand-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">1. Detalhes da Viagem</h2>
                <button 
                    onClick={handleOpenMap}
                    className="text-brand-600 text-sm font-medium flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                >
                    <MapIcon size={16} /> Ver no Google Maps
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Input label="Origem" name="origin" placeholder="Cidade, UF" value={formData.origin} onChange={handleInputChange} />
                <Input label="Destino" name="destination" placeholder="Cidade, UF" value={formData.destination} onChange={handleInputChange} />
            </div>
            
            <Input label="Carga" name="cargo" placeholder="Ex: Soja, Eletrônicos" value={formData.cargo} onChange={handleInputChange} />
            
            <div className="grid grid-cols-2 gap-4">
                <Input label="Peso (Kg)" name="weight" type="number" value={formData.weight} onChange={handleInputChange} />
                <Input label="Placa" name="licensePlate" placeholder="ABC-1234" value={formData.licensePlate} onChange={handleInputChange} />
            </div>

            <Input label="Data de Início" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />

            <div className="mt-8">
                <Button onClick={() => setStep(2)} className="w-full">
                    Próximo: Financeiro
                </Button>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-lg font-semibold text-gray-700">2. Financeiro</h2>
            
             <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-4">
                <h3 className="text-sm font-bold text-green-800 uppercase flex items-center gap-2">
                    <DollarSign size={14} /> Receita
                </h3>
                <Input label="Valor do Frete (R$)" name="price" type="number" value={formData.price} onChange={handleInputChange} />
                <Input label="Adiantamento (R$)" name="advance" type="number" placeholder="0,00" value={formData.advance} onChange={handleInputChange} />
             </div>

             <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-4">
                <h3 className="text-sm font-bold text-red-800 uppercase flex items-center gap-2">
                    <Truck size={14} /> Custos Diretos
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Comissão (%)" name="commission" type="number" placeholder="0,00" value={formData.commission} onChange={handleInputChange} />
                    <Input label="Combustível (R$)" name="fuel" type="number" placeholder="0,00" value={formData.fuel} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Pedágio (R$)" name="toll" type="number" placeholder="0,00" value={formData.toll} onChange={handleInputChange} />
                    <Input label="Despesas (R$)" name="misc" type="number" placeholder="Outros" value={formData.misc} onChange={handleInputChange} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mt-8">
                <Button variant="secondary" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={() => setStep(3)}>Próximo</Button>
            </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-gray-700">3. Despesas Extras (Opcional)</h2>

            {/* Manual Entry Form */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-600 mb-3">Adicionar Despesa</h3>
                <Input 
                    placeholder="Descrição (ex: Jantar)" 
                    value={manualExpenseDesc} 
                    onChange={e => setManualExpenseDesc(e.target.value)} 
                    className="mb-3"
                />
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input 
                            type="number" 
                            placeholder="Valor" 
                            value={manualExpenseAmount} 
                            onChange={e => setManualExpenseAmount(e.target.value)} 
                        />
                    </div>
                    <button 
                        onClick={addManualExpense}
                        disabled={!manualExpenseDesc || !manualExpenseAmount}
                        className="bg-brand-600 text-white rounded-xl px-4 h-[50px] mt-[1px] disabled:opacity-50"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-3">
                {formData.expenses.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                        <p className="text-sm">Nenhuma despesa extra adicionada.</p>
                    </div>
                ) : (
                    formData.expenses.map(expense => (
                        <div key={expense.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800">{expense.description}</p>
                                <p className="text-xs text-gray-500 uppercase">{expense.category}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-red-500">- R$ {expense.amount}</span>
                                <button onClick={() => removeExpense(expense.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
                <Button variant="secondary" onClick={() => setStep(2)}>
                    Voltar
                </Button>
                <Button onClick={handleSave} isLoading={isLoading} icon={<Save size={18} />}>
                    Salvar Frete
                </Button>
            </div>
        </div>
      )}
    </div>
  );
};