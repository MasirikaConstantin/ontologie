import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { readOntologyXml, getOntologySummary } from "../lib/ontology";

const sections = [
  ["objectif", "Objectif"],
  ["classes", "Classes"],
  ["relations", "Relations"],
  ["donnees", "Données"],
  ["individus", "Individus"],
  ["source", "Source OWL"],
];

function DocumentationSection({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return (
    <Card id={id} className="doc-anchor min-w-0 border-0 bg-card/90 shadow-sm ring-1 ring-emerald-950/10">
      <CardHeader className="sm:grid-cols-[auto_1fr] sm:items-center sm:gap-4">
        <span className="grid size-10 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">{number}</span>
        <div>
          <CardTitle className="mt-3 text-xl sm:mt-0 sm:text-2xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="min-w-0 pt-1">{children}</CardContent>
    </Card>
  );
}

export default async function OntologyDocumentationPage() {
  const [ontology, xml] = await Promise.all([getOntologySummary(), readOntologyXml()]);
  const xmlPreview = xml.split("\n").slice(0, 80).join("\n");

  return (
    <main className="page-shell">
      <section className="surface-grid relative isolate grid min-w-0 overflow-hidden rounded-3xl bg-emerald-950 px-5 py-8 text-white shadow-xl shadow-emerald-950/15 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)] lg:gap-10 lg:px-12">
        <div className="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="min-w-0">
          <p className="eyebrow"><BookOpen className="size-4" /> Documentation OWL</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-[-0.035em] text-white sm:text-5xl">
            Comprendre l’ontologie de gestion du personnel
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-emerald-50/80">
            Une lecture structurée du modèle : objectif, classes, relations, propriétés de données et exemples concrets.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" className="h-11 bg-amber-300 px-5 text-emerald-950 hover:bg-amber-200" render={<Link href="/" />}>
              <ArrowLeft data-icon="inline-start" /> Tableau de bord
            </Button>
            <Button size="lg" variant="outline" className="h-11 border-white/25 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white" render={<Link href="/api/ontology/file" />}>
              <Download data-icon="inline-start" /> Télécharger OWL
            </Button>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-end rounded-2xl border border-white/15 bg-white/8 p-5 lg:mt-0">
          <Badge className="w-fit bg-amber-300 text-emerald-950">Résumé du modèle</Badge>
          <strong className="mt-5 text-4xl tracking-tight">{ontology.classes.length} classes</strong>
          <p className="mt-2 leading-7 text-emerald-50/75">
            {ontology.objectProperties.length} relations, {ontology.datatypeProperties.length} propriétés de données et {ontology.individuals.length} individus.
          </p>
        </div>
      </section>

      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-24">
          <Card className="gap-3 border-0 bg-card/90 py-4 shadow-sm ring-1 ring-emerald-950/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm"><Network className="size-4 text-primary" /> Plan de lecture</CardTitle>
              <CardDescription>Accès rapide aux sections</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:grid" aria-label="Plan de la documentation">
                {sections.map(([href, label]) => (
                  <Button key={href} variant="ghost" size="sm" className="shrink-0 justify-start" render={<a href={`#${href}`} />}>
                    {label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <div className="grid min-w-0 gap-5">
          <DocumentationSection id="objectif" number="01" title="Objectif de l’ontologie">
            <div className="grid gap-4">
              <p className="doc-copy">L’ontologie formalise les connaissances nécessaires à la gestion du personnel. Elle représente les employés, leurs départements, leurs postes, leurs compétences, leurs formations, leurs absences et leurs évaluations.</p>
              <p className="doc-copy">Contrairement à une simple base de données, elle donne du sens aux données : un raisonneur OWL peut exploiter les classes, les relations et les contraintes pour vérifier la cohérence du modèle ou déduire des informations.</p>
            </div>
          </DocumentationSection>

          <DocumentationSection id="classes" number="02" title="Classes principales">
            <div className="min-w-0 overflow-hidden rounded-xl border">
              <Table className="min-w-[720px]">
                <TableHeader className="bg-secondary/70">
                  <TableRow>
                    <TableHead>Classe</TableHead><TableHead>Libellé</TableHead><TableHead>Héritage</TableHead><TableHead className="w-[42%]">Explication</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ontology.classes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell><code className="code-pill">{item.id}</code></TableCell>
                      <TableCell className="font-medium">{item.label}</TableCell>
                      <TableCell>{item.parent && item.parent !== "Non défini" ? item.parent : "—"}</TableCell>
                      <TableCell className="whitespace-normal leading-6 text-muted-foreground">{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DocumentationSection>

          <DocumentationSection id="relations" number="03" title="Relations entre les concepts">
            <p className="doc-copy">Les propriétés objet relient deux ressources. Par exemple, <code className="code-pill">travailleDans</code> relie un employé à un département et <code className="code-pill">occupePoste</code> relie un employé à son poste.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {ontology.objectProperties.map((item) => (
                <Card key={item.id} size="sm" className="min-w-0 bg-muted/40">
                  <CardHeader><CardTitle className="text-sm">{item.label}</CardTitle><CardDescription className="truncate">{item.domain} → {item.range}</CardDescription></CardHeader>
                  <CardContent><code className="code-pill">{item.id}</code></CardContent>
                </Card>
              ))}
            </div>
          </DocumentationSection>

          <DocumentationSection id="donnees" number="04" title="Propriétés de données">
            <p className="doc-copy">Ces propriétés décrivent les valeurs simples associées aux ressources, comme le matricule, le nom, l’e-mail, la date d’embauche ou la note d’évaluation.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {ontology.datatypeProperties.map((item) => (
                <Card key={item.id} size="sm" className="min-w-0 bg-muted/40">
                  <CardHeader><CardTitle className="text-sm">{item.label}</CardTitle><CardDescription className="truncate">{item.domain} → {item.range}</CardDescription></CardHeader>
                  <CardContent><code className="code-pill">{item.id}</code></CardContent>
                </Card>
              ))}
            </div>
          </DocumentationSection>

          <DocumentationSection id="individus" number="05" title="Individus d’exemple">
            <p className="doc-copy">Les individus montrent comment le modèle peut être instancié avec des données réelles et facilitent la démonstration pendant un exposé.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {ontology.individuals.map((item) => (
                <Card key={item.id} size="sm" className="min-w-0 bg-muted/40">
                  <CardHeader><CardTitle className="truncate">{item.id}</CardTitle><Badge variant="secondary">{item.type}</Badge></CardHeader>
                  <CardContent><dl className="grid gap-2">{item.fields.map((field) => (
                    <div key={`${item.id}-${field.name}-${field.value}`} className="grid min-w-0 gap-1 rounded-lg bg-background/80 p-3 sm:grid-cols-[minmax(90px,.45fr)_minmax(0,1fr)]">
                      <dt className="text-xs font-semibold">{field.name}</dt><dd className="break-words text-xs text-muted-foreground sm:text-right">{field.value}</dd>
                    </div>
                  ))}</dl></CardContent>
                </Card>
              ))}
            </div>
          </DocumentationSection>

          <DocumentationSection id="source" number="06" title="Extrait du fichier OWL/RDF">
            <p className="doc-copy">Aperçu du fichier RDF/XML chargé par l’application. La version complète reste disponible via le téléchargement ou la route <code className="code-pill">/api/ontology/file</code>.</p>
            <pre className="mt-5 max-h-[520px] max-w-full overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-emerald-100 sm:text-sm"><code>{xmlPreview}</code></pre>
          </DocumentationSection>
        </div>
      </div>
    </main>
  );
}
