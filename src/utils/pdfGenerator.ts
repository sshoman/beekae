
import { Report } from '@/types/bookkeeping';

export const generatePDF = async (report: Report): Promise<void> => {
  try {
    // Generate a text report
    const textReport = generateTextReport(report);
    
    // Create a blob and download it
    const blob = new Blob([textReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

const generateTextReport = (report: Report): string => {
  const lines: string[] = [];
  
  // Title and header
  lines.push(`=== ${report.title} ===`);
  lines.push('');
  
  // Period
  let periodText = '';
  if (report.period.month && report.period.year) {
    periodText = `Period: ${report.period.month} ${report.period.year}`;
  } else if (report.period.startDate && report.period.endDate) {
    periodText = `Period: ${report.period.startDate} to ${report.period.endDate}`;
  }
  
  if (periodText) {
    lines.push(periodText);
  }
  
  // Generated timestamp
  const formattedDate = new Date(report.generatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  lines.push(`Generated on: ${formattedDate}`);
  lines.push('');
  
  // Summary
  lines.push('SUMMARY');
  lines.push('-'.repeat(30));
  lines.push(`Total Income: $${report.summary.totalIncome.toFixed(2)}`);
  lines.push(`Total Expenses: $${report.summary.totalExpenses.toFixed(2)}`);
  lines.push(`Net Amount: $${report.summary.netAmount.toFixed(2)}`);
  lines.push('');
  
  // Entries
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
  lines.push('Made with ❤️ by Beekay');
  
  return lines.join('\n');
};
