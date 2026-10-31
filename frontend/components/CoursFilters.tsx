"use client";

import { LEVEL_LABELS, type Level, type LevelFilter } from "@devops2/cours-utils";

type Props = {
  query: string;
  level: LevelFilter;
  onQueryChange: (query: string) => void;
  onLevelChange: (level: LevelFilter) => void;
};

const LEVELS = Object.keys(LEVEL_LABELS) as Level[];

export default function CoursFilters({ query, level, onQueryChange, onLevelChange }: Props) {
  return (
    <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
      <label>
        Rechercher un cours
        <input
          type="search"
          value={query}
          placeholder="ex. docker"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <label>
        Niveau
        <select value={level} onChange={(event) => onLevelChange(event.target.value as LevelFilter)}>
          <option value="tous">Tous les niveaux</option>
          {LEVELS.map((value) => (
            <option key={value} value={value}>
              {LEVEL_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
