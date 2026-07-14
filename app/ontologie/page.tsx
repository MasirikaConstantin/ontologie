import type { ReactNode } from 'react';
import { readOntologyXml, getOntologySummary } from '../lib/ontology';

function DocumentationSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="doc-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default async function OntologyDocumentationPage() {
  const [ontology, xml] = await Promise.all([getOntologySummary(), readOntologyXml()]);
  const xmlPreview = xml.split('\n').slice(0, 80).join('\n');

  return (
    <main>
      <section className="hero documentation-hero">
        <div>
          <p className="eyebrow">Documentation OWL</p>
          <h1>Visualisation et explication de l’ontologie de gestion du personnel</h1>
          <p>
            Cette page sert de support d’exposé : elle affiche le contenu de l’ontologie,
            explique son objectif, décrit les classes et détaille les relations utilisées.
          </p>
          <div className="actions">
            <a href="/" className="button primary">Retour au tableau de bord</a>
            <a href="/api/ontology/file" className="button secondary">Télécharger le fichier OWL</a>
          </div>
        </div>
        <aside className="hero-card">
          <span>Résumé</span>
          <h2>{ontology.classes.length} classes</h2>
          <p>{ontology.objectProperties.length} relations, {ontology.datatypeProperties.length} propriétés de données et {ontology.individuals.length} individus d’exemple.</p>
        </aside>
      </section>

      <section className="documentation-layout">
        <aside className="doc-toc">
          <strong>Plan de la documentation</strong>
          <a href="#objectif">Objectif</a>
          <a href="#classes">Classes</a>
          <a href="#relations">Relations</a>
          <a href="#donnees">Données</a>
          <a href="#individus">Individus</a>
          <a href="#source">Source OWL</a>
        </aside>

        <div className="doc-content">
          <DocumentationSection title="1. Objectif de l’ontologie">
            <p id="objectif">
              L’ontologie formalise les connaissances nécessaires à la gestion du personnel.
              Elle permet de représenter les employés, leurs départements, leurs postes,
              leurs compétences, leurs formations, leurs absences et leurs évaluations.
            </p>
            <p>
              Contrairement à une simple base de données, l’ontologie donne du sens aux données :
              un raisonneur OWL peut exploiter les classes, les relations et les contraintes pour
              vérifier la cohérence du modèle ou déduire certaines informations.
            </p>
          </DocumentationSection>

          <DocumentationSection title="2. Classes principales">
            <div id="classes" className="doc-table-wrapper">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Classe</th>
                    <th>Libellé</th>
                    <th>Héritage</th>
                    <th>Explication</th>
                  </tr>
                </thead>
                <tbody>
                  {ontology.classes.map((item) => (
                    <tr key={item.id}>
                      <td><code>{item.id}</code></td>
                      <td>{item.label}</td>
                      <td>{item.parent && item.parent !== 'Non défini' ? item.parent : '—'}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocumentationSection>

          <DocumentationSection title="3. Relations entre les concepts">
            <p id="relations">
              Les propriétés objet relient deux ressources de l’ontologie. Par exemple,
              <code> travailleDans </code> relie un employé à un département et
              <code> occupePoste </code> relie un employé à son poste.
            </p>
            <div className="relation-grid">
              {ontology.objectProperties.map((item) => (
                <article key={item.id} className="relation-card">
                  <strong>{item.label}</strong>
                  <span>{item.domain} → {item.range}</span>
                  <code>{item.id}</code>
                </article>
              ))}
            </div>
          </DocumentationSection>

          <DocumentationSection title="4. Propriétés de données">
            <p id="donnees">
              Les propriétés de données décrivent les valeurs simples associées aux ressources,
              comme le matricule, le nom, l’e-mail, la date d’embauche ou la note d’évaluation.
            </p>
            <div className="relation-grid compact">
              {ontology.datatypeProperties.map((item) => (
                <article key={item.id} className="relation-card">
                  <strong>{item.label}</strong>
                  <span>{item.domain} → {item.range}</span>
                  <code>{item.id}</code>
                </article>
              ))}
            </div>
          </DocumentationSection>

          <DocumentationSection title="5. Individus d’exemple">
            <p id="individus">
              Les individus montrent comment le modèle peut être instancié avec des données réelles.
              Ils sont utiles pendant l’exposé pour démontrer l’utilisation concrète des classes et relations.
            </p>
            <div className="individual-grid">
              {ontology.individuals.map((item) => (
                <article className="individual-card" key={item.id}>
                  <div className="individual-header">
                    <h3>{item.id}</h3>
                    <span>{item.type}</span>
                  </div>
                  <ul>
                    {item.fields.map((field) => (
                      <li key={`${item.id}-${field.name}-${field.value}`}>
                        <strong>{field.name}</strong>
                        <span>{field.value}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </DocumentationSection>

          <DocumentationSection title="6. Extrait du fichier OWL/RDF">
            <p id="source">
              Voici un aperçu du fichier RDF/XML chargé par l’application. Le fichier complet est
              disponible via le bouton de téléchargement ou la route <code>/api/ontology/file</code>.
            </p>
            <pre className="xml-preview"><code>{xmlPreview}</code></pre>
          </DocumentationSection>
        </div>
      </section>
    </main>
  );
}
