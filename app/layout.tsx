import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site-header';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Ontologie OWL - Gestion du personnel',
  description: 'Application fullstack Next.js pour visualiser une ontologie OWL de gestion du personnel.'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          {children}
          <footer className="mt-auto border-t border-emerald-950/10 py-6">
            <div className="app-container text-center text-sm text-muted-foreground">
              <p>Ontologie de gestion du personnel · Application pédagogique Next.js</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
