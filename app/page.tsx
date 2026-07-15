import Link from "next/link";
import { ArrowRight, Braces, Database, Download, Network, Users, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOntologySummary } from "./lib/ontology";

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Network }) {
  return (
    <Card className="gap-3 border-0 bg-card/90 py-4 shadow-sm ring-1 ring-emerald-950/10">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="font-medium">{label}</CardDescription>
        <span className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        <strong className="text-3xl font-bold tracking-tight text-foreground">{value}</strong>
      </CardContent>
    </Card>
  );
}

function PropertyList({ title, items }: { title: string; items: Array<{ id: string; label: string; domain: string; range: string }> }) {
  return (
    <Card className="min-w-0 border-0 bg-card/90 shadow-sm ring-1 ring-emerald-950/10">
      <CardHeader>
        <p className="section-kicker">Modèle sémantique</p>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="grid min-w-0 gap-2 rounded-xl border bg-muted/45 p-4">
            <strong>{item.label}</strong>
            <span className="truncate text-sm text-muted-foreground">{item.domain} → {item.range}</span>
            <code className="code-pill">{item.id}</code>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const ontology = await getOntologySummary();

  return (
    <main className="page-shell">
      <section className="surface-grid relative isolate grid min-w-0 overflow-hidden rounded-3xl bg-emerald-950 px-5 py-8 text-white shadow-xl shadow-emerald-950/15 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,.6fr)] lg:gap-10 lg:px-12 lg:py-14">
        <div className="absolute -right-20 -top-20 -z-10 size-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="min-w-0">
          <p className="eyebrow"><Network className="size-4" /> Next.js fullstack + OWL</p>
          <h1 className="max-w-4xl text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Les connaissances RH, organisées autrement.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/80 sm:text-lg">
            Explorez l’ontologie de gestion du personnel, ses relations et ses données depuis une interface claire, reliée directement au fichier OWL.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" className="h-11 bg-amber-300 px-5 text-emerald-950 hover:bg-amber-200" render={<Link href="/ontologie" />}>
              Explorer l’ontologie <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 border-white/25 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white" render={<Link href="/api/ontology" />}>
              <Braces data-icon="inline-start" /> API JSON
            </Button>
            <Button size="lg" variant="ghost" className="h-11 px-5 text-emerald-50 hover:bg-white/10 hover:text-white" render={<Link href="/api/ontology/file" />}>
              <Download data-icon="inline-start" /> Télécharger OWL
            </Button>
          </div>
        </div>
        <div className="mt-8 flex min-w-0 flex-col justify-end rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm lg:mt-0">
          <Badge className="w-fit bg-amber-300 text-emerald-950">Cas d’usage</Badge>
          <h2 className="mt-5 text-2xl font-bold text-white">RH sémantique</h2>
          <p className="mt-2 leading-7 text-emerald-50/75">
            Un modèle réutilisable pour relier employés, départements, postes, compétences et évaluations.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Statistiques de l’ontologie">
        <StatCard label="Classes OWL" value={ontology.classes.length} icon={Network} />
        <StatCard label="Relations objet" value={ontology.objectProperties.length} icon={Workflow} />
        <StatCard label="Propriétés" value={ontology.datatypeProperties.length} icon={Database} />
        <StatCard label="Individus" value={ontology.individuals.length} icon={Users} />
      </section>

      <Card className="border-0 bg-card/90 shadow-sm ring-1 ring-emerald-950/10">
        <CardHeader>
          <p className="section-kicker">Concepts principaux</p>
          <CardTitle className="text-2xl">Classes de l’ontologie</CardTitle>
          <CardDescription>Les concepts structurants du domaine de gestion du personnel.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ontology.classes.map((item) => (
            <Card key={item.id} size="sm" className="min-w-0 bg-muted/40 transition-transform duration-200 hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="text-base">{item.label}</CardTitle>
                <code className="code-pill">{item.id}</code>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                {item.parent && item.parent !== "Non défini" ? <Badge variant="secondary" className="w-fit">Hérite de {item.parent}</Badge> : null}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <PropertyList title="Relations entre concepts" items={ontology.objectProperties} />
        <PropertyList title="Attributs et données" items={ontology.datatypeProperties} />
      </div>

      <Card className="border-0 bg-card/90 shadow-sm ring-1 ring-emerald-950/10">
        <CardHeader>
          <p className="section-kicker">Données de démonstration</p>
          <CardTitle className="text-2xl">Individus déclarés</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ontology.individuals.map((item) => (
            <Card key={item.id} size="sm" className="min-w-0 bg-muted/40">
              <CardHeader>
                <CardTitle className="truncate">{item.id}</CardTitle>
                <Badge variant="secondary">{item.type}</Badge>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-2">
                  {item.fields.map((field) => (
                    <div key={`${item.id}-${field.name}-${field.value}`} className="grid min-w-0 gap-1 rounded-lg bg-background/80 p-3 sm:grid-cols-[minmax(90px,.45fr)_minmax(0,1fr)]">
                      <dt className="text-xs font-semibold text-foreground">{field.name}</dt>
                      <dd className="min-w-0 break-words text-xs text-muted-foreground sm:text-right">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
