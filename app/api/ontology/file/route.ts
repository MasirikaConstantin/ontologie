import { readOntologyXml } from '../../../lib/ontology';

export async function GET() {
  const xml = await readOntologyXml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rdf+xml; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ontologie_gestion_personnel.owl"'
    }
  });
}
