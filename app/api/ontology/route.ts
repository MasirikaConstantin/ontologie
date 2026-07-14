import { NextResponse } from 'next/server';
import { getOntologySummary } from '../../lib/ontology';

export async function GET() {
  const summary = await getOntologySummary();
  return NextResponse.json(summary);
}
