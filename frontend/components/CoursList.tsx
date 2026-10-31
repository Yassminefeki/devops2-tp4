"use client";

import { useState } from "react";
import CoursCard from "@/components/CoursCard";
import CoursFilters from "@/components/CoursFilters";
import { filterCours, LEVEL_LABELS, type Cours, type LevelFilter } from "@devops2/cours-utils";

function describeEmpty(query: string, level: LevelFilter): string {
  const niveau = level === "tous" ? "" : ` de niveau ${LEVEL_LABELS[level].toLowerCase()}`;
  if (query !== "") {
    return `Aucun cours${niveau} ne correspond à « ${query} ».`;
  }
  return niveau === "" ? "Aucun cours disponible." : `Aucun cours${niveau}.`;
}

function describeResults(count: number, query: string, level: LevelFilter): string {
  return count === 0 ? describeEmpty(query, level) : `${count} cours`;
}

export default function CoursList({ cours }: { cours: Cours[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("tous");
  const visibles = filterCours(cours, { query, level });

  return (
    <>
      <CoursFilters query={query} level={level} onQueryChange={setQuery} onLevelChange={setLevel} />
      <p className="results" aria-live="polite">
        {describeResults(visibles.length, query.trim(), level)}
      </p>
      {visibles.length > 0 && (
        <ul className="cards cours-grid" aria-label="Liste des cours">
          {visibles.map((c) => (
            <li key={c.documentId}>
              <CoursCard cours={c} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
