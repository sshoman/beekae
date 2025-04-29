
import { useState, useRef, useEffect } from 'react';
import useBookkeeping from '@/hooks/useBookkeeping';
import { Button } from '@/components/ui/button';
import ChatInput from '@/components/Chat/ChatInput';
import MessageBubble from '@/components/Chat/MessageBubble';
import ReportDisplay from '@/components/Bookkeeping/ReportDisplay';
import { AudioWaveform, Receipt, Wallet, BarChart3, PencilLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookkeepingAgentProps {
  className?: string;
}

const BookkeepingAgent = ({ className }: BookkeepingAgentProps) => {
  const { messages, isLoading, sendMessage, resetChat } = useBookkeeping();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReport, setShowReport] = useState<boolean>(false);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Check if we're on index page based on className
  const isIndexPage = className?.includes('index-page-agent');
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className={cn(
        "flex items-center justify-between px-4 py-3 bg-gradient-to-r from-burgundy/10 to-transparent",
        isIndexPage ? "pb-2" : ""
      )}>
        <h2 className="text-base font-medium text-burgundy flex items-center gap-2">
          <AudioWaveform className="h-4 w-4" />
          Easy Bookkeeping
        </h2>
      </div>
      
      <div className={cn(
        "flex-1 overflow-y-auto px-4",
        isIndexPage ? "pt-1" : ""
      )}>
        {messages.length === 0 ? (
          <div className="chat-empty-placeholder p-4">
            <div className={cn(
              "flex flex-col items-center justify-center",
              isIndexPage ? "mt-0 mb-1" : "my-2"
            )}>
              <AudioWaveform className="w-12 h-12 text-burgundy animate-pulse-wave" />
              <span className="text-xs text-muted-foreground italic">-soon-</span>
            </div>
            <h3 className="text-xl font-medium mb-2 text-burgundy">issue an invoice with a single sentence!</h3>
            <p className="text-muted-foreground text-sm max-w-md font-sans mb-2">
              or a receipt, a purchase order, a sales order, or a salary slip.
            </p>
            
            <div className="w-full max-w-3xl">
              <ChatInput 
                onSendMessage={sendMessage} 
                isLoading={isLoading}
                placeholder="talk to Beekay like you talk to a human bookkeeper who actually went to a good school..." 
                className="mb-4"
              />
              
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <div className="col-span-1 w-full">
                  <h4 className="text-sm font-medium mb-2 text-burgundy font-indie-flower flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-burgundy" />
                    Examples -paperwork
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="p-2 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      issue a receipt for mr. Rose for 2000
                      <span className="animate-float-1 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                    <p className="p-2 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      invoice Globex for 12500 dollars for 50 hours
                      <span className="animate-float-2 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="col-span-1 w-full">
                  <h4 className="text-sm font-medium mb-2 text-burgundy font-indie-flower flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-burgundy" />
                    Examples -records
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="p-2 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      paid AWS bill 1452
                      <span className="animate-float-1 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                    <p className="p-2 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      got a loan from Wells Fargo for 50k
                      <span className="animate-float-2 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="col-span-1 w-full">
                  <h4 className="text-sm font-medium mb-2 text-burgundy font-indie-flower flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-burgundy" />
                    Examples -reports
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="p-2 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      whats my cash flow for Q1?
                      <span className="animate-float-1 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                    <p className="p-2 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      how much did I spend on marketing last month?
                      <span className="animate-float-2 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {showReport ? (
              <ReportDisplay 
                report={messages.find(m => m.report)?.report!}
                onDownload={(reportId) => console.log('Download report', reportId)}
                onRemove={(reportId) => console.log('Remove report', reportId)}
                onClose={() => setShowReport(false)}
              />
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-2 animate-fade-in pl-4">
                    <div className="flex items-center h-8 px-3 py-1 rounded-full bg-secondary">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}
      </div>
      
      {(messages.length > 0 && !showReport) && (
        <div className="p-3 border-t border-border bg-background/50">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            placeholder="Talk to Beekae like you talk to a human bookkeeper who actually went to a good school..." 
          />
        </div>
      )}
    </div>
  );
};

export default BookkeepingAgent;
