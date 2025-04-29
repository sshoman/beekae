
import ProfileHeader from '@/components/Layout/ProfileHeader';
import BookkeepingAgent from '@/components/Bookkeeping/BookkeepingAgent';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Bookkeeping = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy/5 via-background to-burgundy/10">
      <ProfileHeader />
      
      <main className={cn("flex-1 flex flex-col container mx-auto px-4", isMobile ? "py-2" : "py-4")}>
        <div className="glass rounded-2xl border border-border shadow-lg overflow-hidden h-[650px] md:h-[calc(100vh-8rem)] w-full max-w-3xl mx-auto animate-fade-in">
          <BookkeepingAgent />
        </div>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          © Beekae 2025. All rights reserved.
        </div>
      </main>
    </div>
  );
};

export default Bookkeeping;
