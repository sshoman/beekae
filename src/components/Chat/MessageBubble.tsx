
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: any;
  className?: string;
}

const MessageBubble = ({ message, className }: MessageBubbleProps) => {
  const isAi = message.sender === 'assistant' || message.sender === 'ai';
  const messageContent = message.text || message.content || '';
  const hasEntry = message.entry || (messageContent.includes('Entry processed successfully') && messageContent.includes('$'));
  
  // Format for entry display
  let entryDisplay = null;
  if (hasEntry) {
    let entryData = message.entry;
    let description, category, amount, type;
    
    if (!entryData && messageContent.includes('Entry processed successfully')) {
      // Parse from message content if entry object not available
      const parts = messageContent.match(/Entry processed successfully: (income|expense) \$([\d.]+) - (.+)/);
      if (parts) {
        type = parts[1];
        description = parts[3].split(',')[0];
        category = parts[3].split(',')[1]?.trim() || 'General';
        amount = parseFloat(parts[2]);
        amount = type === 'expense' ? -amount : amount;
      }
    } else if (entryData) {
      description = entryData.description;
      category = entryData.category;
      amount = entryData.amount;
      type = entryData.type;
    }
    
    if (description) {
      entryDisplay = (
        <div className="mt-2 bg-secondary/30 p-4 rounded-lg border border-border">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-base">{description}</div>
            <div className={cn(
              "font-bold text-base",
              amount < 0 ? "text-red-500" : "text-green-500"
            )}>
              {amount < 0 ? '-$' : '+$'}{Math.abs(amount).toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">{category}</div>
            <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
              {type === 'income' ? 'Income' : 'Expense'}
            </div>
          </div>
        </div>
      );
    }
  }
  
  return (
    <div 
      className={cn(
        'flex w-full max-w-3xl mx-auto message-in',
        isAi ? 'justify-start' : 'justify-end',
        className
      )}
    >
      <div
        className={cn(
          'relative px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[75%]',
          isAi 
            ? 'bg-white border border-border text-foreground rounded-tl-sm' 
            : 'bg-burgundy text-white rounded-tr-sm'
        )}
      >
        {isAi && (
          <div className="absolute -left-2 top-0 w-2 h-4 overflow-hidden">
            <div className="absolute w-4 h-4 bg-white border-l border-t border-border rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )}
        
        <div className="text-sm md:text-base whitespace-pre-wrap">
          {hasEntry ? "Entry processed successfully:" : messageContent}
        </div>
        
        {entryDisplay}
        
        <div 
          className={cn(
            "text-[10px] mt-1 text-right",
            isAi ? "text-muted-foreground" : "text-white/70"
          )}
        >
          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {!isAi && (
          <div className="absolute -right-2 top-0 w-2 h-4 overflow-hidden">
            <div className="absolute w-4 h-4 bg-burgundy rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
