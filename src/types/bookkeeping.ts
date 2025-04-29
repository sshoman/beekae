
export interface BookkeepingEntry {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  accountType?: 'asset' | 'liability';
  flowType?: 'cash-in' | 'cash-out';
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  entries: BookkeepingEntry[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
  };
  period: {
    startDate?: string;
    endDate?: string;
    month?: string;
    year?: string;
  };
  generatedAt: string;
}

export interface GeminiResponse {
  entry?: BookkeepingEntry;
  report?: Report;
  error?: string;
  message?: string;
}

export interface ReportRequest {
  type: 'monthly' | 'custom';
  category?: string;
  month?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
}
