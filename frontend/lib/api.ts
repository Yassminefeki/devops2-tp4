import type { Cours } from "@devops2/cours-utils";

// Mot de passe du client auprès de l'API (fourni par l'environnement)
const API_PASSWORD = process.env.STRAPI_CLIENT_PASSWORD ?? "";

type StrapiCours = Omit<Cours, "topics" | "summary"> & { summary?: string | null; topics?: unknown };

function baseUrl(): string {
  return process.env.STRAPI_URL ?? "http://localhost:1337";
}

function headers(): HeadersInit {
  return { "X-Client-Password": API_PASSWORD };
}

// Un champ JSON vide ou mal saisi dans Strapi ne doit pas casser l'affichage
function toCours(raw: StrapiCours): Cours {
  return {
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
    summary: raw.summary ?? null,
    session: raw.session,
    duration: raw.duration,
    level: raw.level,
    topics: Array.isArray(raw.topics) ? raw.topics.filter((t): t is string => typeof t === "string") : [],
  };
}

export async function getCours(): Promise<Cours[]> {
  const res = await fetch(`${baseUrl()}/api/courses?sort=session:asc&pagination[pageSize]=100`, {
    headers: headers(),
  });
  if (!res.ok) {
    throw new Error(`Strapi a répondu ${res.status}`);
  }
  const json: { data: StrapiCours[] } = await res.json();
  return json.data.map(toCours);
}

export async function getCoursById(documentId: string): Promise<Cours | null> {
  const res = await fetch(`${baseUrl()}/api/courses/${encodeURIComponent(documentId)}`, {
    headers: headers(),
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Strapi a répondu ${res.status}`);
  }
  const json: { data: StrapiCours } = await res.json();
  return toCours(json.data);
}
