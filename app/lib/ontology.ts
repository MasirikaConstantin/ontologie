import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type OntologyClass = {
  id: string;
  label: string;
  parent?: string;
  description: string;
};

export type OntologyProperty = {
  id: string;
  label: string;
  domain: string;
  range: string;
};

export type OntologyIndividual = {
  id: string;
  type: string;
  fields: Array<{ name: string; value: string }>;
};

export type OntologySummary = {
  classes: OntologyClass[];
  objectProperties: OntologyProperty[];
  datatypeProperties: OntologyProperty[];
  individuals: OntologyIndividual[];
};

const descriptions: Record<string, string> = {
  Personne: 'Représente une personne physique de l’organisation.',
  Employe: 'Membre du personnel rattaché à un département et à un poste.',
  Manager: 'Employé pouvant superviser directement ou indirectement d’autres employés.',
  Departement: 'Unité organisationnelle, par exemple ressources humaines ou informatique.',
  Poste: 'Fonction ou rôle occupé par un employé.',
  Contrat: 'Contrat ou statut de travail associé à un employé.',
  Competence: 'Savoir-faire détenu par un employé.',
  Formation: 'Action de formation suivie par un employé.',
  Absence: 'Période d’absence, congé ou indisponibilité.',
  Evaluation: 'Évaluation de performance ou de compétences.'
};

function ontologyFilePath() {
  return path.join(process.cwd(), 'ontologie_gestion_personnel.owl');
}

export async function readOntologyXml() {
  return readFile(ontologyFilePath(), 'utf8');
}

function localName(value?: string) {
  if (!value) return 'Non défini';
  return value.replace(/^#/, '').split(/[\/#]/).pop() || value;
}

function blocks(xml: string, tag: string) {
  const expression = new RegExp(`<owl:${tag}\\b([\\s\\S]*?)>([\\s\\S]*?)<\\/owl:${tag}>`, 'g');
  return [...xml.matchAll(expression)].map((match) => ({ attributes: match[1], body: match[2] }));
}

function attribute(source: string, name: string) {
  return source.match(new RegExp(`${name}="([^"]+)"`))?.[1];
}

function label(body: string, fallback: string) {
  return body.match(/<rdfs:label(?:\s[^>]*)?>(.*?)<\/rdfs:label>/s)?.[1]?.trim() || fallback;
}

function resource(body: string, tag: string) {
  return localName(body.match(new RegExp(`<${tag}[^>]*rdf:resource="([^"]+)"`))?.[1]);
}

export function parseOntology(xml: string): OntologySummary {
  const seenClasses = new Set<string>();
  const classes = blocks(xml, 'Class')
    .map(({ attributes, body }) => {
      const id = localName(attribute(attributes, 'rdf:about'));
      return {
        id,
        label: label(body, id),
        parent: resource(body, 'rdfs:subClassOf'),
        description: descriptions[id] || 'Concept déclaré dans l’ontologie OWL.'
      };
    })
    .filter((item) => item.id !== 'Non défini' && !seenClasses.has(item.id) && seenClasses.add(item.id));

  const readProperties = (tag: 'ObjectProperty' | 'DatatypeProperty') =>
    blocks(xml, tag).map(({ attributes, body }) => {
      const id = localName(attribute(attributes, 'rdf:about'));
      return {
        id,
        label: label(body, id),
        domain: resource(body, 'rdfs:domain'),
        range: resource(body, 'rdfs:range')
      };
    });

  const individuals = blocks(xml, 'NamedIndividual').map(({ attributes, body }) => {
    const id = localName(attribute(attributes, 'rdf:about'));
    const type = resource(body, 'rdf:type');
    const fields = [...body.matchAll(/<([a-zA-Z][\w-]*)(?:\s+rdf:datatype="[^"]+")?(?:\s+rdf:resource="([^"]+)")?>(.*?)<\/\1>|<([a-zA-Z][\w-]*)\s+rdf:resource="([^"]+)"\/>/gs)]
      .map((match) => ({
        name: match[1] || match[4],
        value: localName(match[2] || match[5] || match[3]?.trim())
      }))
      .filter((field) => field.name !== 'rdf:type');

    return { id, type, fields };
  });

  return {
    classes,
    objectProperties: readProperties('ObjectProperty'),
    datatypeProperties: readProperties('DatatypeProperty'),
    individuals
  };
}

export async function getOntologySummary() {
  return parseOntology(await readOntologyXml());
}
