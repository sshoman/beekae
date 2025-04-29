import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import BookkeepingAgent from '@/components/Bookkeeping/BookkeepingAgent';
import { Button } from '@/components/ui/button';
import { Heart, Youtube } from 'lucide-react';
import Party from '@/components/ui/icons/party';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const Index = () => {
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  
  const handleOpenSheet = (id: string) => {
    setOpenSheet(id);
  };
  
  const handleCloseSheet = () => {
    setOpenSheet(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="fixed top-4 right-4 z-20">
        <Button 
          variant="link" 
          className="text-burgundy font-medium hover:text-burgundy-dark"
          onClick={() => handleOpenSheet('pricing')}
        >
          Pricing
        </Button>
      </div>
      
      <main className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-6 gap-8">
        <div className="md:w-2/5 flex flex-col justify-center animate-fade-in">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-medium mb-4">
              Powered by Gemini
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Fun Intelligence
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              No platform. No windows. No desktop. Beekae will never have more than 1 page in which all your bookkeeping can be done.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/bookkeeping">
                <Button className="bg-burgundy hover:bg-burgundy-dark text-white px-6 py-5" size="lg">
                  <Heart className="w-4 h-4 stroke-white fill-burgundy" strokeWidth={1.5} />
                  <span>Free Account</span>
                </Button>
              </Link>
              <Link to="/bookkeeping">
                <Button variant="secondary" size="lg">
                  <Youtube className="w-4 h-4" />
                  <span>Sit Back & Watch Demo</span>
                </Button>
              </Link>
            </div>
            
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-start p-6 border border-border rounded-xl">
                  <div className="rounded-full bg-secondary p-2 mb-3">
                    <Heart className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Easy</h3>
                  <p className="text-sm text-muted-foreground">Easiest bookkeeping experience anywhere</p>
                </div>
                
                <div className="flex flex-col items-start p-6 border border-border rounded-xl">
                  <div className="rounded-full bg-secondary p-2 mb-3">
                    <Party className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Fun</h3>
                  <p className="text-sm text-muted-foreground">Finding creative ways to make bookkeeping not so boring.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-3/5 glass rounded-2xl border border-border shadow-sm overflow-hidden md:h-auto animate-slide-up">
          <BookkeepingAgent className="index-page-agent" />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p> © Beekae 2025. All rights reserved.</p>
      </footer>
      
      {/* Pricing Sheet */}
      <Sheet open={openSheet === 'pricing'} onOpenChange={handleCloseSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Pricing Plans</SheetTitle>
            <SheetDescription>
              Pricing Overview
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="relative border rounded-lg p-6 bg-background/50">
              <div className="absolute top-0 right-0 p-2">
                <Heart className="h-5 w-5 text-burgundy" fill="hsl(var(--burgundy))" />
              </div>
              <h3 className="text-xl font-medium mb-2">First 10 Founders</h3>
              <p className="text-3xl font-bold mb-4">$9<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Innovators & early adopters</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Advanced reporting</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Advanced data security</span>
                </li>
              </ul>
              <Link to="/bookkeeping">
                <Button className="w-full">Free Month</Button>
              </Link>
            </div>
            
            <div className="relative border rounded-lg p-6 bg-background/50">
              <div className="absolute top-0 right-0 p-2">
                <span className="text-xl">⬜️</span> {/* Silver Emoji */}
              </div>
              <h3 className="text-xl font-medium mb-2">Silver</h3>
              <p className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>New startup with -$10k in ARR</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Advanced reporting</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Email support</span>
                </li>
              </ul>
              <Link to="/bookkeeping">
                <Button className="w-full" variant="outline">Free Month</Button>
              </Link>
            </div>
            
            <div className="relative border rounded-lg p-6 bg-background/50">
              <div className="absolute top-0 right-0 p-2">
                <span className="text-xl">💎</span> {/* Platinum Emoji */}
              </div>
              <h3 className="text-xl font-medium mb-2">Platinum</h3>
              <p className="text-3xl font-bold mb-4">$99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Stable startup with +$100k ARR</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Advanced reporting</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Advanced data security</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/bookkeeping">
                <Button className="w-full" variant="outline">Free Month</Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
