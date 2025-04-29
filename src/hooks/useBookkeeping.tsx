
import { useState } from 'react';
import { toast } from 'sonner';
import { BookkeepingEntry, GeminiResponse, Report, ReportRequest } from '@/types/bookkeeping';
import { generatePDF } from '@/utils/pdfGenerator';

function useBookkeeping() {
  const [entries, setEntries] = useState<BookkeepingEntry[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processEntry = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    setLastError(null);
    
    try {
      const mockResponse = await simulateGeminiProcessing(text, entries);
      
      if (mockResponse.error) {
        throw new Error(mockResponse.error);
      }
      
      if (mockResponse.entry) {
        setReports([]);
        setEntries(prev => [mockResponse.entry!, ...prev]);
        
        toast.success('Entry processed successfully', {
          description: `${mockResponse.entry.type}: $${Math.abs(mockResponse.entry.amount).toFixed(2)} - ${mockResponse.entry.description}`
        });
        
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          content: `Entry processed successfully: ${mockResponse.entry.type} $${Math.abs(mockResponse.entry.amount).toFixed(2)} - ${mockResponse.entry.description}`, 
          sender: 'assistant',
          entry: mockResponse.entry
        }]);
      } else if (mockResponse.report) {
        setReports(prev => [mockResponse.report!, ...prev]);
        
        toast.success('Report generated successfully', {
          description: `${mockResponse.report.title} - ${new Date(mockResponse.report.generatedAt).toLocaleString()}`
        });
        
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          content: `Report generated successfully: ${mockResponse.report.title}`, 
          sender: 'assistant',
          report: mockResponse.report
        }]);
      } else if (mockResponse.message) {
        toast.info(mockResponse.message);
        
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          content: mockResponse.message, 
          sender: 'assistant' 
        }]);
      }
      
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error processing entry:', error);
      setLastError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast.error('Failed to process request', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
      
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        content: `Error: ${error instanceof Error ? error.message : 'Failed to process your request. Please try again.'}`, 
        sender: 'assistant' 
      }]);
      
      setIsLoading(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReport = async (request: ReportRequest) => {
    setIsProcessing(true);
    
    try {
      const reportData = generateReportData(entries, request);
      setReports(prev => [reportData, ...prev]);
      
      toast.success('Report generated successfully', {
        description: `${reportData.title} - ${new Date(reportData.generatedAt).toLocaleString()}`
      });
      
      return reportData;
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) {
      toast.error('Report not found');
      return;
    }
    
    try {
      const textReport = generateTextReport(report);
      
      const blob = new Blob([textReport], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    }
  };

  const generateTextReport = (report: Report): string => {
    const lines: string[] = [];
    
    lines.push(`=== ${report.title} ===`);
    lines.push('');
    
    let periodText = '';
    if (report.period.month && report.period.year) {
      periodText = `Period: ${report.period.month} ${report.period.year}`;
    } else if (report.period.startDate && report.period.endDate) {
      periodText = `Period: ${report.period.startDate} to ${report.period.endDate}`;
    }
    
    if (periodText) {
      lines.push(periodText);
    }
    
    const formattedDate = new Date(report.generatedAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    lines.push(`Generated on: ${formattedDate}`);
    lines.push('');
    
    lines.push('SUMMARY');
    lines.push('-'.repeat(30));
    lines.push(`Total Income: $${report.summary.totalIncome.toFixed(2)}`);
    lines.push(`Total Expenses: $${report.summary.totalExpenses.toFixed(2)}`);
    lines.push(`Net Amount: $${report.summary.netAmount.toFixed(2)}`);
    lines.push('');
    
    lines.push('ENTRIES');
    lines.push('-'.repeat(80));
    lines.push('Date'.padEnd(12) + 'Description'.padEnd(30) + 'Category'.padEnd(20) + 'Amount'.padStart(15));
    lines.push('-'.repeat(80));
    
    for (const entry of report.entries) {
      const date = new Date(entry.date).toLocaleDateString();
      const amount = entry.type === 'income' 
        ? `+$${Math.abs(entry.amount).toFixed(2)}` 
        : `-$${Math.abs(entry.amount).toFixed(2)}`;
      
      lines.push(
        date.padEnd(12) + 
        entry.description.substring(0, 28).padEnd(30) + 
        entry.category.substring(0, 18).padEnd(20) + 
        amount.padStart(15)
      );
    }
    
    lines.push('-'.repeat(80));
    lines.push('');
    lines.push('Made with ❤️ by Beekae');
    
    return lines.join('\n');
  };

  const removeReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    toast.success('Report removed');
  };

  const clearEntries = () => {
    setEntries([]);
    setReports([]);
    toast.success('All entries and reports cleared');
  };

  const sendMessage = (message: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), content: message, sender: 'user', timestamp: Date.now() }]);
    
    processEntry(message);
  };

  const resetChat = () => {
    setMessages([]);
  };

  return {
    entries,
    reports,
    isProcessing,
    lastError,
    processEntry,
    generateReport,
    downloadReport,
    removeReport,
    clearEntries,
    messages,
    isLoading,
    sendMessage,
    resetChat
  };
};

const generateReportData = (entries: BookkeepingEntry[], request: ReportRequest): Report => {
  let filteredEntries = [...entries];
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();
  const currentDay = now.toLocaleString('default', { day: 'numeric' });
  
  if (request.type === 'monthly' && request.month && request.year) {
    filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const entryMonth = entryDate.toLocaleString('default', { month: 'long' });
      const entryYear = entryDate.getFullYear();
      
      return entryMonth.toLowerCase() === request.month!.toLowerCase() && 
             entryYear.toString() === request.year;
    });
  } else if (request.type === 'custom' && request.startDate && request.endDate) {
    filteredEntries = entries.filter(entry => {
      return entry.date >= request.startDate! && entry.date <= request.endDate!;
    });
  } else {
    filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const entryDay = entryDate.getDate();
      const entryMonth = entryDate.getMonth();
      const entryYear = entryDate.getFullYear();
      
      return entryDay === now.getDate() && 
             entryMonth === now.getMonth() && 
             entryYear === now.getFullYear();
    });
  }
  
  if (request.category) {
    filteredEntries = filteredEntries.filter(entry => 
      entry.category.toLowerCase() === request.category!.toLowerCase()
    );
  }
  
  const summary = filteredEntries.reduce((acc, entry) => {
    if (entry.type === 'income') {
      acc.totalIncome += entry.amount;
    } else {
      acc.totalExpenses += Math.abs(entry.amount);
    }
    acc.netAmount = acc.totalIncome - acc.totalExpenses;
    return acc;
  }, { totalIncome: 0, totalExpenses: 0, netAmount: 0 });
  
  let title = `Financial Report`;
  let period = {};
  
  if (request.type === 'monthly' && request.month && request.year) {
    title = `Monthly Report - ${request.month} ${request.year}`;
    period = { month: request.month, year: request.year };
  } else if (request.type === 'custom' && request.startDate && request.endDate) {
    title = `Custom Report - ${request.startDate} to ${request.endDate}`;
    period = { startDate: request.startDate, endDate: request.endDate };
  } else {
    title = `Daily Report - ${currentMonth} ${currentDay}, ${currentYear}`;
    period = { 
      month: currentMonth, 
      year: currentYear.toString(), 
      startDate: now.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    };
  }
  
  if (request.category) {
    title = `${request.category} ${title}`;
  }
  
  return {
    id: Date.now().toString(),
    title,
    entries: filteredEntries,
    summary,
    period,
    generatedAt: new Date().toISOString()
  };
};

const simulateGeminiProcessing = async (text: string, existingEntries: BookkeepingEntry[]): Promise<GeminiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerText = text.toLowerCase();

  if (lowerText.includes("issue a receipt for mr. rose for 2000") ||
      lowerText.includes("invoice globex for 12500 dollars for 50 hours")) {
    
    const isReceipt = lowerText.includes("receipt for mr. rose");
    
    let entryData: BookkeepingEntry = {
      id: Date.now().toString(),
      description: isReceipt 
        ? "Receipt for Mr. Rose" 
        : "Invoice to Globex for consulting",
      amount: isReceipt ? 2000 : 12500,
      category: isReceipt ? "Sales" : "Consulting Services",
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      createdAt: new Date().toISOString()
    };
    
    return { entry: entryData };
  }
  
  if (
    lowerText.includes('report') || 
    lowerText.includes('summary') || 
    lowerText.includes('total') ||
    lowerText.includes('statistics') ||
    lowerText.includes('financial statement') ||
    lowerText.includes('expenses') ||
    lowerText.includes('income') ||
    lowerText.includes('spent') ||
    lowerText.includes('earned')
  ) {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    
    let requestType: 'monthly' | 'custom' = 'monthly';
    let month = currentMonth;
    let year = currentYear.toString();
    let category = undefined;
    
    const isDailyRequest = 
      lowerText.includes('today') || 
      lowerText.includes('daily') || 
      (lowerText.includes('this') && lowerText.includes('day'));
    
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june', 
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    let isMonthSpecified = false;
    for (const m of months) {
      if (lowerText.includes(m)) {
        month = m[0].toUpperCase() + m.slice(1);
        isMonthSpecified = true;
        break;
      }
    }
    
    const yearMatch = lowerText.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }
    
    const categories = [
      'payroll', 'marketing', 'technology', 'office space', 
      'subscription revenue', 'services', 'equipment', 'loans', 'assets'
    ];
    
    for (const cat of categories) {
      if (lowerText.includes(cat.toLowerCase())) {
        category = cat[0].toUpperCase() + cat.slice(1);
        break;
      }
    }
    
    const request: ReportRequest = {
      type: requestType,
    };
    
    if (isDailyRequest || (!isMonthSpecified && !lowerText.includes('month') && !lowerText.includes('year'))) {
      request.type = 'custom';
      request.startDate = new Date().toISOString().split('T')[0];
      request.endDate = new Date().toISOString().split('T')[0];
    } else {
      request.month = month;
      request.year = year;
    }
    
    if (category) {
      request.category = category;
    }
    
    const report = generateReportData(existingEntries, request);
    
    return { report };
  }
  
  if (lowerText.includes('help') || lowerText.includes('what can you do')) {
    return { message: "I can help you track your business finances. Just describe a transaction like 'received 25000 from enterprise clients'" };
  }
  
  let type: 'income' | 'expense' = 'expense';
  let accountType: 'asset' | 'liability' | undefined;
  let flowType: 'cash-in' | 'cash-out' | undefined;
  
  if (
    lowerText.includes('invoice') || 
    lowerText.includes('bill to') || 
    lowerText.includes('charge')
  ) {
    type = 'income';
    flowType = 'cash-in';
    accountType = 'asset'; // This is accounts receivable
  } else if (
    lowerText.includes('received') || 
    lowerText.includes('earned') || 
    lowerText.includes('revenue') ||
    lowerText.includes('client paid') ||
    lowerText.includes('income') ||
    lowerText.includes('sales') ||
    lowerText.includes('got') ||
    lowerText.includes('collected')
  ) {
    type = 'income';
    flowType = 'cash-in';
  } else {
    flowType = 'cash-out';
  }
  
  if (
    lowerText.includes('purchased') ||
    lowerText.includes('bought') ||
    lowerText.includes('acquired') ||
    lowerText.includes('investment') ||
    lowerText.includes('furniture') ||
    lowerText.includes('equipment')
  ) {
    accountType = 'asset';
  } else if (
    lowerText.includes('loan') ||
    lowerText.includes('debt') ||
    lowerText.includes('owed')
  ) {
    accountType = 'liability';
  }
  
  const amountRegexes = [
    /\$?(\d+(?:,\d{3})*(?:\.\d{1,2})?k?)/i,  // Handles $1,234.56 or 1234.56 or 1,234.56k
    /(\d+)k\b/i,  // Handles 5k or 10K 
    /(\d+)\s+dollars/i,  // Handles 100 dollars
    /(\d+)\s+bucks/i,  // Handles 50 bucks
  ];
  
  let amountMatch = null;
  for (const regex of amountRegexes) {
    const match = text.match(regex);
    if (match) {
      amountMatch = match;
      break;
    }
  }
  
  if (!amountMatch) {
    return { error: "I couldn't detect an amount in your entry. Please include a dollar amount like 1200.00." };
  }
  
  let amountStr = amountMatch[1].replace(/,/g, '');
  
  // Convert 'k' notation (e.g., 5k) to full number 
  if (amountStr.toLowerCase().endsWith('k')) {
    const numericPart = amountStr.slice(0, -1);
    amountStr = (parseFloat(numericPart) * 1000).toString();
  }
  
  const amount = parseFloat(amountStr);
  
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  
  let category = 'Miscellaneous';
  
  if (lowerText.includes('salary') || lowerText.includes('payroll') || lowerText.includes('wage')) {
    category = 'Payroll';
  } else if (lowerText.includes('advertisement') || lowerText.includes('marketing')) {
    category = 'Marketing';
  } else if (lowerText.includes('server') || lowerText.includes('hosting') || lowerText.includes('aws') || lowerText.includes('AWS')) {
    category = 'Technology';
  } else if (lowerText.includes('rent') || lowerText.includes('office')) {
    category = 'Office Space';
  } else if (lowerText.includes('subscription') || lowerText.includes('saas')) {
    category = 'Subscription Revenue';
  } else if (lowerText.includes('consulting') || lowerText.includes('service')) {
    category = 'Services';
  } else if (lowerText.includes('equipment') || lowerText.includes('hardware') || lowerText.includes('furniture')) {
    category = 'Equipment';
  } else if (lowerText.includes('loan') || lowerText.includes('borrowed')) {
    category = 'Loans';
  } else if (lowerText.includes('asset') || lowerText.includes('investment')) {
    category = 'Assets';
  }
  
  if (lowerText.includes('invoice') || lowerText.includes('bill to')) {
    category = 'Accounts Receivable';
  }
  
  let clientName = '';
  if (type === 'income') {
    const clientMatches = lowerText.match(/from\s+([a-z0-9\s]+)\s+(for|corp|inc|llc)/i);
    if (clientMatches && clientMatches[1]) {
      clientName = clientMatches[1].trim();
      clientName = clientName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  let description = '';
  
  if (type === 'income') {
    if (lowerText.includes('invoice')) {
      description = clientName ? `Invoice to ${clientName}` : 'Client Invoice';
    } else if (clientName) {
      description = `${clientName} Revenue`;
    } else if (category === 'Subscription Revenue') {
      description = 'Subscription Revenue';
    } else {
      description = 'Client Revenue';
    }
  } else {
    if (lowerText.includes('aws') || lowerText.includes('AWS')) {
      description = 'AWS Hosting';
    } else if (lowerText.includes('salary') || lowerText.includes('payroll')) {
      description = 'Staff Payroll';
    } else if (lowerText.includes('marketing') || lowerText.includes('ads')) {
      description = 'Marketing Expenses';
    } else if (lowerText.includes('loan') || lowerText.includes('borrowed')) {
      description = 'Bank Loan';
    } else if (lowerText.includes('furniture')) {
      description = 'Office Furniture';
    } else if (lowerText.includes('equipment') || lowerText.includes('asset')) {
      description = 'Equipment Purchase';
    } else {
      const expenseMatches = lowerText.match(/(paid|bought|purchased|for)\s+([a-zA-Z0-9\s]+?)\s+(for|\$|this|last)/i);
      if (expenseMatches && expenseMatches[2]) {
        description = expenseMatches[2].trim();
        description = description.split(' ').map(word => 
          word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word
        ).join(' ');
      } else {
        description = category;
      }
    }
  }
  
  description = `${description}, ${currentMonth}`;
  
  return {
    entry: {
      id: Date.now().toString(),
      description,
      amount: type === 'income' ? amount : -amount,
      category,
      date: new Date().toISOString().split('T')[0],
      type,
      accountType,
      flowType,
      createdAt: new Date().toISOString()
    }
  };
};

export default useBookkeeping;
