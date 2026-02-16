import { Freight, FreightStatus, Expense } from '../types';

const STORAGE_KEY = 'fretesmart_data_v1';

export const getFreights = (): Freight[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFreight = (freight: Freight): void => {
  const freights = getFreights();
  const existingIndex = freights.findIndex(f => f.id === freight.id);
  
  if (existingIndex >= 0) {
    freights[existingIndex] = freight;
  } else {
    freights.push(freight);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(freights));
};

export const deleteFreight = (id: string): void => {
  const freights = getFreights();
  const newFreights = freights.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newFreights));
};

export const seedData = () => {
  if (getFreights().length === 0) {
    const mockFreights: Freight[] = [
      {
        id: '1',
        origin: 'São Paulo, SP',
        destination: 'Curitiba, PR',
        cargo: 'Eletrônicos',
        licensePlate: 'ABC-1234',
        weight: 12000,
        price: 4500,
        advance: 2000,
        fuel: 1200,
        toll: 150,
        commission: 450,
        misc: 50,
        startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: FreightStatus.DELIVERED,
        expenses: []
      },
      {
        id: '2',
        origin: 'Curitiba, PR',
        destination: 'Florianópolis, SC',
        cargo: 'Móveis',
        licensePlate: 'XYZ-9876',
        weight: 8000,
        price: 2800,
        advance: 1000,
        fuel: 600,
        toll: 80,
        commission: 280,
        startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: FreightStatus.IN_PROGRESS,
        expenses: []
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFreights));
  }
};