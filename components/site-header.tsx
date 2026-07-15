"use client";

import Link from "next/link";
import { Braces, Download, Menu, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { href: "/", label: "Tableau" },
  { href: "/ontologie", label: "Documentation" },
  { href: "/api/ontology", label: "API JSON", icon: Braces },
  { href: "/api/ontology/file", label: "Fichier OWL", icon: Download },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-background/88 backdrop-blur-xl">
      <div className="app-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-bold tracking-tight">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Network className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate">Ontologie Personnel</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="ghost" nativeButton={false} render={<Link href={href} />}>
              {Icon ? <Icon data-icon="inline-start" /> : null}
              {label}
            </Button>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger
            render={<Button variant="outline" size="icon" className="md:hidden" aria-label="Ouvrir le menu" />}
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="w-[88vw] max-w-sm border-emerald-950/10 bg-background/98">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2 text-base">
                <Network className="size-5 text-primary" />
                Ontologie Personnel
              </SheetTitle>
              <SheetDescription>Navigation de l’application</SheetDescription>
            </SheetHeader>
            <nav className="grid gap-2 px-4" aria-label="Navigation mobile">
              {navigation.map(({ href, label, icon: Icon }) => (
                <Button key={href} variant="ghost" nativeButton={false} className="h-11 justify-start px-3" render={<Link href={href} />}>
                  {Icon ? <Icon data-icon="inline-start" /> : <Network data-icon="inline-start" />}
                  {label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
