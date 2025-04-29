
import React from 'react';
import { cn } from '@/lib/utils';
import { Report } from '@/types/bookkeeping';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, X, Heart } from 'lucide-react';

interface ReportDisplayProps {
  report: Report;
  onDownload: (reportId: string) => void;
  onRemove: (reportId: string) => void;
  onClose: () => void;  // Added onClose prop to interface
  className?: string;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onDownload, onRemove, onClose, className }) => {
  const { title, entries, summary, period, generatedAt } = report;
  const formattedDate = new Date(generatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getPeriodLabel = () => {
    if (period.month && period.year) {
      return `${period.month} ${period.year}`;
    } else if (period.startDate && period.endDate) {
      if (period.startDate === period.endDate) {
        return `${new Date(period.startDate).toLocaleDateString()}`;
      }
      return `${new Date(period.startDate).toLocaleDateString()} to ${new Date(period.endDate).toLocaleDateString()}`;
    }
    return 'Custom Period';
  };

  return (
    <Card className={cn("w-full mb-6 bg-burgundy/5 border-burgundy/30", className)}>
      <CardHeader className="pb-2 bg-burgundy text-white rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription className="text-white/80">
              {getPeriodLabel()} • Generated: {formattedDate}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="h-8 bg-white text-burgundy hover:bg-white/90"
              onClick={() => onDownload(report.id)}
            >
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 bg-transparent border-white text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-xl font-semibold text-green-600">${summary.totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-xl font-semibold text-red-600">${summary.totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-muted-foreground">Net</p>
            <p className={cn(
              "text-xl font-semibold",
              summary.netAmount >= 0 ? "text-green-600" : "text-red-600"
            )}>
              ${summary.netAmount.toFixed(2)}
            </p>
          </div>
        </div>
        
        {entries.length > 0 ? (
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader className="bg-burgundy/10">
                <TableRow>
                  <TableHead className="text-burgundy">Date</TableHead>
                  <TableHead className="text-burgundy">Description</TableHead>
                  <TableHead className="text-burgundy">Category</TableHead>
                  <TableHead className="text-right text-burgundy">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="border-burgundy/10">
                    <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell className={cn(
                      "text-right font-medium",
                      entry.type === 'income' ? "text-green-600" : "text-red-600"
                    )}>
                      {entry.type === 'income' ? '+' : '-'}${Math.abs(entry.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground bg-white/50 rounded-md border">
            No entries found for this period
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-burgundy/10 pt-4 text-xs text-burgundy/80 bg-burgundy/5">
        <div className="flex items-center">
          Made with <Heart className="h-3 w-3 mx-1 fill-burgundy stroke-burgundy" /> by Beekay • Export generated on {formattedDate}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportDisplay;
