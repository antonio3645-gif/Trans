export enum FreightStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Andamento',
  DELIVERED = 'Entregue',
  PAID = 'Pago'
}

export interface Expense {
  id: string;
  category: 'Fuel' | 'Food' | 'Toll' | 'Maintenance' | 'Other';
  amount: number;
  date: string; // ISO string
  description?: string;
}

export interface Freight {
  id: string;
  origin: string;
  destination: string;
  cargo: string;
  licensePlate?: string;
  weight: number; // in tons or kg
  price: number;
  
  // New Financial Fields
  advance?: number;      // Adiantamento
  commission?: number;   // Comissão Motorista
  fuel?: number;         // Combustível (manual entry)
  toll?: number;         // Pedágio (manual entry)
  misc?: number;         // Outras Despesas (manual entry)

  startDate: string;
  status: FreightStatus;
  expenses: Expense[]; // Scanned/Detailed expenses
  notes?: string;
}

export interface AnalysisResult {
  summary: string;
  profitabilityScore: number; // 0-100
  suggestions: string[];
}