
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import useChat from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { AudioWaveform, Filter, Receipt, Wallet, BarChart3, PencilLine } from 'lucide-react';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { messages, isLoading, sendMessage, resetChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-4 py-3 mb-4 bg-gradient-to-r from-burgundy/10 to-transparent">
        <h2 className="text-base font-medium text-burgundy flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Fun Intelligence
        </h2>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetChat}
            className="text-xs"
          >
            Clear chat
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          <div className="chat-empty-placeholder">
            <div className="flex flex-col items-center justify-center mb-4 mt-4">
              <AudioWaveform className="w-12 h-12 text-burgundy animate-pulse-wave" />
              <span className="text-xs text-muted-foreground italic">-soon-</span>
            </div>
            <h3 className="text-xl font-medium mb-2 text-burgundy">issue an invoice with a single sentence!</h3>
            <p className="text-muted-foreground text-sm max-w-md font-sans mb-8">
              or a receipt, a purchase order, or a financial statement.
            </p>
            
            <div className="mt-auto w-full max-w-3xl px-4">
              <ChatInput 
                onSendMessage={sendMessage} 
                isLoading={isLoading} 
              />
              
              <div className="grid grid-cols-3 gap-6 w-full mt-8">
                <div className="col-span-1 w-full">
                  <h4 className="text-sm font-medium mb-2 text-burgundy font-indie-flower flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-burgundy" />
                    invoice
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="p-3 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      "issue an invoice to abc corp for $500 for web design"
                      <span className="animate-float-1 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                    <p className="p-3 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      "create a receipt for $75 payment from john smith"
                      <span className="animate-float-2 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="col-span-1 w-full">
                  <h4 className="text-sm font-medium mb-2 text-burgundy font-indie-flower flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-burgundy" />
                    record
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="p-3 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      "record $120 expense for office supplies"
                      <span className="animate-float-1 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                    <p className="p-3 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      "log $2,500 payment from xyz company"
                      <span className="animate-float-2 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="col-span-1 w-full">
                  <h4 className="text-sm font-medium mb-2 text-burgundy font-indie-flower flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-burgundy" />
                    report
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="p-3 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      "generate an income statement for q1 2025"
                      <span className="animate-float-1 absolute opacity-10 text-2xl font-bold text-burgundy">
                        <PencilLine className="h-7 w-7" />
                      </span>
                    </p>
                    <p className="p-3 bg-secondary/50 rounded-lg text-xs relative overflow-hidden example-card">
                      "how much did i make in sales this year so far?"
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
          <div className="space-y-6 py-4">
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
      </div>
      
      {messages.length > 0 && (
        <div className="mt-auto p-4">
          <ChatInput 
            onSendMessage={sendMessage} 
            isLoading={isLoading} 
          />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
