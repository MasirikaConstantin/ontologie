import { getOntologySummary } from './lib/ontology';

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function PropertyList({ title, items }: { title: string; items: Array<{ id: string; label: string; domain: string; range: string }> }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <p>Modèle sémantique</p>
        <h2>{title}</h2>
      </div>
      <div className="property-list">
        {items.map((item) => (
          <article key={item.id}>
            <strong>{item.label}</strong>
            <span>{item.domain} → {item.range}</span>
            <code>{item.id}</code>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const ontology = await getOntologySummary();

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Next.js fullstack + OWL</p>
          <h1>Application professionnelle de gestion du personnel basée sur une ontologie</h1>
          <p>
            Le serveur Next.js lit le fichier OWL, expose ses données via une API JSON et génère
            cette interface de démonstration pour votre exposé.
          </p>
          <div className="actions">
            <a href="/ontologie" className="button primary">Afficher l’ontologie</a>
            <a href="/api/ontology" className="button secondary">Voir l’API JSON</a>
            <a href="/api/ontology/file" className="button secondary">Télécharger OWL</a>
          </div>
        </div>
        <aside className="hero-card">
          <span>Cas d’usage</span>
          <h2>RH sémantique</h2>
          <p>Centraliser les employés, départements, postes, compétences et évaluations dans un modèle réutilisable.</p>
        </aside>
      </section>

      <section className="stats-grid" aria-label="Statistiques de l'ontologie">
        <StatCard label="Classes OWL" value={ontology.classes.length} />
        <StatCard label="Relations objet" value={ontology.objectProperties.length} />
        <StatCard label="Propriétés de données" value={ontology.datatypeProperties.length} />
        <StatCard label="Individus" value={ontology.individuals.length} />
      </section>

      <section className="panel">
        <div className="section-heading">
          <p>Concepts principaux</p>
          <h2>Classes de l’ontologie</h2>
        </div>
        <div className="class-grid">
          {ontology.classes.map((item) => (
            <article className="class-card" key={item.id}>
              <div>
                <h3>{item.label}</h3>
                <code>{item.id}</code>
              </div>
              <p>{item.description}</p>
              {item.parent && item.parent !== 'Non défini' ? <span>Hérite de {item.parent}</span> : null}
            </article>
          ))}
        </div>
      </section>

      <div className="columns">
        <PropertyList title="Relations entre concepts" items={ontology.objectProperties} />
        <PropertyList title="Attributs et données" items={ontology.datatypeProperties} />
      </div>

      <section className="panel">
        <div className="section-heading">
          <p>Données de démonstration</p>
          <h2>Individus déclarés</h2>
        </div>
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
      </section>
    </main>
  );
}
