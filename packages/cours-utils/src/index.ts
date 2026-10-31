export type Level = "debutant" | "intermediaire" | "avance";
export type LevelFilter = Level | "tous";

export type Cours = {
  id: number;
  documentId: string;
  title: string;
  summary: string | null;
  session: number;
  duration: number;
  level: Level;
  topics: string[];
};

export const LEVEL_LABELS: Record<Level, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

// 45 → "45 min", 90 → "1 h 30"
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

// Minuscules et sans accents : « Déploiement » et « deploiement » se retrouvent
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function filterCours(
  cours: Cours[],
  { query = "", level = "tous" }: { query?: string; level?: LevelFilter },
): Cours[] {
  const needle = normalize(query.trim());
  return cours.filter((c) => {
    if (level !== "tous" && c.level !== level) {
      return false;
    }
    if (needle === "") {
      return true;
    }
    return normalize(c.title).includes(needle) || c.topics.some((topic) => normalize(topic).includes(needle));
  });
}

export function sortBySession(cours: Cours[]): Cours[] {
  return [...cours].sort((a, b) => a.session - b.session);
}

export function formatLevel(level: Level): string {
  return LEVEL_LABELS[level];
}
